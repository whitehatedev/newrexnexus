import type {
  AboutUsCmsContent,
  ContactFooterCmsContent,
  ProjectGalleryCmsContent,
  SeoRouteEntry,
  ServiceCatalogItem,
  ServicesCmsContent,
  StoreCmsContent,
  TeamMemberProfile,
  WebsiteBannerItem,
  WebsiteCmsSectionsBundle,
} from '../types/platform.ts';

export const CMS_MEDIA_CATEGORIES = [
  'Company Branding',
  'Team Photographs',
  'Founder Profile',
  'Agricultural Drones',
  'KRASHIVANTRI Products',
  'Engineering Projects',
  'Robotics',
  'Manufacturing',
  'Services',
  'Banners',
  'Promotional Videos',
  'Company Events',
] as const;

export const NEUTRAL_AVATAR_URLS = [
  '/assets/avatars/neutral-avatar-1.svg',
  '/assets/avatars/neutral-avatar-2.svg',
  '/assets/avatars/neutral-avatar-3.svg',
  '/assets/avatars/neutral-avatar-4.svg',
] as const;

export function pickNeutralAvatar(seedText: string | number = 0): string {
  const s = String(seedText || 'ntf');
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return NEUTRAL_AVATAR_URLS[hash % NEUTRAL_AVATAR_URLS.length];
}

