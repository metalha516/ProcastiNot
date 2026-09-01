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
    <div className="stitch-card rounded-2xl p-6 border border-violet-500/20 bg-gradient-to-b from-[#191a1f] to-[#14151a]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border transition-colors ${
            gammaAudio.enabled
              ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
              : 'bg-neutral-800/60 border-neutral-700/50 text-neutral-400'
          }`}>
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">40 Hz Gamma Wave Audio Engine</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Neural Entrainment
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Synchronizes prefrontal cortical oscillations to enhance working memory and sustained concentration.
            </p>
          </div>
        </div>

        {/* Master Audio Toggle */}
        <button
          type="button"
          onClick={toggleGammaAudio}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            gammaAudio.enabled
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
          }`}
        >
          {gammaAudio.enabled ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Audio Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Mode Selector: Binaural vs Isochronic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => updateGammaSettings({ mode: 'binaural' })}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            gammaAudio.mode === 'binaural'
              ? 'bg-violet-500/10 border-violet-500/40 text-white'
              : 'bg-[#121316] border-white/5 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-violet-300">Binaural Beats (Headphones)</span>
            <Radio className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Plays 216 Hz (left) and 256 Hz (right). Brain derives 40 Hz phase delta.
          </p>
        </button>

        <button
          type="button"
          onClick={() => updateGammaSettings({ mode: 'isochronic' })}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            gammaAudio.mode === 'isochronic'
              ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
              : 'bg-[#121316] border-white/5 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-cyan-300">Isochronic Pulses (Speakers/Any)</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Rhythmic 40 Hz amplitude modulation. Effective without stereo isolation.
          </p>
        </button>
      </div>

      {/* Layerable Soundscapes */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
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
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSel
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-[#121316] border-white/5 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-violet-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Volume Mixers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#121316] p-4 rounded-xl border border-white/5">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-neutral-300">40 Hz Gamma Tone</span>
            <span className="font-mono text-violet-400">{Math.round(gammaAudio.gammaVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gammaAudio.gammaVolume}
            onChange={e => updateGammaSettings({ gammaVolume: parseFloat(e.target.value) })}
            className="w-full accent-violet-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-neutral-300">Ambient Background</span>
            <span className="font-mono text-cyan-400">{Math.round(gammaAudio.ambientVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gammaAudio.ambientVolume}
            onChange={e => updateGammaSettings({ ambientVolume: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Pulse visualizer bar */}
      {gammaAudio.enabled && isRunning && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-violet-600 to-cyan-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(6, Math.sin(i + Date.now() / 200) * 18 + 12)}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <span className="ml-2 text-[11px] font-mono text-neutral-400">
            40 Hz Carrier Active
          </span>
        </div>
      )}
    </div>
  );
};
