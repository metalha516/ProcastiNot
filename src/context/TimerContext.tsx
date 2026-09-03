import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TimerMode, TimerPreset, GammaAudioState, FocusSessionLog } from '../types';
import { defaultPresets } from '../data/mockData';
import { gammaEngine } from '../audio/gammaEngine';

interface TimerContextType {
  mode: TimerMode;
  timeRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  activePreset: TimerPreset;
  presets: TimerPreset[];
  gammaAudio: GammaAudioState;
  sessionLogs: FocusSessionLog[];
  selectedTaskTitle: string;
  setSelectedTaskTitle: (title: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  switchMode: (newMode: TimerMode) => void;
  selectPreset: (preset: TimerPreset) => void;
  setCustomDuration: (focusMins: number, breakMins: number) => void;
  updateGammaSettings: (updates: Partial<GammaAudioState>) => void;
  toggleGammaAudio: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{
  children: React.ReactNode;
  onSessionComplete?: (session: FocusSessionLog) => void;
}> = ({ children, onSessionComplete }) => {
  const [presets, setPresets] = useState<TimerPreset[]>(defaultPresets);
  const [activePreset, setActivePreset] = useState<TimerPreset>(defaultPresets[0]);
  const [mode, setMode] = useState<TimerMode>('focus');
  
  const [totalDuration, setTotalDuration] = useState<number>(defaultPresets[0].focusMinutes * 60);
  const [timeRemaining, setTimeRemaining] = useState<number>(defaultPresets[0].focusMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('CS161: Dynamic Programming & Matrix Chain');

  const [gammaAudio, setGammaAudio] = useState<GammaAudioState>({
    enabled: false,
    frequency: 40,
    carrierFrequency: 216,
    mode: 'binaural',
    gammaVolume: 0.35,
    ambientType: 'rain',
    ambientVolume: 0.25,
  });

  const [sessionLogs, setSessionLogs] = useState<FocusSessionLog[]>(() => {
    const saved = localStorage.getItem('procastinot_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'sess_1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        durationMinutes: 25,
        mode: 'focus',
        taskTitle: 'CS161: Dynamic Programming',
        interceptionsEncountered: 0,
        pointsEarned: 50,
        completed: true,
      },
      {
        id: 'sess_2',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        durationMinutes: 50,
        mode: 'focus',
        taskTitle: 'MATH 104 Topology proofs',
        interceptionsEncountered: 1,
        pointsEarned: 100,
        completed: true,
      },
    ];
  });

  // Cross-tab synchronization via BroadcastChannel
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      broadcastRef.current = new BroadcastChannel('procastinot_timer_channel');
      broadcastRef.current.onmessage = (event) => {
        const data = event.data;
        if (data.type === 'SYNC') {
          setTimeRemaining(data.timeRemaining);
          setIsRunning(data.isRunning);
          setMode(data.mode);
        }
      };
    } catch {
      // BroadcastChannel unsupported or restricted
    }

    return () => {
      broadcastRef.current?.close();
    };
  }, []);

  // Update dynamic document title
  useEffect(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const icon = mode === 'focus' ? '🧠' : '☕';
    const label = mode === 'focus' ? 'Focus' : 'Break';

    if (isRunning) {
      document.title = `(${formatted}) ${icon} ${label} | ProcastiNot`;
    } else {
      document.title = `ProcastiNot — Student Focus & Anti-Distraction Platform`;
    }
  }, [timeRemaining, isRunning, mode]);

  // Audio synchronization with timer state
  useEffect(() => {
    if (gammaAudio.enabled) {
      gammaEngine.start(
        gammaAudio.mode,
        gammaAudio.ambientType,
        gammaAudio.gammaVolume,
        gammaAudio.ambientVolume
      );
    } else {
      gammaEngine.stop();
    }
  }, [gammaAudio.enabled, gammaAudio.mode, gammaAudio.ambientType]);

  // Volume slider dynamic sync
  useEffect(() => {
    gammaEngine.setGammaVolume(gammaAudio.gammaVolume);
  }, [gammaAudio.gammaVolume]);

  useEffect(() => {
    gammaEngine.setAmbientVolume(gammaAudio.ambientVolume);
  }, [gammaAudio.ambientVolume]);

  const completeCurrentSession = useCallback(() => {
    setIsRunning(false);
    gammaEngine.stop();
    gammaEngine.playChime('complete');

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
      });
    } catch {}

    const durationMins = Math.round(totalDuration / 60);
    const points = mode === 'focus' ? durationMins + 25 : 5;

    const newLog: FocusSessionLog = {
      id: `sess_${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMinutes: durationMins,
      mode,
      taskTitle: selectedTaskTitle,
      interceptionsEncountered: 0,
      pointsEarned: points,
      completed: true,
    };

    setSessionLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('procastinot_sessions', JSON.stringify(updated));
      return updated;
    });

    if (onSessionComplete) {
      onSessionComplete(newLog);
    }

    // Switch mode automatically
    if (mode === 'focus') {
      const nextMode = 'short_break';
      setMode(nextMode);
      const nextDuration = activePreset.breakMinutes * 60;
      setTotalDuration(nextDuration);
      setTimeRemaining(nextDuration);
    } else {
      const nextMode = 'focus';
      setMode(nextMode);
      const nextDuration = activePreset.focusMinutes * 60;
      setTotalDuration(nextDuration);
      setTimeRemaining(nextDuration);
    }
  }, [mode, totalDuration, selectedTaskTitle, onSessionComplete, activePreset]);

  // Main countdown tick interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeCurrentSession();
            return 0;
          }
          const next = prev - 1;
          broadcastRef.current?.postMessage({
            type: 'SYNC',
            timeRemaining: next,
            isRunning: true,
            mode,
          });
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, mode, completeCurrentSession]);

  const startTimer = () => {
    gammaEngine.playChime('start');
    setIsRunning(true);
    broadcastRef.current?.postMessage({
      type: 'SYNC',
      timeRemaining,
      isRunning: true,
      mode,
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    broadcastRef.current?.postMessage({
      type: 'SYNC',
      timeRemaining,
      isRunning: false,
      mode,
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = (mode === 'focus' ? activePreset.focusMinutes : activePreset.breakMinutes) * 60;
    setTimeRemaining(duration);
    setTotalDuration(duration);
    broadcastRef.current?.postMessage({
      type: 'SYNC',
      timeRemaining: duration,
      isRunning: false,
      mode,
    });
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('short_break');
      const breakSecs = activePreset.breakMinutes * 60;
      setTotalDuration(breakSecs);
      setTimeRemaining(breakSecs);
    } else {
      setMode('focus');
      const focusSecs = activePreset.focusMinutes * 60;
      setTotalDuration(focusSecs);
      setTimeRemaining(focusSecs);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    let mins = activePreset.focusMinutes;
    if (newMode === 'short_break') mins = activePreset.breakMinutes;
    if (newMode === 'long_break') mins = activePreset.breakMinutes * 3;
    const secs = mins * 60;
    setTotalDuration(secs);
    setTimeRemaining(secs);
  };

  const selectPreset = (preset: TimerPreset) => {
    setActivePreset(preset);
    setIsRunning(false);
    const secs = (mode === 'focus' ? preset.focusMinutes : preset.breakMinutes) * 60;
    setTotalDuration(secs);
    setTimeRemaining(secs);
  };

  const setCustomDuration = (focusMins: number, breakMins: number) => {
    const custom: TimerPreset = {
      id: `custom_${Date.now()}`,
      name: `Custom ${focusMins}/${breakMins}`,
      focusMinutes: focusMins,
      breakMinutes: breakMins,
      tag: 'Custom',
    };
    setPresets(prev => [custom, ...prev.filter(p => !p.id.startsWith('custom'))]);
    selectPreset(custom);
  };

  const updateGammaSettings = (updates: Partial<GammaAudioState>) => {
    gammaEngine.initContext();
    setGammaAudio(prev => ({ ...prev, ...updates }));
  };

  const toggleGammaAudio = () => {
    gammaEngine.initContext();
    setGammaAudio(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeRemaining,
        totalDuration,
        isRunning,
        activePreset,
        presets,
        gammaAudio,
        sessionLogs,
        selectedTaskTitle,
        setSelectedTaskTitle,
        startTimer,
        pauseTimer,
        resetTimer,
        skipSession,
        switchMode,
        selectPreset,
        setCustomDuration,
        updateGammaSettings,
        toggleGammaAudio,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
