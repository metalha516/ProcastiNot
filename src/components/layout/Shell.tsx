import React, { useState, useEffect } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { OverviewDashboard } from '../dashboard/OverviewDashboard';
import { PomodoroTimer } from '../timer/PomodoroTimer';
import { DistractionBlocker } from '../distraction/DistractionBlocker';
import { SecondThoughtModal } from '../distraction/SecondThoughtModal';
import { CircadianOrganizer } from '../planner/CircadianOrganizer';
import { VirtualFocusRooms } from '../rooms/VirtualFocusRooms';
import { StreakHeatmap } from '../gamification/StreakHeatmap';
import { PerformanceDeltaCurve } from '../gamification/PerformanceDeltaCurve';
import { LeaderboardArena } from '../gamification/LeaderboardArena';
import { RewardShop } from '../gamification/RewardShop';
import { AuthModal } from '../auth/AuthModal';
import { useBrowserShield } from '../../hooks/useBrowserShield';

export const Shell: React.FC = () => {
  useBrowserShield();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('procastinot_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('procastinot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('procastinot_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewDashboard onNavigate={setActiveTab} />;
      case 'timer':
      case 'focus-timer':
        return <PomodoroTimer />;
      case 'blocker':
        return <DistractionBlocker />;
      case 'planner-tasks':
      case 'circadian':
      case 'ai-planner':
      case 'countdown':
        return <CircadianOrganizer />;
      case 'study-rooms':
      case 'rooms':
        return <VirtualFocusRooms />;
      case 'habits-matrix':
      case 'habits':
        return <StreakHeatmap />;
      case 'analytics':
      case 'delta':
        return <PerformanceDeltaCurve />;
      case 'arena':
        return <LeaderboardArena />;
      case 'rewards':
        return <RewardShop />;
      default:
        return <OverviewDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <div className="flex flex-1 relative max-w-[1920px] mx-auto w-full">
        {/* Claymorphic Tactile Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content View Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Topbar Header */}
          <Topbar
            onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigate={setActiveTab}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <SecondThoughtModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
