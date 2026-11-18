import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { getSupabaseClient } from '../lib/supabase';
import { DbUser } from '../types/platform';

interface OAuthStatusResponse {
  supabaseConfigured: boolean;
  supabaseUrlOrigin: string | null;
  supabaseCallbackUrl: string | null;
  recommendedRedirectUrls: string[];
}

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

export const AuthCallbackPage: React.FC = () => {
  const { navigate, startGuestSession, refreshMe, consumePostAuthRedirect, notify } = usePlatform();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing Google sign-in and syncing your customer profile...');

  useEffect(() => {
    let active = true;
    const runCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const oauthErrorParam =
          searchParams.get('error_description') ||
          searchParams.get('error') ||
          hashParams.get('error_description') ||
          hashParams.get('error');

        if (oauthErrorParam) {
          throw new Error(decodeURIComponent(oauthErrorParam.replace(/\+/g, ' ')));
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
          throw new Error(
            'Supabase Auth client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are configured.'
          );
        }

        const code = searchParams.get('code');
        if (code) {
          const { error: exchErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchErr) throw exchErr;
        }

        const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        let accessToken = sessionData.session?.access_token;
        if (!accessToken) {
          // Wait briefly for Supabase detectSessionInUrl async hydration if hash tokens exist
          await new Promise((r) => setTimeout(r, 450));
          const retry = await supabase.auth.getSession();
          accessToken = retry.data.session?.access_token;
        }

        if (!accessToken) {
          throw new Error(
            'No authenticated OAuth session was returned. Verify that the callback URL is authorized in Supabase Authentication settings.'
          );
        }

        const syncRes = await fetch('/api/auth/sync-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'same-origin',
        });
        const syncJson = (await syncRes.json().catch(() => ({}))) as {
          user?: DbUser;
          sessionToken?: string;
          error?: string;
        };

        if (!syncRes.ok || !syncJson.user) {
          throw new Error(syncJson.error || 'Failed to synchronize customer profile.');
        }

        if (syncJson.sessionToken) {
          startGuestSession(syncJson.sessionToken, syncJson.user);
        }
        await refreshMe();

        if (!active) return;
        const destination = consumePostAuthRedirect() || '/my-account';
        setStatus('success');
        setMessage(`Welcome, ${syncJson.user.fullName || syncJson.user.email}! Redirecting...`);
        notify(`Signed in with Google as ${syncJson.user.fullName || syncJson.user.email}.`, 'success');
        setTimeout(() => {
          if (active) navigate(destination);
        }, 450);
      } catch (err: any) {
        if (!active) return;
        setStatus('error');
        setMessage(err?.message || 'Google authentication callback failed.');
      }
    };

    runCallback();
    return () => {
      active = false;
    };
  }, [consumePostAuthRedirect, navigate, notify, refreshMe, startGuestSession]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-[#15803D] animate-spin mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#111417]">Signing You In</h1>
            <p className="text-sm text-slate-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-[#15803D] mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#111417]">Authentication Complete</h1>
            <p className="text-sm text-slate-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#111417]">Google Sign-In Could Not Complete</h1>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-left text-xs text-red-900 space-y-1.5">
              <div className="font-semibold">Authentication Diagnostic</div>
              <p className="leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-[#111417] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Return to Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AuthStandaloneView: React.FC<{ initialMode: 'login' | 'register' }> = ({ initialMode }) => {
  const {
    isSignedIn,
    dbUser,
    navigate,
    signInWithEmail,
    registerWithEmail,
    signInWithSupabaseOAuth,
    oauthError,
    oauthRedirectUrl,
    clearOauthError,
    setPostAuthRedirect,
    consumePostAuthRedirect,
  } = usePlatform();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyOrCollege, setCompanyOrCollege] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [oauthStatus, setOauthStatus] = useState<OAuthStatusResponse | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setFormError('');
    clearOauthError();
  }, [initialMode, clearOauthError]);

  useEffect(() => {
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    if (redirectParam && redirectParam.startsWith('/')) {
      setPostAuthRedirect(redirectParam);
    }
    fetch('/api/auth/oauth-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setOauthStatus(d);
      })
      .catch(() => {});
  }, [setPostAuthRedirect]);

  if (isSignedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-[#15803D] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#111417]">
            Signed in as {dbUser?.fullName || dbUser?.email}
          </h1>
          <p className="text-sm text-slate-600">
            Access your orders, project registrations, GST invoices, and saved addresses inside My Account.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/my-account')}
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
            >
              Open My Account <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/register-project')}
              className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-lg"
            >
              Register a Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);
    try {
      const dest =
        new URLSearchParams(window.location.search).get('redirect') || consumePostAuthRedirect() || '/my-account';
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
      } else {
        if (!fullName.trim() || !email.trim()) {
          throw new Error('Full name and email address are required.');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        await registerWithEmail({
          fullName: fullName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          companyOrCollege: companyOrCollege.trim(),
          password,
        });
      }
      navigate(dest);
    } catch (err: any) {
      setFormError(err?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleClick = async () => {
    setFormError('');
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    await signInWithSupabaseOAuth(redirectParam || '/my-account');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 rounded-2xl bg-[#111417] text-white p-8 space-y-5 border border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          NEXUSTEKFUSION ACCOUNT PORTAL
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight">
          {mode === 'login' ? 'Sign In to NexusTekFusion' : 'Create Your Engineering Account'}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Manage KRASHIVANTRI drone enquiries, custom engineering project milestones, 3D printing jobs, Razorpay orders, and GST invoices in one dashboard.
        </p>
        <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
          <li className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Supabase Auth session security with customer profile synchronization</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Direct access to Project Registration, Drone Repair bookings &amp; Store Cart</span>
          </li>
        </ul>
      </div>

      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              navigate('/login');
            }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-[#111417] shadow-sm' : 'text-slate-600 hover:text-[#111417]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              navigate('/register');
            }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-[#111417] shadow-sm' : 'text-slate-600 hover:text-[#111417]'
            }`}
          >
            Register
          </button>
        </div>

        {(formError || oauthError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              Authentication Notice
            </div>
            <p className="leading-relaxed">{formError || oauthError}</p>
          </div>
        )}

        {/* Google Sign-In Section */}
        <div className="space-y-2.5">
          {oauthRedirectUrl ? (
            <a
              href={oauthRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2"
            >
              <GoogleMark />
              Open Google Sign-In in New Tab
            </a>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={handleGoogleClick}
              className="w-full py-3 border border-slate-300 hover:bg-slate-50 text-[#111417] text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <GoogleMark />
              Continue with Google
            </button>
          )}

          {oauthStatus && !oauthStatus.supabaseConfigured && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11px] text-amber-950 leading-relaxed">
              <strong>Supabase Google OAuth Configuration Required:</strong> Set{' '}
              <span className="font-mono">SUPABASE_URL</span> &amp;{' '}
              <span className="font-mono">SUPABASE_ANON_KEY</span>, enable Google in Supabase Authentication &rarr; Providers with your Google OAuth Client ID &amp; Secret, and authorize callback URL{' '}
              <span className="font-mono">{window.location.origin}/auth/callback</span>.
            </div>
          )}
        </div>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2.5 text-slate-400 font-medium">Or continue with Email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-[#15803D] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Organization / College / Farm</label>
                  <input
                    value={companyOrCollege}
                    onChange={(e) => setCompanyOrCollege(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-[#15803D] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              {mode === 'register' ? 'Password (minimum 8 characters) *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="password"
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Create password' : 'Enter password'}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-[#15803D] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-[#111417] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {busy
              ? mode === 'login'
                ? 'Signing In...'
                : 'Creating Account...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => <AuthStandaloneView initialMode="login" />;
export const RegisterPage: React.FC = () => <AuthStandaloneView initialMode="register" />;