export const DEFAULT_ABOUT_US_CMS: AboutUsCmsContent = {
  heroKicker: 'NEXUSTEKFUSION PRIVATE LIMITED · EST. 2026 · NAGPUR, INDIA',
  heroTitle: 'Engineering Indigenous Agricultural Drones & Applied Intelligence.',
  heroDescription:
    'Transforming Ideas into Reality — Engineering the Future with Intelligence. Headquartered in Nagpur, Maharashtra, NexusTekFusion Private Limited is building India’s agricultural UAV hardware, robotics, embedded electronics, and precision spraying ecosystem.',
  heroImageUrl: '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg',
  heroVideoUrl: '',
  heroCapabilities: [
    {
      num: '01',
      title: 'KRASHIVANTRI UAVs',
      detail: 'Indigenous agricultural drone airframes, propulsion integration, and precision crop spraying architecture.',
    },
    {
      num: '02',
      title: 'Robotics & AI Systems',
      detail: 'Applied artificial intelligence, computer vision, IoT telemetry, and industrial automation platforms.',
    },
    {
      num: '03',
      title: 'Hardware & R&D Lab',
      detail: 'Single/double-layer PCB engineering, 3D rapid prototyping, drone diagnostics, and custom R&D execution.',
    },
  ],
  overviewTitle: 'Building Dependable Indigenous Engineering from Nagpur for India',
  overviewSubtitle: 'Corporate Profile & Strategic Mission',
  overviewParagraphs: [
    'NexusTekFusion Private Limited is an engineering, technology development, agricultural drone manufacturing, and innovation company headquartered in Nagpur, Maharashtra, India (CIN: U30305ME2026PTC474052).',
    'Founded in 2026 by Sahil Prakash Bhagat, the company unites indigenous agricultural UAV manufacturing, KRASHIVANTRI precision spraying technology, Drone-as-a-Service (DaaS) digital platforms, verified electronics hardware supply, and bespoke R&D engineering.',
    'From field-serviceable carbon-fiber agricultural airframes and brushless propulsion spares to milestone-backed academic, institutional, and industrial prototyping, our Nagpur engineering facility serves farmers, certified pilots, universities, startups, and industrial clients nationwide.',
  ],
  historyTitle: 'From Applied R&D Lab to Indigenous UAV Manufacturer',
  historyDescription:
    'Established in 2026 in Nagpur, Maharashtra, NexusTekFusion evolved from hands-on robotics, embedded electronics, and flight-control prototyping into a full-stack engineering enterprise powering KRASHIVANTRI agricultural drones, pan-India Drone-as-a-Service (DaaS) software ecosystems, and industrial hardware commerce.',
  visionTitle: 'Long-Term Corporate Vision',
  visionDescription:
    'To become India’s trusted agricultural drone manufacturing and multi-disciplinary engineering company—bridging aerospace hardware, intelligent software, and dependable local field support across every major agricultural and industrial corridor.',
  missionTitle: 'Strategic Mission Pillars',
  missionPoints: [
    'Design and manufacture indigenous agricultural spraying drones engineered for Indian climate and field durability.',
    'Expand Drone-as-a-Service (DaaS) missions connecting verified farmers with DGCA-certified drone pilots transparently.',
    'Deliver industrial-grade UAV components, embedded electronics, 3D printing, and custom engineering prototypes with rigorous quality control.',
    'Empower students, startups, researchers, and enterprises with structured end-to-end R&D execution.',
  ],
  verticalsSectionTitle: 'Integrated Engineering & Product Verticals',
  verticals: [
    {
      num: '01',
      title: 'KRASHIVANTRI Agricultural Drone Manufacturing',
      description:
        'Modular multi-rotor agricultural UAV systems engineered in Nagpur for high-uptime crop spraying, variable-rate payload deployment, and rapid in-field servicing.',
      imageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
      groupLabel: 'Flagship UAV Platforms',
      items: ['KRASHIVANTRI X Modular Agricultural UAV', 'KRASHIVANTRI X PRO Commercial Fleet Platform', 'Carbon-Fiber Airframes & Propulsion Integration', 'Field Telemetry & Precision Nozzle Control'],
      highlightNote: 'Indigenous manufacturing backed by Nagpur spares & diagnostic support.',
    },
    {
      num: '02',
      title: 'Agricultural Drone-as-a-Service (DaaS) & Portals',
      description:
        'Digital mission dispatch connecting Indian farmers and FPOs with certified drone pilots through verified farm polygon mapping, telemetry tracking, and instant digital escrow.',
      imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
      groupLabel: 'Digital Ecosystem',
      items: ['KRASHIVANTRI Farmer Portal & Boundary Mapping', 'Drone Pilot Live GPS & Mission Execution Console', 'Geofenced Spraying Verification & Evidence Logs', 'Transparent Per-Acre Commercial Settlement'],
    },
    {
      num: '03',
      title: 'Drone & Electronics Hardware Store',
      description:
        'Curated direct-dispatch store providing genuine agricultural drone motors, FOC ESCs, dual-IMU flight controllers, smart LiPo batteries, spraying pumps, and embedded electronics.',
      imageUrl: '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
      groupLabel: 'Hardware Distribution',
      items: ['High-Thrust Brushless UAV Propulsion', 'STM32/H743 Flight Avionics & RTK GPS', 'Industrial Connectors & BMS Power Boards', 'Additive PA12-CF & TPU UAV Mounts'],
    },
    {
      num: '04',
      title: 'Custom Engineering R&D, Repair & Rapid Prototyping',
      description:
        'Dedicated engineering division supporting students, researchers, startups, and industrial organizations with custom UAV/robotics prototyping and precision drone diagnostics.',
      imageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
      groupLabel: 'Technical Services',
      items: ['Drone Repair, Calibration & Flight Diagnostics', 'AI/ML, IoT, Embedded & Robotics Project Execution', 'FDM/SLA Rapid 3D Printing & CAD Modelling', 'Single & Double Layer PCB Design & Prototyping'],
    },
  ],
  techSectionTitle: 'Core Engineering & Technology Capabilities',
  techCapabilities: [
    { title: 'Agricultural UAV Engineering', desc: 'Structural airframe design, heavy-lift propulsion tuning, autonomous waypoints, and spraying payload integration.' },
    { title: 'Embedded Systems & PCB Design', desc: 'STM32/ESP32 firmware, CAN/RS485 telemetry buses, power distribution, and single/double-layer PCB layout.' },
    { title: 'Robotics & Industrial Automation', desc: 'Autonomous UGVs, ROS2 sensor fusion, PLC interfacing, and bespoke mechatronic actuator assemblies.' },
    { title: 'AI, Computer Vision & Cloud IoT', desc: 'Edge inference pipelines, agricultural analytics, real-time fleet telemetry dashboards, and mobile applications.' },
    { title: '3D Printing & Rapid Prototyping', desc: 'Functional PA12-CF carbon-nylon brackets, TPU vibration isolators, PETG housings, and SLA 8K engineering parts.' },
    { title: 'Diagnostics & Field Reliability', desc: 'Full thrust bench verification, ESC firmware calibration, ultrasonic cleaning, and pre-dispatch QA protocols.' },
  ],
  daasTitle: 'Nationwide Drone-as-a-Service (DaaS) Vision',
  daasDescription:
    'Bridging agricultural drone manufacturing with scalable rural service delivery across Maharashtra and India through connected farmer and pilot workflows.',
  daasHighlights: [
    'GPS polygon farm boundary mapping with verified acreage calculation',
    'DGCA-aligned pilot verification, drone UIN linkage & mission geofencing',
    'Live mission telemetry, photo/video spray evidence & automated settlement',
    'Centralized Nagpur fleet diagnostics, spare parts dispatch & pilot onboarding',
  ],
  daasImageUrl: '/src/assets/images/krashivantri_x_pro_1795013371537.jpg',
  krashiShowcaseTitle: 'KRASHIVANTRI Indigenous UAV Lineup',
  krashiShowcaseSubtitle: 'Two purpose-built agricultural drone architectures engineered for Indian field endurance.',
  leadershipTitle: 'Executive Leadership',
  leadershipSubtitle: 'Driven by engineering discipline, indigenous manufacturing, and scalable agritech innovation.',
  teamSectionTitle: 'Engineering & Innovation Team',
  teamSectionSubtitle: 'Multi-disciplinary engineers, UAV specialists, and software architects advancing NexusTekFusion.',
  coreValuesTitle: 'Corporate Engineering Values',
  coreValues: [
    { title: 'Engineering Integrity', desc: 'Every airframe, circuit board, and software module is validated against real operational loads before delivery.' },
    { title: 'Indigenous Self-Reliance', desc: 'Designed, assembled, tested, and supported in India to cut downtime and foreign dependency for Indian operators.' },
    { title: 'Field-First Practicality', desc: 'Modular construction and accessible spare parts keep agricultural drones flying during peak spraying windows.' },
    { title: 'Transparent Execution', desc: 'Milestone-backed project workflows, honest quotations, and traceable service records across every engagement.' },
  ],
  companyMediaGallery: [
    {
      id: 'gal-1',
      title: 'KRASHIVANTRI Precision Spraying Field Trial',
      caption: 'Indigenous agricultural multi-rotor airframe undergoing stability and spray dispersion calibration.',
      mediaType: 'image',
      url: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
    },
    {
      id: 'gal-2',
      title: 'Commercial Agricultural UAV Manufacturing',
      caption: 'KRASHIVANTRI X PRO carbon-composite propulsion architecture and spraying manifold assembly.',
      mediaType: 'image',
      url: '/src/assets/images/krashivantri_x_pro_1795013371537.jpg',
    },
    {
      id: 'gal-3',
      title: 'Avionics, Diagnostics & Rapid Prototyping Lab',
      caption: 'Flight controller bench calibration, ESC testing, and additive manufacturing at our Nagpur facility.',
      mediaType: 'image',
      url: '/src/assets/images/service_drone_repair_1794987205295.jpg',
    },
  ],
  ctaHeading: 'Partner with NexusTekFusion for UAV Fleet Deployment or Custom Engineering',
  ctaBody:
    'Connect with our Nagpur headquarters for KRASHIVANTRI demonstrations, enterprise DaaS collaborations, genuine drone components, or custom engineering R&D projects.',
  ctaPrimaryLabel: 'Contact Our Team',
  ctaPrimaryLink: '/contact',
  ctaSecondaryLabel: 'Explore KRASHIVANTRI',
  ctaSecondaryLink: '/krashivantri',
};

