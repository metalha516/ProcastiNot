import React from 'react';
import {
  Headphones,
  Volume2,
  VolumeX,
  Radio,
  CloudRain,
  BookOpen,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTimer } from '../../context/TimerContext';

export const GammaWaveControls: React.FC = () => {
  const { gammaAudio, updateGammaSettings, toggleGammaAudio, isRunning } = useTimer();

  return (
    <div className="clay-card rounded-3xl p-6 border border-white/80 dark:border-white/5 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl clay-pill flex items-center justify-center ${
            gammaAudio.enabled
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-400'
          }`}>
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-slate-100">
                40 Hz Gamma Audio Synthesizer
              </h2>
              <span className="font-telemetry-sm px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full clay-pill bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                Neural Soundboard
              </span>
            </div>
            <p className="font-body-md text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Entrains prefrontal cortical oscillations to sustain deep concentration and focus.
            </p>
          </div>
        </div>

        {/* Master Audio Toggle */}
        <button
          type="button"
          onClick={toggleGammaAudio}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-telemetry-sm text-xs font-bold transition-all cursor-pointer ${
            gammaAudio.enabled
              ? 'clay-btn-primary text-white shadow-md'
              : 'clay-btn-light text-slate-600 dark:text-slate-400'
          }`}
        >
          {gammaAudio.enabled ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>AUDIO ACTIVE</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Mode Selector: Binaural vs Isochronic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => updateGammaSettings({ mode: 'binaural' })}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
            gammaAudio.mode === 'binaural'
              ? 'clay-card-subtle border-2 border-orange-500/50'
              : 'clay-inset border border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-headline-sm text-xs font-extrabold text-slate-900 dark:text-slate-100">
              Binaural Beats (Headphones)
            </span>
            <Radio className="w-4 h-4 text-orange-500" />
          </div>
          <p className="font-body-md text-[11px] text-slate-500 font-medium leading-relaxed">
            Plays 216 Hz (left) and 256 Hz (right). Brain derives 40 Hz phase delta.
          </p>
        </button>

        <button
          type="button"
          onClick={() => updateGammaSettings({ mode: 'isochronic' })}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
            gammaAudio.mode === 'isochronic'
              ? 'clay-card-subtle border-2 border-indigo-500/50'
              : 'clay-inset border border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-headline-sm text-xs font-extrabold text-slate-900 dark:text-slate-100">
              Isochronic Pulses (Speakers/Any)
            </span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="font-body-md text-[11px] text-slate-500 font-medium leading-relaxed">
            Rhythmic 40 Hz amplitude modulation. Effective without headphone isolation.
          </p>
        </button>
      </div>

      {/* Layerable Soundscapes */}
      <div className="mb-5">
        <label className="block font-telemetry-sm text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Layered Focus Soundscapes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'none', label: 'Pure Gamma', icon: Sparkles },
            { id: 'rain', label: 'Rain Shower', icon: CloudRain },
            { id: 'pink', label: 'Pink Noise', icon: Radio },
            { id: 'brown', label: 'Brown Noise', icon: Sliders },
            { id: 'library', label: 'Study Cafe', icon: BookOpen },
          ].map(item => {
            const Icon = item.icon;
            const isSel = gammaAudio.ambientType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateGammaSettings({ ambientType: item.id as any })}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-telemetry-sm text-xs font-bold transition-all cursor-pointer ${
                  isSel
                    ? 'clay-btn-primary text-white'
                    : 'clay-pill text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Volume Mixers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 clay-inset p-4 rounded-2xl border border-white/60 dark:border-white/5">
        <div>
          <div className="flex justify-between font-telemetry-sm text-xs mb-1.5 font-bold">
            <span className="text-slate-700 dark:text-slate-300">40 Hz Gamma Tone</span>
            <span className="text-orange-600 dark:text-orange-400">{Math.round(gammaAudio.gammaVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gammaAudio.gammaVolume}
            onChange={e => updateGammaSettings({ gammaVolume: parseFloat(e.target.value) })}
            className="w-full accent-orange-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-telemetry-sm text-xs mb-1.5 font-bold">
            <span className="text-slate-700 dark:text-slate-300">Ambient Background</span>
            <span className="text-indigo-600 dark:text-indigo-400">{Math.round(gammaAudio.ambientVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gammaAudio.ambientVolume}
            onChange={e => updateGammaSettings({ ambientVolume: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Pulse Visualizer Bar */}
      {gammaAudio.enabled && isRunning && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-orange-500 to-emerald-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(6, Math.sin(i + Date.now() / 200) * 18 + 12)}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <span className="ml-2 font-telemetry-sm text-[11px] text-slate-500 font-bold">
            40 Hz Carrier Wave Active
          </span>
        </div>
      )}
    </div>
  );
};

