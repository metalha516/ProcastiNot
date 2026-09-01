import React from 'react';
import {
  LayoutDashboard,
  Clock,
  ShieldAlert,
  Activity,
  Sparkles,
  Calendar,
  Users,
  Flame,
  TrendingUp,
  Trophy,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Brain,
} from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { isRunning, mode } = useTimer();
  const { circadianStatus } = useTask();

  const navigationSections = [
    {
      title: 'CORE ENGINE',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'timer', label: 'Focus & 40Hz Audio', icon: Clock, badge: isRunning ? 'Active' : undefined },
        { id: 'blocker', label: 'Distraction Shield', icon: ShieldAlert },
      ],
    },
    {
      title: 'INTELLIGENT PLANNING',
      items: [
        { id: 'circadian', label: 'Circadian Tasks', icon: Activity },
        { id: 'ai-planner', label: 'AI Study Planner', icon: Sparkles },
        { id: 'countdown', label: 'Exam Countdowns', icon: Calendar },
      ],
    },
    {
      title: 'PEER & SOCIAL',
      items: [
        { id: 'rooms', label: 'Virtual Focus Rooms', icon: Users },
        { id: 'arena', label: 'Group Study Arena', icon: Trophy },
      ],
    },
    {
      title: 'HABITS & REWARDS',
      items: [
        { id: 'habits', label: 'Streaks & Heatmap', icon: Flame },
        { id: 'delta', label: 'Performance Deltas', icon: TrendingUp },
        { id: 'rewards', label: 'Reward Shop', icon: ShoppingBag },
      ],
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-4 bg-[#15161b] border-r border-white/10 select-none">
      {/* Top Nav Items */}
      <div className="space-y-6 px-3 overflow-y-auto">
        {/* Brand / Mini Tag */}
        <div className={`px-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Navigation</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs">
              Ω
            </div>
          )}
        </div>

        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 block mb-1.5 font-mono">
                {section.title}
              </span>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-400 text-black font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Info Widget */}
      <div className="px-3 pt-4 border-t border-white/5 space-y-2">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-[#121316] border border-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Brain className="w-3.5 h-3.5 text-violet-400" />
              <span>Bio-Alertness</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>{circadianStatus.energyScore}% Score</span>
              <span className="text-violet-400">{circadianStatus.currentWindow.toUpperCase()}</span>
            </div>
          </div>
        ) : null}

        {/* Collapse button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full hidden lg:flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
