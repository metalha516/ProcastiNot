import React, { useState } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { OverviewDashboard } from '../dashboard/OverviewDashboard';
import { PomodoroTimer } from '../timer/PomodoroTimer';
import { DistractionBlocker } from '../distraction/DistractionBlocker';
import { SecondThoughtModal } from '../distraction/SecondThoughtModal';
import { CircadianOrganizer } from '../planner/CircadianOrganizer';
import { AIStudyPlanner } from '../planner/AIStudyPlanner';
import { ExamCountdown } from '../planner/ExamCountdown';
import { VirtualFocusRooms } from '../rooms/VirtualFocusRooms';
import { StreakHeatmap } from '../gamification/StreakHeatmap';
import { PerformanceDeltaCurve } from '../gamification/PerformanceDeltaCurve';
import { LeaderboardArena } from '../gamification/LeaderboardArena';
import { RewardShop } from '../gamification/RewardShop';
import { AuthModal } from '../auth/AuthModal';

export const Shell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewDashboard onNavigate={setActiveTab} />;
      case 'timer':
        return <PomodoroTimer />;
      case 'blocker':
        return <DistractionBlocker />;
      case 'circadian':
        return <CircadianOrganizer />;
      case 'ai-planner':
        return <AIStudyPlanner />;
      case 'countdown':
        return <ExamCountdown />;
      case 'rooms':
        return <VirtualFocusRooms />;
      case 'habits':
        return <StreakHeatmap />;
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
    <div className="min-h-screen bg-[#121316] text-[#e3e3e3] flex flex-col">
      {/* Top Application Bar */}
      <Topbar
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigate={setActiveTab}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 relative">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <SecondThoughtModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
