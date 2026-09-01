import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Palette,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useTimer } from '../../context/TimerContext';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenAuth: () => void;
  onNavigate: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, onOpenAuth, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { streak, streakFreezes, focusPoints, notifications, markNotificationRead } = useGamification();
  const { isRunning, timeRemaining, mode } = useTimer();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-30 h-16 w-full stitch-glass border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-600/30">
            Ω
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-white tracking-tight">ProcastiNot</span>
            <span className="text-[10px] text-violet-400 font-mono block -mt-1">OmniFocus StudyForge</span>
          </div>
        </div>

        {/* Live Timer Pill if running */}
        {isRunning && (
          <button
            type="button"
            onClick={() => onNavigate('timer')}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold animate-pulse-glow cursor-pointer ml-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>({timerStr}) {mode.toUpperCase()}</span>
          </button>
        )}
      </div>

      {/* Right: Badges, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Flame Badge */}
        <button
          type="button"
          onClick={() => onNavigate('habits')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
          title={`${streak} day study streak with ${streakFreezes} freeze shields`}
        >
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-mono">{streak}</span>
          <span className="hidden sm:inline text-[10px] opacity-80">d</span>
        </button>

        {/* Focus Points Wallet Badge */}
        <button
          type="button"
          onClick={() => onNavigate('rewards')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold transition-all cursor-pointer"
          title="Focus Reward Points wallet - Click to open Shop"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">{focusPoints.toLocaleString()}</span>
          <span className="text-[10px] text-cyan-400">FP</span>
        </button>

        {/* Routine-Aware Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors relative cursor-pointer"
            title="Routine-aware alert notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 ring-2 ring-[#191a1f] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#191a1f] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Routine-Aware Notifications
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {unreadNotifs.length} unread
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-[#121316] border-white/5 opacity-70'
                        : 'bg-violet-500/10 border-violet-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono font-normal">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Menu */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-violet-500/40"
              />
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#191a1f] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-left">
                <div className="p-2 border-b border-white/5 mb-2">
                  <span className="text-xs font-bold text-white block">{user.name}</span>
                  <span className="text-[11px] text-violet-400 font-mono block">{user.institution}</span>
                  <span className="text-[10px] text-neutral-500 mt-1 block">Level {user.level} Scholar</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('circadian');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Circadian Chronotype Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('rewards');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Theme & Avatar Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
