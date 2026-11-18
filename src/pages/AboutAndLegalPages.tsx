import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Compass,
  Cpu,
  Factory,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  Leaf,
  Mail,
  MapPin,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Target,
  User,
  Users,
  Wifi,
  Wrench,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Product, TeamMemberProfile } from '../types/platform';

const DEFAULT_TEAM_PROFILES: TeamMemberProfile[] = [
  {
    id: 'sahil-prakash-bhagat',
    name: 'Sahil Prakash Bhagat',
    designation: 'Founder & Chief Executive Officer',
    qualifications:
      'Bachelor of Engineering – YCCE, Nagpur · MBA – JD College of Engineering & Management',
    biography:
      'Sahil Prakash Bhagat is the Founder and CEO of NexusTekFusion Private Limited. He leads the company’s strategic vision, engineering innovation, product development, and business growth. His focus areas include indigenous agricultural drone manufacturing, nationwide Drone-as-a-Service expansion, AI-powered agriculture, robotics, embedded systems, and advanced engineering solutions.',
    responsibilities:
      'Corporate strategy and business development · Agricultural drone manufacturing · KRASHIVANTRI product development · Nationwide DaaS expansion · Technology commercialization · Strategic partnerships and investor relations · Research and innovation',
    photoUrl: '',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'anchal-joshi',
    name: 'Anchal Joshi',
    designation: 'Engineering & Innovation Team',
    qualifications: '',
    biography: '',
    responsibilities: '',
    photoUrl: '',
    displayOrder: 2,
    isActive: true,
  },
];

const LEGACY_SHORT_SAHIL_BIO =
  'Founder & Chief Executive Officer of NexusTekFusion Private Limited, leading agricultural drone manufacturing, R&D engineering, and indigenous technology development.';

const LEGACY_SHORT_SAHIL_RESP =
  'Lead company strategy, drone manufacturing, DaaS expansion, product development, and technology innovation.';