export const DEFAULT_SERVICES_CMS_ITEMS: ServiceCatalogItem[] = [
  {
    slug: 'drone-repair',
    title: 'Drone Repair & Diagnostics Service',
    shortDesc:
      'Complete drone inspection, troubleshooting, repair, component replacement, flight controller configuration, calibration and performance testing for agricultural, commercial and custom-built drones.',
    fullDesc:
      'Our Nagpur UAV service center and mobile field diagnostics engineers handle structural airframe rebuilds, motor & ESC swaps, flight controller PID/IMU calibration, RTK GPS integration, spray pump overhaul, and verified hover/load flight testing.',
    visible: true,
    imageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
    videoUrl: '',
    benefits: [
      'Both Mobile Field Engineer Visits & Nagpur Service Centre Drop-Offs',
      'Full Flight Controller Configuration, Telemetry Tuning & Compass Calibration',
      'Genuine Replacement Motors, ESCs, Spray Pumps & Carbon Booms',
      'Live Repair Tracking, Pre-Work Quotation Approval & Online Inspection Payments',
    ],
    capabilities: [
      'Agricultural Spraying Drones (10L–30L)',
      'Survey & Mapping Multirotors',
      'Custom R&D & Academic UAV Airframes',
      'Spray Pump & Nozzle Flow Diagnostics',
    ],
    ctaLabel: 'Book Drone Repair',
    ctaLink: '/services/drone-repair',
    secondaryCtaLabel: 'Contact Service Desk',
    secondaryCtaLink: '/contact',
  },
  {
    slug: 'custom-engineering-projects',
    title: 'Custom Engineering Project Development & Prototyping',
    shortDesc:
      'NexusTekFusion provides customized engineering project development, hardware and software development, prototype manufacturing, research assistance, and end-to-end project implementation for students, startups, researchers, businesses, and institutions.',
    fullDesc:
      'Submit your problem statement and technical requirements through our Customer Project Registration Portal. Receive an engineering feasibility evaluation, milestone-based quotation, live build progress photos/videos, and verified deliverables upon completion.',
    visible: true,
    imageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
    videoUrl: '',
    benefits: [
      'End-to-End Hardware, Firmware, Mechanical CAD & Cloud/Mobile Software Implementation',
      'Milestone-Protected Quotations & Transparent Razorpay Escrow Workflow',
      'Regular Engineering Progress Reports, Testing Photos & Source Code Handover',
      'Dedicated Support for Final-Year Academic Projects, Startups, Institutions & Industries',
    ],
    capabilities: [
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
    ],
    ctaLabel: 'Register Your Project',
    ctaLink: '/register-project',
    secondaryCtaLabel: 'View Project Details',
    secondaryCtaLink: '/services/custom-engineering',
  },
];

