import { eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { projectEmailNotifications, siteSettings } from '../db/schema.ts';

export interface EmailTemplateDef {
  eventType: string;
  label: string;
  enabled: boolean;
  subject: string;
  body: string;
}

export const DEFAULT_PROJECT_EMAIL_TEMPLATES: EmailTemplateDef[] = [
  {
    eventType: 'enquiry_submitted',
    label: 'Project Enquiry Received',
    enabled: true,
    subject: 'Project Enquiry Received — {{enquiryNumber}} | NexusTekFusion',
    body: 'Dear {{customerName}}, we have received your project enquiry "{{projectTitle}}" ({{enquiryNumber}}). Our engineering team will review and respond shortly.',
  },
  {
    eventType: 'enquiry_under_review',
    label: 'Project Under Technical Review',
    enabled: true,
    subject: 'Technical Evaluation Started — {{enquiryNumber}}',
    body: 'Dear {{customerName}}, your project registration {{enquiryNumber}} ("{{projectTitle}}") is currently under technical evaluation by our engineering team.',
  },
  {
    eventType: 'additional_info_requested',
    label: 'Additional Information Requested',
    enabled: true,
    subject: 'Action Required: Additional Information Needed — {{enquiryNumber}}',
    body: 'Dear {{customerName}}, our engineering team requires additional details or supporting files for {{enquiryNumber}} ("{{projectTitle}}"): {{notes}}. Please reply or upload documents from your My Projects dashboard.',
  },
  {
    eventType: 'quotation_sent',
    label: 'Quotation Published',
    enabled: true,
    subject: 'Project Quotation Ready — {{quotationNumber}} ({{enquiryNumber}})',
    body: 'Dear {{customerName}}, your itemized quotation {{quotationNumber}} totaling ₹{{totalAmountInr}} (50% Advance: ₹{{advanceAmountInr}}, Balance: ₹{{balanceAmountInr}}) is published in your My Projects dashboard.',
  },
  {
    eventType: 'project_approved',
    label: 'Quotation Approved — Advance Payment Required',
    enabled: true,
    subject: 'Quotation Approved — {{advancePercent}}% Advance Payment Pending ({{enquiryNumber}})',
    body: 'Dear {{customerName}}, thank you for approving quotation {{quotationNumber}}. Please pay the {{advancePercent}}% advance (₹{{advanceAmountInr}}) to activate your project development.',
  },
  {
    eventType: 'advance_payment_confirmed',
    label: 'Advance Payment Confirmed & Project Activated',
    enabled: true,
    subject: 'Advance Payment Received — Project {{projectCode}} Activated',
    body: 'Dear {{customerName}}, we have verified your advance payment of ₹{{amountInr}} (Ref: {{paymentRef}}). Project {{projectCode}} is now active.',
  },
  {
    eventType: 'project_started',
    label: 'Project Development Started',
    enabled: true,
    subject: 'Project Development Started — {{projectCode}}',
    body: 'Dear {{customerName}}, development work has started on project {{projectCode}} ("{{projectTitle}}"). Assigned Engineer: {{assignedEngineer}}.',
  },
  {
    eventType: 'milestone_updated',
    label: 'Project Progress Updated',
    enabled: true,
    subject: 'Project Progress Update ({{progressPercentage}}%) — {{projectCode}}',
    body: 'Dear {{customerName}}, project {{projectCode}} has a new progress update: {{summary}}.',
  },
  {
    eventType: 'testing_completed',
    label: 'Testing and Quality Assurance Update',
    enabled: true,
    subject: 'Testing & QA Update — {{projectCode}}',
    body: 'Dear {{customerName}}, testing and quality assurance inspection is underway/completed for {{projectCode}} ("{{projectTitle}}"). {{summary}}',
  },
  {
    eventType: 'project_ready_for_final_payment',
    label: 'Project Completed — Final Payment Required',
    enabled: true,
    subject: 'Project Completed — Pay Remaining {{finalPercent}}% Balance ({{projectCode}})',
    body: 'Dear {{customerName}}, development & testing for {{projectCode}} are complete. Please pay the remaining balance of ₹{{balanceAmountInr}} to unlock Ready for Handover deliverables.',
  },
  {
    eventType: 'final_payment_reminder',
    label: 'Final Payment Reminder',
    enabled: true,
    subject: 'Payment Reminder: Remaining Balance ₹{{balanceAmountInr}} — {{projectCode}}',
    body: 'Dear {{customerName}}, this is a friendly reminder to complete the remaining balance payment of ₹{{balanceAmountInr}} for {{projectCode}} so we can proceed with handover.',
  },
  {
    eventType: 'final_payment_confirmed',
    label: 'Final Payment Confirmed & Ready for Handover',
    enabled: true,
    subject: 'Final Payment Verified — {{projectCode}} Ready for Handover',
    body: 'Dear {{customerName}}, your final payment of ₹{{amountInr}} (Ref: {{paymentRef}}) is verified. Clearance Certificate {{certificateNumber}} is issued and your project deliverables are now unlocked.',
  },
  {
    eventType: 'handover_ready',
    label: 'Project Ready for Handover',
    enabled: true,
    subject: 'Project Deliverables Ready for Handover — {{projectCode}}',
    body: 'Dear {{customerName}}, final deliverables for {{projectCode}} are available in your NexusTekFusion My Projects dashboard.',
  },
  {
    eventType: 'project_dispatched',
    label: 'Physical Hardware / Kit Dispatched',
    enabled: true,
    subject: 'Hardware Dispatched — {{projectCode}} via {{courierName}}',
    body: 'Dear {{customerName}}, your deliverables for {{projectCode}} have been dispatched via {{courierName}} (Tracking: {{trackingNumber}}).',
  },
  {
    eventType: 'project_delivered',
    label: 'Project Delivered / Handed Over',
    enabled: true,
    subject: 'Project Delivered / Handed Over — {{projectCode}}',
    body: 'Dear {{customerName}}, project {{projectCode}} has been marked Delivered / Handed Over. Thank you for partnering with NEXUSTEKFUSION PRIVATE LIMITED.',
  },
  {
    eventType: 'payment_failed',
    label: 'Payment Failed / Cancelled',
    enabled: true,
    subject: 'Payment Attempt Unsuccessful — {{projectCode}}',
    body: 'Dear {{customerName}}, a recent payment attempt for {{projectCode}} did not complete. Please retry from your account dashboard.',
  },
  {
    eventType: 'enquiry_rejected',
    label: 'Project Proposal Declined',
    enabled: true,
    subject: 'Update on Project Registration {{enquiryNumber}}',
    body: 'Dear {{customerName}}, thank you for reaching out. Unfortunately project registration {{enquiryNumber}} could not proceed: {{reason}}.',
  },
];

function interpolateTemplate(tpl: string, vars: Record<string, string | number | undefined>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_m, k) => (vars[k] !== undefined ? String(vars[k]) : ''));
}

