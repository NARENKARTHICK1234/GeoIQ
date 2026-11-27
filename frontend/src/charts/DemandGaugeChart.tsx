import React from 'react';

interface DemandGaugeProps {
  value: number; // e.g. 32
  label?: string;
  max?: number;
}

export const DemandGaugeChart: React.FC<DemandGaugeProps> = ({
  value = 32,
  label = "High Demand Low Presence Areas",
  max = 50
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  // Half-circle circumference: π * r. If r = 70, stroke-dasharray = 220
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center h-[200px]">
      <div className="relative w-[180px] h-[105px] overflow-hidden flex items-end justify-center">
        <svg className="w-[180px] h-[180px] -rotate-90 origin-center" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
            High Demand
          </span>
          <span className="text-3xl font-extrabold font-display text-white tracking-tight text-glow-cyan">
            {value}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-300 mt-2">{label}</p>
    </div>
  );
};
