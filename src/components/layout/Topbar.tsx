import React, { useState } from 'react';
import {
  Flame,
  Search,
  Bell,
  Menu,
  Volume2,
  LogOut,
  Sparkles,
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
  const { streak, focusPoints, notifications, markNotificationRead } = useGamification();
  const { isRunning, timeRemaining, mode } = useTimer();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const toggleRainAudio = () => {
    setIsAudioActive(prev => !prev);
  };

  return (
    <header className="h-16 clay-card rounded-2xl flex items-center justify-between px-4 sm:px-6 my-3 mx-4 border border-white/70 dark:border-white/5 transition-all select-none z-30">
      {/* Left: Mobile Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Search Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl clay-inset w-44 sm:w-64 md:w-80 border border-white/50 dark:border-white/[0.03]">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands or modules..."
            className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full focus:ring-0"
          />
          <span className="hidden sm:inline font-telemetry-sm text-[10px] px-2 py-0.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shadow-sm flex-shrink-0">
            ⌘K
          </span>
        </div>

        {/* ZEN STACK ACTIVE Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 clay-pill border border-emerald-100 dark:border-emerald-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="font-telemetry-sm text-xs text-emerald-800 dark:text-emerald-300 font-extrabold tracking-wide">
            ZEN STACK ACTIVE
          </span>
        </div>

        {/* Live Timer badge if running */}
        {isRunning && (
          <button
            type="button"
            onClick={() => onNavigate('timer')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full clay-btn-primary text-white text-xs font-telemetry-sm font-bold cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{timerStr} ({mode.toUpperCase()})</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fire Streak Counter */}
        <button
          type="button"
          onClick={() => onNavigate('habits-matrix')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl clay-pill bg-white dark:bg-[#1f2537] cursor-pointer"
          title={`${streak} day focus streak!`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <div className="flex items-baseline gap-0.5">
            <span className="font-telemetry-md text-sm font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">
              {streak}
            </span>
            <span className="font-telemetry-sm text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              d streak
            </span>
          </div>
        </button>

        {/* Rain Binaural Toggle Button */}
        <button
          type="button"
          onClick={toggleRainAudio}
          className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-all ${
            isAudioActive ? 'ring-2 ring-indigo-500/50 bg-indigo-50 dark:bg-indigo-950/40' : ''
          }`}
          title="Toggle Ambient Rain & Binaural Soundscape"
        >
          <Volume2 className={`w-4 h-4 ${isAudioActive ? 'text-indigo-600 animate-pulse' : 'text-indigo-500 dark:text-indigo-400'}`} />
          <span className="font-telemetry-sm text-xs font-bold">
            {isAudioActive ? 'Rain Playing' : 'Rain Binaural'}
          </span>
        </button>

        {/* Points Badge */}
        <button
          type="button"
          onClick={() => onNavigate('rewards')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl clay-pill bg-white dark:bg-[#1f2537] cursor-pointer"
          title={`${focusPoints} Focus Points`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-telemetry-sm text-xs font-bold text-slate-700 dark:text-slate-300">
            {focusPoints.toLocaleString()} FP
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 rounded-2xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 clay-card rounded-3xl p-4 z-50 animate-fade-in text-left border border-white/80 dark:border-white/5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="font-headline-sm text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Telemetry Alerts
                </span>
                <span className="font-telemetry-sm text-[10px] text-slate-500 font-bold">
                  {unreadNotifs.length} UNREAD
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-2xl clay-inset text-left cursor-pointer transition-all ${
                      n.read ? 'opacity-60' : 'border-l-4 border-orange-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
                      <span>{n.title}</span>
                      <span className="font-telemetry-sm text-[10px] text-slate-500 font-normal">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="p-1 rounded-full clay-pill bg-white dark:bg-[#1f2537] cursor-pointer flex items-center"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 clay-card rounded-3xl p-3 z-50 text-left border border-white/80 dark:border-white/5 shadow-xl">
                <div className="p-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                  <span className="font-headline-sm text-sm font-bold text-slate-800 dark:text-slate-100 block">{user.name}</span>
                  <span className="font-telemetry-sm text-xs text-orange-600 dark:text-orange-400 block">{user.institution || 'Scholar Engine'}</span>
                  <span className="font-telemetry-sm text-[10px] text-slate-500 block mt-0.5">Level {user.level} Tactile User</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('planner-tasks');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Circadian Task Matrix
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('rewards');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Reward Shop & Themes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-2 cursor-pointer"
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
            className="px-4 py-2 rounded-2xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

