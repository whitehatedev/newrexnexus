import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSupabaseClient, initSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { AuthModal } from '../components/AuthModal';
import {
  BlogPost,
  Brand,
  CartItem,
  CaseStudy,
  DbUser,
  PrintingMachine,
  PrintingMaterial,
  Product,
  ProductCategory,
  SiteSettings,
} from '../types/platform';

const ADMIN_ROLES = new Set([
  'super_admin',
  'admin',
  'website_manager',
  'product_manager',
  'sales_manager',
  'project_manager',
  'engineer',
  'printing_operator',
  'inventory_manager',
  'accounts_manager',
  'support_manager',
  'support_staff',
]);

interface ToastItem {
  id: string;
  message: string;
  tone: 'success' | 'error' | 'info';
}

interface PublishedPageSummary {
  id: number;
  title: string;
  slug: string;
  status: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  companyOrCollege: string;
  password: string;
}

interface PlatformContextValue {
  path: string;
  navigate: (to: string) => void;
  dbUser: DbUser | null;
  isSignedIn: boolean;
  authLoading: boolean;
  isAdmin: boolean;
  supabaseConfigured: boolean;
  oauthError: string | null;
  oauthRedirectUrl: string | null;
  clearOauthError: () => void;
  setPostAuthRedirect: (dest: string) => void;
  consumePostAuthRedirect: () => string;
  openAuthModal: (mode?: 'login' | 'register') => void;
  signInWithGoogle: () => Promise<void>;
  signInWithSupabaseOAuth: (redirectPath?: string) => Promise<{ ok: boolean; errorMessage?: string; redirectUrl?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<DbUser>;
  registerWithEmail: (payload: RegisterPayload) => Promise<DbUser>;
  signInWithAdminCredentials: (email: string, password: string) => Promise<DbUser>;
  signOut: () => Promise<void>;
  apiFetch: <T = any>(url: string, options?: RequestInit) => Promise<T>;
  getIdToken: () => Promise<string | null>;
  settings: SiteSettings;
  previewDraft: boolean;
  categories: ProductCategory[];
  brands: Brand[];
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newArrivalProducts: Product[];
  blogs: BlogPost[];
  caseStudies: CaseStudy[];
  printingMaterials: PrintingMaterial[];
  printingMachines: PrintingMachine[];
  publishedPages: PublishedPageSummary[];
  razorpayConfigured: boolean;
  razorpayMode: 'live' | 'test' | 'sandbox';
  refreshBootstrap: () => Promise<void>;
  refreshMe: () => Promise<void>;
  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, qty?: number, variant?: string, color?: string) => void;
  updateCartQty: (productId: number, variant: string | undefined, color: string | undefined, qty: number) => void;
  removeFromCart: (productId: number, variant?: string, color?: string) => void;
  clearCart: () => void;
  startGuestSession: (token: string, user: DbUser) => void;
  notify: (message: string, tone?: 'success' | 'error' | 'info') => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(() => isSupabaseConfigured());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [oauthRedirectUrl, setOauthRedirectUrl] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings>({});
  const [previewDraft, setPreviewDraft] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [printingMaterials, setPrintingMaterials] = useState<PrintingMaterial[]>([]);
  const [printingMachines, setPrintingMachines] = useState<PrintingMachine[]>([]);
  const [publishedPages, setPublishedPages] = useState<PublishedPageSummary[]>([]);
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);
  const [razorpayMode, setRazorpayMode] = useState<'live' | 'test' | 'sandbox'>('sandbox');

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('ntf_cart');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const sessionTokenRef = React.useRef<string | null>(
    typeof window !== 'undefined' ? window.sessionStorage.getItem('ntf_session_token') : null
  );

  const cartHydratedForUserRef = React.useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('ntf_cart', JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  const persistSessionToken = useCallback((token: string | null) => {
    sessionTokenRef.current = token;
    try {
      if (token) window.sessionStorage.setItem('ntf_session_token', token);
      else window.sessionStorage.removeItem('ntf_session_token');
    } catch {
      // ignore storage errors
    }
  }, []);

  const startGuestSession = useCallback(
    (token: string, user: DbUser) => {
      persistSessionToken(token);
      setDbUser(user);
    },
    [persistSessionToken]
  );

  const notify = useCallback((message: string, tone: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname + window.location.search) return;
    window.history.pushState({}, '', to);
    setPath(to.split('?')[0] || '/');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) return data.session.access_token;
    }
    return sessionTokenRef.current;
  }, []);

  const apiFetch = useCallback(
    async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
      const headers = new Headers(options.headers || {});
      const token = await getIdToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      const res = await fetch(url, { ...options, headers, credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data as T;
    },
    [getIdToken]
  );

  const syncMe = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: DbUser }>('/api/me');
      setDbUser(data.user);
    } catch {
      setDbUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [apiFetch]);

  const refreshBootstrap = useCallback(async () => {
    try {
      const wantsDraft = new URLSearchParams(window.location.search).get('previewDraft') === 'true';
      const data = await apiFetch(`/api/bootstrap${wantsDraft ? '?previewDraft=true' : ''}`);
      setSettings(data.settings || {});
      setPreviewDraft(Boolean(data.previewDraft));
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setFeaturedProducts(data.featuredProducts || []);
      setBestsellerProducts(data.bestsellerProducts || []);
      setNewArrivalProducts(data.newArrivalProducts || []);
      setBlogs(data.blogs || []);
      setCaseStudies(data.caseStudies || []);
      setPrintingMaterials(data.printingMaterials || []);
      setPrintingMachines(data.printingMachines || []);
      setPublishedPages(data.publishedPages || []);
      setRazorpayConfigured(Boolean(data.razorpayConfigured));
      setRazorpayMode(
        data.razorpayMode === 'live' || data.razorpayMode === 'test' || data.razorpayMode === 'sandbox'
          ? data.razorpayMode
          : data.razorpayConfigured
          ? 'test'
          : 'sandbox'
      );

      if (data.supabaseConfig?.url && data.supabaseConfig?.anonKey) {
        initSupabaseClient(data.supabaseConfig.url, data.supabaseConfig.anonKey);
        setSupabaseConfigured(true);
      }
    } catch (err) {
      console.error('Bootstrap fetch failed:', err);
    }
  }, [apiFetch]);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  useEffect(() => {
    syncMe();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange(async () => {
      await syncMe();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [syncMe, supabaseConfigured]);

  useEffect(() => {
    if (!dbUser?.id) {
      cartHydratedForUserRef.current = null;
      return;
    }
    if (cartHydratedForUserRef.current === dbUser.id) return;
    let active = true;
    (async () => {
      try {
        const res = await apiFetch<{ items: CartItem[] }>('/api/cart');
        if (!active) return;
        const remoteItems = Array.isArray(res.items) ? res.items : [];
        if (remoteItems.length > 0) {
          setCart((localItems) => {
            if (localItems.length === 0) return remoteItems;
            const merged = [...localItems];
            for (const r of remoteItems) {
              const idx = merged.findIndex(
                (l) => l.product.id === r.product.id && l.variant === r.variant && l.color === r.color
              );
              if (idx >= 0) {
                merged[idx] = {
                  ...merged[idx],
                  qty: Math.min(merged[idx].product.stockQty || 999, Math.max(merged[idx].qty, r.qty)),
                };
              } else {
                merged.push(r);
              }
            }
            return merged;
          });
        }
        cartHydratedForUserRef.current = dbUser.id;
      } catch {
        cartHydratedForUserRef.current = dbUser.id;
      }
    })();
    return () => {
      active = false;
    };
  }, [dbUser?.id, apiFetch]);

  useEffect(() => {
    if (!dbUser?.id || cartHydratedForUserRef.current !== dbUser.id) return;
    const timer = setTimeout(() => {
      apiFetch('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            qty: i.qty,
            variant: i.variant,
            color: i.color,
          })),
        }),
      }).catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [cart, dbUser?.id, apiFetch]);

  const clearOauthError = useCallback(() => setOauthError(null), []);

  const setPostAuthRedirect = useCallback((dest: string) => {
    if (typeof window === 'undefined') return;
    const clean = dest && !dest.startsWith('/auth/callback') && dest !== '/login' && dest !== '/register'
      ? dest
      : '/my-account';
    try {
      window.localStorage.setItem('ntf_post_auth_redirect', clean);
      window.sessionStorage.setItem('ntf_post_auth_redirect', clean);
    } catch {
      // ignore storage errors
    }
  }, []);

  const consumePostAuthRedirect = useCallback((): string => {
    if (typeof window === 'undefined') return '/my-account';
    try {
      const saved =
        window.sessionStorage.getItem('ntf_post_auth_redirect') ||
        window.localStorage.getItem('ntf_post_auth_redirect');
      window.sessionStorage.removeItem('ntf_post_auth_redirect');
      window.localStorage.removeItem('ntf_post_auth_redirect');
      if (saved && saved.startsWith('/') && !saved.startsWith('/auth/callback') && saved !== '/login' && saved !== '/register') {
        return saved;
      }
    } catch {
      // ignore
    }
    return '/my-account';
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setOauthRedirectUrl(null);
    setOauthError(null);
    setAuthModalOpen(true);
  }, []);

  const signInWithSupabaseOAuth = useCallback(
    async (redirectPath?: string): Promise<{ ok: boolean; errorMessage?: string; redirectUrl?: string }> => {
      setOauthError(null);
      setOauthRedirectUrl(null);

      const currentPath =
        typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/my-account';
      const targetDest = redirectPath || currentPath;
      setPostAuthRedirect(targetDest);

      const supabase = getSupabaseClient();
      if (!supabase) {
        const msg =
          'Google Sign-In requires Supabase Auth configuration (SUPABASE_URL and SUPABASE_ANON_KEY) with the Google provider enabled in Supabase Authentication settings.';
        setOauthError(msg);
        notify(msg, 'error');
        return { ok: false, errorMessage: msg };
      }

      const callbackUrl = `${window.location.origin}/auth/callback`;
      const isIframe = typeof window !== 'undefined' && window.self !== window.top;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          ...(isIframe ? { skipBrowserRedirect: true } : {}),
        },
      });

      if (error) {
        console.error('Google Sign-In Error:', error.message);
        const isDisabledProvider = /unsupported provider|provider is not enabled|validation_failed/i.test(error.message || '');
        const msg = isDisabledProvider
          ? `Google provider is not enabled in Supabase Authentication (400: ${error.message}). Enable Google under Supabase Auth -> Providers -> Google, configure Google OAuth Client ID & Secret, and add ${callbackUrl} to Authorized Redirect URLs.`
          : error.message || 'Google Sign-In failed.';
        setOauthError(msg);
        notify(msg, 'error');
        return { ok: false, errorMessage: msg };
      }

      if (isIframe && data?.url) {
        setOauthRedirectUrl(data.url);
        return { ok: true, redirectUrl: data.url };
      }

      return { ok: true, redirectUrl: data?.url };
    },
    [notify, setPostAuthRedirect]
  );

  const signInWithGoogle = useCallback(async () => {
    if (typeof window !== 'undefined') {
      setPostAuthRedirect(`${window.location.pathname}${window.location.search}`);
    }
    openAuthModal('login');
  }, [openAuthModal, setPostAuthRedirect]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await apiFetch<{ user: DbUser; sessionToken?: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (res.sessionToken) persistSessionToken(res.sessionToken);
        setDbUser(res.user);
        await refreshBootstrap();
        notify(`Signed in as ${res.user.fullName || res.user.email}.`, 'success');
        return res.user;
      } catch (localErr: any) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error && data.session) {
            const me = await apiFetch<{ user: DbUser }>('/api/me');
            setDbUser(me.user);
            await refreshBootstrap();
            notify(`Signed in as ${me.user.fullName || me.user.email}.`, 'success');
            return me.user;
          }
        }
        throw localErr;
      }
    },
    [apiFetch, notify, persistSessionToken, refreshBootstrap]
  );

  const registerWithEmail = useCallback(
    async (payload: RegisterPayload) => {
      const res = await apiFetch<{ user: DbUser; sessionToken?: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.sessionToken) persistSessionToken(res.sessionToken);
      setDbUser(res.user);
      await refreshBootstrap();
      notify(`Welcome, ${res.user.fullName || res.user.email}!`, 'success');
      return res.user;
    },
    [apiFetch, notify, persistSessionToken, refreshBootstrap]
  );

  const signInWithAdminCredentials = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch<{ user: DbUser; sessionToken?: string }>('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.sessionToken) persistSessionToken(res.sessionToken);
      setDbUser(res.user);
      await refreshBootstrap();
      notify(`Signed in as ${res.user.fullName || res.user.email}.`, 'success');
      return res.user;
    },
    [apiFetch, notify, persistSessionToken, refreshBootstrap]
  );

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    persistSessionToken(null);
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setDbUser(null);
    notify('Signed out.', 'info');
  }, [apiFetch, notify, persistSessionToken]);

  const addToCart = useCallback(
    (product: Product, qty = 1, variant?: string, color?: string) => {
      if (product.productType === 'quote_only' || product.priceInr <= 0) {
        notify(`"${product.name}" requires a quotation request.`, 'info');
        return;
      }
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.product.id === product.id && i.variant === variant && i.color === color
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: Math.min(product.stockQty, copy[idx].qty + qty) };
          return copy;
        }
        return [...prev, { product, qty: Math.min(product.stockQty, qty), variant, color }];
      });
      setCartDrawerOpen(true);
      notify(`Added "${product.name}" to cart.`, 'success');
    },
    [notify]
  );

  const updateCartQty = useCallback(
    (productId: number, variant: string | undefined, color: string | undefined, qty: number) => {
      setCart((prev) =>
        qty <= 0
          ? prev.filter((i) => !(i.product.id === productId && i.variant === variant && i.color === color))
          : prev.map((i) =>
              i.product.id === productId && i.variant === variant && i.color === color
                ? { ...i, qty: Math.min(i.product.stockQty, qty) }
                : i
            )
      );
    },
    []
  );

  const removeFromCart = useCallback((productId: number, variant?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.variant === variant && i.color === color))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isSignedIn = Boolean(dbUser);
  const isAdmin = Boolean(dbUser && ADMIN_ROLES.has(dbUser.role));

  return (
    <PlatformContext.Provider
      value={{
        path,
        navigate,
        dbUser,
        isSignedIn,
        authLoading,
        isAdmin,
        supabaseConfigured,
        oauthError,
        oauthRedirectUrl,
        clearOauthError,
        setPostAuthRedirect,
        consumePostAuthRedirect,
        openAuthModal,
        signInWithGoogle,
        signInWithSupabaseOAuth,
        signInWithEmail,
        registerWithEmail,
        signInWithAdminCredentials,
        signOut,
        apiFetch,
        getIdToken,
        settings,
        previewDraft,
        categories,
        brands,
        featuredProducts,
        bestsellerProducts,
        newArrivalProducts,
        blogs,
        caseStudies,
        printingMaterials,
        printingMachines,
        publishedPages,
        razorpayConfigured,
        razorpayMode,
        refreshBootstrap,
        refreshMe: syncMe,
        cart,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        startGuestSession,
        notify,
      }}
    >
      {children}
      <AuthModal
        open={authModalOpen}
        initialMode={authModalMode}
        supabaseConfigured={supabaseConfigured}
        oauthRedirectUrl={oauthRedirectUrl}
        oauthError={oauthError}
        onClose={() => {
          setAuthModalOpen(false);
          setOauthRedirectUrl(null);
          setOauthError(null);
        }}
        onLogin={async (em, pw) => {
          await signInWithEmail(em, pw);
        }}
        onRegister={async (payload) => {
          await registerWithEmail(payload);
        }}
        onSupabaseOAuth={() => signInWithSupabaseOAuth()}
      />
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-transform ${
              t.tone === 'error'
                ? 'border-red-300 bg-red-50 text-red-900'
                : t.tone === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </PlatformContext.Provider>
  );
};

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
