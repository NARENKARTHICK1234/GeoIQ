import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface RegionalDonutProps {
  data: Array<{ region: string; share_pct?: number; revenue_cr?: number }>;
  totalSalesCr?: number;
  height?: number;
}

const REGION_COLORS: Record<string, string> = {
  South: '#A855F7',   // Purple
  West: '#22D3EE',    // Cyan
  North: '#2563EB',   // Blue
  East: '#D946EF',    // Magenta
  Central: '#F43F5E'  // Coral Red
};

export const RegionalDonutChart: React.FC<RegionalDonutProps> = ({
  data = [],
  totalSalesCr = 124.8,
  height = 200
}) => {
  const chartData = data.map(d => ({
    name: d.region,
    value: d.share_pct || 20,
    color: REGION_COLORS[d.region] || '#7C3AED',
    revenue: d.revenue_cr
  }));

  return (
    <div className="flex items-center justify-between w-full" style={{ height }}>
      {/* Donut Chart with Center Text */}
      <div className="relative w-1/2 h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={52}
              outerRadius={74}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B1020" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 22, 43, 0.95)',
                borderColor: 'rgba(124, 58, 237, 0.3)',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#F8FAFC'
              }}
              formatter={(val: any, name: any) => [`${val}%`, `${name} Share`]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[13px] font-bold text-white tracking-tight">₹{totalSalesCr} Cr</span>
          <span className="text-[9px] text-slate-400">Total Sales</span>
        </div>
      </div>

      {/* Legend List */}
      <div className="w-1/2 pl-3 space-y-1.5 text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 text-[11px]">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-200 text-[11px]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
