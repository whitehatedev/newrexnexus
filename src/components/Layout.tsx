import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  ChevronDown,
  Minus,
  Plus,
  Trash2,
  Headphones,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

const COMPANY_LOGO_SRC = '/assets/aistudio/image_1a5ac752.png';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    path,
    navigate,
    settings,
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    dbUser,
    isSignedIn,
    isAdmin,
    openAuthModal,
    apiFetch,
    notify,
    publishedPages,
  } = usePlatform();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSending, setNewsletterSending] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + (i.product.discountPriceInr ?? i.product.priceInr) * i.qty, 0);
  const freeShippingAbove = settings.shippingConfig?.freeShippingAboveInr ?? 2500;
  const standardShipping = settings.shippingConfig?.standardShippingInr ?? 99;
  const remainingForFreeShipping = Math.max(0, freeShippingAbove - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / Math.max(1, freeShippingAbove)) * 100));

  const announcement = settings.announcementBar;
  const company = settings.companyInfo;
  const customerCareEmail = company?.customerCareEmail || 'info@nexustekfusion.in';
  const socials = company?.socialLinks;

  const rawNavItems =
    settings.navigationMenus?.header && settings.navigationMenus.header.length > 0
      ? settings.navigationMenus.header
      : [
          { id: 'home', label: 'Home', to: '/', visible: true, sortOrder: 1 },
          { id: 'krashivantri', label: 'KRASHIVANTRI', to: '/krashivantri', visible: true, sortOrder: 2 },
          { id: 'store', label: 'Store', to: '/store', visible: true, sortOrder: 3 },
          { id: 'services', label: 'Services', to: '/services', visible: true, sortOrder: 4 },
          { id: 'project-dev', label: 'Project Development', to: '/register-project', visible: true, sortOrder: 5 },
          { id: 'about', label: 'About Us', to: '/about', visible: true, sortOrder: 6 },
          { id: 'contact', label: 'Contact', to: '/contact', visible: true, sortOrder: 7 },
        ];

  const navItems = rawNavItems
    .filter((i) => i.visible !== false && i.id !== 'sale' && i.to !== '/sale')
    .map((i) => ({
      ...i,
      children: (i.children || []).filter((c) => c.id !== 'shop-sale' && c.to !== '/sale'),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const go = (to: string) => {
    setDrawerOpen(false);
    setCartDrawerOpen(false);
    setSearchOpen(false);
    navigate(to);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    go(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSending(true);
    try {
      await apiFetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: newsletterEmail.trim(), source: 'footer' }),
      });
      setNewsletterEmail('');
      notify('Subscribed to NexusTekFusion updates.', 'success');
    } catch (err: any) {
      notify(err?.message || 'Subscription failed.', 'error');
    } finally {
      setNewsletterSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F7] text-[#111417]">
      {/* Slim Editable Announcement Bar (<= 40px) */}
      {announcement?.enabled && !bannerDismissed && (
        <div className="bg-[#111417] text-slate-100 border-b border-slate-800 px-4 h-9 flex items-center justify-between text-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center gap-3 truncate">
            <span className="truncate">{announcement.text}</span>
            {announcement.link && (
              <button
                onClick={() => go(announcement.link)}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 whitespace-nowrap shrink-0"
              >
                {announcement.ctaLabel || 'Explore'}
              </button>
            )}
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="text-slate-400 hover:text-white p-1 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Lockup (Official Logo + Wordmark) */}
          <button
            onClick={() => go('/')}
            className="inline-flex items-center gap-2 font-display text-base xl:text-lg font-bold tracking-tight text-[#111417] whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-[#15803D] rounded"
          >
            <img
              src={COMPANY_LOGO_SRC}
              alt="NexusTekFusion Logo"
              className="h-8 w-8 object-contain shrink-0"
            />
            <span>{company?.brandName || 'NexusTekFusion'}</span>
          </button>

          {/* Zone 2: Concise Single-Line Navigation Links with Hover/Focus Dropdown Support */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const children = item.children || [];
              const active =
                path === item.to ||
                (item.to === '/store' && path.startsWith('/shop')) ||
                (item.to !== '/' && path.startsWith(item.to + '/')) ||
                children.some((c) => path === c.to || path.startsWith(c.to + '/'));

              if (children.length === 0) {
                return (
                  <button
                    key={item.id || item.to}
                    onClick={() => go(item.to)}
                    className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                      active
                        ? 'border-[#15803D] text-[#111417] font-semibold'
                        : 'border-transparent hover:text-[#111417] hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <div key={item.id || item.to} className="relative group">
                  <button
                    onClick={() => go(item.to)}
                    className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors inline-flex items-center gap-1 ${
                      active
                        ? 'border-[#15803D] text-[#111417] font-semibold'
                        : 'border-transparent hover:text-[#111417] hover:border-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#111417] transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="hidden group-hover:block group-focus-within:block absolute left-0 top-full pt-2 z-50 min-w-[230px]">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-xl py-2">
                      {children.map((sub) => (
                        <button
                          key={sub.id || sub.to}
                          onClick={() => go(sub.to)}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors block ${
                            path === sub.to
                              ? 'bg-emerald-50 text-[#15803D] font-semibold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-[#111417]'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Zone 3: Account Controls + Compact Store Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search store"
              className="p-2 text-slate-600 hover:text-[#111417] rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Store cart"
              className="relative p-2 text-slate-700 hover:text-[#111417] rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span
                className={`font-mono tabular-nums px-1.5 py-0.5 rounded-md text-[11px] ${
                  cartCount > 0 ? 'bg-[#15803D] text-white' : 'text-slate-600'
                }`}
              >
                {cartCount}
              </span>
            </button>

            {isSignedIn ? (
              <button
                onClick={() => go('/my-account')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111417] border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#15803D]" />
                <span>My Account</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => go('/login')}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#111417] hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => go('/register')}
                  className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Register
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => go('/admin/dashboard')}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#15803D] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open full navigation menu"
              className="p-2 text-slate-700 hover:text-[#111417] hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search KRASHIVANTRI drones, agricultural drone parts, flight controllers, or SKUs..."
                className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#15803D]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#111417] text-white text-sm font-medium rounded-lg hover:bg-slate-800 whitespace-nowrap"
              >
                Search Store
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Slide-Over Complete Platform Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <img src={COMPANY_LOGO_SRC} alt="NexusTekFusion" className="h-7 w-7 object-contain" />
                  <span className="font-display font-bold text-lg text-[#111417]">Navigation</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-400">KRASHIVANTRI &amp; Services</div>
                  {[
                    ['Home', '/'],
                    ['KRASHIVANTRI Drones', '/krashivantri'],
                    ['KRASHIVANTRI X', '/product/krashivantri-x'],
                    ['KRASHIVANTRI X PRO', '/product/krashivantri-x-pro'],
                    ['Farmer Spraying Portal', '/krashivantri/farmer-portal'],
                    ['Drone Pilot Portal', '/krashivantri/pilot-portal'],
                    ['About Us', '/about'],
                    ['All Services', '/services'],
                    ['Custom Engineering Projects', '/services/custom-engineering'],
                    ['Register Your Project', '/register-project'],
                    ['Drone Repair & Diagnostics', '/services/drone-repair'],
                  ].map(([label, to]) => (
                    <button
                      key={to}
                      onClick={() => go(to)}
                      className="block text-left text-slate-700 hover:text-[#15803D] py-0.5"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-400">Store &amp; Portals</div>
                  {[
                    ['Hardware & Drone Store', '/store'],
                    ['Agricultural Drones', '/store/category/agricultural-drones'],
                    ['3D Printed Products', '/store/3d-printed-products'],
                    ['Engineering Projects', '/projects'],
                    ['B2B / Bulk Orders', '/b2b'],
                    ['Blogs & Articles', '/blogs'],
                    ['Track Order', '/track-order'],
                    ['Contact & Support', '/contact'],
                    ['FAQs', '/faq'],
                  ].map(([label, to]) => (
                    <button
                      key={to}
                      onClick={() => go(to)}
                      className="block text-left text-slate-700 hover:text-[#15803D] py-0.5"
                    >
                      {label}
                    </button>
                  ))}
                  {publishedPages.map((pg) => (
                    <button
                      key={pg.id}
                      onClick={() => go(`/p/${pg.slug}`)}
                      className="block text-left text-slate-700 hover:text-[#15803D] py-0.5"
                    >
                      {pg.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                {isSignedIn ? (
                  <button
                    onClick={() => go('/my-account')}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-300 text-sm font-medium text-[#111417] hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>My Account ({dbUser?.email || 'Account'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => go('/login')}
                      className="py-2.5 px-4 rounded-lg border border-slate-300 text-sm font-medium text-[#111417] hover:bg-slate-50 text-center"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => go('/register')}
                      className="py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold text-center"
                    >
                      Register
                    </button>
                  </div>
                )}
                {isAdmin ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => go('/admin/dashboard')}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#111417] text-white text-sm font-medium hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Admin Control Panel
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => go('/admin/website-editor')}
                        className="py-2 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-left"
                      >
                        Visual Editor
                      </button>
                      <button
                        onClick={() => go('/admin/project-enquiries')}
                        className="py-2 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-left"
                      >
                        Project Quotes
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => go('/admin/login')}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium hover:bg-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      Admin Login Portal
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <a
                  href={`mailto:${customerCareEmail}?subject=${encodeURIComponent('Customer Care Enquiry — NexusTekFusion')}`}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-[#111417] text-xs font-semibold hover:bg-emerald-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Headphones className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span className="truncate">Contact Customer Support ({customerCareEmail})</span>
                  </span>
                  <Mail className="w-4 h-4 text-[#15803D] shrink-0" />
                </a>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">{company?.legalName}</div>
              <div>CIN: {company?.cin}</div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Store Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/55">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#15803D]" />
                <span className="font-display font-bold text-lg text-[#111417]">
                  Store Cart ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart drawer"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#15803D] font-semibold">
                    Unlocked FREE Pan-India Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-mono text-[#111417]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> for FREE shipping
                  </span>
                )}
                <span className="font-mono text-slate-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#15803D] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <div className="font-display font-bold text-[#111417]">Your store cart is empty</div>
                    <p className="text-xs text-slate-500">
                      Explore agricultural drones, propulsion hardware, flight controllers, and electronics components.
                    </p>
                  </div>
                  <button
                    onClick={() => go('/store')}
                    className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg"
                  >
                    Browse Store
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const unit = item.product.discountPriceInr ?? item.product.priceInr;
                  return (
                    <div
                      key={`${item.product.id}-${item.variant}-${item.color}`}
                      className="flex gap-3 pb-4 border-b border-slate-100"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <button
                          onClick={() => go(`/product/${item.product.slug}`)}
                          className="text-left font-display font-semibold text-sm text-[#111417] hover:text-[#15803D] line-clamp-1"
                        >
                          {item.product.name}
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {[item.variant, item.color].filter(Boolean).join(' · ') || item.product.sku}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateCartQty(item.product.id, item.variant, item.color, item.qty - 1)
                              }
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-semibold tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateCartQty(item.product.id, item.variant, item.color, item.qty + 1)
                              }
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#111417] tabular-nums">
                              ₹{(unit * item.qty).toLocaleString('en-IN')}
                            </span>
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() =>
                                removeFromCart(item.product.id, item.variant, item.color)
                              }
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-slate-200 p-6 space-y-4 bg-white">
              {cart.length > 0 && (
                <>
                  <div className="space-y-1.5 text-xs font-mono tabular-nums text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal (excl. GST)</span>
                      <span className="font-semibold text-[#111417]">
                        ₹{cartSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span>
                        {remainingForFreeShipping === 0 ? 'FREE' : `₹${standardShipping}`}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => go('/cart')}
                      className="py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => go('/checkout')}
                      className="py-2.5 px-3 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5"
                    >
                      Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Order help? Customer Care:</span>
                <a
                  href={`mailto:${customerCareEmail}?subject=${encodeURIComponent('Store Order Help')}`}
                  className="font-mono font-semibold text-[#15803D] hover:underline"
                >
                  {customerCareEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Authoritative Dark Charcoal Footer */}
      <footer className="bg-[#111417] text-slate-300 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={COMPANY_LOGO_SRC}
                alt="NexusTekFusion Logo"
                className="h-9 w-9 object-contain bg-white rounded-md p-1 shrink-0"
              />
              <div className="font-display text-base font-bold text-white leading-tight">
                {company?.legalName || 'NEXUSTEKFUSION PRIVATE LIMITED'}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {company?.primaryTagline || 'Transforming Ideas into Reality'} —{' '}
              {company?.secondaryTagline || 'Engineering Intelligent Agricultural Drone Solutions'}.
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-2 font-mono">
              <div>CIN: {company?.cin || 'U30305ME2026PTC474052'}</div>
              {company?.gstin && <div>GSTIN: {company.gstin}</div>}
              <div>Founder & CEO: {company?.founderCeo || 'Sahil Prakash Bhagat'}</div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-semibold text-white">KRASHIVANTRI &amp; Services</div>
            <ul className="space-y-2 text-slate-400">
              {[
                ['KRASHIVANTRI Drones', '/krashivantri'],
                ['KRASHIVANTRI X', '/product/krashivantri-x'],
                ['KRASHIVANTRI X PRO', '/product/krashivantri-x-pro'],
                ['Farmer Spraying Portal', '/krashivantri/farmer-portal'],
                ['Drone Pilot Portal', '/krashivantri/pilot-portal'],
                ['Drone Repair & Diagnostics Service', '/services/drone-repair'],
                ['Custom Engineering Project Development', '/services/custom-engineering'],
                ['Register Your Project', '/register-project'],
              ].map(([label, to]) => (
                <li key={to}>
                  <button onClick={() => go(to)} className="hover:text-white transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-semibold text-white">Store &amp; Support</div>
            <ul className="space-y-2 text-slate-400">
              {[
                ['Hardware & Drone Store', '/store'],
                ['KRASHIVANTRI Drones', '/krashivantri'],
                ['3D Printed Products', '/store/3d-printed-products'],
                ['Engineering R&D Projects', '/projects'],
                ['B2B & Bulk Orders', '/b2b'],
                ['Track Order', '/track-order'],
                ['Engineering Blogs', '/blogs'],
                ['FAQs', '/faq'],
              ].map(([label, to]) => (
                <li key={to}>
                  <button onClick={() => go(to)} className="hover:text-white transition-colors">
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${customerCareEmail}?subject=${encodeURIComponent('Customer Care Support — NexusTekFusion')}`}
                  className="text-emerald-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Customer Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-sm">
            <div className="font-semibold text-white">Registered Office &amp; Newsletter</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {company?.address ||
                'H NO. 565/19 NIT, SANKUL NEW COTTON MARK, Ganjipeth, Nagpur 440018, Maharashtra, India'}
            </p>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div>
                Customer Care:{' '}
                <a
                  href={`mailto:${customerCareEmail}?subject=${encodeURIComponent('Customer Care Enquiry')}`}
                  className="text-emerald-400 hover:underline font-mono"
                >
                  {customerCareEmail}
                </a>
              </div>
              <div>
                Company Email:{' '}
                <a href={`mailto:${company?.email || 'info@nexustekfusion.in'}`} className="hover:text-white font-mono">
                  {company?.email || 'info@nexustekfusion.in'}
                </a>
              </div>
              {company?.contactPhone && <div>Phone: {company.contactPhone}</div>}
              <div>Hours: {company?.businessHours || 'Mon–Sat, 10:00 AM – 7:00 PM IST'}</div>
            </div>

            <form onSubmit={handleNewsletter} className="space-y-2 pt-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Engineering Updates &amp; Drone Launches
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 rounded-lg bg-[#181C20] border border-slate-700 px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={newsletterSending}
                  className="px-3 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold whitespace-nowrap disabled:opacity-50"
                >
                  {newsletterSending ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>

            <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <button onClick={() => go('/shipping-policy')} className="hover:text-white">
                Shipping Policy
              </button>
              <button onClick={() => go('/return-refund-policy')} className="hover:text-white">
                Returns
              </button>
              <button onClick={() => go('/privacy-policy')} className="hover:text-white">
                Privacy
              </button>
              <button onClick={() => go('/terms-and-conditions')} className="hover:text-white">
                Terms
              </button>
              {socials?.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
              )}
              {socials?.youtube && (
                <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-white">
                  YouTube
                </a>
              )}
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram
                </a>
              )}
              {socials?.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-5 px-4 sm:px-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              © {new Date().getFullYear()} {company?.legalName || 'NEXUSTEKFUSION PRIVATE LIMITED'}. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <button onClick={() => go('/contact')} className="hover:text-white">
                Contact
              </button>
              {isAdmin ? (
                <>
                  <button onClick={() => go('/admin/website-editor')} className="text-emerald-400 hover:text-emerald-300">
                    Website Editor
                  </button>
                  <button onClick={() => go('/admin/dashboard')} className="text-emerald-300 hover:text-white">
                    Admin Console
                  </button>
                </>
              ) : (
                <button onClick={() => go('/admin/login')} className="text-slate-400 hover:text-white">
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
