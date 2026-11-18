import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Cpu,
  Plane,
  Smartphone,
  ShieldCheck,
  Truck,
  CreditCard,
  FileText,
  Mail,
  MessageSquarePlus,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { HomepageSectionConfig, Product } from '../types/platform';

const HERO_IMG = '/src/assets/images/hero_agri_drone_mfg_1795013369288.jpg';
const KRASHI_X_IMG = '/src/assets/images/krashivantri_x_field_1795013369836.jpg';
const KRASHI_X_PRO_IMG = '/src/assets/images/krashivantri_x_pro_1795013371537.jpg';
const DRONE_IMG = '/src/assets/images/service_agri_drone_1794981061744.jpg';
const PCB_IMG = '/src/assets/images/service_pcb_electronics_1794981062614.jpg';
const PRINT_IMG = '/src/assets/images/service_3d_printing_1794981063445.jpg';
const ROBOT_IMG = '/src/assets/images/service_robotics_automation_1794981063545.jpg';

const SERVICE_CARDS = [
  {
    num: '01',
    slug: 'drone-repair',
    title: 'Drone Repair & Diagnostics Service',
    summary:
      'Agricultural & FPV UAV airframe repair, flight controller calibration, ESC/motor replacement, bench diagnostics, and on-site field support.',
    to: '/services/drone-repair',
    ctaLabel: 'Book Drone Repair',
    icon: Plane,
  },
  {
    num: '02',
    slug: 'custom-engineering-projects',
    title: 'Custom Engineering Project Development & Prototyping',
    summary:
      'NexusTekFusion provides customized engineering project development, hardware and software development, prototype manufacturing, research assistance, and end-to-end project implementation for students, startups, researchers, businesses, and institutions.',
    to: '/register-project',
    ctaLabel: 'Register Your Project',
    icon: Cpu,
  },
];

