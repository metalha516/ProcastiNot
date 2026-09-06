import React from 'react';
import {
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  CheckSquare,
  Users,
  Grid2X2,
  BarChart3,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthFeatureGateProps {
  featureId: string;
  onOpenAuth: () => void;
  onGoToTimer: () => void;
}

const FEATURE_METADATA: Record<
  string,
  {
    title: string;
    badge: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    highlights: string[];
  }
> = {
  dashboard: {
    title: 'Student Command Dashboard',
    badge: 'Telemetry & Overview',
    description:
      'Access your personal telemetry stream, daily focus points breakdown, Eisenhower 2x2 decision runway, and proof-of-work heatmap.',
    icon: LayoutDashboard,
    highlights: [
      'Real-time cognitive load & focus duration telemetry',
      'Eisenhower 2x2 priority matrix with direct task creation',
      '7x26 week calendar activity heatmap with proof logging',
    ],
  },
  blocker: {
    title: 'Anti-Distraction Shield & Browser Interceptor',
    badge: 'Dopamine Friction Suite',
    description:
      'Deploy global browser-level interception for social media, 10-second box-breathing friction gates, and resistance analytics.',
    icon: ShieldAlert,
    highlights: [
      'Real-time browser link capture & navigation arrest',
      'Second-thought 10s mindfulness box-breathing gate',
      'Downloadable Chrome extension, Tampermonkey script & hosts filter',
    ],
  },
  'planner-tasks': {
    title: 'Circadian Task Matrix & AI Syllabus Planner',
    badge: 'Energy-Aligned Scheduling',
    description:
      'Organize assignments aligned with your biological circadian energy rhythm and generate AI-powered exam countdown runways.',
    icon: CheckSquare,
    highlights: [
      'Tasks sorted by exam urgency and cognitive energy demands',
      'AI exam syllabus parser that generates day-by-day revision plans',
      'Circadian chronotype tracker (early bird / afternoon / night owl)',
    ],
  },
  'habits-matrix': {
    title: 'Tactile Habit Check-Ins & Consistency Matrix',
    badge: 'Habit Formation Protocol',
    description:
      'Build unbroken academic study streaks with haptic daily check-ins and proof-of-work telemetry archiving.',
    icon: Grid2X2,
    highlights: [
      'Tactile puffy clay habit toggles with streak multipliers',
      'Full 7x26 week calendar matrix with interactive day inspector',
      'Automatic streak freeze protection against burnout',
    ],
  },
  'study-rooms': {
    title: 'Virtual Focus Rooms & Peer Accountability',
    badge: 'Synchronous Co-Working',
    description:
      'Study with verified college students in real-time synchronous focus rooms with shared audio entrainment.',
    icon: Users,
    highlights: [
      'Live peer presence with real-time focus status',
      'Synchronized binaural gamma beats & ambient rain generator',
      'Accountability peer nudging and group sprint timers',
    ],
  },
  analytics: {
    title: 'Deep Work Analytics & Performance Delta',
    badge: 'Cognitive Velocity',
    description:
      'Inspect your focus depth trajectories, weekly study velocity, and distraction resistance rate across semesters.',
    icon: BarChart3,
    highlights: [
      'Focus depth curve analysis against daily circadian peaks',
      'Weekly cognitive velocity and subject distribution breakdown',
      'Historical distraction resistance & minutes saved tracking',
    ],
  },
  rewards: {
    title: 'Focus Points Reward Shop & Theme Unlocker',
    badge: 'Gamified Incentives',
    description:
      'Redeem earned focus points for tactile clay UI themes, soundscapes, and emergency streak freeze shields.',
    icon: ShoppingBag,
    highlights: [
      'Unlock exclusive tactile claymorphic colorways & themes',
      'Acquire premium binaural audio frequencies & sound presets',
      'Equip streak freezes to protect long-standing consistency',
    ],
  },
};

export const AuthFeatureGate: React.FC<AuthFeatureGateProps> = ({
  featureId,
  onOpenAuth,
  onGoToTimer,
}) => {
  const { loginDemoUser, isLoading } = useAuth();

  const meta = FEATURE_METADATA[featureId] || FEATURE_METADATA.dashboard;
  const Icon = meta.icon;

  const handleDemoAccess = async () => {
    await loginDemoUser();
  };

  return (
    <div className="max-w-3xl mx-auto my-6 sm:my-10 animate-fade-in px-2 sm:px-0">
      <div className="clay-card rounded-3xl p-6 sm:p-10 border border-orange-500/30 dark:border-violet-500/20 text-center relative overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-orange-500/15 to-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Lock Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full clay-inset text-orange-700 dark:text-orange-400">
            <Lock className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-telemetry-sm text-xs font-extrabold uppercase tracking-wider">
              Student Authentication Required
            </span>
          </div>
        </div>

        {/* Feature Icon Shield */}
        <div className="relative flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl clay-pill flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-md">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-1 mb-3">
          <span className="font-telemetry-sm text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            {meta.badge}
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {meta.title}
          </h1>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-medium">
          {meta.description}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
          {meta.highlights.map((h, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl clay-inset flex items-start gap-2.5 border border-white/60 dark:border-white/5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-snug">
                {h}
              </span>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200/80 dark:border-white/5">
          {/* Sign In button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl clay-btn-primary text-white font-headline-sm font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Sign In / Student SSO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl clay-btn-indigo text-white font-headline-sm font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all disabled:opacity-50"
            title="Instantly sign in as Alex Chen (Stanford University demo profile)"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Authenticating...' : '1-Click Demo Sign-In'}</span>
          </button>

          {/* Free Pomodoro Timer Fallback */}
          <button
            type="button"
            onClick={onGoToTimer}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 font-headline-sm font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 transition-all hover:text-slate-900 dark:hover:text-white"
          >
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Use Free Focus Timer</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4">
          Focus Timer is 100% free and open without sign in. All other academic telemetry features require an authenticated student profile.
        </p>
      </div>
    </div>
  );
};
