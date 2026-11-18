import React, { useEffect, useState } from 'react';
import { Lock, Mail, Phone, ShieldCheck, User, X } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';

interface AuthModalProps {
  open: boolean;
  initialMode?: 'login' | 'register';
  supabaseConfigured: boolean;
  oauthRedirectUrl?: string | null;
  oauthError?: string | null;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (input: {
    fullName: string;
    email: string;
    mobile: string;
    companyOrCollege: string;
    password: string;
  }) => Promise<void>;
  onSupabaseOAuth: () => Promise<any>;
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

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  initialMode = 'login',
  supabaseConfigured,
  oauthRedirectUrl,
  oauthError,
  onClose,
  onLogin,
  onRegister,
  onSupabaseOAuth,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyOrCollege, setCompanyOrCollege] = useState('');
  const [password, setPassword] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError('');
      setInfoMsg('');
    }
  }, [open, initialMode]);

  if (!open) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    setBusy(true);
    try {
      await onLogin(email.trim(), password);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!fullName.trim() || !email.trim()) {
      setError('Full name and email address are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setBusy(true);
    try {
      await onRegister({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        companyOrCollege: companyOrCollege.trim(),
        password,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    const supabase = getSupabaseClient();
    if (!supabase) {
      setInfoMsg('Please email Customer Care at info@nexustekfusion.in for password recovery.');
      return;
    }
    setBusy(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (resetErr) throw resetErr;
      setInfoMsg('Password reset link sent to your email address.');
    } catch (err: any) {
      setError(err?.message || 'Unable to send reset email. Contact info@nexustekfusion.in.');
    } finally {
      setBusy(false);
    }
  };

  const displayError = error || oauthError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-semibold text-[#15803D] uppercase tracking-wider">
              NEXUSTEKFUSION Account
            </div>
            <h3 className="font-display text-lg font-bold text-[#111417]">
              {mode === 'login'
                ? 'Sign In to Your Account'
                : mode === 'forgot'
                ? 'Reset Account Password'
                : 'Create Customer Account'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            aria-label="Close sign in dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setInfoMsg('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'login' ? 'bg-white text-[#111417] shadow-sm' : 'text-slate-600 hover:text-[#111417]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setInfoMsg('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'register' ? 'bg-white text-[#111417] shadow-sm' : 'text-slate-600 hover:text-[#111417]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {displayError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-800 leading-relaxed">
              {displayError}
            </div>
          )}

          {infoMsg && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-900">
              {infoMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setInfoMsg('');
                    }}
                    className="text-[11px] font-semibold text-[#15803D] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-[#111417] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {busy ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <p className="text-xs text-slate-600">
                Enter your registered email address or contact Customer Care at{' '}
                <a href="mailto:info@nexustekfusion.in" className="text-[#15803D] underline">
                  info@nexustekfusion.in
                </a>
                .
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 py-2.5 bg-[#111417] text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  {busy ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="px-4 py-2.5 border border-slate-300 text-xs font-semibold rounded-lg"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Organization / Farm</label>
                  <input
                    type="text"
                    value={companyOrCollege}
                    onChange={(e) => setCompanyOrCollege(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Password (min 8 characters) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-[#15803D] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-[#111417] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {busy ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {mode !== 'forgot' && (
            <>
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">Or</span>
                </div>
              </div>

              {oauthRedirectUrl ? (
                <a
                  href={oauthRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open Google Sign-In in New Tab
                </a>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onSupabaseOAuth}
                  className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <GoogleMark />
                  Continue with Google
                </button>
              )}

              {!supabaseConfigured && (
                <p className="text-[11px] text-slate-500 text-center">
                  Requires Supabase Google OAuth configuration. Clicking verifies live configuration status.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