function getInitials(name: string): string {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'NT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const SafeEditorialImage: React.FC<{
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  className?: string;
}> = ({ src, alt, fallbackTitle, fallbackSubtitle, className = 'w-full h-full object-cover' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full min-h-[220px] bg-gradient-to-br from-[#111417] via-[#181C20] to-[#0E2417] flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2">
        <Plane className="w-7 h-7 text-emerald-400" />
        <div className="font-display font-semibold text-sm text-white">{fallbackTitle}</div>
        {fallbackSubtitle && <div className="text-xs text-slate-400">{fallbackSubtitle}</div>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

const PortraitStage: React.FC<{
  member: TeamMemberProfile;
  size?: 'founder' | 'team';
}> = ({ member, size = 'team' }) => {
  const [imgError, setImgError] = useState(false);
  const isFounder = size === 'founder';

  if (member.photoUrl && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-[#111417] border border-slate-200 ${
          isFounder
            ? 'w-full h-full min-h-[360px] lg:min-h-[460px] rounded-xl'
            : 'w-28 h-32 sm:w-32 sm:h-36 rounded-xl shrink-0'
        }`}
      >
        <img
          src={member.photoUrl}
          alt={member.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`${member.name} portrait placeholder`}
      className={`relative overflow-hidden bg-gradient-to-b from-[#181C20] to-[#111417] text-white border border-white/15 flex flex-col items-center justify-center text-center ${
        isFounder
          ? 'w-full h-full min-h-[340px] lg:min-h-[440px] rounded-xl p-8'
          : 'w-28 h-32 sm:w-32 sm:h-36 rounded-xl p-4 shrink-0'
      }`}
    >
      <div
        className={`rounded-full bg-white/[0.07] border border-white/15 flex items-center justify-center font-display font-bold tracking-wider text-white ${
          isFounder ? 'w-24 h-24 text-2xl mb-4' : 'w-12 h-12 text-base mb-2'
        }`}
      >
        {member.name ? getInitials(member.name) : <User className="w-6 h-6" />}
      </div>
      <div className={isFounder ? 'space-y-1' : 'space-y-0.5'}>
        <div className={`font-display font-semibold text-white ${isFounder ? 'text-base' : 'text-xs'}`}>
          {member.name}
        </div>
        <div className={`text-slate-400 ${isFounder ? 'text-xs' : 'text-[10px]'}`}>
          {isFounder ? 'Founder & CEO · Nagpur' : 'Profile Portrait'}
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { settings, navigate, apiFetch, addToCart } = usePlatform();
  const company = settings.companyInfo;
  const [krashiProducts, setKrashiProducts] = useState<Record<string, Product | null>>({});

  useEffect(() => {
    let active = true;
    const loadKrashivantriModels = async () => {
      try {
        const [resX, resPro] = await Promise.allSettled([
          apiFetch<{ product: Product }>('/api/products/krashivantri-x'),
          apiFetch<{ product: Product }>('/api/products/krashivantri-x-pro'),
        ]);
        if (!active) return;
        setKrashiProducts({
          'krashivantri-x': resX.status === 'fulfilled' ? resX.value.product : null,
          'krashivantri-x-pro': resPro.status === 'fulfilled' ? resPro.value.product : null,
        });
      } catch {
        // Catalog fallback remains intact when single-product lookup is unavailable
      }
    };
    loadKrashivantriModels();
    return () => {
      active = false;
    };
  }, [apiFetch]);

  const rawTeam = (
    settings.aboutTeam && settings.aboutTeam.length > 0
      ? settings.aboutTeam
      : DEFAULT_TEAM_PROFILES
  )
    .filter((m) => m.isActive !== false)
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

  const founderEntry =
    rawTeam.find((m) => m.id === 'sahil-prakash-bhagat') ||
    rawTeam.find((m) => /founder/i.test(m.designation)) ||
    null;

  const founderProfile: TeamMemberProfile | null = founderEntry
    ? {
        ...founderEntry,
        qualifications:
          founderEntry.qualifications ||
          'Bachelor of Engineering – YCCE, Nagpur · MBA – JD College of Engineering & Management',
        biography:
          !founderEntry.biography || founderEntry.biography === LEGACY_SHORT_SAHIL_BIO
            ? DEFAULT_TEAM_PROFILES[0].biography
            : founderEntry.biography,
        responsibilities:
          !founderEntry.responsibilities || founderEntry.responsibilities === LEGACY_SHORT_SAHIL_RESP
            ? DEFAULT_TEAM_PROFILES[0].responsibilities
            : founderEntry.responsibilities,
      }
    : null;

  const founderEducationList = (founderProfile?.qualifications || '')
    .split(/\s*[·•|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const founderResponsibilityList = (founderProfile?.responsibilities || '')
    .split(/\s*[·•;\n]+\s*/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean);

  const engineeringTeam = rawTeam.filter((m) => !founderEntry || m.id !== founderEntry.id);

  const catalogModels = settings.krashivantriCatalog?.models || [];
  const krashiCards = [
    {
      slug: 'krashivantri-x',
      fallbackName: 'KRASHIVANTRI X',
      fallbackTagline: 'Smart Agriculture. Precision Spraying.',
      fallbackImage: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
      fallbackSummary:
        'Modular agricultural spraying drone built for rapid field deployment, precision nozzle coverage, and dependable everyday farm operations.',
    },
    {
      slug: 'krashivantri-x-pro',
      fallbackName: 'KRASHIVANTRI X PRO',
      fallbackTagline: 'Advanced Intelligence. Precision Agriculture.',
      fallbackImage: '/src/assets/images/krashivantri_x_pro_1795013371537.jpg',
      fallbackSummary:
        'High-endurance intelligent agricultural UAV engineered for commercial fleet spraying operators, FPOs, and autonomous mission telemetry.',
    },
  ].map((card) => {
    const dbProduct = krashiProducts[card.slug] || null;
    const cmsModel = catalogModels.find((m) => m.id === card.slug);
    const dbSpecPairs = Object.entries(dbProduct?.technicalSpecs || {}).map(([label, value]) => ({
      label,
      value: String(value),
    }));
    const cmsSpecPairs = (cmsModel?.specs || []).filter((s) => s.label && s.value);
    const verifiedSpecs = dbSpecPairs.length > 0 ? dbSpecPairs : cmsSpecPairs;
    const features = (
      dbProduct?.features && dbProduct.features.length > 0
        ? dbProduct.features
        : cmsModel?.highlights || []
    ).slice(0, 4);

    return {
      slug: card.slug,
      dbProduct,
      name: dbProduct?.name || cmsModel?.name || card.fallbackName,
      tagline: cmsModel?.tagline || card.fallbackTagline,
      imageUrl: dbProduct?.imageUrl || cmsModel?.imageUrl || card.fallbackImage,
      summary: dbProduct?.shortDescription || cmsModel?.summary || card.fallbackSummary,
      verifiedSpecs: verifiedSpecs.slice(0, 6),
      features,
    };
  });

  const heroCapabilities = [
    {
      num: '01',
      title: 'AGRICULTURAL DRONE MANUFACTURING',
      detail: 'Indigenous KRASHIVANTRI UAV assembly, avionics, and custom airframes.',
    },
    {
      num: '02',
      title: 'DRONE-AS-A-SERVICE (DaaS)',
      detail: 'Precision crop spraying, surveying, and scalable service partner operations.',
    },
    {
      num: '03',
      title: 'ENGINEERING & TECHNOLOGY INNOVATION',
      detail: 'AI, robotics, IoT, embedded hardware, PCB design, and rapid prototyping.',
    },
  ];

  const corporateFields = [
    {
      label: 'Company',
      value: company?.legalName || 'NexusTekFusion Private Limited',
      mono: false,
    },
    {
      label: 'Founder & CEO',
      value: company?.founderCeo || 'Sahil Prakash Bhagat',
      mono: false,
    },
    {
      label: 'Established',
      value: company?.established || '2026',
      mono: true,
    },
    {
      label: 'CIN',
      value: company?.cin || 'U30305ME2026PTC474052',
      mono: true,
    },
    {
      label: 'Headquarters',
      value: 'Nagpur, Maharashtra, India',
      mono: false,
    },
    {
      label: 'Website',
      value: company?.website || 'https://nexustekfusion.in',
      href: company?.website || 'https://nexustekfusion.in',
      mono: true,
    },
    {
      label: 'Email',
      value: company?.email || 'info@nexustekfusion.in',
      href: `mailto:${company?.email || 'info@nexustekfusion.in'}`,
      mono: true,
    },
  ];

  const missionPoints = [
    'Establishing nationwide agricultural Drone-as-a-Service operations.',
    'Manufacturing indigenous KRASHIVANTRI agricultural drones.',
    'Making precision spraying and crop monitoring accessible to farmers.',
    'Developing AI-powered agriculture and autonomous technologies.',
    'Promoting Indian engineering, research, and product innovation.',
    'Creating employment and rural entrepreneurship opportunities.',
  ];

  const businessVerticals = [
    {
      num: '01',
      title: 'AGRICULTURAL DRONE MANUFACTURING',
      description: 'Designing and developing indigenous agricultural UAV platforms.',
      imageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
      icon: <Plane className="w-4 h-4 text-[#15803D]" />,
      groupLabel: 'Capabilities',
      items: [
        'KRASHIVANTRI X and X PRO',
        'Agricultural drone assembly',
        'Custom UAV engineering',
        'Payload integration',
        'Drone electronics and hardware',
        'OEM and customized manufacturing',
      ],
    },
    {
      num: '02',
      title: 'DRONE-AS-A-SERVICE (DaaS)',
      description:
        'Making agricultural drone technology accessible through a scalable service network across India.',
      imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
      icon: <Sprout className="w-4 h-4 text-[#15803D]" />,
      groupLabel: 'Services',
      items: [
        'Agricultural drone spraying',
        'Crop monitoring and surveying',
        'Precision agriculture',
        'Drone pilot services',
        'Regional service partner network',
        'Farmer-focused booking and service management',
      ],
      highlightNote:
        'Built with a clear expansion roadmap to scale agricultural drone spraying and field operations throughout India.',
    },
    {
      num: '03',
      title: 'ENGINEERING & TECHNOLOGY INNOVATION',
      description: 'Turning engineering concepts into practical technology products.',
      imageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
      icon: <Cpu className="w-4 h-4 text-[#15803D]" />,
      groupLabel: 'Capabilities',
      items: [
        'Artificial Intelligence and Machine Learning',
        'Robotics and Autonomous Systems',
        'IoT and Embedded Electronics',
        'PCB Design and Hardware Development',
        '3D Printing and Rapid Prototyping',
        'Industrial Automation',
        'Custom Engineering and Product Development',
      ],
    },
  ];

  const techCapabilities = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-[#15803D]" />,
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Applied computer vision, crop health analytics, predictive field diagnostics, and intelligent decision pipelines.',
    },
    {
      icon: <Plane className="w-5 h-5 text-[#15803D]" />,
      title: 'Agricultural Drones & UAV Systems',
      desc: 'Complete airframe design, heavy-lift propulsion calibration, spraying fluid dynamics, and avionics integration.',
    },
    {
      icon: <Bot className="w-5 h-5 text-[#15803D]" />,
      title: 'Robotics & Autonomous Platforms',
      desc: 'Autonomous path navigation, sensor-fused obstacle avoidance, mechatronic actuation, and field robotics.',
    },
    {
      icon: <Wifi className="w-5 h-5 text-[#15803D]" />,
      title: 'IoT & Smart Devices',
      desc: 'Connected agricultural telemetry nodes, low-power wireless gateways, and field-ready connected instrumentation.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#15803D]" />,
      title: 'Embedded Systems – ESP32, STM32, Raspberry Pi',
      desc: 'Real-time firmware engineering, CAN/UART industrial bus control, edge compute boards, and actuator controllers.',
    },
    {
      icon: <CircuitBoard className="w-5 h-5 text-[#15803D]" />,
      title: 'PCB Design & Electronics Assembly',
      desc: 'Multi-layer schematic capture, power-distribution boards, signal-integrity routing, and hardware bring-up.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#15803D]" />,
      title: '3D Printing & Rapid Prototyping',
      desc: 'Functional polymer enclosures, nozzle brackets, custom drone mounts, and iterative mechanical validation.',
    },
    {
      icon: <Factory className="w-5 h-5 text-[#15803D]" />,
      title: 'Industrial Automation & Product Engineering',
      desc: 'End-to-end R&D from concept feasibility and hardware prototypes to repeatable production workflows.',
    },
  ];

  const daasHighlights = [
    'Agricultural drone spraying',
    'Crop monitoring and surveying',
    'Farmer-focused services',
    'Trained drone operators',
    'Regional service partners',
    'Precision farming',
    'Rural entrepreneurship',
  ];

  const coreValues = [
    {
      icon: <Compass className="w-5 h-5 text-[#15803D]" />,
      title: 'Innovation',
      desc: 'Applying aerospace engineering, AI, and embedded intelligence to solve practical agricultural and industrial problems.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#15803D]" />,
      title: 'Engineering Excellence',
      desc: 'Disciplined mechanical, electronic, and software validation across every drone platform and hardware system we build.',
    },
    {
      icon: <Factory className="w-5 h-5 text-[#15803D]" />,
      title: 'Indigenous Manufacturing',
      desc: 'Designing, assembling, and calibrating KRASHIVANTRI UAVs and core hardware systems within India.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#15803D]" />,
      title: 'Quality & Reliability',
      desc: 'Field-hardened components and repeatable inspection standards built for demanding rural operating conditions.',
    },
    {
      icon: <FlaskConical className="w-5 h-5 text-[#15803D]" />,
      title: 'Research & Development',
      desc: 'Continuous engineering investment in autonomous mission control, precision nozzles, and smart embedded electronics.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#15803D]" />,
      title: 'Customer-Centric Solutions',
      desc: 'Serviceable hardware, transparent workflows, and dependable technical support focused on farmer and client outcomes.',
    },
    {
      icon: <Leaf className="w-5 h-5 text-[#15803D]" />,
      title: 'Sustainable Technology',
      desc: 'Precision aerial application that reduces chemical wastage, lowers water usage, and protects long-term soil health.',
    },
    {
      icon: <Sprout className="w-5 h-5 text-[#15803D]" />,
      title: 'Agricultural Empowerment',
      desc: 'Equipping Indian farmers, FPOs, and trained rural drone pilots with accessible, modern aerial technology.',
    },
  ];

  const scrollToCapabilities = () => {
    const el = document.getElementById('about-capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#F7F9F7] text-slate-900">
      {/* SECTION 3: HERO SECTION – COMPANY IDENTITY */}
      <section className="relative bg-[#111417] text-white border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0.92, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 flex flex-col justify-between space-y-7"
            >
              <div className="space-y-5">
                <div className="text-xs font-semibold text-emerald-400 tracking-wide">
                  Company Profile · Nagpur, Maharashtra, India · Est. {company?.established || '2026'}
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance leading-[1.08]">
                  {company?.legalName || 'NEXUSTEKFUSION PRIVATE LIMITED'}
                </h1>

                <p className="font-display text-lg sm:text-2xl font-semibold text-emerald-300 text-balance leading-snug">
                  Transforming Ideas into Reality — Engineering the Future with Intelligence.
                </p>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  An Indian engineering, agricultural drone manufacturing, and technology innovation company building intelligent solutions for agriculture, industry, and emerging technologies.
                </p>
              </div>

              {/* Three Primary Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {heroCapabilities.map((cap) => (
                  <div key={cap.title} className="space-y-1.5">
                    <div className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                      {cap.num}.
                    </div>
                    <div className="font-display text-xs font-bold tracking-wide text-white leading-snug">
                      {cap.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{cap.detail}</p>
                  </div>
                ))}
              </div>

              {/* Three Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/krashivantri')}
                  className="px-5 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  Explore KRASHIVANTRI <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollToCapabilities}
                  className="px-5 py-3 bg-white text-[#111417] hover:bg-slate-100 text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  Our Capabilities
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="px-5 py-3 border border-white/25 text-white hover:bg-white/10 text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  Contact Our Team
                </button>
              </div>
            </motion.div>

            {/* Right Dominant Aerospace Visual */}
            <div className="lg:col-span-5 flex">
              <div className="w-full min-h-[280px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-white/15 bg-[#181C20] relative">
                <SafeEditorialImage
                  src="/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg"
                  alt="NexusTekFusion Agricultural Drone Manufacturing Facility in Nagpur"
                  fallbackTitle="NexusTekFusion Agricultural UAV Manufacturing"
                  fallbackSubtitle="Nagpur, Maharashtra, India"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6">
                  <div className="text-xs font-medium text-emerald-300">
                    Indigenous UAV &amp; Robotics Engineering
                  </div>
                  <div className="font-display text-base font-bold text-white mt-0.5">
                    KRASHIVANTRI Manufacturing &amp; R&amp;D Hub — Nagpur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT OUR COMPANY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 min-h-[280px] rounded-2xl overflow-hidden border border-slate-200 bg-[#111417] relative">
              <SafeEditorialImage
                src="/src/assets/images/hero_nexustek_engineering_1794981062404.jpg"
                alt="NexusTekFusion Engineering & Hardware Prototyping Lab"
                fallbackTitle="NexusTekFusion Engineering Lab"
                fallbackSubtitle="AI, Robotics, Embedded Systems & UAV Hardware"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5">
                <div className="text-xs text-slate-300">
                  Hardware Engineering · Avionics · Prototyping
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-[#15803D]">About Our Company</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance leading-tight">
                Engineering Innovation. Manufacturing Intelligence. Empowering Agriculture.
              </h2>
              <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  NexusTekFusion Private Limited is headquartered in Nagpur, Maharashtra, India. We specialize in agricultural drone manufacturing, UAV engineering, artificial intelligence, robotics, embedded electronics, IoT, industrial automation, and advanced product development.
                </p>
                <p>
                  Our approach combines engineering research, hardware development, software intelligence, prototyping, and manufacturing to transform innovative ideas into practical products.
                </p>
                <p>
                  We are building an integrated technology ecosystem focused on indigenous agricultural drone manufacturing, nationwide Drone-as-a-Service operations, and intelligent engineering solutions.
                </p>
              </div>
            </div>

            {/* Corporate Information Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Building2 className="w-4 h-4 text-[#15803D]" /> Corporate Information
                </div>
                <span className="text-xs text-slate-500">Registered Indian Private Limited Entity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {corporateFields.map((item) => (
                  <div key={item.label} className="space-y-0.5 min-w-0">
                    <div className="text-xs text-slate-500">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                        className={`block text-sm font-semibold text-[#15803D] hover:text-[#166534] break-all ${
                          item.mono ? 'font-mono tabular-nums' : ''
                        }`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div
                        className={`text-sm font-semibold text-slate-950 ${
                          item.mono ? 'font-mono tabular-nums' : ''
                        }`}
                      >
                        {item.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: VISION & MISSION (Two Visually Distinct Sections) */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-[#15803D]">Strategic Purpose</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* OUR VISION - Crisp Editorial Surface */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-[#F7F9F7] p-8 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#15803D]">
                  <Target className="w-4 h-4" /> OUR VISION
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 text-balance leading-snug">
                  Leading Indigenous Agricultural Drones &amp; Autonomous Engineering
                </h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  To become a leading Indian engineering and technology company developing indigenous agricultural drones, autonomous systems, robotics, and intelligent engineering products that contribute to a smarter and more sustainable future.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-5 text-xs text-slate-600 flex items-center justify-between gap-4">
                <span>Indigenous R&amp;D · Nagpur, India</span>
                <span className="font-mono text-[#15803D] font-semibold">Make in India UAVs</span>
              </div>
            </div>

            {/* OUR MISSION - Deep Charcoal Aerospace Surface */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#111417] text-white p-8 sm:p-10 flex flex-col justify-between space-y-7">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Compass className="w-4 h-4" /> OUR MISSION
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance leading-snug">
                  Accessible Agricultural Drone Technology &amp; Nationwide DaaS
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  To manufacture innovative agricultural drone technologies, develop advanced engineering products, and make modern drone-based agricultural services accessible to farmers across India.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="text-xs font-semibold text-slate-400">Our mission focuses on:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {missionPoints.map((point, idx) => (
                    <div
                      key={point}
                      className="rounded-xl border border-white/10 bg-[#181C20] p-4 flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THREE CORE BUSINESS VERTICALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold text-[#15803D]">Core Business Verticals</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
            Three Pillars of NexusTekFusion Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Integrating indigenous drone production, nationwide field spraying operations, and cross-disciplinary hardware and software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {businessVerticals.map((vert) => (
            <article
              key={vert.title}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-emerald-400"
            >
              <div>
                <div className="aspect-[16/10] bg-[#111417] overflow-hidden relative">
                  <SafeEditorialImage
                    src={vert.imageUrl}
                    alt={vert.title}
                    fallbackTitle={vert.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#15803D] tabular-nums">
                      {vert.num} · Business Vertical
                    </span>
                    {vert.icon}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-bold text-slate-950 leading-snug">
                      {vert.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{vert.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-500">{vert.groupLabel}</div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {vert.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {vert.highlightNote && (
                <div className="px-6 sm:px-7 pb-6">
                  <div className="rounded-xl bg-[#F7F9F7] border border-slate-200 p-3.5 text-xs text-slate-700 leading-relaxed">
                    {vert.highlightNote}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 7 & SECTION 8: FOUNDER & LEADERSHIP + ENGINEERING & INNOVATION TEAM */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-12">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-[#15803D]">Leadership &amp; Engineering</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
              Founder &amp; Leadership
            </h2>
          </div>

          {/* SECTION 7: Large-Format Founder Profile (Dynamically backed by Admin team settings) */}
          {founderProfile && (
            <article className="rounded-2xl border border-slate-800 bg-[#111417] text-white p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-4 flex">
                <PortraitStage member={founderProfile} size="founder" />
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-emerald-400">
                      Executive Leadership · Nagpur Headquarters
                    </div>
                    <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
                      {founderProfile.name}
                    </h3>
                    <div className="text-base font-semibold text-slate-300">
                      {founderProfile.designation}
                    </div>
                  </div>

                  {founderEducationList.length > 0 && (
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Education
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
                        {founderEducationList.map((edu) => (
                          <li key={edu} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {founderProfile.biography && (
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="text-xs font-semibold text-slate-400">Executive Profile</div>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                        {founderProfile.biography}
                      </p>
                    </div>
                  )}
                </div>

                {founderResponsibilityList.length > 0 && (
                  <div className="border-t border-white/10 pt-5 space-y-3">
                    <div className="text-xs font-semibold text-emerald-400">Key Responsibilities</div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-200">
                      {founderResponsibilityList.map((resp) => (
                        <li key={resp} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          )}

          {/* SECTION 8: Engineering & Innovation Team */}
          {engineeringTeam.length > 0 && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#15803D]">Engineering &amp; Innovation</div>
                  <h3 className="font-display text-2xl font-bold text-slate-950">
                    Engineering &amp; Innovation Team
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Team profiles are maintained directly in the Company Administration Panel
                </span>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  engineeringTeam.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl'
                } gap-6`}
              >
                {engineeringTeam.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-2xl border border-slate-200 bg-[#F7F9F7] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start transition-colors duration-200 hover:border-emerald-300"
                  >
                    <PortraitStage member={member} size="team" />

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-display text-xl font-bold text-slate-950">
                          {member.name}
                        </h4>
                        <div className="text-sm font-semibold text-[#15803D]">
                          {member.designation}
                        </div>
                      </div>

                      {member.qualifications ? (
                        <div className="text-xs sm:text-sm text-slate-700 border-t border-slate-200 pt-2.5 leading-relaxed">
                          <span className="font-semibold text-slate-900">Qualifications: </span>
                          {member.qualifications}
                        </div>
                      ) : null}

                      {member.biography ? (
                        <p className="text-sm text-slate-600 leading-relaxed">{member.biography}</p>
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Core contributor within NexusTekFusion&apos;s engineering, prototyping, and applied technology development initiatives in Nagpur.
                        </p>
                      )}

                      {member.responsibilities ? (
                        <div className="text-xs sm:text-sm text-slate-700 border-t border-slate-200 pt-2.5 leading-relaxed">
                          <span className="font-semibold text-slate-900">Responsibilities: </span>
                          {member.responsibilities}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 9: TECHNOLOGY & ENGINEERING CAPABILITIES */}
      <section id="about-capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-semibold text-[#15803D]">
              Technical Capabilities &amp; Domains
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
              Technology &amp; Engineering Capabilities
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Multi-disciplinary capabilities spanning embedded firmware, multi-layer PCB design, autonomous robotics, additive prototyping, and heavy-lift agricultural UAVs.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-[#111417]">
              <SafeEditorialImage
                src="/src/assets/images/service_pcb_electronics_1794981062614.jpg"
                alt="PCB Design and Embedded Electronics Engineering"
                fallbackTitle="PCB & Embedded Systems"
              />
            </div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-[#111417]">
              <SafeEditorialImage
                src="/src/assets/images/service_3d_printing_1794981063445.jpg"
                alt="3D Printing and Rapid Mechanical Prototyping"
                fallbackTitle="Rapid Prototyping"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {techCapabilities.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 transition-colors duration-200 hover:border-emerald-400"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9F7] border border-slate-200 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-950 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FLAGSHIP INNOVATION – KRASHIVANTRI */}
      <section className="bg-[#111417] text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-7">
            <div className="space-y-2.5 max-w-3xl">
              <div className="text-xs font-semibold text-emerald-400">Flagship Innovation</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
                KRASHIVANTRI – Intelligent Agricultural Drone Technology
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                KRASHIVANTRI is the agricultural drone product family developed by NexusTekFusion to support modern farming through precision spraying, intelligent UAV technology, and efficient agricultural operations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/krashivantri')}
              className="px-5 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 shrink-0 transition-colors whitespace-nowrap"
            >
              View KRASHIVANTRI Hub <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {krashiCards.map((model) => (
              <article
                key={model.slug}
                className="rounded-2xl border border-white/15 bg-[#181C20] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-black overflow-hidden">
                    <SafeEditorialImage
                      src={model.imageUrl}
                      alt={model.name}
                      fallbackTitle={model.name}
                      fallbackSubtitle={model.tagline}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-emerald-400">{model.tagline}</div>
                      <h3 className="font-display text-2xl font-bold text-white">{model.name}</h3>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">{model.summary}</p>

                    {model.features.length > 0 && (
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="text-xs font-semibold text-slate-400">Key Features</div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                          {model.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {model.verifiedSpecs.length > 0 ? (
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="text-xs font-semibold text-slate-400">
                          Verified Specifications
                        </div>
                        <div className="divide-y divide-white/10 text-xs">
                          {model.verifiedSpecs.map((sp) => (
                            <div key={sp.label} className="py-2 flex justify-between gap-4">
                              <span className="text-slate-400">{sp.label}</span>
                              <span className="font-mono text-white text-right tabular-nums">
                                {sp.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-white/10 pt-4 text-xs text-slate-400">
                        Verified platform specifications are published on the dedicated {model.name} product page.
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${model.slug}`)}
                    className="px-5 py-2.5 bg-white text-[#111417] hover:bg-slate-100 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    Explore Product <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (model.dbProduct && model.dbProduct.stockQty > 0) {
                        addToCart(model.dbProduct, 1);
                        navigate('/checkout');
                      } else {
                        navigate(`/product/${model.slug}`);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: NATIONWIDE AGRICULTURAL DRONE VISION */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#15803D]">
                  Nationwide DaaS Roadmap · India
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance leading-tight">
                  EMPOWERING INDIAN AGRICULTURE THROUGH DRONE TECHNOLOGY
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Our vision is to make agricultural drone services accessible to farmers throughout India through a connected ecosystem of indigenous drone manufacturing, trained operators, regional service partners, and intelligent agricultural technology.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {daasHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-[#F7F9F7] px-4 py-3 flex items-center gap-2.5 text-sm font-medium text-slate-900"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Explicit Distinction: Active HQ vs Planned Expansion */}
              <div className="rounded-xl border border-slate-200 bg-[#F7F9F7] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-950">Current Operational Hub</div>
                  <p className="text-slate-600 leading-relaxed">
                    Headquarters, UAV engineering, manufacturing, and pilot coordination based in Nagpur, Maharashtra.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[#15803D]">Planned Nationwide Expansion</div>
                  <p className="text-slate-600 leading-relaxed">
                    Phased onboarding of certified drone pilots and regional agricultural service partners across Indian farming belts.
                  </p>
                </div>
              </div>
            </div>

            {/* Refined Architectural India Expansion Map Visual */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-[#111417] text-white p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400">
                      Ecosystem Architecture
                    </div>
                    <div className="font-display text-lg font-bold text-white">
                      Nagpur Hub &amp; Planned Pan-India Corridors
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    HQ: 21.1458° N, 79.0882° E
                  </div>
                </div>

                <div className="relative rounded-xl border border-white/10 bg-[#181C20] p-4 sm:p-6 flex items-center justify-center">
                  <svg
                    viewBox="0 0 420 460"
                    role="img"
                    aria-label="Map of India showing NexusTekFusion headquarters in Nagpur and planned Drone-as-a-Service expansion regions"
                    className="w-full max-w-[360px] h-auto"
                  >
                    {/* Subtle Coordinate Grid */}
                    <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
                      <line x1="0" y1="92" x2="420" y2="92" />
                      <line x1="0" y1="184" x2="420" y2="184" />
                      <line x1="0" y1="276" x2="420" y2="276" />
                      <line x1="0" y1="368" x2="420" y2="368" />
                      <line x1="105" y1="0" x2="105" y2="460" />
                      <line x1="210" y1="0" x2="210" y2="460" />
                      <line x1="315" y1="0" x2="315" y2="460" />
                    </g>

                    {/* Refined Geometric Silhouette of India */}
                    <path
                      d="M178,24 L208,34 L224,52 L218,74 L240,94 L274,116 L310,126 L340,122 L374,116 L388,136 L364,158 L372,178 L346,192 L332,164 L310,164 L298,194 L278,214 L256,246 L230,276 L206,314 L188,368 L172,422 L152,434 L138,402 L122,356 L104,310 L92,260 L72,226 L44,206 L46,178 L72,166 L64,142 L94,112 L124,90 L146,56 L160,34 Z"
                      fill="#1F2933"
                      stroke="#34D399"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />

                    {/* Planned Expansion Corridors from Nagpur Central Hub (182, 224) */}
                    <g stroke="#34D399" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4">
                      <line x1="182" y1="224" x2="165" y2="115" />
                      <line x1="182" y1="224" x2="94" y2="218" />
                      <line x1="182" y1="224" x2="275" y2="178" />
                      <line x1="182" y1="224" x2="166" y2="348" />
                    </g>

                    {/* Planned Regional Corridor Nodes (Hollow / Amber-Slate Distinction) */}
                    {[
                      { x: 165, y: 115, label: 'North Corridor (Planned)' },
                      { x: 94, y: 218, label: 'West Corridor (Planned)' },
                      { x: 275, y: 178, label: 'East Corridor (Planned)' },
                      { x: 166, y: 348, label: 'South Corridor (Planned)' },
                    ].map((node) => (
                      <g key={node.label}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="5"
                          fill="#111417"
                          stroke="#94A3B8"
                          strokeWidth="1.75"
                        />
                        <text
                          x={node.x}
                          y={node.y - 10}
                          textAnchor="middle"
                          fill="#CBD5E1"
                          fontSize="9"
                          fontFamily="ui-monospace, monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}

                    {/* Nagpur Operational Headquarters Anchor */}
                    <g>
                      <circle cx="182" cy="224" r="14" fill="#10B981" fillOpacity="0.18" />
                      <circle cx="182" cy="224" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                      <rect
                        x="194"
                        y="209"
                        width="126"
                        height="26"
                        rx="6"
                        fill="#111417"
                        stroke="#10B981"
                        strokeOpacity="0.7"
                      />
                      <text
                        x="202"
                        y="225"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="600"
                        fontFamily="ui-sans-serif, sans-serif"
                      >
                        Nagpur HQ · Operational
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white inline-block" />
                    <span>Operational Headquarters (Nagpur, MH)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#111417] border-2 border-slate-400 inline-block" />
                    <span>Planned Partner &amp; Operator Expansion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: OUR CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold text-[#15803D]">Guiding Standards</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Our Core Values
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Eight foundational principles governing our engineering architecture, manufacturing discipline, and agricultural service partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreValues.map((val, idx) => (
            <div
              key={val.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 transition-colors duration-200 hover:border-emerald-400"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#F7F9F7] border border-slate-200 flex items-center justify-center">
                  {val.icon}
                </div>
                <span className="font-mono text-xs font-bold text-[#15803D] tabular-nums">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-950">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: CONTACT & PARTNERSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-[#111417] text-white p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-emerald-400">Contact &amp; Partnerships</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              LET&apos;S BUILD THE FUTURE TOGETHER
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              We welcome partnerships with farmers, agricultural businesses, engineering institutions, startups, researchers, investors, manufacturers, and technology innovators.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Nagpur, Maharashtra, India
              </span>
              <a
                href={`mailto:${company?.email || 'info@nexustekfusion.in'}`}
                className="inline-flex items-center gap-1.5 font-mono hover:text-emerald-300"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />{' '}
                {company?.email || 'info@nexustekfusion.in'}
              </a>
              <a
                href={company?.website || 'https://nexustekfusion.in'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono hover:text-emerald-300"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />{' '}
                {company?.website || 'https://nexustekfusion.in'}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-5 py-3.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              Contact Our Team <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/b2b')}
              className="px-5 py-3.5 bg-white text-[#111417] hover:bg-slate-100 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              Partner With Us <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/krashivantri')}
              className="px-5 py-3.5 border border-white/25 text-white hover:bg-white/10 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              Explore KRASHIVANTRI <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/register-project')}
              className="px-5 py-3.5 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Wrench className="w-4 h-4" /> Register Your Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { settings } = usePlatform();
  const faqs = settings.faqs || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-[#15803D]">Help Center</div>
        <h1 className="font-display text-3xl font-bold text-slate-950">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
            <h3 className="font-display font-semibold text-slate-950">{item.q}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{
  type: 'shipping' | 'returnRefund' | 'privacy' | 'terms';
  title: string;
}> = ({ type, title }) => {
  const { settings } = usePlatform();
  const content = settings.policies?.[type] || '';
  const company = settings.companyInfo;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-6">
      <div className="border-b border-slate-200 pb-6 space-y-1">
        <div className="text-xs font-semibold text-[#15803D]">Legal & Compliance</div>
        <h1 className="font-display text-3xl font-bold text-slate-950">{title}</h1>
        <div className="text-xs text-slate-500 font-mono">
          {company?.legalName} · CIN {company?.cin}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};