export const DEFAULT_SERVICES_CMS: ServicesCmsContent = {
  heroKicker: 'NEXUSTEKFUSION ENGINEERING SERVICES',
  heroTitle: 'Drone Diagnostics & Custom Engineering Project Development',
  heroDescription:
    'Focused, accountable technical execution for agricultural UAV maintenance, commercial drone fleets, and end-to-end custom hardware & software prototyping.',
  bannerImageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
  bannerVideoUrl: '',
  services: DEFAULT_SERVICES_CMS_ITEMS,
};

export const DEFAULT_PROJECT_GALLERY_CMS: ProjectGalleryCmsContent = {
  heroKicker: 'APPLIED R&D & CASE STUDIES',
  heroTitle: 'Engineering R&D & Custom Project Gallery',
  heroDescription:
    'Explore indigenous agricultural UAV systems, autonomous robotics platforms, embedded electronics, and rapid additive prototypes engineered at NexusTekFusion Private Limited.',
  bannerImageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
  featuredVideoUrl: '',
  categories: [
    {
      id: 'cat-uav',
      name: 'Agricultural & Custom UAVs',
      description: 'Indigenous multi-rotor airframes, spraying manifolds, RTK navigation, and telemetry links.',
      imageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
    },
    {
      id: 'cat-robotics',
      name: 'Robotics & Automation',
      description: 'ROS2 autonomous rovers, LiDAR SLAM platforms, and mechatronic actuators.',
      imageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
    },
    {
      id: 'cat-embedded',
      name: 'Embedded Electronics & PCB',
      description: 'Single/double-layer power boards, STM32/ESP32 nodes, and industrial sensor interfaces.',
      imageUrl: '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
    },
    {
      id: 'cat-3dp',
      name: '3D Printing & Rapid Prototypes',
      description: 'PA12-CF gearboxes, TPU vibration isolators, and custom functional enclosures.',
      imageUrl: '/src/assets/images/service_3d_printing_1794981063445.jpg',
    },
  ],
};

