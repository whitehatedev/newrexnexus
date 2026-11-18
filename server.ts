import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { and, eq } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  blogs,
  caseStudies,
  cmsPages,
  paymentRefunds,
  payments,
  paymentWebhookEvents,
  products,
  projectEnquiries,
  projectQuotations,
  storeOrders,
} from './src/db/schema.ts';
import { publicRouter } from './src/server/routes/public.ts';
import { customerRouter } from './src/server/routes/customer.ts';
import { adminRouter } from './src/server/routes/admin.ts';
import { authRouter } from './src/server/routes/auth.ts';
import { krashivantriRouter } from './src/server/routes/krashivantri.ts';
import { verifyWebhookSignature } from './src/server/razorpay.ts';
import { syncPaymentToSupabase, syncRefundToSupabase } from './src/server/supabase-ecommerce.ts';
import { dispatchLifecycleEmail } from './src/server/email.ts';
import { reconcileProjectQuotationPayment } from './src/server/project-lifecycle.ts';
import { ensureUploadDirs, generateCode, UPLOADS_ROOT } from './src/server/utils.ts';
import { ensureInitialSeed } from './src/server/seed.ts';

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);

  ensureUploadDirs();
  ensureInitialSeed().catch((err) => {
    console.error('Startup seed check failed:', err);
  });

  // Razorpay Webhook (raw body required for HMAC signature verification & idempotency)
  const handleRazorpayWebhook = async (req: express.Request, res: express.Response) => {
    const signature = String(req.headers['x-razorpay-signature'] || '');
    const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
    if (!(await verifyWebhookSignature(rawBody, signature))) {
      return res.status(400).json({ error: 'Invalid Razorpay webhook signature.' });
    }
    try {
      const payload = JSON.parse(rawBody || '{}');
      const paymentEntity = payload?.payload?.payment?.entity;
      const refundEntity = payload?.payload?.refund?.entity;
      const eventType = String(payload?.event || 'payment.event');
      const razorpayPaymentId = String(paymentEntity?.id || refundEntity?.payment_id || '');
      const razorpayOrderId = String(paymentEntity?.order_id || '');
      const razorpayRefundId = String(refundEntity?.id || '');
      const eventId = String(
        req.headers['x-razorpay-event-id'] ||
          `${eventType}_${razorpayRefundId || razorpayPaymentId || razorpayOrderId || Date.now()}`
      );
      const existing = await db
        .select()
        .from(paymentWebhookEvents)
        .where(eq(paymentWebhookEvents.eventId, eventId))
        .limit(1);
      if (existing.length > 0) {
        return res.json({ received: true, duplicate: true });
      }
      await db.insert(paymentWebhookEvents).values({
        eventId,
        provider: 'razorpay',
        eventType,
        razorpayOrderId,
        razorpayPaymentId,
        payload,
        processingStatus: 'processed',
      });

      const amountPaise = Number(paymentEntity?.amount || refundEntity?.amount || 0);
      const amountInr = Math.round(amountPaise / 100);

      if (eventType === 'payment.authorized') {
        if (razorpayOrderId && paymentEntity?.status === 'captured') {
          const [matchedQuote] = await db
            .select()
            .from(projectQuotations)
            .where(eq(projectQuotations.razorpayOrderId, razorpayOrderId))
            .limit(1);
          if (matchedQuote && razorpayPaymentId) {
            await reconcileProjectQuotationPayment({
              quotationId: matchedQuote.id,
              razorpayOrderId,
              razorpayPaymentId,
              razorpaySignature: signature,
              paymentMode: matchedQuote.paidAmountInr > 0 ? 'balance' : 'advance',
            });
          }
        }
      } else if (eventType === 'payment.captured' || eventType === 'order.paid') {
        let reconciledProject = false;
        if (razorpayOrderId && razorpayPaymentId) {
          const [matchedQuote] = await db
            .select()
            .from(projectQuotations)
            .where(eq(projectQuotations.razorpayOrderId, razorpayOrderId))
            .limit(1);
          if (matchedQuote) {
            await reconcileProjectQuotationPayment({
              quotationId: matchedQuote.id,
              razorpayOrderId,
              razorpayPaymentId,
              razorpaySignature: signature,
              paymentMode: matchedQuote.paidAmountInr > 0 ? 'balance' : 'advance',
            });
            reconciledProject = true;
          }
        }

        if (!reconciledProject && razorpayOrderId) {
          await db
            .update(storeOrders)
            .set({
              paymentStatus: 'paid',
              orderStatus: 'Payment Confirmed',
              razorpayPaymentId,
              updatedAt: new Date(),
            })
            .where(eq(storeOrders.razorpayOrderId, razorpayOrderId));
        }
        if (!reconciledProject && razorpayPaymentId) {
          const [existingPay] = await db
            .select()
            .from(payments)
            .where(eq(payments.razorpayPaymentId, razorpayPaymentId))
            .limit(1);
          if (!existingPay) {
            const paymentRef = generateCode('NTF-WH');
            await db.insert(payments).values({
              paymentRef,
              entityType: 'store_order',
              entityId: 0,
              paymentStage: 'store',
              razorpayOrderId,
              razorpayPaymentId,
              amountInr,
              amountPaise,
              mode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live_razorpay' : 'test_mode',
              status: 'verified',
              verifiedAt: new Date(),
            });
            syncPaymentToSupabase({
              paymentRef,
              entityType: 'store_order',
              razorpayOrderId,
              razorpayPaymentId,
              amountInr,
              amountPaise,
              status: 'captured',
              verifiedAt: new Date(),
            }).catch(() => {});
          }
        }
      } else if (eventType === 'payment.failed') {
        const errorCode = String(paymentEntity?.error_code || 'PAYMENT_FAILED');
        const failureReason = String(paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed');
        let matchedQuote: typeof projectQuotations.$inferSelect | undefined;
        if (razorpayOrderId) {
          const [qRow] = await db
            .select()
            .from(projectQuotations)
            .where(eq(projectQuotations.razorpayOrderId, razorpayOrderId))
            .limit(1);
          matchedQuote = qRow;
          if (!matchedQuote) {
            await db
              .update(storeOrders)
              .set({ paymentStatus: 'failed', updatedAt: new Date() })
              .where(eq(storeOrders.razorpayOrderId, razorpayOrderId));
          }
        }
        if (razorpayPaymentId) {
          const paymentRef = generateCode('NTF-FAIL');
          await db.insert(payments).values({
            paymentRef,
            entityType: matchedQuote ? 'project_quotation' : 'store_order',
            entityId: matchedQuote ? matchedQuote.id : 0,
            paymentStage: matchedQuote ? 'project_quotation' : 'store',
            razorpayOrderId,
            razorpayPaymentId,
            amountInr,
            amountPaise,
            mode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live_razorpay' : 'test_mode',
            status: 'failed',
            errorCode,
            failureReason,
          });
          if (matchedQuote) {
            const [enq] = await db
              .select()
              .from(projectEnquiries)
              .where(eq(projectEnquiries.id, matchedQuote.enquiryId))
              .limit(1);
            if (enq?.customerEmail) {
              await dispatchLifecycleEmail({
                userId: enq.userId,
                enquiryId: enq.id,
                recipientEmail: enq.customerEmail,
                eventType: 'payment_failed',
                vars: {
                  customerName: enq.customerName,
                  enquiryNumber: enq.enquiryNumber,
                  quotationNumber: matchedQuote.quotationNumber,
                  amountInr,
                  reason: failureReason,
                },
              });
            }
          }
          syncPaymentToSupabase({
            paymentRef,
            entityType: matchedQuote ? 'project_quotation' : 'store_order',
            entityRef: matchedQuote ? String(matchedQuote.id) : undefined,
            razorpayOrderId,
            razorpayPaymentId,
            amountInr,
            amountPaise,
            status: 'failed',
            errorCode,
            failureReason,
          }).catch(() => {});
        }
      } else if (eventType === 'refund.processed' || eventType === 'refund.failed') {
        const refundStatus = eventType === 'refund.processed' ? 'processed' : 'failed';
        if (razorpayRefundId) {
          const [existingRef] = await db
            .select()
            .from(paymentRefunds)
            .where(eq(paymentRefunds.razorpayRefundId, razorpayRefundId))
            .limit(1);
          if (existingRef) {
            await db
              .update(paymentRefunds)
              .set({ status: refundStatus, processedAt: refundStatus === 'processed' ? new Date() : null })
              .where(eq(paymentRefunds.id, existingRef.id));
          } else {
            const refundRef = generateCode('NTF-RFND');
            await db.insert(paymentRefunds).values({
              refundRef,
              razorpayPaymentId,
              razorpayRefundId,
              amountInr,
              amountPaise,
              status: refundStatus,
              initiatedBy: 'razorpay_webhook',
              processedAt: refundStatus === 'processed' ? new Date() : null,
            });
            syncRefundToSupabase({
              refundRef,
              razorpayPaymentId,
              razorpayRefundId,
              amountInr,
              amountPaise,
              status: refundStatus,
              initiatedBy: 'razorpay_webhook',
              processedAt: refundStatus === 'processed' ? new Date() : null,
            }).catch(() => {});
          }
        }
        if (razorpayPaymentId && refundStatus === 'processed') {
          await db
            .update(payments)
            .set({ status: 'refunded', refundStatus: 'full', refundedAmountInr: amountInr })
            .where(eq(payments.razorpayPaymentId, razorpayPaymentId));
          await db
            .update(storeOrders)
            .set({ paymentStatus: 'refunded', refundStatus: 'full', updatedAt: new Date() })
            .where(eq(storeOrders.razorpayPaymentId, razorpayPaymentId));
        }
      }
    } catch (err) {
      console.error('Webhook log error:', err);
    }
    res.json({ received: true });
  };

  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleRazorpayWebhook);
  app.post('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), handleRazorpayWebhook);

  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // Serve public CMS media library uploads ONLY (private customer files stay behind /api/files/download)
  app.use('/uploads/media', express.static(path.join(UPLOADS_ROOT, 'media')));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'nexustekfusion-platform' });
  });

  // SEO endpoints
  app.get('/robots.txt', (_req, res) => {
    const base = process.env.APP_URL || 'https://nexustekfusion.in';
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /my-account\nDisallow: /checkout\nSitemap: ${base}/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', async (_req, res) => {
    const base = process.env.APP_URL || 'https://nexustekfusion.in';
    const staticRoutes = [
      '/',
      '/about',
      '/services',
      '/services/drone-repair',
      '/services/custom-engineering',
      '/track-drone-repair',
      '/register-project',
      '/project-enquiry',
      '/krashivantri',
      '/krashivantri/farmer-portal',
      '/krashivantri/pilot-portal',
      '/projects',
      '/shop',
      '/store/3d-printed-products',
      '/blogs',
      '/contact',
      '/faq',
      '/shipping-policy',
      '/return-refund-policy',
      '/privacy-policy',
      '/terms-and-conditions',
      '/track-order',
    ];

    try {
      const [prodRows, blogRows, pageRows, projectRows] = await Promise.all([
        db
          .select({ slug: products.slug })
          .from(products)
          .where(and(eq(products.isPublished, true), eq(products.isDeleted, false))),
        db.select({ slug: blogs.slug }).from(blogs).where(eq(blogs.isPublished, true)),
        db.select({ slug: cmsPages.slug }).from(cmsPages).where(eq(cmsPages.status, 'published')),
        db.select({ slug: caseStudies.slug }).from(caseStudies).where(eq(caseStudies.isPublished, true)),
      ]);
      const dynamicUrls = [
        ...prodRows.map((p) => `/product/${p.slug}`),
        ...blogRows.map((b) => `/blogs/${b.slug}`),
        ...projectRows.map((pr) => `/projects/${pr.slug}`),
        ...pageRows.map((pg) => `/p/${pg.slug}`),
      ];
      const allUrls = [...staticRoutes, ...dynamicUrls];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
        .map((u) => `  <url><loc>${base}${u}</loc></url>`)
        .join('\n')}\n</urlset>`;
      res.type('application/xml').send(xml);
    } catch {
      res.type('application/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticRoutes
          .map((u) => `<url><loc>${base}${u}</loc></url>`)
          .join('')}</urlset>`
      );
    }
  });

  // API Routers
  app.use('/api/auth', authRouter);
  app.use('/api', publicRouter);
  app.use('/api', customerRouter);
  app.use('/api', krashivantriRouter);
  app.use('/api/admin', adminRouter);

  // Error handler for multer & API errors
  app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err?.status || 400).json({ error: err?.message || 'Unexpected server error.' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NexusTekFusion server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
