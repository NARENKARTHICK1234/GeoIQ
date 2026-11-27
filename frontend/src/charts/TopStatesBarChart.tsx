import React from 'react';

interface StateBarItem {
  state: string;
  revenue?: number;
  revenue_cr?: number;
}

export const TopStatesBarChart: React.FC<{ data: StateBarItem[] }> = ({ data = [] }) => {
  const maxVal = Math.max(...data.map(d => d.revenue_cr || (d.revenue ? d.revenue / 10000000 : 20)), 25);

  return (
    <div className="space-y-3 p-1">
      {data.map((item, idx) => {
        const revCr = item.revenue_cr !== undefined ? item.revenue_cr : +(item.revenue! / 10000000).toFixed(1);
        const pct = Math.min(100, (revCr / maxVal) * 100);

        return (
          <div key={item.state} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">{item.state}</span>
              <span className="font-bold text-white font-display">₹{revCr} Cr</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-cyan-400 transition-all duration-700 shadow-glow-purple"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