export const DEFAULT_STORE_CMS: StoreCmsContent = {
  promoBannerEnabled: true,
  promoBannerKicker: 'DIRECT-DISPATCH HARDWARE STORE',
  promoBannerTitle: 'Agricultural Drone Parts, Avionics & Precision Engineering Spares',
  promoBannerSubtitle:
    'Genuine propulsion motors, FOC ESCs, STM32 flight controllers, spraying pumps, GPS modules, and PA12-CF 3D printed UAV hardware dispatched from Nagpur.',
  promoBannerImageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
  promoBannerVideoUrl: '',
  promoBannerCtaLabel: 'Explore KRASHIVANTRI Fleet',
  promoBannerCtaLink: '/krashivantri',
  categoryDescriptions: {
    'agricultural-drones': 'Complete indigenous agricultural spraying UAV platforms engineered for field endurance.',
    'agricultural-drone-parts': 'Carbon landing skids, folding arm clamps, tanks, and modular maintenance spares.',
    'drone-motors-propulsion': 'High-thrust brushless agricultural motors and carbon folding propeller pairs.',
    'escs-flight-controllers': 'Dual-IMU autopilot stacks, heavy-duty FOC ESCs, and CAN telemetry avionics.',
    'spraying-pumps-nozzles': 'High-pressure brushless diaphragm spraying pumps, flat-fan nozzles, and flowmeters.',
    '3d-printed-products': 'Ready-to-ship PA12-CF gearboxes, TPU GPS mounts, and additive engineering parts.',
  },
};

export const DEFAULT_CONTACT_FOOTER_CMS: ContactFooterCmsContent = {
  contactHeroKicker: 'NAGPUR HEADQUARTERS & ENGINEERING DESK',
  contactHeroTitle: 'Contact & Engineering Support Desk',
  contactHeroSubtitle:
    'Reach NexusTekFusion Private Limited for KRASHIVANTRI drone demonstrations, DaaS partnerships, custom engineering projects, store orders, or service centre support.',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=NIT+Sankul+New+Cotton+Market+Ganjipeth+Nagpur+440018',
  supportHeadline: 'Direct Engineering Support',
  supportDescription:
    'Submit technical enquiries, request KRASHIVANTRI fleet demonstrations, or ask about existing project quotes and hardware dispatches.',
  footerDescription:
    'Transforming Ideas into Reality — Engineering the Future with Intelligence. Agricultural drone manufacturing, KRASHIVANTRI UAV platforms, electronics hardware store, and custom R&D engineering from Nagpur, Maharashtra.',
  newsletterTitle: 'Engineering Dispatch & KRASHIVANTRI Updates',
  newsletterDescription:
    'Receive product releases, agricultural drone manufacturing news, and engineering case studies from Nagpur.',
  copyrightText: '© 2026 NEXUSTEKFUSION PRIVATE LIMITED · CIN: U30305ME2026PTC474052 · Nagpur, Maharashtra, India',
};

