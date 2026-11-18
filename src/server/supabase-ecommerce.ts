import { getServerSupabaseClient, getServiceRoleSupabaseClient } from '../lib/supabase-admin.ts';

function getWriteClient() {
  return getServiceRoleSupabaseClient() || getServerSupabaseClient();
}

export async function syncCategoryToSupabase(cat: {
  name: string;
  slug: string;
  storeScope?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('ecommerce_categories').upsert(
      {
        name: cat.name,
        slug: cat.slug,
        store_scope: cat.storeScope || 'general',
        description: cat.description || '',
        is_active: cat.isActive ?? true,
        sort_order: cat.sortOrder ?? 0,
      },
      { onConflict: 'slug' }
    );
  } catch {
    // Non-blocking sync when Supabase schema is not yet applied
  }
}

export async function syncProductToSupabase(prod: {
  sku: string;
  name: string;
  slug: string;
  categorySlug?: string | null;
  brand?: string;
  productType?: string;
  modelNumber?: string;
  shortDescription?: string;
  description?: string;
  technicalSpecs?: Record<string, string>;
  features?: string[];
  applications?: string;
  priceInr: number;
  discountPriceInr?: number | null;
  gstPercent?: number;
  stockQty?: number;
  lowStockThreshold?: number;
  warrantyInfo?: string;
  deliveryInfo?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  availableColors?: string[];
  availableVariants?: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isPublished?: boolean;
  isDeleted?: boolean;
  sortOrder?: number;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('ecommerce_products').upsert(
      {
        sku: prod.sku,
        name: prod.name,
        slug: prod.slug,
        category_slug: prod.categorySlug || null,
        brand: prod.brand || 'NexusTekFusion',
        product_type: prod.productType || 'simple',
        model_number: prod.modelNumber || '',
        short_description: prod.shortDescription || '',
        description: prod.description || '',
        technical_specs: prod.technicalSpecs || {},
        features: prod.features || [],
        applications: prod.applications || '',
        price_inr: prod.priceInr,
        discount_price_inr: prod.discountPriceInr ?? null,
        gst_percent: prod.gstPercent ?? 18,
        stock_qty: prod.stockQty ?? 0,
        low_stock_threshold: prod.lowStockThreshold ?? 5,
        warranty_info: prod.warrantyInfo || '',
        delivery_info: prod.deliveryInfo || '',
        image_url: prod.imageUrl || '',
        gallery_urls: prod.galleryUrls || [],
        available_colors: prod.availableColors || [],
        available_variants: prod.availableVariants || [],
        is_featured: Boolean(prod.isFeatured),
        is_bestseller: Boolean(prod.isBestseller),
        is_new_arrival: Boolean(prod.isNewArrival),
        is_published: prod.isPublished ?? true,
        is_deleted: Boolean(prod.isDeleted),
        sort_order: prod.sortOrder ?? 0,
      },
      { onConflict: 'sku' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncCustomerProfileToSupabase(user: {
  uid: string;
  email: string;
  fullName: string;
  mobile: string;
  companyOrCollege?: string;
  role?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  emailConfirmedAt?: string;
  phoneConfirmedAt?: string;
}) {
  const client = getWriteClient();
  if (!client || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.uid)) {
    return;
  }
  try {
    await client.from('customer_profiles').upsert(
      {
        id: user.uid,
        email: user.email,
        full_name: user.fullName || '',
        phone: user.mobile || '',
        company_or_college: user.companyOrCollege || '',
        role: user.role || 'customer',
        email_verified: Boolean(user.emailVerified),
        phone_verified: Boolean(user.phoneVerified),
        email_confirmed_at: user.emailConfirmedAt || null,
        phone_confirmed_at: user.phoneConfirmedAt || null,
      },
      { onConflict: 'id' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncCartToSupabase(userUid: string, items: unknown[]) {
  const client = getWriteClient();
  if (!client || !userUid) return;
  try {
    await client.from('customer_carts').upsert(
      {
        user_uid: userUid,
        items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_uid' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncStoreOrderToSupabase(order: {
  orderNumber: string;
  userUid: string;
  customerEmail?: string;
  billingAddress: unknown;
  shippingAddress: unknown;
  items: unknown;
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  gstInr: number;
  totalInr: number;
  couponCode?: string;
  paymentStatus: string;
  refundStatus?: string;
  orderStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingCourier?: string;
  trackingId?: string;
  trackingUrl?: string;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('store_orders').upsert(
      {
        order_number: order.orderNumber,
        user_uid: order.userUid,
        customer_email: order.customerEmail || '',
        billing_address: order.billingAddress || {},
        shipping_address: order.shippingAddress || {},
        items: order.items || [],
        subtotal_inr: order.subtotalInr,
        discount_inr: order.discountInr,
        shipping_inr: order.shippingInr,
        gst_inr: order.gstInr,
        total_inr: order.totalInr,
        coupon_code: order.couponCode || '',
        payment_status: order.paymentStatus,
        refund_status: order.refundStatus || 'none',
        order_status: order.orderStatus,
        razorpay_order_id: order.razorpayOrderId || '',
        razorpay_payment_id: order.razorpayPaymentId || '',
        tracking_courier: order.trackingCourier || '',
        tracking_id: order.trackingId || '',
        tracking_url: order.trackingUrl || '',
      },
      { onConflict: 'order_number' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncPaymentToSupabase(payment: {
  paymentRef: string;
  userUid?: string;
  entityType: string;
  entityRef?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountInr: number;
  amountPaise: number;
  mode?: string;
  status: string;
  errorCode?: string;
  failureReason?: string;
  refundStatus?: string;
  refundedAmountInr?: number;
  verifiedAt?: Date | null;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('razorpay_payments').upsert(
      {
        payment_ref: payment.paymentRef,
        user_uid: payment.userUid || '',
        entity_type: payment.entityType,
        entity_ref: payment.entityRef || '',
        razorpay_order_id: payment.razorpayOrderId || '',
        razorpay_payment_id: payment.razorpayPaymentId || null,
        amount_inr: payment.amountInr,
        amount_paise: payment.amountPaise,
        mode: payment.mode || 'test_mode',
        status: payment.status,
        error_code: payment.errorCode || '',
        failure_reason: payment.failureReason || '',
        refund_status: payment.refundStatus || 'none',
        refunded_amount_inr: payment.refundedAmountInr || 0,
        verified_at: payment.verifiedAt ? payment.verifiedAt.toISOString() : null,
      },
      { onConflict: 'payment_ref' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncRefundToSupabase(refund: {
  refundRef: string;
  razorpayPaymentId: string;
  razorpayRefundId?: string;
  amountInr: number;
  amountPaise: number;
  reason?: string;
  status: string;
  initiatedBy?: string;
  processedAt?: Date | null;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('payment_refunds').upsert(
      {
        refund_ref: refund.refundRef,
        razorpay_payment_id: refund.razorpayPaymentId,
        razorpay_refund_id: refund.razorpayRefundId || null,
        amount_inr: refund.amountInr,
        amount_paise: refund.amountPaise,
        reason: refund.reason || '',
        status: refund.status,
        initiated_by: refund.initiatedBy || '',
        processed_at: refund.processedAt ? refund.processedAt.toISOString() : null,
      },
      { onConflict: 'refund_ref' }
    );
  } catch {
    // Non-blocking sync
  }
}

export async function syncEnquiryToSupabase(enquiry: {
  ticketNumber: string;
  userUid?: string;
  name: string;
  email: string;
  mobile?: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  staffReply?: string;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('contact_enquiries').upsert(
      {
        ticket_number: enquiry.ticketNumber,
        user_uid: enquiry.userUid || '',
        name: enquiry.name,
        email: enquiry.email,
        mobile: enquiry.mobile || '',
        category: enquiry.category,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        staff_reply: enquiry.staffReply || '',
      },
      { onConflict: 'ticket_number' }
    );
  } catch {
    // Non-blocking sync
  }
}
