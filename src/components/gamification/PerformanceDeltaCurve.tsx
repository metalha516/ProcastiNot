import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Info, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { DailyPerformanceDelta } from '../../types';

export const PerformanceDeltaCurve: React.FC = () => {
  const { deltaHistory } = useGamification();
  const [selectedPoint, setSelectedPoint] = useState<DailyPerformanceDelta>(
    deltaHistory[deltaHistory.length - 1]
  );

  // SVG dimensions for chart
  const width = 600;
  const height = 180;
  const padding = 30;

  const minScore = 60;
  const maxScore = 100;

  const points = deltaHistory.map((d, index) => {
    const x = padding + (index / (deltaHistory.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.performanceScore - minScore) / (maxScore - minScore)) * (height - 2 * padding);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const latestDelta = deltaHistory[deltaHistory.length - 1].deltaPercentage;
  const isTrendingUp = latestDelta >= 0;

  return (
    <div className="stitch-card rounded-2xl p-6 border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Daily Performance Delta Curve</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Linear focus velocity modeling day-over-day changes in focus consistency, task throughput, and impulse defense.
          </p>
        </div>

        {/* Velocity Pill */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
          isTrendingUp
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {isTrendingUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isTrendingUp ? `+${latestDelta}%` : `${latestDelta}%`} Trajectory</span>
        </div>
      </div>

      {/* SVG Delta Trend Curve */}
      <div className="bg-[#121316] rounded-xl p-4 border border-white/5 relative">
        <div className="w-full h-48">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="deltaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[70, 80, 90, 100].map(score => {
              const y = height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
              return (
                <g key={score}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <text x={padding - 6} y={y + 3} fill="#52525b" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {score}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            <path d={areaD} fill="url(#deltaGradient)" />

            {/* Main Trend Line */}
            <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Data Points */}
            {points.map((p, idx) => {
              const isSel = selectedPoint.date === p.data.date;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => setSelectedPoint(p.data)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSel ? 6 : 4}
                    fill={isSel ? '#06B6D4' : '#191a1f'}
                    stroke="#06B6D4"
                    strokeWidth={isSel ? 3 : 2}
                    className="transition-all hover:r-6"
                  />
                  {/* Date labels */}
                  <text x={p.x} y={height - 10} fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {p.data.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Day Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121316] p-3.5 rounded-xl border border-white/5">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Focus Time</span>
          <span className="text-base font-bold text-white font-mono mt-0.5 block">
            {selectedPoint.focusHours} Hours
          </span>
        </div>

        <div className="bg-[#121316] p-3.5 rounded-xl border border-white/5">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Tasks Cleared</span>
          <span className="text-base font-bold text-violet-400 font-mono mt-0.5 block">
            {selectedPoint.tasksCompleted} Tasks
          </span>
        </div>

        <div className="bg-[#121316] p-3.5 rounded-xl border border-white/5">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Impulses Resisted</span>
          <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
            {selectedPoint.distractionsAvoided} Blocked
          </span>
        </div>

        <div className="bg-[#121316] p-3.5 rounded-xl border border-white/5">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Performance Index</span>
          <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
            {selectedPoint.performanceScore}/100
          </span>
        </div>
      </div>

      {/* Formula note */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono pt-1">
        <Info className="w-3.5 h-3.5 text-neutral-400" />
        <span>Formula: Efficiency = (Focus Mins × 0.5) + (Tasks × 10) - (Unchecked Distractions × 15)</span>
      </div>
    </div>
  );
};