export const DEFAULT_SEO_ROUTES: SeoRouteEntry[] = [
  {
    route: '/',
    label: 'Homepage',
    title: 'NEXUSTEKFUSION PRIVATE LIMITED — Agricultural Drone Manufacturing & KRASHIVANTRI',
    description:
      'Agricultural drone manufacturing, KRASHIVANTRI precision spraying UAVs, drone components store, and custom engineering project development — NexusTekFusion Private Limited, Nagpur.',
    keywords: 'NexusTekFusion, KRASHIVANTRI, agricultural drone India, drone manufacturing Nagpur, UAV components, custom engineering projects',
    ogImageUrl: '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg',
    socialDescription: 'Indigenous agricultural drone manufacturing, KRASHIVANTRI UAV technology, and engineering hardware store from Nagpur, India.',
    canonicalUrl: 'https://nexustekfusion.in/',
  },
  {
    route: '/about',
    label: 'About Us',
    title: 'About NexusTekFusion Private Limited — Founder, Leadership & Agricultural UAV Engineering',
    description:
      'Learn about NexusTekFusion Private Limited, Founder & CEO Sahil Prakash Bhagat, our Nagpur engineering facility, KRASHIVANTRI drones, and nationwide DaaS vision.',
    keywords: 'NexusTekFusion Private Limited, Sahil Prakash Bhagat, Nagpur drone company, agricultural UAV manufacturer',
    ogImageUrl: '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg',
    socialDescription: 'Meet the leadership and engineering team behind NexusTekFusion Private Limited and KRASHIVANTRI agricultural drones.',
    canonicalUrl: 'https://nexustekfusion.in/about',
  },
  {
    route: '/krashivantri',
    label: 'KRASHIVANTRI Platform',
    title: 'KRASHIVANTRI Agricultural Drones & Spraying Portals | NexusTekFusion',
    description:
      'Explore KRASHIVANTRI X and KRASHIVANTRI X PRO agricultural spraying drones, Farmer Spraying Portal, and Drone Pilot Portal.',
    keywords: 'KRASHIVANTRI, KRASHIVANTRI X, KRASHIVANTRI X PRO, agriculture drone spraying, DaaS portal India',
    ogImageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
    socialDescription: 'Smart Agriculture. Precision Spraying. Explore indigenous KRASHIVANTRI UAV platforms and DaaS portals.',
    canonicalUrl: 'https://nexustekfusion.in/krashivantri',
  },
  {
    route: '/services',
    label: 'Services',
    title: 'Drone Repair, Diagnostics & Custom Engineering Project Development | NexusTekFusion',
    description:
      'Book professional agricultural and commercial drone repair & diagnostics or register your custom engineering, robotics, IoT, AI, or PCB project.',
    keywords: 'drone repair Nagpur, UAV diagnostics, custom engineering projects, PCB prototyping, 3D printing India',
    ogImageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
    socialDescription: 'Certified drone repair, calibration, diagnostics, and custom R&D project execution.',
    canonicalUrl: 'https://nexustekfusion.in/services',
  },
  {
    route: '/shop',
    label: 'Hardware Store',
    title: 'Drone Components, Avionics, Spraying Pumps & Hardware Store | NexusTekFusion',
    description:
      'Shop agricultural drone frames, brushless motors, FOC ESCs, flight controllers, LiPo batteries, spraying pumps, sensors, and 3D printed UAV parts.',
    keywords: 'drone parts store India, agricultural drone motors, flight controller, spraying nozzles, ESCs',
    ogImageUrl: '/src/assets/images/krashivantri_x_pro_1795013371537.jpg',
    socialDescription: 'Genuine agricultural drone components, avionics, and engineering hardware dispatched pan-India from Nagpur.',
    canonicalUrl: 'https://nexustekfusion.in/shop',
  },
  {
    route: '/projects',
    label: 'Project Gallery',
    title: 'Engineering R&D Showcase & Project Gallery | NexusTekFusion',
    description:
      'View deployed KRASHIVANTRI UAV architectures, autonomous ROS2 rovers, embedded hardware, and custom R&D engineering case studies.',
    keywords: 'engineering R&D gallery, robotics projects, UAV case studies, NexusTekFusion portfolio',
    ogImageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
    socialDescription: 'Applied UAV, robotics, and embedded electronics projects engineered by NexusTekFusion.',
    canonicalUrl: 'https://nexustekfusion.in/projects',
  },
  {
    route: '/register-project',
    label: 'Register Project',
    title: 'Register Your Custom Engineering Project | NexusTekFusion Portal',
    description:
      'Submit your custom hardware, software, AI/ML, IoT, robotics, drone, or PCB project specification for technical evaluation and quotation.',
    keywords: 'register engineering project, custom prototype quote, final year engineering project India',
    ogImageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
    socialDescription: 'Register your engineering project for milestone-backed technical review and prototype delivery.',
    canonicalUrl: 'https://nexustekfusion.in/register-project',
  },
  {
    route: '/contact',
    label: 'Contact Us',
    title: 'Contact NexusTekFusion Private Limited — Nagpur Headquarters',
    description:
      'Get in touch with NexusTekFusion Private Limited at Ganjipeth, Nagpur for KRASHIVANTRI enquiries, drone repair, hardware orders, and R&D projects.',
    keywords: 'contact NexusTekFusion, Nagpur drone manufacturer address, engineering support',
    ogImageUrl: '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg',
    socialDescription: 'Reach our Nagpur engineering & manufacturing headquarters.',
    canonicalUrl: 'https://nexustekfusion.in/contact',
  },
];

