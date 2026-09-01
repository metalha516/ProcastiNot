import React, { useState } from 'react';
import { X, Lock, Mail, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle, loginWithSSO, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'sso'>('login');
  const [email, setEmail] = useState<string>('alex.chen@stanford.edu');
  const [password, setPassword] = useState<string>('password123');
  const [institution, setInstitution] = useState<string>('Stanford University');

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    onClose();
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  const handleSSOLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithSSO(institution, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#191a1f] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-violet-600/30 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Student Focus Ecosystem
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your circadian task schedule, virtual rooms, and focus rewards.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#121316] p-1 rounded-xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-violet-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Email / Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sso')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'sso' ? 'bg-violet-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Institutional SSO
          </button>
        </div>

        {/* Quick Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-neutral-900 font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-all cursor-pointer shadow-md mb-4"
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

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-[11px] text-neutral-500 uppercase">Or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="text-left">
              <label className="block text-xs text-neutral-400 mb-1">Student / University Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <div className="text-left">
              <label className="block text-xs text-neutral-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In & Enter Dashboard'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSSOLogin} className="space-y-3">
            <div className="text-left">
              <label className="block text-xs text-neutral-400 mb-1">Select Institution</label>
              <select
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
              >
                <option value="Stanford University">Stanford University (SUNet ID)</option>
                <option value="MIT">Massachusetts Institute of Technology (Kerberos)</option>
                <option value="UC Berkeley">University of California, Berkeley (CalNet)</option>
                <option value="Harvard University">Harvard University (HarvardKey)</option>
                <option value="Carnegie Mellon">Carnegie Mellon University (Andrew ID)</option>
                <option value="Cambridge University">University of Cambridge (Raven)</option>
              </select>
            </div>
            <div className="text-left">
              <label className="block text-xs text-neutral-400 mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="netid@institution.edu"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Connecting to SSO Provider...' : 'Authenticate via Campus SSO'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
