import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  User,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginWithGoogle, loginWithSSO, loginDemoUser, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'sso'>('signin');
  const [showGoogleChooser, setShowGoogleChooser] = useState<boolean>(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('');
  const [customGoogleName, setCustomGoogleName] = useState<string>('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState<boolean>(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState<string>('alex.chen@stanford.edu');
  const [loginPassword, setLoginPassword] = useState<string>('password123');

  // Register state
  const [regName, setRegName] = useState<string>('');
  const [regInstitution, setRegInstitution] = useState<string>('Stanford University');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regChronotype, setRegChronotype] = useState<'early_bird' | 'afternoon_flow' | 'night_owl'>('afternoon_flow');

  // SSO state
  const [ssoInstitution, setSsoInstitution] = useState<string>('Stanford University');
  const [ssoEmail, setSsoEmail] = useState<string>('alex.chen@stanford.edu');

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleDemoLogin = async () => {
    await loginDemoUser();
    triggerCelebration();
    onClose();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);
    triggerCelebration();
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regName || !regPassword) return;
    await register(regName, regEmail, regPassword, regInstitution, regChronotype);
    triggerCelebration();
    onClose();
  };

  const handleSelectGoogleAccount = async (email: string, name: string, avatar?: string) => {
    await loginWithGoogle(email, name, avatar);
    triggerCelebration();
    setShowGoogleChooser(false);
    onClose();
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    const name = customGoogleName || customGoogleEmail.split('@')[0];
    await loginWithGoogle(customGoogleEmail, name);
    triggerCelebration();
    setShowGoogleChooser(false);
    onClose();
  };

  const handleSSOLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithSSO(ssoInstitution, ssoEmail);
    triggerCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-[#191a1f] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-center overflow-hidden my-auto">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-orange-500/15 to-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* GOOGLE ACCOUNT CHOOSER VIEW */}
        {showGoogleChooser ? (
          <div className="space-y-4 animate-fade-in text-left">
            <button
              type="button"
              onClick={() => setShowGoogleChooser(false)}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to other options</span>
            </button>

            <div className="text-center pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="w-10 h-10 mx-auto flex items-center justify-center mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Choose an account to continue to ProcastiNot
              </p>
            </div>

            {/* Google Accounts List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'alex.chen.developer@gmail.com',
                    'Alex Chen',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  )
                }
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/60 border border-slate-200 dark:border-white/10 transition-all cursor-pointer text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Alex Chen"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                    Alex Chen
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    alex.chen.developer@gmail.com
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'scholar.student@gmail.com',
                    'Student Scholar',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  )
                }
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/60 border border-slate-200 dark:border-white/10 transition-all cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                    Student Scholar
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    scholar.student@gmail.com
                  </span>
                </div>
              </button>

              {/* Custom Google Account Option */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/60 border border-dashed border-slate-300 dark:border-white/20 transition-all cursor-pointer text-slate-700 dark:text-neutral-300 text-xs font-semibold"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 space-y-2.5 animate-fade-in"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-neutral-400 mb-1">
                      Google Email
                    </label>
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={e => setCustomGoogleEmail(e.target.value)}
                      placeholder="your.google@gmail.com"
                      required
                      className="w-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-neutral-400 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={e => setCustomGoogleName(e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isLoading ? 'Connecting Google OAuth...' : 'Confirm & Sign In with Google'}
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center pt-2">
              ProcastiNot uses Google OAuth 2.0 to securely synchronize your study streak and focus telemetry.
            </p>
          </div>
        ) : (
          /* STANDARD SIGN IN / CREATE ACCOUNT / SSO VIEW */
          <>
            {/* Header Emblem */}
            <div className="relative mb-5">
              <div className="w-12 h-12 rounded-2xl clay-pill mx-auto flex items-center justify-center text-orange-500 shadow-md mb-2.5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'register' ? 'Create Student Account' : 'Student Focus Ecosystem'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                {activeTab === 'register'
                  ? 'Join ProcastiNot to unlock circadian scheduling, distraction shield & rooms.'
                  : 'Access your circadian task schedule, virtual rooms, and focus rewards.'}
              </p>
            </div>

            {/* 3 Tab Mode Switcher */}
            <div className="flex bg-slate-100 dark:bg-[#121316] p-1 rounded-2xl border border-slate-200/80 dark:border-white/5 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'clay-btn-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'clay-btn-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sso')}
                className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'sso'
                    ? 'clay-btn-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Campus SSO
              </button>
            </div>

            {/* Instant 1-Click Demo Sign In */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl clay-btn-indigo text-white font-headline-sm font-extrabold text-xs sm:text-sm cursor-pointer shadow-md mb-2.5 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isLoading ? 'Authenticating...' : '1-Click Demo Sign-In (Alex Chen)'}</span>
            </button>

            {/* Interactive Google Sign In Button */}
            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl bg-white dark:bg-[#121316] text-slate-800 dark:text-neutral-200 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm border border-slate-200/80 dark:border-white/10 mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
              <span className="px-3 text-[10px] text-slate-400 dark:text-neutral-500 uppercase font-bold tracking-wider">
                Or with university credentials
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleEmailLogin} className="space-y-3 text-left animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Student / University Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="alex.chen@stanford.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl clay-btn-primary text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In & Enter Dashboard'}
                </button>

                <p className="text-center text-xs text-slate-500 dark:text-neutral-400 pt-2">
                  Don't have a student account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </form>
            )}

            {/* TAB 2: CREATE ACCOUNT (NEW STUDENT REGISTRATION) */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 text-left animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      University / College
                    </label>
                    <input
                      type="text"
                      value={regInstitution}
                      onChange={e => setRegInstitution(e.target.value)}
                      placeholder="e.g. Stanford / BAUST"
                      className="w-full clay-inset rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Study Chronotype
                    </label>
                    <select
                      value={regChronotype}
                      onChange={e => setRegChronotype(e.target.value as any)}
                      className="w-full clay-inset rounded-xl px-2.5 py-2 text-xs text-slate-700 dark:text-neutral-300 focus:outline-none"
                    >
                      <option value="early_bird">🌅 Early Bird (6am-2pm)</option>
                      <option value="afternoon_flow">☀️ Afternoon (10am-6pm)</option>
                      <option value="night_owl">🦉 Night Owl (4pm-12am)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                    className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl clay-btn-primary text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isLoading ? 'Creating Account...' : 'Create Account (+500 Welcome FP)'}</span>
                </button>

                <p className="text-center text-xs text-slate-500 dark:text-neutral-400 pt-2">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}

            {/* TAB 3: CAMPUS SSO */}
            {activeTab === 'sso' && (
              <form onSubmit={handleSSOLogin} className="space-y-3 text-left animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Select Academic Institution
                  </label>
                  <select
                    value={ssoInstitution}
                    onChange={e => setSsoInstitution(e.target.value)}
                    className="w-full clay-inset rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="Stanford University">Stanford University (SUNet ID)</option>
                    <option value="MIT">Massachusetts Institute of Technology (Kerberos)</option>
                    <option value="UC Berkeley">University of California, Berkeley (CalNet)</option>
                    <option value="Harvard University">Harvard University (HarvardKey)</option>
                    <option value="Carnegie Mellon">Carnegie Mellon University (Andrew ID)</option>
                    <option value="Cambridge University">University of Cambridge (Raven)</option>
                    <option value="Other University">Other Accredited Institution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Institutional Email / NetID
                  </label>
                  <input
                    type="email"
                    value={ssoEmail}
                    onChange={e => setSsoEmail(e.target.value)}
                    placeholder="netid@institution.edu"
                    className="w-full clay-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl clay-btn-indigo text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{isLoading ? 'Connecting to Campus SSO...' : 'Authenticate via Campus SSO'}</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