export const DEFAULT_SEO_CONFIG = {
  defaultTitle: 'NEXUSTEKFUSION PRIVATE LIMITED — Agricultural Drone Manufacturing & KRASHIVANTRI',
  defaultDescription:
    'Agricultural drone manufacturing, KRASHIVANTRI precision spraying UAVs, drone components store, and custom engineering project development — NexusTekFusion Private Limited, Nagpur.',
  defaultKeywords:
    'NexusTekFusion, KRASHIVANTRI, agricultural drone manufacturing, Nagpur UAV, drone components store, custom engineering development',
  defaultOgImageUrl: '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg',
  defaultSocialDescription:
    'Indigenous agricultural drone manufacturing, KRASHIVANTRI UAV technology, and engineering hardware store.',
  ga4MeasurementId: '',
  routes: DEFAULT_SEO_ROUTES,
};

export const DEFAULT_CMS_BUNDLE: WebsiteCmsSectionsBundle = {
  aboutUs: DEFAULT_ABOUT_US_CMS,
  services: DEFAULT_SERVICES_CMS,
  projectGallery: DEFAULT_PROJECT_GALLERY_CMS,
  storeContent: DEFAULT_STORE_CMS,
  contactFooter: DEFAULT_CONTACT_FOOTER_CMS,
  krashivantriVideoUrl: '',
};