export async function dispatchLifecycleEmail(params: {
  userId?: number | null;
  projectId?: number | null;
  enquiryId?: number | null;
  recipientEmail: string;
  eventType: string;
  vars: Record<string, string | number | undefined>;
}) {
  if (!params.recipientEmail || !params.recipientEmail.includes('@')) {
    return { deliveryStatus: 'failed', errorMessage: 'Missing valid recipient email' };
  }

  let templates = DEFAULT_PROJECT_EMAIL_TEMPLATES;
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'projectEmailTemplates'))
      .limit(1);
    if (Array.isArray(row?.value)) {
      templates = row.value as EmailTemplateDef[];
    }
  } catch {
    // use defaults
  }

  const tpl =
    templates.find((t) => t.eventType === params.eventType) ||
    DEFAULT_PROJECT_EMAIL_TEMPLATES.find((t) => t.eventType === params.eventType);

  if (tpl && !tpl.enabled) {
    return { deliveryStatus: 'disabled', errorMessage: 'Template disabled by admin' };
  }

  const subject = interpolateTemplate(
    tpl?.subject || `NexusTekFusion Update — ${params.eventType}`,
    params.vars
  );
  const bodyText = interpolateTemplate(
    tpl?.body || 'Please check your NexusTekFusion account dashboard for updates.',
    params.vars
  );

  const fromEmail = process.env.EMAIL_FROM || 'NEXUSTEKFUSION Customer Care <info@nexustekfusion.in>';
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL?.trim();

  let provider = 'none';
  let deliveryStatus: 'sent' | 'failed' | 'not_configured' = 'not_configured';
  let providerMessageId = '';
  let errorMessage = '';

  if (resendKey) {
    provider = 'resend';
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.recipientEmail],
          subject,
          text: bodyText,
        }),
      });
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.id) {
        deliveryStatus = 'sent';
        providerMessageId = String(json.id);
      } else {
        deliveryStatus = 'failed';
        errorMessage = json?.message || `Resend HTTP ${resp.status}`;
      }
    } catch (err: any) {
      deliveryStatus = 'failed';
      errorMessage = err?.message || 'Resend request error';
    }
  } else if (webhookUrl) {
    provider = 'email_webhook';
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: params.recipientEmail,
          subject,
          text: bodyText,
          eventType: params.eventType,
        }),
      });
      if (resp.ok) {
        deliveryStatus = 'sent';
        providerMessageId = `webhook-${Date.now()}`;
      } else {
        deliveryStatus = 'failed';
        errorMessage = `Email webhook HTTP ${resp.status}`;
      }
    } catch (err: any) {
      deliveryStatus = 'failed';
      errorMessage = err?.message || 'Email webhook error';
    }
  } else {
    provider = 'dashboard_queue';
    errorMessage = 'Queued in customer dashboard; customer care available at info@nexustekfusion.in.';
  }

  try {
    await db.insert(projectEmailNotifications).values({
      userId: params.userId ?? null,
      projectId: params.projectId ?? null,
      enquiryId: params.enquiryId ?? null,
      recipientEmail: params.recipientEmail,
      eventType: params.eventType,
      subject,
      bodyPreview: bodyText.slice(0, 500),
      provider,
      deliveryStatus,
      providerMessageId,
      errorMessage,
    });
  } catch (err) {
    console.error('Email notification log write failed:', err);
  }

  return { deliveryStatus, provider, providerMessageId, errorMessage };
}
