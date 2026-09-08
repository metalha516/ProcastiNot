import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { GamificationProvider, useGamification } from './context/GamificationContext';
import { TimerProvider } from './context/TimerContext';
import { Shell } from './components/layout/Shell';

// AppContent wraps TimerProvider inside GamificationProvider so completion awards points
const AppContent: React.FC = () => {
  const { awardPoints, recordFocusSession } = useGamification();

  return (
    <TimerProvider
      onSessionComplete={(session) => {
        awardPoints(session.pointsEarned, `Completed ${session.durationMinutes}m focus block!`);
        recordFocusSession(session.durationMinutes);
      }}
    >
      <Shell />
    </TimerProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
