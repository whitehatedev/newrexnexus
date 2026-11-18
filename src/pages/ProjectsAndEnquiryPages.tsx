import React, { useEffect, useState } from 'react';
import { Upload, ArrowRight, CheckCircle2, Play, ArrowLeft } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { AddressSelector } from '../components/AddressSelector';
import { AddressData, CaseStudy } from '../types/platform';

export const ProjectsShowcasePage: React.FC = () => {
  const { caseStudies, navigate } = usePlatform();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#15803D]">Applied Research &amp; Builds</div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#111417]">
            Engineering R&amp;D &amp; Academic Projects
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Documented platforms, UAV prototypes, embedded builds, and robotics systems engineered by the NexusTekFusion team.
          </p>
        </div>
        <button
          onClick={() => navigate('/register-project')}
          className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 shrink-0"
        >
          Register Your Project <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {caseStudies.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No published projects yet. Administrators can publish projects from the Admin Console.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((cs) => (
            <div key={cs.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between">
              <div>
                <button
                  onClick={() => navigate(`/projects/${cs.slug}`)}
                  className="aspect-[16/9] bg-slate-100 block w-full overflow-hidden"
                >
                  <img src={cs.imageUrl} alt={cs.title} referrerPolicy="no-referrer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </button>
                <div className="p-6 space-y-3">
                  <div className="text-xs text-slate-500">{cs.relatedServices.join(' · ')}</div>
                  <h2 className="font-display text-xl font-bold text-[#111417]">{cs.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{cs.description}</p>
                  <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
                    <div><span className="font-semibold text-slate-900">Technologies:</span> {cs.technologyUsed}</div>
                    <div><span className="font-semibold text-slate-900">Applications:</span> {cs.applications}</div>
                    <div><span className="font-semibold text-slate-900">Outcomes:</span> {cs.outcomes}</div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => navigate(`/projects/${cs.slug}`)}
                  className="px-4 py-2 bg-[#111417] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                >
                  View Project <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/project-enquiry')}
                  className="text-xs font-semibold text-[#15803D] hover:underline"
                >
                  Request Similar Build
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { apiFetch, navigate } = usePlatform();
  const [project, setProject] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ project: CaseStudy }>(`/api/projects/${encodeURIComponent(slug)}`)
      .then((res) => setProject(res.project))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug, apiFetch]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-sm text-slate-500">Loading project documentation...</div>;
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">Project Not Found</h1>
        <button
          onClick={() => navigate('/projects')}
          className="px-5 py-2.5 bg-[#111417] text-white text-sm font-semibold rounded-lg"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <button
        onClick={() => navigate('/projects')}
        className="text-xs font-semibold text-slate-600 hover:text-[#15803D] inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Engineering R&amp;D &amp; Academic Projects
      </button>

      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-[#15803D]">
          {project.relatedServices.join(' · ') || 'Engineering R&D Project'}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111417]">{project.title}</h1>
        <p className="text-base text-slate-600 leading-relaxed">{project.description}</p>
      </div>

      <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
        <img
          src={project.imageUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {project.videoUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
            <Play className="w-4 h-4 text-[#15803D]" /> Project Test &amp; Demonstration Video
          </div>
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#15803D] text-white text-xs font-semibold rounded-lg"
          >
            Watch Video
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <div className="text-xs font-semibold text-[#15803D] uppercase">Technologies Used</div>
          <p className="text-sm text-slate-700 leading-relaxed">{project.technologyUsed || 'Configured in Admin CMS'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <div className="text-xs font-semibold text-[#15803D] uppercase">Field Applications</div>
          <p className="text-sm text-slate-700 leading-relaxed">{project.applications || 'Industrial & Academic Deployment'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <div className="text-xs font-semibold text-[#15803D] uppercase">Engineering Outcomes</div>
          <p className="text-sm text-slate-700 leading-relaxed">{project.outcomes || 'Validated Production Prototype'}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#111417] text-white p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold">Need a Similar R&amp;D or Academic System?</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Request an itemized 14-category engineering quotation tailored to your technical scope.
          </p>
        </div>
        <button
          onClick={() => navigate('/project-enquiry')}
          className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 shrink-0"
        >
          Request Similar Project <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PROJECT_CATEGORIES = [
  'Artificial Intelligence and Machine Learning',
  'Internet of Things (IoT)',
  'Robotics and Automation',
  'Drone and UAV Development',
  'Embedded Systems and Microcontrollers',
  'Electrical and Electronics Engineering',
  'PCB Design and Development',
  'Mechanical Design and CAD Modelling',
  '3D Printing and Rapid Prototyping',
  'Software and Application Development',
  'Industrial Automation',
  'Custom Research and Product Development',
];

const CUSTOMER_CATEGORIES = [
  'Student',
  'Startup',
  'Business',
  'Researcher',
  'Individual',
  'Institution',
];

const PROJECT_TYPES = [
  'Mini Project',
  'Major Project',
  'Final Year Project',
  'Research Project',
  'Prototype',
  'Commercial Product',
  'Custom Development',
];

const COMPLEXITY_LEVELS = ['Basic', 'Intermediate', 'Advanced', 'Research Level'];

const DOC_TYPES = [
  'Reference PDF',
  'Image',
  'Circuit Diagram',
  'Research Paper',
  'Reference Video',
  'CAD File',
  'Project Specification',
  'Other Supporting Document',
];

const ALLOWED_DOC_ACCEPT =
  '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp,.mp4,.mov,.avi,.mkv,.zip,.rar,.stl,.obj,.3mf,.step,.stp,.iges,.igs,.dwg,.dxf,.gbr,.kicad_pcb,.sch,.brd';

export const ProjectEnquiryPage: React.FC = () => {
  const {
    isSignedIn,
    dbUser,
    signInWithGoogle,
    signInWithSupabaseOAuth,
    oauthError,
    oauthRedirectUrl,
    apiFetch,
    notify,
    navigate,
  } = usePlatform();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [billingAddress, setBillingAddress] = useState<AddressData | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData | null>(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [files, setFiles] = useState<Array<{ file: File; docType: string }>>([]);
  const [selectedDocType, setSelectedDocType] = useState<string>('Project Specification');
  const [submitting, setSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');

  const [form, setForm] = useState({
    customerName: dbUser?.fullName || '',
    customerEmail: dbUser?.email || '',
    customerPhone: dbUser?.mobile || '',
    whatsappNumber: dbUser?.mobile || '',
    companyOrCollege: dbUser?.companyOrCollege || '',
    courseDepartment: '',
    city: '',
    state: '',
    customerCategory: 'Student',
    teamType: 'Individual',
    teamCount: 1,
    projectTitle: '',
    projectCategory: 'Custom Research and Product Development',
    engineeringDomain: 'Electronics & Embedded Systems',
    engineeringBranch: 'Electronics & Communication (ECE)',
    academicLevel: 'Final Year Project',
    projectType: 'Prototype',
    projectDescription: '',
    problemStatement: '',
    projectObjective: '',
    expectedFunctionality: '',
    requiredFeatures: '',
    requiredTechnologies: '',
    hardwareRequirements: '',
    softwareRequirements: '',
    componentsRequired: '',
    expectedDeliverables: '',
    targetCompletionDate: '',
    projectComplexity: 'Intermediate',
    prototypeRequirements: '',
    budgetMinInr: '',
    budgetMaxInr: '',
    estimatedBudget: '',
    specialRequirements: '',
  });

  const [flags, setFlags] = useState({
    needHardware: true,
    needSoftware: true,
    needPcb: false,
    need3dPrinting: false,
    needAiMl: false,
    needIot: false,
    needPrototype: true,
    needMobileWebApp: false,
    needDocumentation: true,
    needPpt: false,
    needResearchPaper: false,
    consultationMode: 'Phone / WhatsApp / Video Call',
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
  });

  useEffect(() => {
    if (dbUser) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || dbUser.fullName,
        customerEmail: prev.customerEmail || dbUser.email,
        customerPhone: prev.customerPhone || dbUser.mobile,
        whatsappNumber: prev.whatsappNumber || dbUser.mobile,
        companyOrCollege: prev.companyOrCollege || dbUser.companyOrCollege,
      }));
    }
  }, [dbUser]);

  const loadAddresses = async () => {
    if (!isSignedIn) return;
    try {
      const me = await apiFetch<{ addresses: AddressData[] }>('/api/me');
      setAddresses(me.addresses || []);
      if (me.addresses?.length > 0 && !billingAddress) {
        const def = me.addresses.find((a) => a.isDefault) || me.addresses[0];
        setBillingAddress(def);
        setDeliveryAddress(def);
        setForm((prev) => ({
          ...prev,
          city: prev.city || def.city || '',
          state: prev.state || def.state || '',
        }));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [isSignedIn]);

  const handleAddFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const valid: Array<{ file: File; docType: string }> = [];
    for (const file of Array.from(incoming)) {
      if (file.size > 80 * 1024 * 1024) {
        notify(`File "${file.name}" exceeds the 80 MB limit.`, 'error');
        continue;
      }
      valid.push({ file, docType: selectedDocType });
    }
    setFiles((prev) => [...prev, ...valid].slice(0, 12));
  };

  const validateStep = (targetStep: number): boolean => {
    if (step === 1 && targetStep > 1) {
      if (!form.customerName.trim() || !form.customerEmail.trim() || !form.customerPhone.trim()) {
        notify('Please enter Full Name, Email Address, and Mobile Number.', 'error');
        return false;
      }
      if (!form.city.trim() || !form.state.trim()) {
        notify('Please enter your City and State.', 'error');
        return false;
      }
      const finalDelivery = sameAddress ? billingAddress : deliveryAddress;
      if (!billingAddress || !finalDelivery) {
        notify('Please select or add both Billing and Delivery addresses.', 'error');
        return false;
      }
    }
    if (step === 2 && targetStep > 2) {
      if (!form.projectTitle.trim() || !form.projectDescription.trim()) {
        notify('Please enter Project Title and Project Description.', 'error');
        return false;
      }
    }
    return true;
  };

  const goStep = (next: 1 | 2 | 3 | 4 | 5) => {
    if (!validateStep(next)) return;
    setStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      await signInWithGoogle();
      return;
    }
    const finalDelivery = sameAddress ? billingAddress : deliveryAddress;
    if (!billingAddress || !finalDelivery) {
      notify('Please select or save both Billing and Delivery addresses.', 'error');
      return;
    }
    if (!flags.acceptedTerms || !flags.acceptedPrivacyPolicy) {
      notify('Please accept both Terms & Conditions and Privacy Policy before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const budgetSummary =
        form.budgetMinInr || form.budgetMaxInr
          ? `₹${form.budgetMinInr || '0'} – ₹${form.budgetMaxInr || 'Flexible'}`
          : form.estimatedBudget;

      const fd = new FormData();
      Object.entries({
        ...form,
        estimatedBudget: budgetSummary,
        engineeringBranch: form.engineeringDomain || form.engineeringBranch,
      }).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('flags', JSON.stringify(flags));
      fd.append('acceptedTerms', String(flags.acceptedTerms));
      fd.append('acceptedPrivacyPolicy', String(flags.acceptedPrivacyPolicy));
      fd.append('billingAddress', JSON.stringify(billingAddress));
      fd.append('deliveryAddress', JSON.stringify(finalDelivery));
      fd.append(
        'documentCategories',
        JSON.stringify(files.map((item) => ({ name: item.file.name, category: item.docType })))
      );
      files.forEach((item) => fd.append('attachments', item.file));

      const res = await apiFetch<{ enquiry: { enquiryNumber: string }; projectRegistrationId?: string }>(
        '/api/project-enquiries',
        {
          method: 'POST',
          body: fd,
        }
      );
      const regId = res.projectRegistrationId || res.enquiry.enquiryNumber;
      setSubmittedCode(regId);
      notify(`Project ${regId} registered! Status: Submitted – Under Review.`, 'success');
    } catch (err: any) {
      notify(err?.message || 'Failed to register project.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsMeta: Array<{ num: 1 | 2 | 3 | 4 | 5; label: string }> = [
    { num: 1, label: 'A. Customer Info' },
    { num: 2, label: 'B. Project Details' },
    { num: 3, label: 'D. Project Documents' },
    { num: 4, label: 'C. Budget & Specs' },
    { num: 5, label: 'E. Review & Submit' },
  ];

  const finalDelivery = sameAddress ? billingAddress : deliveryAddress;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-[#15803D]">
          Custom Engineering Project Development &amp; Prototyping
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111417]">
          Register Your Project
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Submit your complete engineering requirements and technical documents. Our team reviews feasibility, prepares an itemized cost quotation, and tracks development end-to-end in your dashboard.
        </p>
      </div>

      {!isSignedIn ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5">
          <h2 className="font-display text-xl font-bold text-[#111417]">Customer Sign-In Required</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Sign in with Google or your NexusTekFusion account to register your project, securely upload supporting documents, receive quotations, and track milestones.
          </p>
          {oauthError && (
            <div className="max-w-lg mx-auto rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-left text-xs text-red-900">
              {oauthError}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {oauthRedirectUrl ? (
              <a
                href={oauthRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg"
              >
                Open Google Sign-In in New Tab
              </a>
            ) : (
              <button
                type="button"
                onClick={() => signInWithSupabaseOAuth('/register-project')}
                className="px-5 py-3 border border-slate-300 bg-white hover:bg-slate-50 text-[#111417] text-sm font-semibold rounded-lg"
              >
                Continue with Google
              </button>
            )}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-6 py-3 bg-[#111417] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg"
            >
              Sign In / Create Account with Email
            </button>
          </div>
        </div>
      ) : submittedCode ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#111417] font-display text-2xl font-bold">
            <CheckCircle2 className="w-7 h-7 text-[#15803D]" />
            Project Registered Successfully
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white rounded-xl border border-emerald-200 p-4 text-xs">
            <div>
              <div className="text-slate-500">Unique Project Registration ID</div>
              <div className="font-mono text-base font-bold text-[#111417] mt-0.5">{submittedCode}</div>
            </div>
            <div>
              <div className="text-slate-500">Current Project Status</div>
              <div className="font-semibold text-[#15803D] text-sm mt-0.5">Submitted – Under Review</div>
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            An acknowledgement email has been dispatched to <span className="font-mono">{form.customerEmail}</span>. Your project is now queued for our engineering review team. Once reviewed, an itemized quotation (50% Advance / 50% Final Balance) will be published to your My Projects dashboard.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => navigate('/my-account/project-enquiries')}
              className="px-5 py-2.5 bg-[#111417] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg"
            >
              Open My Projects Dashboard
            </button>
            <button
              onClick={() => navigate('/services')}
              className="px-5 py-2.5 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg bg-white"
            >
              Back to Services
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 5-Step Progress Header */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepsMeta.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= step || validateStep(s.num)) setStep(s.num);
                }}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  step === s.num
                    ? 'border-[#15803D] bg-emerald-50 text-[#111417]'
                    : s.num < step
                    ? 'border-[#111417] bg-slate-50 text-[#111417]'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <div className="font-mono text-[11px] font-semibold">SECTION {s.num} / 5</div>
                <div className="text-xs font-semibold mt-0.5 truncate">{s.label}</div>
              </button>
            ))}
          </div>

          {/* SECTION A: CUSTOMER INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Section A. Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
                    <input
                      required
                      placeholder="Full Name *"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="Email Address *"
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Mobile Number *</label>
                    <input
                      required
                      placeholder="Mobile Number *"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp Number</label>
                    <input
                      placeholder="WhatsApp Number (for quick project updates)"
                      value={form.whatsappNumber}
                      onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      College / University / Company Name
                    </label>
                    <input
                      placeholder="Institution or Organization Name"
                      value={form.companyOrCollege}
                      onChange={(e) => setForm({ ...form, companyOrCollege: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                    <input
                      placeholder="e.g. ECE, CSE, Mechanical, Robotics R&D"
                      value={form.courseDepartment}
                      onChange={(e) => setForm({ ...form, courseDepartment: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City *</label>
                    <input
                      required
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">State *</label>
                    <input
                      required
                      placeholder="State *"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Customer Category *</label>
                    <select
                      value={form.customerCategory}
                      onChange={(e) => setForm({ ...form, customerCategory: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      {CUSTOMER_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Team Structure</label>
                    <select
                      value={form.teamType}
                      onChange={(e) => setForm({ ...form, teamType: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Student Group">Student Group</option>
                      <option value="Enterprise Team">Startup / R&D Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Team Members</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={form.teamCount}
                      onChange={(e) => setForm({ ...form, teamCount: Math.max(1, Number(e.target.value)) })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Billing &amp; Hardware Delivery Addresses
                </h2>
                <AddressSelector
                  title="Billing Address"
                  addresses={addresses}
                  selected={billingAddress}
                  onSelect={(addr) => {
                    setBillingAddress(addr);
                    if (addr) {
                      setForm((prev) => ({
                        ...prev,
                        city: prev.city || addr.city || '',
                        state: prev.state || addr.state || '',
                      }));
                    }
                  }}
                  onAddressSaved={loadAddresses}
                />
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                  />
                  Project delivery address is the same as billing address
                </label>
                {!sameAddress && (
                  <AddressSelector
                    title="Project Delivery Address"
                    addresses={addresses}
                    selected={deliveryAddress}
                    onSelect={setDeliveryAddress}
                    onAddressSaved={loadAddresses}
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => goStep(2)}
                  className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                >
                  Continue to Project Information <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION B: PROJECT INFORMATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Section B. Project Information
                </h2>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Project Title *</label>
                  <input
                    required
                    placeholder="Concise title describing your project or product *"
                    value={form.projectTitle}
                    onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Project Category *</label>
                    <select
                      value={form.projectCategory}
                      onChange={(e) => setForm({ ...form, projectCategory: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
                    >
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Engineering Domain *</label>
                    <input
                      placeholder="e.g. UAV Avionics, Edge AI, Embedded"
                      value={form.engineeringDomain}
                      onChange={(e) => setForm({ ...form, engineeringDomain: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Project Type *</label>
                    <select
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Project Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detailed overview of what needs to be built, use cases, and environment *"
                    value={form.projectDescription}
                    onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Problem Statement</label>
                    <textarea
                      rows={3}
                      placeholder="Core technical or industrial problem this project solves"
                      value={form.problemStatement}
                      onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Objective of the Project</label>
                    <textarea
                      rows={3}
                      placeholder="Key engineering objectives & measurable targets"
                      value={form.projectObjective}
                      onChange={(e) => setForm({ ...form, projectObjective: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Expected Working</label>
                    <textarea
                      rows={3}
                      placeholder="Step-by-step operational flow / how the system should work"
                      value={form.expectedFunctionality}
                      onChange={(e) => setForm({ ...form, expectedFunctionality: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Required Features and Functionalities
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specific user-facing features, automation triggers, telemetry, alerts"
                      value={form.requiredFeatures}
                      onChange={(e) => setForm({ ...form, requiredFeatures: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Preferred Technology / Programming Language
                    </label>
                    <input
                      placeholder="e.g. Python, C/C++, ROS2, React, Flutter, STM32, ESP32"
                      value={form.requiredTechnologies}
                      onChange={(e) => setForm({ ...form, requiredTechnologies: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Expected Output</label>
                    <input
                      placeholder="e.g. Tested working model, Android dashboard, CAD files, Report"
                      value={form.expectedDeliverables}
                      onChange={(e) => setForm({ ...form, expectedDeliverables: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Hardware Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="Microcontrollers, motors, batteries, enclosures..."
                      value={form.hardwareRequirements}
                      onChange={(e) => setForm({ ...form, hardwareRequirements: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Software Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="Mobile app, web portal, ML model, cloud backend..."
                      value={form.softwareRequirements}
                      onChange={(e) => setForm({ ...form, softwareRequirements: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Components Required</label>
                    <textarea
                      rows={2}
                      placeholder="Specific sensors, modules, PCBs or actuators..."
                      value={form.componentsRequired}
                      onChange={(e) => setForm({ ...form, componentsRequired: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-700">Project Deliverable Flags</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      ['needPrototype', 'Working physical prototype required'],
                      ['needMobileWebApp', 'Mobile application or web application required'],
                      ['needDocumentation', 'Documentation and project report required'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer font-medium text-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean((flags as any)[key])}
                          onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-slate-300 bg-white text-slate-800 text-sm font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goStep(3)}
                  className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                >
                  Continue to Document Uploads <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION D: UPLOAD PROJECT DOCUMENTS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Section D. Upload Project Documents
                </h2>
                <p className="text-xs text-slate-600">
                  Upload Reference PDFs, Images, Circuit Diagrams, Research Papers, Reference Videos, CAD Files (.stl/.step/.dwg), Project Specifications, or Other Supporting Documents (up to 12 files, max 80 MB each).
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Document Category for Next Upload:</label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs bg-white"
                  >
                    {DOC_TYPES.map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>

                <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:bg-slate-50 text-sm text-slate-600">
                  <Upload className="w-6 h-6 text-[#15803D]" />
                  <span className="font-medium">
                    Click to attach supporting project files ({files.length}/12 selected)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    PDF · Images · Circuit Diagrams · Research Papers · Videos · CAD (.STL/.STEP/.DWG) · ZIP
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={ALLOWED_DOC_ACCEPT}
                    onChange={(e) => {
                      handleAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-lg px-4">
                    {files.map((item, i) => (
                      <div key={i} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-slate-900 font-semibold">{item.file.name}</span>
                          <span className="ml-2 px-2 py-0.5 rounded bg-emerald-50 text-[#15803D] text-[10px] font-semibold">
                            {item.docType}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">{(item.file.size / 1024).toFixed(1)} KB</span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-slate-300 bg-white text-slate-800 text-sm font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goStep(4)}
                  className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                >
                  Continue to Budget &amp; Complexity <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION C: PROJECT REQUIREMENTS AND BUDGET */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Section C. Project Requirements and Budget
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Minimum Expected Budget (₹ INR)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 15000"
                      value={form.budgetMinInr}
                      onChange={(e) => setForm({ ...form, budgetMinInr: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Maximum Expected Budget (₹ INR)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 45000"
                      value={form.budgetMaxInr}
                      onChange={(e) => setForm({ ...form, budgetMaxInr: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Preferred Completion Date
                    </label>
                    <input
                      type="date"
                      value={form.targetCompletionDate}
                      onChange={(e) => setForm({ ...form, targetCompletionDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Project Complexity</label>
                    <select
                      value={form.projectComplexity}
                      onChange={(e) => setForm({ ...form, projectComplexity: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      {COMPLEXITY_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Prototype Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Enclosure specs, battery backup, dimensions, operating range, field conditions..."
                      value={form.prototypeRequirements}
                      onChange={(e) => setForm({ ...form, prototypeRequirements: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Preferred Communication Method
                      </label>
                      <select
                        value={flags.consultationMode}
                        onChange={(e) => setFlags({ ...flags, consultationMode: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                      >
                        <option value="Phone / WhatsApp / Video Call">Phone / WhatsApp / Video Call</option>
                        <option value="WhatsApp Messaging">WhatsApp Messaging</option>
                        <option value="Online Video Call">Online Video Call</option>
                        <option value="Email">Email</option>
                        <option value="In-Person (Nagpur Office)">In-Person (Nagpur Office)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Additional Requirements</label>
                      <input
                        placeholder="College viva support, patent filing assistance, bulk manufacturing..."
                        value={form.specialRequirements}
                        onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Additional Engineering Scope Options</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      ['needHardware', 'Hardware Build'],
                      ['needSoftware', 'Software / Firmware'],
                      ['needPcb', 'Custom PCB Design'],
                      ['need3dPrinting', '3D Printing / CAD'],
                      ['needAiMl', 'AI / ML Model'],
                      ['needIot', 'IoT & Cloud'],
                      ['needPpt', 'Presentation (PPT)'],
                      ['needResearchPaper', 'Research Paper Support'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean((flags as any)[key])}
                          onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 border border-slate-300 bg-white text-slate-800 text-sm font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goStep(5)}
                  className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                >
                  Review &amp; Final Submission <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION E: FINAL SUBMISSION */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 text-sm">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Section E. Final Review &amp; Submit Project for Review
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-slate-900">Customer &amp; Organization</div>
                    <div>
                      {form.customerName} ({form.customerCategory}) · {form.customerPhone}
                    </div>
                    {form.whatsappNumber && (
                      <div className="text-slate-600 font-mono">WhatsApp: {form.whatsappNumber}</div>
                    )}
                    <div className="text-slate-600">{form.customerEmail}</div>
                    <div className="text-slate-600">
                      {form.city}, {form.state}
                      {form.companyOrCollege ? ` · ${form.companyOrCollege}` : ''}
                      {form.courseDepartment ? ` (${form.courseDepartment})` : ''}
                    </div>
                    {finalDelivery && (
                      <div className="pt-2 border-t border-slate-200 text-slate-600">
                        Delivery: {finalDelivery.houseFlat}, {finalDelivery.streetArea}, {finalDelivery.city}, {finalDelivery.state} — {finalDelivery.pinCode}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-slate-900">Project Summary</div>
                    <div className="font-semibold text-[#15803D]">{form.projectTitle}</div>
                    <div className="text-slate-600">
                      {form.projectCategory} · {form.engineeringDomain} · {form.projectType} ({form.projectComplexity})
                    </div>
                    <div className="text-slate-600 font-mono">
                      Budget:{' '}
                      {form.budgetMinInr || form.budgetMaxInr
                        ? `₹${form.budgetMinInr || '0'} – ₹${form.budgetMaxInr || 'Flexible'}`
                        : 'Open to Quotation'}
                      {form.targetCompletionDate ? ` · Target: ${form.targetCompletionDate}` : ''}
                    </div>
                    <div className="text-slate-600">
                      Prototype: {flags.needPrototype ? 'Yes' : 'No'} · Web/Mobile App: {flags.needMobileWebApp ? 'Yes' : 'No'} · Report/Docs: {flags.needDocumentation ? 'Yes' : 'No'}
                    </div>
                    <div className="text-slate-600">
                      Documents Attached: {files.length} file(s) · Communication: {flags.consultationMode}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.acceptedTerms}
                      onChange={(e) => setFlags({ ...flags, acceptedTerms: e.target.checked })}
                      className="mt-0.5"
                    />
                    <span>
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/terms-and-conditions')}
                        className="text-[#15803D] underline font-medium"
                      >
                        Terms and Conditions
                      </button>{' '}
                      of NEXUSTEKFUSION PRIVATE LIMITED including engineering review, 50% advance / 50% final payment terms, and quotation validity rules. *
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.acceptedPrivacyPolicy}
                      onChange={(e) => setFlags({ ...flags, acceptedPrivacyPolicy: e.target.checked })}
                      className="mt-0.5"
                    />
                    <span>
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/privacy-policy')}
                        className="text-[#15803D] underline font-medium"
                      >
                        Privacy Policy
                      </button>{' '}
                      and consent to NEXUSTEKFUSION PRIVATE LIMITED storing my project specifications and supporting documents securely for technical review. *
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 border border-slate-300 bg-white text-slate-800 text-sm font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Uploading Documents & Submitting...' : 'Submit Project for Review'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
