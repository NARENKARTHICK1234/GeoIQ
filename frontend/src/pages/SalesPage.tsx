import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Store, Users, Download, RefreshCw } from 'lucide-react'
import { 
  BarChart, Bar, AreaChart, Area, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const statesData = [
  { state: 'MH', name: 'Maharashtra', revenue: 22.8, growth: 16.8, stores: 28 },
  { state: 'TN', name: 'Tamil Nadu', revenue: 18.9, growth: 17.1, stores: 24 },
  { state: 'UP', name: 'Uttar Pradesh', revenue: 16.4, growth: 13.9, stores: 20 },
  { state: 'KA', name: 'Karnataka', revenue: 14.3, growth: 14.2, stores: 19 },
  { state: 'WB', name: 'West Bengal', revenue: 12.7, growth: 10.7, stores: 16 },
  { state: 'RJ', name: 'Rajasthan', revenue: 10.4, growth: 15.4, stores: 13 },
  { state: 'GJ', name: 'Gujarat', revenue: 9.8, growth: 12.1, stores: 12 },
  { state: 'MP', name: 'Madhya Pradesh', revenue: 8.6, growth: 11.3, stores: 10 },
  { state: 'DL', name: 'Delhi', revenue: 8.2, growth: 9.5, stores: 9 },
  { state: 'PB', name: 'Punjab', revenue: 6.4, growth: 12.1, stores: 8 },
]

const trendData = [
  { month: 'Jan', revenue: 85 }, { month: 'Feb', revenue: 92 }, { month: 'Mar', revenue: 88 },
  { month: 'Apr', revenue: 105 }, { month: 'May', revenue: 115 }, { month: 'Jun', revenue: 110 },
  { month: 'Jul', revenue: 125 }, { month: 'Aug', revenue: 118 }, { month: 'Sep', revenue: 130 },
  { month: 'Oct', revenue: 142 }, { month: 'Nov', revenue: 155 }, { month: 'Dec', revenue: 165 },
]

const categoryData = [
  { name: 'Electronics', size: 28.4, fill: '#7C3AED' },
  { name: 'Fashion', size: 20.7, fill: '#22D3EE' },
  { name: 'Grocery', size: 18.9, fill: '#10B981' },
  { name: 'Home & Living', size: 14.2, fill: '#F59E0B' },
  { name: 'Health & Beauty', size: 9.8, fill: '#D946EF' },
  { name: 'Others', size: 8.0, fill: '#64748b' },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || '#fff' }}>{p.name}: <span className="text-white font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></p>
      ))}
    </div>
  ) : null

export default function SalesPage() {
  const [metric, setMetric] = useState<'revenue' | 'sales'>('revenue')
  const [salesData, setSalesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSalesByState().then(d => { setSalesData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Revenue', value: '₹124.8 Cr', change: '+14.2%', positive: true, icon: BarChart3, color: 'purple' },
    { title: 'Total Sales', value: '4.21 M', change: '+11.6%', positive: true, icon: TrendingUp, color: 'cyan' },
    { title: 'Active Stores', value: '1,248', change: '+6.9%', positive: true, icon: Store, color: 'emerald' },
    { title: 'Total Customers', value: '3.87 M', change: '+12.3%', positive: true, icon: Users, color: 'violet' },
    { title: 'Profit Margin', value: '18.7%', change: '+2.4pp', positive: true, icon: TrendingUp, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Geospatial Analysis</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Geographic Sales Analysis</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze region-wise sales performance, identify high-growth markets, and uncover expansion opportunities.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setLoading(true); api.getSalesByState().then(d => { setSalesData(d); setLoading(false) }).catch(() => setLoading(false)) }}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      {/* Map + Trend */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">India – Sales Performance by State</h2>
              <p className="text-slate-500 text-xs mt-0.5">Click a state to drill down</p>
            </div>
            <div className="flex items-center gap-2">
              {(['Revenue', 'Sales', 'Customers'] as const).map(m => (
                <button key={m} onClick={() => setMetric(m.toLowerCase() as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${metric === m.toLowerCase() ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[380px]">
            <InteractiveMap mode="choropleth" height="380px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Revenue Trend */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold">Regional Revenue Trend</h3>
              <span className="text-xs text-purple-400">↑ ₹20.4 Cr</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#22D3EE" fill="url(#sg1)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Regions */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Top Performing Regions</h3>
            <div className="space-y-2.5">
              {statesData.slice(0, 5).map((s, i) => (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-300">{s.name}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white">₹{s.revenue} Cr</span>
                        <span className="text-emerald-400">+{s.growth}%</span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${(s.revenue / 25) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Share donut */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Sales Share by Region</h3>
            <div className="grid grid-cols-2 gap-1">
              {[{ label: 'West', val: '28.9%', color: '#7C3AED' }, { label: 'South', val: '24.7%', color: '#22D3EE' }, { label: 'North', val: '18.6%', color: '#10B981' }, { label: 'East', val: '15.2%', color: '#F59E0B' }, { label: 'Central', val: '12.6%', color: '#D946EF' }].map(r => (
                <div key={r.label} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <span className="text-slate-400">{r.label}</span>
                  <span className="text-white font-medium ml-auto">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: State bars + Category treemap */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Revenue by State</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statesData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="state" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {statesData.map((_, i) => <Cell key={i} fill={`hsl(${260 + i * 10}, 70%, ${55 - i * 2}%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Product Category Distribution</h3>
          <div className="space-y-3">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c.fill }} />
                <span className="text-sm text-slate-300 flex-1">{c.name}</span>
                <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.size / 30 * 100}%`, background: c.fill }} />
                  </div>
                  <span className="text-xs text-white w-10 text-right">{c.size}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Key Insight</p>
            <p className="text-slate-400 text-sm mt-1">Maharashtra, Tamil Nadu, and Uttar Pradesh contribute 36.8% of total revenue. High sales growth is also observed in Rajasthan (+15.4%) and Karnataka (+14.2%), indicating strong expansion potential.</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
