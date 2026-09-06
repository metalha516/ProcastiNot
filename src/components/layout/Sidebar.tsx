import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  Grid2X2,
  Users,
  BarChart3,
  ShoppingBag,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldAlert,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  isDark = true,
  onToggleTheme,
}) => {
  const { isRunning } = useTimer();
  const { circadianStatus } = useTask();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'timer', label: 'Focus Timer', icon: Clock, badge: isRunning ? 'LIVE' : undefined, requiresAuth: false },
    { id: 'planner-tasks', label: 'Planner & Tasks', icon: CheckSquare, requiresAuth: true },
    { id: 'habits-matrix', label: 'Habits & Matrix', icon: Grid2X2, requiresAuth: true },
    { id: 'blocker', label: 'Distraction Shield', icon: ShieldAlert, requiresAuth: true },
    { id: 'study-rooms', label: 'Study Rooms', icon: Users, requiresAuth: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, requiresAuth: true },
    { id: 'rewards', label: 'Reward Shop', icon: ShoppingBag, requiresAuth: true },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-3 sm:p-4 clay-card rounded-3xl z-40 border border-white/60 dark:border-white/5 transition-all select-none">
      <div className="flex flex-col gap-3">
        {/* Brand Emblem Header */}
        <div className={`h-14 px-3 flex items-center gap-3 rounded-2xl bg-white/70 dark:bg-[#141926] clay-pill ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-500/20 shadow-inner flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-headline-sm text-sm sm:text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100 truncate">
                ProcastiNot
              </span>
              <span className="font-telemetry-sm text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                Clay Deck v2.4
              </span>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-3 pt-1">
            <span className="text-[10px] font-telemetry-sm tracking-widest text-slate-400 dark:text-slate-500 uppercase font-bold">
              Tactile Console
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = !isAuthenticated && item.requiresAuth;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer text-sm font-semibold ${
                  isActive
                    ? 'clay-btn-primary text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/[0.04]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {!isCollapsed && (
                  <span className="font-label-md text-sm truncate flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="font-telemetry-sm text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold animate-pulse">
                    {item.badge}
                  </span>
                )}
                {!isCollapsed && isLocked && (
                  <span className="font-telemetry-sm text-[9px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    <span>LOCK</span>
                  </span>
                )}
                {!isCollapsed && !isAuthenticated && !item.requiresAuth && !item.badge && (
                  <span className="font-telemetry-sm text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    FREE
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Power Core & Theme Controls */}
      <div className="flex flex-col gap-2 pt-2">
        {/* Power Core Fuel Gauge */}
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#141926] clay-pill border border-white/80 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
              <span className="font-telemetry-sm text-[10px] uppercase tracking-wider font-bold">Power Core</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>
            <div className="w-full clay-inset h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${circadianStatus.energyScore}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 font-telemetry-sm text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-medium">Focus Fuel</span>
              <span className="text-orange-600 dark:text-orange-400 font-extrabold">{circadianStatus.energyScore}%</span>
            </div>
          </div>
        )}

        {/* Theme Toggle & Collapse Buttons */}
        <div className="flex items-center justify-between gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs flex-1 ${
                isCollapsed ? 'px-2' : ''
              }`}
              title={isDark ? 'Switch to Light Clay' : 'Switch to Dark Clay'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  {!isCollapsed && <span className="font-telemetry-sm font-bold">Light Clay</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  {!isCollapsed && <span className="font-telemetry-sm font-bold">Dark Clay</span>}
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-2 rounded-2xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Unauthenticated Quick Sign In Banner */}
        {!isCollapsed && !isAuthenticated && (
          <button
            type="button"
            onClick={() => {
              onSelectTab('dashboard');
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-2xl clay-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-1 hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Sign In to Unlock All</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-[calc(100vh-2rem)] sticky top-4 my-4 ml-4 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full p-4 z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