const CUSTOM_PROJECT_CAPABILITIES = [
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

const KRASHIVANTRI_SPEC_ROWS: Array<{ label: string; keys: string[]; fallback: string }> = [
  { label: 'Payload Capacity', keys: ['Payload capacity', 'Payload Capacity'], fallback: 'Official Specification on Briefing' },
  { label: 'Flight Time', keys: ['Flight time', 'Flight Time'], fallback: 'Official Specification on Briefing' },
  { label: 'Tank Capacity', keys: ['Tank capacity', 'Tank Capacity'], fallback: 'Official Specification on Briefing' },
  { label: 'Spraying Width', keys: ['Spraying width', 'Spraying Width'], fallback: 'Official Specification on Briefing' },
  { label: 'Battery Specifications', keys: ['Battery', 'Battery Specifications', 'Battery Configuration'], fallback: 'Official Specification on Briefing' },
  { label: 'Navigation Capabilities', keys: ['Navigation system', 'Navigation Capabilities', 'Navigation System'], fallback: 'Official Specification on Briefing' },
  { label: 'Applications', keys: ['Application', 'Applications', 'Target Application'], fallback: 'Precision Crop Spraying & Agricultural Field Operations' },
];

const FALLBACK_SECTIONS: HomepageSectionConfig[] = [
  { id: 'hero', type: 'hero', visible: true },
  { id: 'agri_fpv_showcase', type: 'agri_fpv_showcase', visible: true },
  { id: 'categories', type: 'categories', visible: true },
  { id: 'featured_products', type: 'featured_products', visible: true },
  { id: 'bestsellers', type: 'bestsellers', visible: true },
  { id: 'new_arrivals', type: 'new_arrivals', visible: true },
  { id: 'company_intro', type: 'company_intro', visible: true },
  { id: 'services', type: 'services', visible: true },
  { id: 'printing_and_projects', type: 'printing_and_projects', visible: true },
  { id: 'krashivantri_apps', type: 'krashivantri_apps', visible: true },
  { id: 'case_studies', type: 'case_studies', visible: true },
  { id: 'testimonials', type: 'testimonials', visible: true },
  { id: 'why_us', type: 'why_us', visible: true },
  { id: 'cta', type: 'cta', visible: true },
];

export const HomePage: React.FC = () => {
  const {
    navigate,
    featuredProducts,
    bestsellerProducts,
    newArrivalProducts,
    categories,
    caseStudies,
    addToCart,
    settings,
    previewDraft,
    apiFetch,
  } = usePlatform();
  const [krashiProducts, setKrashiProducts] = useState<{ x: Product | null; xPro: Product | null }>({
    x: null,
    xPro: null,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      apiFetch<{ product: Product }>('/api/products/krashivantri-x').catch(() => null),
      apiFetch<{ product: Product }>('/api/products/krashivantri-x-pro').catch(() => null),
    ]).then(([r1, r2]) => {
      if (active) {
        setKrashiProducts({
          x: r1?.product || null,
          xPro: r2?.product || null,
        });
      }
    });
    return () => {
      active = false;
    };
  }, [apiFetch]);

  const company = settings.companyInfo;
  const customerCareEmail = company?.customerCareEmail || 'info@nexustekfusion.in';
  const krashiCatalog = settings.krashivantriCatalog;
  const layoutList =
    (previewDraft ? settings.homepageLayout?.draft : settings.homepageLayout?.published) ||
    FALLBACK_SECTIONS;

  const resolveKrashiSpec = (modelId: string, row: typeof KRASHIVANTRI_SPEC_ROWS[number]): string => {
    const dbProd = modelId === 'krashivantri-x-pro' ? krashiProducts.xPro : krashiProducts.x;
    const cmsModel = krashiCatalog?.models?.find((m) => m.id === modelId);
    if (row.label === 'Applications' && dbProd?.applications) {
      return dbProd.applications;
    }
    const specsObj = dbProd?.technicalSpecs || {};
    for (const [k, v] of Object.entries(specsObj)) {
      if (row.keys.some((target) => target.toLowerCase() === k.toLowerCase()) && String(v).trim()) {
        return String(v).trim();
      }
    }
    const cmsSpec = cmsModel?.specs?.find((sp) =>
      row.keys.some((target) => target.toLowerCase() === sp.label.trim().toLowerCase())
    );
    if (cmsSpec?.value?.trim()) return cmsSpec.value.trim();
    return row.fallback;
  };

  const renderProductGrid = (items: Product[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => {
        const isQuoteOnly = product.productType === 'quote_only' || product.priceInr <= 0;
        const hasDiscount =
          !isQuoteOnly &&
          product.discountPriceInr !== null &&
          product.discountPriceInr < product.priceInr &&
          product.priceInr > 0;
        const discountPct = hasDiscount
          ? Math.round(((product.priceInr - (product.discountPriceInr || 0)) / product.priceInr) * 100)
          : 0;
        const activePrice = hasDiscount ? product.discountPriceInr! : product.priceInr;
        const specEntries = Object.entries(product.technicalSpecs || {}).slice(0, 2);
        return (
          <div
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-[#15803D] transition-colors"
          >
            <div>
              <button
                onClick={() => navigate(`/product/${product.slug}`)}
                className="relative block w-full aspect-[4/3] bg-slate-100 overflow-hidden"
              >
                <img
                  src={product.imageUrl || PCB_IMG}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {hasDiscount && discountPct > 0 && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#15803D] text-white font-mono text-[11px] font-bold">
                    -{discountPct}%
                  </span>
                )}
              </button>
              <div className="p-5 space-y-2">
                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-slate-700">{product.sku}</span>
                  <span aria-hidden="true">·</span>
                  {isQuoteOnly ? (
                    <span className="text-[#15803D] font-medium">Custom Build</span>
                  ) : (
                    <span className={product.stockQty > 0 ? 'text-[#15803D] font-medium' : 'text-red-700 font-medium'}>
                      {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="text-left font-display font-semibold text-[#111417] hover:text-[#15803D] line-clamp-2"
                >
                  {product.name}
                </button>
                {(product.shortDescription || product.description) && (
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>
                )}
                {specEntries.length > 0 && (
                  <div className="pt-1 border-t border-slate-100 space-y-0.5 text-[11px] text-slate-500">
                    {specEntries.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 truncate">
                        <span className="truncate">{k}</span>
                        <span className="font-mono text-slate-700 truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-baseline gap-2 pt-1 font-mono tabular-nums">
                  {isQuoteOnly ? (
                    <span className="text-sm font-bold text-[#111417] font-sans">Contact for Price</span>
                  ) : (
                    <>
                      <span className="text-base font-bold text-[#111417]">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.priceInr.toLocaleString('en-IN')}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 space-y-2">
              {isQuoteOnly ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="flex-1 py-2 px-3 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.slug}#quote`)}
                    className="flex-1 py-2 px-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold"
                  >
                    Enquire Now
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button
                      disabled={product.stockQty <= 0}
                      onClick={() => addToCart(product, 1, product.availableVariants[0], product.availableColors[0])}
                      className="flex-1 py-2 px-3 bg-[#111417] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                    <button
                      disabled={product.stockQty <= 0}
                      onClick={() => {
                        addToCart(product, 1, product.availableVariants[0], product.availableColors[0]);
                        navigate('/checkout');
                      }}
                      className="py-2 px-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold disabled:opacity-40 whitespace-nowrap"
                    >
                      Buy Now
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="flex-1 py-1.5 border border-slate-200 hover:border-slate-400 text-slate-700 rounded-lg text-[11px] font-medium"
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.slug}#quote`)}
                      className="py-1.5 px-3 border border-slate-200 hover:border-[#15803D] text-[#15803D] rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <MessageSquarePlus className="w-3 h-3" /> Enquire
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderSection = (sec: HomepageSectionConfig) => {
    if (!sec.visible) return null;

    switch (sec.type) {
      case 'hero':
        return (
          <div key={sec.id}>
            <section className="bg-[#111417] text-white border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
                  <div className="text-xs font-semibold text-emerald-400 tracking-wider font-mono uppercase">
                    {sec.kicker || 'NEXUSTEKFUSION PRIVATE LIMITED'}
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance">
                    {sec.heading || 'Engineering Intelligent Agricultural Drone Solutions'}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
                    {sec.subheading ||
                      'Designing, manufacturing and developing advanced agricultural drones, precision spraying systems, UAV technologies, drone components, and intelligent farming solutions.'}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                    {sec.body ||
                      'We combine drone engineering, embedded electronics, automation, and AI-driven technologies to build practical solutions for modern agriculture.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => navigate(sec.primaryCtaLink || '/krashivantri')}
                      className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      {sec.primaryCtaLabel || 'Explore KRASHIVANTRI'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(sec.secondaryCtaLink || '/contact')}
                      className="px-6 py-3 border border-slate-600 hover:border-emerald-400 text-slate-100 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      {sec.secondaryCtaLabel || 'Contact Our Team'}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative h-72 sm:h-96 lg:h-full min-h-[360px] rounded-xl overflow-hidden border border-slate-700 bg-[#181C20]">
                    <img
                      src={sec.imageUrl || HERO_IMG}
                      alt="NexusTekFusion agricultural drone manufacturing facility and KRASHIVANTRI multirotor"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111417]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200 flex flex-wrap items-center gap-2">
                      <span>KRASHIVANTRI Agricultural UAV Manufacturing</span>
                      <span aria-hidden="true">·</span>
                      <span>Embedded Electronics</span>
                      <span aria-hidden="true">·</span>
                      <span>Custom Prototyping</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Manufacturing & Engineering Capabilities Strip */}
            <div className="bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-[#15803D] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#111417]">Agricultural Drone Manufacturing</div>
                    <div className="text-slate-500">KRASHIVANTRI X &amp; X PRO UAV platforms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-[#15803D] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#111417]">Pan-India Components Store</div>
                    <div className="text-slate-500">Free dispatch on orders above ₹2,500</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#15803D] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#111417]">Razorpay &amp; GST Invoicing</div>
                    <div className="text-slate-500">Verified checkout &amp; tax documentation</div>
                  </div>
                </div>
                <a
                  href={`mailto:${customerCareEmail}?subject=${encodeURIComponent('Engineering & Drone Enquiry — NexusTekFusion')}`}
                  className="flex items-center gap-3 hover:text-[#15803D] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#15803D] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#111417]">Customer Care Desk</div>
                    <div className="font-mono text-[#15803D]">{customerCareEmail}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        );

      case 'agri_fpv_showcase': {
        const allCatalogDrones = Array.from(
          new Map(
            [...featuredProducts, ...bestsellerProducts, ...newArrivalProducts]
              .filter(
                (p) =>
                  p.slug !== 'krashivantri-x' &&
                  p.slug !== 'krashivantri-x-pro' &&
                  /drone|uav|hexacopter|agri|flight controller|nozzle/i.test(
                    `${p.name} ${p.subcategory || ''} ${(p.tags || []).join(' ')}`
                  )
              )
              .map((p) => [p.id, p])
          ).values()
        ).slice(0, 4);

        const droneModels = [
          {
            id: 'krashivantri-x',
            name: krashiProducts.x?.name || krashiCatalog?.models?.[0]?.name || 'KRASHIVANTRI X',
            tagline: krashiCatalog?.models?.[0]?.tagline || 'Smart Agriculture. Precision Spraying.',
            summary:
              krashiProducts.x?.shortDescription ||
              krashiCatalog?.models?.[0]?.summary ||
              'Multi-rotor agricultural spraying UAV engineered by NexusTekFusion for dependable crop protection, field efficiency, and modular servicing.',
            imageUrl: krashiProducts.x?.imageUrl || KRASHI_X_IMG,
          },
          {
            id: 'krashivantri-x-pro',
            name: krashiProducts.xPro?.name || krashiCatalog?.models?.[1]?.name || 'KRASHIVANTRI X PRO',
            tagline: krashiCatalog?.models?.[1]?.tagline || 'Advanced Intelligence. Precision Agriculture.',
            summary:
              krashiProducts.xPro?.shortDescription ||
              krashiCatalog?.models?.[1]?.summary ||
              'Heavy-duty commercial agricultural drone platform built for continuous fleet operations, precision spraying acreage, and real-time telemetry.',
            imageUrl: krashiProducts.xPro?.imageUrl || KRASHI_X_PRO_IMG,
          },
        ];

        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="text-xs font-mono font-semibold text-[#15803D] uppercase tracking-wider">
                  {sec.kicker || 'FLAGSHIP AGRICULTURAL DRONES'}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'KRASHIVANTRI — Intelligent Agricultural Drone Technology'}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  {sec.subheading ||
                    'Explore our flagship agricultural drone platforms engineered in-house for Indian farming conditions, commercial spraying fleets, and research institutions.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => navigate('/krashivantri')}
                  className="px-4 py-2.5 bg-[#111417] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  Compare KRASHIVANTRI Models <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/krashivantri#krashivantri-enquiry')}
                  className="px-4 py-2.5 border border-slate-300 hover:border-[#15803D] text-[#111417] text-xs font-semibold rounded-lg whitespace-nowrap"
                >
                  Book Field Demo
                </button>
              </div>
            </div>

            {/* Industrial Flagship Drone Presentations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {droneModels.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-800 bg-[#111417] text-white overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#181C20] overflow-hidden relative">
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111417]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-5 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                        {m.tagline}
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 space-y-5">
                      <div className="space-y-2">
                        <h3 className="font-display text-2xl font-bold text-white">{m.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{m.summary}</p>
                      </div>

                      <div className="border-t border-slate-800 pt-4 space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                          Key System Specifications
                        </div>
                        <div className="divide-y divide-slate-800/80 text-xs">
                          {KRASHIVANTRI_SPEC_ROWS.map((row) => {
                            const val = resolveKrashiSpec(m.id, row);
                            return (
                              <div key={row.label} className="py-2 flex justify-between gap-4">
                                <span className="text-slate-400">{row.label}</span>
                                <span
                                  className={`text-right font-mono ${
                                    val === 'Official Specification on Briefing'
                                      ? 'text-slate-400 italic font-sans'
                                      : 'text-white font-medium'
                                  }`}
                                >
                                  {val}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('/krashivantri#krashivantri-enquiry')}
                      className="flex-1 py-2.5 px-4 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/product/${m.id}`)}
                      className="flex-1 py-2.5 px-4 border border-slate-600 hover:border-emerald-400 text-white text-xs font-semibold rounded-lg whitespace-nowrap"
                    >
                      View Specifications
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Drone Hardware Store Shelf */}
            {allCatalogDrones.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-[#111417]">
                    Agricultural Drone Airframes, Flight Controllers &amp; Spraying Hardware
                  </h3>
                  <button
                    onClick={() => navigate('/store/category/agricultural-drone-parts')}
                    className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1"
                  >
                    Browse Drone Hardware Store <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {renderProductGrid(allCatalogDrones)}
              </div>
            )}
          </section>
        );
      }

      case 'company_intro':
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-slate-200 pb-16">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-semibold text-[#15803D]">
                  {sec.kicker || 'NEXUSTEKFUSION PRIVATE LIMITED'}
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417] text-balance">
                  {sec.heading || 'Transforming Ideas into Reality'}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {sec.body ||
                    'NexusTekFusion Private Limited unites KRASHIVANTRI agricultural drone manufacturing, precision drone hardware & electronics supply, and end-to-end engineering project development from our Nagpur facility.'}
                </p>
                <button
                  onClick={() => navigate(sec.primaryCtaLink || '/about')}
                  className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
                >
                  {sec.primaryCtaLabel || 'Read company profile'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                  <h3 className="font-display font-semibold text-[#111417]">KRASHIVANTRI Agri-UAVs</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    KRASHIVANTRI X and KRASHIVANTRI X PRO precision spraying platforms built for Indian agricultural conditions.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                  <h3 className="font-display font-semibold text-[#111417]">Drone Hardware Store</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Industrial propulsion systems, flight controllers, ESC stacks, GNSS/RTK GPS modules, pumps, and batteries ready to ship.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                  <h3 className="font-display font-semibold text-[#111417]">Engineering R&amp;D Execution</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Custom industrial and academic builds with 14-category itemized quotations, milestone tracking, and verified deliverables.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                  <h3 className="font-display font-semibold text-[#111417]">Diagnostics &amp; 3D Prototyping</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Agricultural UAV bench diagnostics, PCB &amp; firmware validation, and rapid carbon-reinforced 3D prototyping.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'categories':
        if (categories.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#15803D]">
                  {sec.kicker || 'Drone & Electronics Catalog'}
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'Browse Store Categories'}
                </h2>
                {sec.subheading && <p className="text-sm text-slate-600 max-w-2xl">{sec.subheading}</p>}
              </div>
              <button
                onClick={() => navigate('/store')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                Open Full Store <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.filter((c) => c.storeScope === 'general').slice(0, 14).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/store/category/${cat.slug}`)}
                  className="text-left rounded-xl border border-slate-200 bg-white p-5 hover:border-[#15803D] transition-colors space-y-1.5"
                >
                  <div className="font-display font-bold text-sm text-[#111417]">{cat.name}</div>
                  <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>
                </button>
              ))}
            </div>
          </section>
        );

      case 'featured_products':
        if (featuredProducts.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">
                  {sec.kicker || 'Drone Parts & Electronics Store'}
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'Featured Drone & Electronics Hardware'}
                </h2>
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/store')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'Browse Store'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {renderProductGrid(featuredProducts)}
          </section>
        );

      case 'bestsellers':
        if (bestsellerProducts.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'High-Demand Components'}</div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'Best-Selling Store Hardware'}
                </h2>
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/store')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'Open Store'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {renderProductGrid(bestsellerProducts.slice(0, 4))}
          </section>
        );

      case 'new_arrivals':
        if (newArrivalProducts.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'Latest Inventory'}</div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'New Arrivals in Store'}
                </h2>
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/store')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'Browse New Hardware'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {renderProductGrid(newArrivalProducts.slice(0, 4))}
          </section>
        );

      case 'services': {
        const allowedSlugs = new Set(['drone-repair', 'custom-engineering-projects', 'custom-engineering']);
        const filteredDynamic = settings.servicesCatalog?.filter((s) => s.visible && allowedSlugs.has(s.slug));
        const itemsToRender =
          filteredDynamic && filteredDynamic.length > 0
            ? filteredDynamic.map((s, idx) => ({
                num: String(idx + 1).padStart(2, '0'),
                slug: s.slug,
                title: s.title,
                summary: s.shortDesc,
                to: s.slug === 'drone-repair' ? '/services/drone-repair' : '/register-project',
                ctaLabel: s.slug === 'drone-repair' ? s.ctaLabel || 'Book Drone Repair' : 'Register Your Project',
              }))
            : SERVICE_CARDS;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'Engineering Services'}</div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'Our Core Services'}
                </h2>
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/services')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'Explore Services'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {itemsToRender.map((svc) => {
                const isCustomProj = svc.slug !== 'drone-repair';
                return (
                  <div
                    key={svc.slug}
                    className={`rounded-xl border p-6 sm:p-7 flex flex-col justify-between space-y-5 ${
                      isCustomProj ? 'border-emerald-200 bg-white shadow-sm' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>{svc.num}</span>
                        <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#111417]">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{svc.summary}</p>
                      {isCustomProj ? (
                        <div className="pt-2">
                          <div className="text-xs font-semibold text-slate-800 mb-2">
                            Project development capabilities:
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                            {CUSTOM_PROJECT_CAPABILITIES.map((cap) => (
                              <li key={cap} className="flex items-start gap-1.5">
                                <span className="text-[#15803D] font-bold">·</span>
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <ul className="space-y-1.5 text-xs text-slate-700 pt-2">
                          {[
                            'Agricultural spraying, survey, FPV & custom UAV fault diagnostics',
                            'Flight controller calibration, ESC/motor replacement & airframe rebuild',
                            'Nagpur Service Centre drop-off or on-site field technician support',
                          ].map((pt) => (
                            <li key={pt} className="flex items-start gap-1.5">
                              <span className="text-[#15803D] font-bold">·</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => navigate(svc.to)}
                        className={`px-5 py-2.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 ${
                          isCustomProj
                            ? 'bg-[#15803D] hover:bg-[#166534] text-white'
                            : 'bg-[#111417] hover:bg-slate-800 text-white'
                        }`}
                      >
                        {svc.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {isCustomProj && (
                        <button
                          onClick={() => navigate('/services/custom-engineering')}
                          className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg"
                        >
                          Learn More
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      }

      case 'printing_and_projects':
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-slate-100">
                <img
                  src={PRINT_IMG}
                  alt="Industrial 3D printer fabricating precision drone and mechanical parts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#15803D]">On-Demand Additive Manufacturing</div>
                  <h2 className="font-display text-2xl font-bold text-[#111417]">
                    Turn Your 3D Designs Into Reality.
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Upload STL, OBJ, 3MF, or STEP files, inspect your geometry in our interactive 3D viewport, choose FDM or SLA materials, receive automated slicing estimates, and order online.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate('/services/3d-printing')}
                    className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                  >
                    Upload Your 3D Model <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#111417] text-white overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-[#181C20]">
                <img
                  src={DRONE_IMG}
                  alt="Custom agricultural drone hardware prototype"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">
                    Custom Engineering Project Development &amp; Prototyping
                  </div>
                  <h2 className="font-display text-2xl font-bold">
                    Register Your Project
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    End-to-end customized engineering project development, hardware &amp; software builds, prototype manufacturing, and research assistance for students, startups, researchers, businesses, and institutions.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate('/register-project')}
                    className="px-5 py-2.5 bg-white text-[#111417] hover:bg-slate-100 text-sm font-semibold rounded-lg inline-flex items-center gap-2"
                  >
                    Register Your Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      case 'krashivantri_apps': {
        const apps = settings.appLinks || [];
        if (apps.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'Mobile Ecosystem'}</div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'KRASHIVANTRI Android Applications'}
                </h2>
                {sec.subheading && <p className="text-sm text-slate-600 max-w-2xl">{sec.subheading}</p>}
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/krashivantri')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'Open KRASHIVANTRI Page'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {apps.map((app) => (
                <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#15803D] font-semibold">
                      <span>{app.role}</span>
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#111417]">{app.name}</h3>
                    <p className="text-sm text-slate-600">{app.description}</p>
                  </div>
                  {app.comingSoon || (!app.playStoreUrl && !app.apkDownloadUrl) ? (
                    <div className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-fit">
                      Coming Soon on Google Play
                    </div>
                  ) : (
                    <a
                      href={app.playStoreUrl || app.apkDownloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#15803D] text-white text-xs font-semibold rounded-lg w-fit inline-flex items-center gap-1.5"
                    >
                      Get App <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'case_studies':
        if (caseStudies.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'Applied Engineering'}</div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                  {sec.heading || 'Engineering R&D & Academic Projects'}
                </h2>
              </div>
              <button
                onClick={() => navigate(sec.primaryCtaLink || '/projects')}
                className="text-sm font-semibold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
              >
                {sec.primaryCtaLabel || 'View All Projects'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.slice(0, 4).map((cs) => (
                <div key={cs.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/9] bg-slate-100">
                      <img
                        src={cs.imageUrl || ROBOT_IMG}
                        alt={cs.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="text-xs text-slate-500">{cs.relatedServices.join(' · ')}</div>
                      <h3 className="font-display text-xl font-bold text-[#111417]">{cs.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{cs.description}</p>
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        <div>
                          <span className="font-semibold text-slate-900">Technologies:</span> {cs.technologyUsed}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">Applications:</span> {cs.applications}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-5">
                    <button
                      onClick={() => navigate(`/projects/${cs.slug}`)}
                      className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1"
                    >
                      View Project Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'testimonials': {
        const list = settings.testimonials || [];
        if (list.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#15803D]">{sec.kicker || 'Verified Client Feedback'}</div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                {sec.heading || 'Engineering & Store Feedback'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {list.map((t, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-[#111417]">{t.name}</span> · {t.role} ({t.org})
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'why_us':
        return (
          <section key={sec.id} className="bg-slate-100 border-y border-slate-200 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-semibold text-[#15803D]">
                    {sec.kicker || 'Why Choose NexusTekFusion'}
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-[#111417]">
                    {sec.heading || 'Built for Engineering Execution'}
                  </h2>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                  {[
                    ['Engineering-Focused', 'Every engagement starts with technical feasibility, BOM review, and clear deliverables.'],
                    ['Agricultural UAV R&D', 'Hardware, propulsion, spraying systems, and navigation tuned for real Indian field conditions.'],
                    ['Hardware + Software', 'Unified PCB, mechanical CAD, embedded firmware, and cloud/AI telemetry dashboards.'],
                    ['In-House Prototyping', 'Rapid FDM/SLA 3D printing and electronics bench validation under one roof.'],
                    ['Transparent Quotations', 'Itemized estimates, revision tracking, and milestone-based project visibility.'],
                    ['Dedicated Support', 'Direct engineer assignment and structured support tickets from our Nagpur lab.'],
                  ].map(([title, body]) => (
                    <div key={title} className="space-y-1.5">
                      <h3 className="font-display font-semibold text-[#111417]">{title}</h3>
                      <p className="text-slate-600 leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-10 space-y-4">
                <div className="text-xs font-semibold text-[#15803D]">Our Engineering Workflow</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    '01. Requirement',
                    '02. Research',
                    '03. Design',
                    '04. Development',
                    '05. Prototyping',
                    '06. Testing',
                    '07. Delivery',
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-[#111417] text-center"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl bg-[#111417] text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2 max-w-2xl">
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  {sec.heading || 'Ready to Deploy KRASHIVANTRI or Build Your Engineering System?'}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base">
                  {sec.subheading ||
                    'Schedule an agricultural drone demonstration, request bulk hardware supply, or register your custom engineering project with our Nagpur team.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => navigate(sec.primaryCtaLink || '/register-project')}
                  className="px-5 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg whitespace-nowrap"
                >
                  {sec.primaryCtaLabel || 'Register Your Project'}
                </button>
                <button
                  onClick={() => navigate(sec.secondaryCtaLink || '/contact')}
                  className="px-5 py-3 border border-slate-600 hover:border-emerald-400 text-white text-sm font-semibold rounded-lg whitespace-nowrap"
                >
                  {sec.secondaryCtaLabel || 'Contact Our Team'}
                </button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-24">
      {previewDraft && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-semibold text-amber-900">
          Draft Layout Preview Mode — Only visible to authenticated Administrators until published.
        </div>
      )}
      {layoutList.map((sec) => renderSection(sec))}
    </div>
  );
};
