import { getServerSupabaseClient, getServiceRoleSupabaseClient } from '../lib/supabase-admin.ts';

function getWriteClient() {
  return getServiceRoleSupabaseClient() || getServerSupabaseClient();
}

export async function syncProjectRegistrationToSupabase(params: {
  enquiry: {
    enquiryNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    whatsappNumber?: string;
    companyOrCollege?: string;
    courseDepartment?: string;
    city?: string;
    state?: string;
    customerCategory?: string;
    projectTitle: string;
    projectCategory: string;
    engineeringDomain?: string;
    projectType: string;
    projectDescription: string;
    problemStatement?: string;
    objective?: string;
    expectedWorking?: string;
    requiredFeatures?: string;
    requiredTechnologies?: string;
    hardwareRequirements?: string;
    softwareRequirements?: string;
    componentsRequired?: string;
    expectedOutput?: string;
    requiresPhysicalPrototype?: boolean;
    requiresWebOrMobileApp?: boolean;
    requiresDocumentation?: boolean;
    estimatedBudget?: string;
    targetCompletionDate?: string;
    complexityLevel?: string;
    prototypeRequirements?: string;
    preferredCommunicationMethod?: string;
    specialRequirements?: string;
    acceptedTerms?: boolean;
    acceptedPrivacyPolicy?: boolean;
    status: string;
    assignedEngineer?: string;
    attachments?: Array<{ originalName: string; storagePath: string; sizeBytes: number; category?: string }>;
  };
  userUid: string;
}) {
  const client = getWriteClient();
  if (!client) return;
  const e = params.enquiry;
  try {
    await client.from('customers').upsert(
      {
        user_uid: params.userUid,
        full_name: e.customerName,
        email: e.customerEmail,
        mobile: e.customerPhone,
        whatsapp_number: e.whatsappNumber || '',
        organization: e.companyOrCollege || '',
        department: e.courseDepartment || '',
        city: e.city || '',
        state: e.state || '',
        customer_category: e.customerCategory || 'Student',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_uid' }
    );

    await client.from('project_registrations').upsert(
      {
        registration_number: e.enquiryNumber,
        user_uid: params.userUid,
        customer_name: e.customerName,
        customer_email: e.customerEmail,
        customer_phone: e.customerPhone,
        whatsapp_number: e.whatsappNumber || '',
        company_or_college: e.companyOrCollege || '',
        department: e.courseDepartment || '',
        city: e.city || '',
        state: e.state || '',
        customer_category: e.customerCategory || 'Student',
        project_title: e.projectTitle,
        project_category: e.projectCategory,
        engineering_domain: e.engineeringDomain || '',
        project_type: e.projectType,
        project_description: e.projectDescription,
        problem_statement: e.problemStatement || '',
        objective: e.objective || '',
        expected_working: e.expectedWorking || '',
        required_features: e.requiredFeatures || '',
        preferred_technologies: e.requiredTechnologies || '',
        hardware_requirements: e.hardwareRequirements || '',
        software_requirements: e.softwareRequirements || '',
        components_required: e.componentsRequired || '',
        expected_output: e.expectedOutput || '',
        requires_physical_prototype: e.requiresPhysicalPrototype ?? true,
        requires_web_or_mobile_app: e.requiresWebOrMobileApp ?? false,
        requires_documentation: e.requiresDocumentation ?? true,
        expected_budget: e.estimatedBudget || '',
        target_completion_date: e.targetCompletionDate || '',
        complexity_level: e.complexityLevel || 'Intermediate',
        prototype_requirements: e.prototypeRequirements || '',
        preferred_communication_method: e.preferredCommunicationMethod || 'WhatsApp & Dashboard',
        additional_requirements: e.specialRequirements || '',
        accepted_terms: e.acceptedTerms ?? true,
        accepted_privacy_policy: e.acceptedPrivacyPolicy ?? true,
        status: e.status,
        assigned_engineer: e.assignedEngineer || '',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'registration_number' }
    );

    if (e.attachments?.length) {
      for (const att of e.attachments) {
        await client.from('project_attachments').insert({
          registration_number: e.enquiryNumber,
          user_uid: params.userUid,
          file_name: att.originalName,
          storage_path: att.storagePath,
          file_size_bytes: att.sizeBytes,
          category: att.category || 'supporting_document',
        });
      }
    }
  } catch {
    // Non-blocking Supabase sync
  }
}

export async function syncProjectReviewToSupabase(params: {
  registrationNumber: string;
  reviewerEmail: string;
  decisionStatus: string;
  assignedEngineer?: string;
  internalNotes?: string;
  clarificationNotes?: string;
  rejectionReason?: string;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client
      .from('project_registrations')
      .update({
        status: params.decisionStatus,
        assigned_engineer: params.assignedEngineer || '',
        updated_at: new Date().toISOString(),
      })
      .eq('registration_number', params.registrationNumber);

    await client.from('project_reviews').insert({
      registration_number: params.registrationNumber,
      reviewer_email: params.reviewerEmail,
      decision_status: params.decisionStatus,
      assigned_engineer: params.assignedEngineer || '',
      internal_notes: params.internalNotes || '',
      clarification_notes: params.clarificationNotes || '',
      rejection_reason: params.rejectionReason || '',
    });
  } catch {
    // Non-blocking sync
  }
}

export async function syncProjectQuotationToSupabase(params: {
  registrationNumber: string;
  quotation: {
    quotationNumber: string;
    revisionNumber: number;
    totalAmountInr: number;
    advanceAmountInr: number;
    balanceAmountInr: number;
    gstInr: number;
    discountInr: number;
    estimatedDeliveryDate?: string;
    validityDays: number;
    status: string;
    approvedByAdmin?: boolean;
    publishedAt?: Date | string | null;
    paidAmountInr?: number;
    paymentStatus?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    hardwareCostInr?: number;
    softwareCostInr?: number;
    testingChargesInr?: number;
    documentationChargesInr?: number;
    costCategories?: Record<string, number>;
    items?: unknown[];
  };
}) {
  const client = getWriteClient();
  if (!client) return;
  const q = params.quotation;
  const cc = q.costCategories || {};
  try {
    await client.from('project_quotations').upsert(
      {
        quotation_number: q.quotationNumber,
        registration_number: params.registrationNumber,
        revision_number: q.revisionNumber,
        total_amount_inr: q.totalAmountInr,
        advance_amount_inr: q.advanceAmountInr,
        balance_amount_inr: q.balanceAmountInr,
        gst_inr: q.gstInr,
        discount_inr: q.discountInr,
        estimated_delivery_date: q.estimatedDeliveryDate || '',
        validity_days: q.validityDays,
        status: q.status,
        approved_by_admin: Boolean(q.approvedByAdmin),
        published_at: q.publishedAt ? new Date(q.publishedAt).toISOString() : null,
        paid_amount_inr: q.paidAmountInr || 0,
        payment_status: q.paymentStatus || 'pending',
        razorpay_order_id: q.razorpayOrderId || '',
        razorpay_payment_id: q.razorpayPaymentId || '',
      },
      { onConflict: 'quotation_number' }
    );

    await client.from('project_cost_breakdown').insert({
      quotation_number: q.quotationNumber,
      hardware_cost_inr: Number(cc.hardware ?? q.hardwareCostInr ?? 0),
      software_cost_inr: Number(cc.software ?? q.softwareCostInr ?? 0),
      component_cost_inr: Number(cc.sensors ?? 0),
      pcb_cost_inr: Number(cc.pcb ?? 0),
      printing_3d_cost_inr: Number((cc.printing3d || 0) + (cc.mechanical || 0)),
      engineering_charges_inr: Number((cc.development || 0) + (cc.droneRobotics || 0) + (cc.aiMl || 0) + (cc.iot || 0)),
      testing_qa_charges_inr: Number(cc.testing ?? q.testingChargesInr ?? 0),
      documentation_charges_inr: Number(cc.documentation ?? q.documentationChargesInr ?? 0),
      other_charges_inr: Number((cc.other || 0) + (cc.delivery || 0)),
      taxes_inr: q.gstInr,
      custom_items: q.items || [],
    });
  } catch {
    // Non-blocking sync
  }
}

export async function syncProjectUpdateToSupabase(params: {
  projectCode: string;
  registrationNumber: string;
  update: {
    category?: string;
    title?: string;
    description?: string;
    summary: string;
    progressPercentage?: number;
    photos?: unknown[];
    videos?: unknown[];
    reports?: unknown[];
    adminComments?: string;
    author: string;
  };
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('project_updates').insert({
      project_code: params.projectCode,
      registration_number: params.registrationNumber,
      update_category: params.update.category || 'Development Update',
      update_title: params.update.title || 'Progress Update',
      description: params.update.description || params.update.summary,
      progress_percentage: Number(params.update.progressPercentage || 0),
      photos: params.update.photos || [],
      videos: params.update.videos || [],
      reports: params.update.reports || [],
      admin_comments: params.update.adminComments || '',
      author_email: params.update.author,
    });
  } catch {
    // Non-blocking sync
  }
}

export async function syncProjectMessageToSupabase(params: {
  registrationNumber: string;
  userUid: string;
  senderEmail: string;
  senderName: string;
  senderRole: string;
  message: string;
  attachments?: unknown[];
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    await client.from('project_messages').insert({
      registration_number: params.registrationNumber,
      user_uid: params.userUid,
      sender_email: params.senderEmail,
      sender_name: params.senderName,
      sender_role: params.senderRole,
      message: params.message,
      attachments: params.attachments || [],
    });
  } catch {
    // Non-blocking sync
  }
}

export async function syncProjectPaymentAndHandoverToSupabase(params: {
  projectCode: string;
  registrationNumber: string;
  paymentRef?: string;
  quotationNumber?: string;
  userUid?: string;
  paymentStage?: string;
  amountInr?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceNumber?: string;
  docType?: string;
  gstInr?: number;
  handoverUnlocked?: boolean;
  clearanceCertificateNumber?: string;
  completionCertificateNumber?: string;
}) {
  const client = getWriteClient();
  if (!client) return;
  try {
    if (params.paymentRef && params.amountInr) {
      await client.from('project_payments').upsert(
        {
          payment_ref: params.paymentRef,
          registration_number: params.registrationNumber,
          quotation_number: params.quotationNumber || '',
          user_uid: params.userUid || '',
          payment_stage: params.paymentStage || 'advance',
          amount_inr: params.amountInr,
          amount_paise: Math.round(params.amountInr * 100),
          razorpay_order_id: params.razorpayOrderId || '',
          razorpay_payment_id: params.razorpayPaymentId || '',
          status: 'verified',
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'payment_ref' }
      );
    }

    if (params.invoiceNumber && params.docType) {
      await client.from('project_invoices').upsert(
        {
          invoice_number: params.invoiceNumber,
          registration_number: params.registrationNumber,
          doc_type: params.docType,
          amount_inr: params.amountInr || 0,
          gst_inr: params.gstInr || 0,
          user_uid: params.userUid || '',
        },
        { onConflict: 'invoice_number' }
      );
    }

    await client.from('project_handover').upsert(
      {
        project_code: params.projectCode,
        registration_number: params.registrationNumber,
        handover_unlocked: Boolean(params.handoverUnlocked),
        clearance_certificate_number: params.clearanceCertificateNumber || '',
        completion_certificate_number: params.completionCertificateNumber || '',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_code' }
    );
  } catch {
    // Non-blocking sync
  }
}
