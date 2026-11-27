import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface SalesTrendProps {
  data: Array<{ month: string; revenue_cr?: number; sales_revenue?: number }>;
  height?: number;
}

export const SalesTrendChart: React.FC<SalesTrendProps> = ({ data = [], height = 230 }) => {
  const chartData = data.map(d => ({
    name: d.month.length > 7 ? d.month : (new Date(d.month + '-01').toLocaleString('default', { month: 'short' })),
    revenue: d.revenue_cr !== undefined ? d.revenue_cr : (d.sales_revenue ? +(d.sales_revenue / 10000000).toFixed(1) : 0)
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.12)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
            tickFormatter={(val) => `₹${val} Cr`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 22, 43, 0.95)',
              borderColor: 'rgba(124, 58, 237, 0.3)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#F8FAFC'
            }}
            formatter={(value: any) => [`₹${value} Cr`, 'Sales Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22D3EE"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#salesTrendGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