export const DEFAULT_TEAM_MEMBERS_SEED: TeamMemberProfile[] = [
  {
    id: 'sahil-prakash-bhagat',
    name: 'Sahil Prakash Bhagat',
    designation: 'Founder & Chief Executive Officer',
    department: 'Executive Leadership',
    professionalCategory: 'Executive Leadership',
    qualifications:
      'Bachelor of Engineering – YCCE, Nagpur · MBA – JD College of Engineering & Management',
    experience: 'Agricultural UAV Manufacturing, Applied R&D, Strategy & Technology Commercialization',
    biography:
      'Sahil Prakash Bhagat is the Founder and CEO of NexusTekFusion Private Limited. He leads the company’s strategic vision, engineering innovation, product development, and business growth. His focus areas include indigenous agricultural drone manufacturing, nationwide Drone-as-a-Service expansion, AI-powered agriculture, robotics, embedded systems, and advanced engineering solutions.',
    detailedBiography:
      'As Founder & Chief Executive Officer of NexusTekFusion Private Limited, Sahil Prakash Bhagat directs corporate strategy, indigenous agricultural drone architecture under the KRASHIVANTRI product line, institutional R&D partnerships, and nationwide Drone-as-a-Service (DaaS) deployment from Nagpur, Maharashtra.',
    responsibilities:
      'Corporate strategy and business development · Agricultural drone manufacturing · KRASHIVANTRI product development · Nationwide DaaS expansion · Technology commercialization · Strategic partnerships and investor relations · Research and innovation',
    skills: [
      'Agricultural UAV Strategy',
      'Product Engineering',
      'Drone-as-a-Service (DaaS)',
      'Applied Robotics & AI',
      'Technology Commercialization',
    ],
    linkedinUrl: '',
    photoUrl: NEUTRAL_AVATAR_URLS[0],
    photoAlt: 'Sahil Prakash Bhagat — Founder & Chief Executive Officer, NexusTekFusion Private Limited',
    displayOrder: 1,
    status: 'published',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'anchal-joshi',
    name: 'Anchal Joshi',
    designation: 'Engineering & Innovation Team',
    department: 'Engineering & Innovation',
    professionalCategory: 'Engineering & Innovation',
    qualifications: 'Engineering & Technology Specialist',
    experience: 'Applied R&D, Embedded Prototyping & Technical Systems Support',
    biography:
      'Member of the Engineering & Innovation division contributing to applied technology prototyping, system integration, and technical project workflows at NexusTekFusion Private Limited.',
    detailedBiography:
      'Anchal Joshi supports engineering development, technical project coordination, and hardware-software validation across NexusTekFusion’s R&D and innovation initiatives in Nagpur.',
    responsibilities: 'Engineering research · Prototype validation · Technical documentation & execution',
    skills: ['Applied Engineering', 'System Integration', 'Technical Documentation'],
    linkedinUrl: '',
    photoUrl: NEUTRAL_AVATAR_URLS[1],
    photoAlt: 'Anchal Joshi — Engineering & Innovation Team, NexusTekFusion Private Limited',
    displayOrder: 2,
    status: 'published',
    isFeatured: false,
    isActive: true,
  },
];

export const DEFAULT_WEBSITE_BANNERS_SEED: WebsiteBannerItem[] = [
  {
    bannerKey: 'homepage-krashivantri-flagship',
    title: 'KRASHIVANTRI Agricultural Drone Series',
    subtitle:
      'Indigenous multi-rotor spraying platforms engineered in Nagpur for dependable acreage coverage, modular servicing, and DaaS fleet operations.',
    placement: 'homepage_promo',
    imageUrl: '/src/assets/images/krashivantri_x_field_1795013369836.jpg',
    videoUrl: '',
    ctaLabel: 'Explore KRASHIVANTRI',
    ctaLink: '/krashivantri',
    sortOrder: 1,
    isActive: true,
    status: 'published',
  },
  {
    bannerKey: 'store-drone-components',
    title: 'Genuine UAV Propulsion, Avionics & Spraying Hardware',
    subtitle:
      'Industrial motors, FOC ESCs, flight controllers, spraying pumps, and PA12-CF 3D printed mounts dispatched nationwide from Nagpur.',
    placement: 'store',
    imageUrl: '/src/assets/images/krashivantri_x_pro_1795013371537.jpg',
    videoUrl: '',
    ctaLabel: 'Browse Hardware Catalog',
    ctaLink: '/shop',
    sortOrder: 2,
    isActive: true,
    status: 'published',
  },
];
