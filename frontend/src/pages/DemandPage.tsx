import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, TrendingUp, Target, ArrowUpRight, Zap } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const demandTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  demand: Math.floor(250000 + Math.sin(i * 0.4) * 60000 + Math.random() * 40000),
}))

const segmentData = [
  { name: 'Electronics', value: 28.4, color: '#7C3AED' },
  { name: 'Fashion', value: 20.7, color: '#22D3EE' },
  { name: 'Grocery', value: 18.9, color: '#10B981' },
  { name: 'Home & Living', value: 14.2, color: '#F59E0B' },
  { name: 'Health & Beauty', value: 9.8, color: '#D946EF' },
  { name: 'Others', value: 8.0, color: '#64748b' },
]

const cityTypeData = [
  { name: 'Metro', value: 42.6, color: '#7C3AED' },
  { name: 'Tier 1', value: 27.3, color: '#22D3EE' },
  { name: 'Tier 2', value: 19.4, color: '#10B981' },
  { name: 'Tier 3', value: 10.7, color: '#F59E0B' },
]

const topDemand = [
  { region: 'Maharashtra', pct: 12.4 },
  { region: 'Tamil Nadu', pct: 10.8 },
  { region: 'Uttar Pradesh', pct: 8.9 },
  { region: 'Karnataka', pct: 8.1 },
  { region: 'Gujarat', pct: 6.7 },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{typeof p.value === 'number' ? (p.value > 10000 ? `${(p.value / 1000).toFixed(0)}K` : p.value.toFixed(1)) : p.value}</span></p>
      ))}
    </div>
  ) : null

export default function DemandPage() {
  const [view, setView] = useState<'heatmap' | 'markers' | 'choropleth'>('heatmap')
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [demandData, setDemandData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDemandAnalysis().then(d => { setDemandData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Demand (Units)', value: loading ? '...' : `${((demandData?.total_demand || 892000) / 100000).toFixed(2)} L`, change: '+14.8%', positive: true, icon: Users, color: 'purple' },
    { title: 'High-Demand Locations', value: loading ? '...' : (demandData?.high_demand_locations || 246).toString(), change: '+18.3%', positive: true, icon: MapPin, color: 'cyan' },
    { title: 'Avg. Demand per Region', value: loading ? '...' : (demandData?.avg_demand_per_region || 3628).toLocaleString(), change: '+11.9%', positive: true, icon: Target, color: 'emerald' },
    { title: 'Demand Growth Rate', value: loading ? '...' : `${(demandData?.demand_growth_rate || 14.8).toFixed(1)}%`, change: '+3.6pp', positive: true, icon: TrendingUp, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Analysis / Customer Demand</div>
        <h1 className="text-2xl font-bold font-display text-white">Customer Demand Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Analyze location-based customer demand, identify high-demand regions, and discover market opportunities for expansion.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-white font-semibold">Demand Density Heatmap – India</h2>
            <div className="flex items-center gap-2">
              {(['Heatmap', 'Markers', 'Choropleth'] as const).map(v => (
                <button key={v} onClick={() => setView(v.toLowerCase() as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${view === v.toLowerCase() ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-b border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Metric</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
                  <option>Customer Demand</option>
                  <option>Revenue Potential</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">State</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
                  <option>All States</option>
                </select>
              </div>
            </div>
          </div>
          <div className="h-[380px]">
            <InteractiveMap mode="heatmap" height="380px" />
          </div>
          {/* Legend */}
          <div className="p-4 border-t border-white/5">
            <p className="text-xs text-slate-500 mb-2">Demand Intensity</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #1a237e, #0d47a1, #1565c0, #0288d1, #26c6da, #00e5ff, #69ff47, #ffea00, #ff6d00, #dd2c00)' }} />
              <div className="flex items-center justify-between w-full max-w-[200px] text-xs text-slate-500">
                <span>Low</span><span>Medium</span><span>High</span><span>Very High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Top demand regions */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Top Demand Regions</h3>
            <div className="space-y-2.5">
              {topDemand.map(r => (
                <div key={r.region} className="flex items-center gap-3">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{r.region}</span>
                      <span className="text-white font-medium">{r.pct}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${r.pct / 15 * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Trend */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold">Demand Trend</h3>
              <div className="flex gap-1">
                {(['Daily', 'Weekly', 'Monthly'] as const).map(t => (
                  <button key={t} onClick={() => setTimeframe(t.toLowerCase() as any)}
                    className={`px-2 py-0.5 rounded text-xs transition-all ${timeframe === t.toLowerCase() ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={demandTrend.slice(0, timeframe === 'daily' ? 30 : timeframe === 'weekly' ? 12 : 7)}>
                <defs>
                  <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D946EF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D946EF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="demand" stroke="#D946EF" fill="url(#dg1)" strokeWidth={2} dot={false} name="demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Donut */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Demand by Segment</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={100}>
                <PieChart>
                  <Pie data={segmentData} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" stroke="none">
                    {segmentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1">
                {segmentData.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-slate-400 flex-1">{s.name}</span>
                    <span className="text-white font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom insight */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Key Insight</p>
            <p className="text-slate-400 text-sm mt-1">High customer demand is observed in Maharashtra, Tamil Nadu, and Uttar Pradesh, with demand growth above the national average.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/20 p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Opportunity</p>
            <p className="text-slate-400 text-sm mt-1">Expand store presence in high-demand but low-coverage cities like Nagpur, Coimbatore, and Lucknow.</p>
            <a href="/opportunities" className="text-xs text-cyan-400 flex items-center gap-1 mt-2 hover:text-cyan-300">
              View Expansion Opportunities <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data. Demand estimates are modeled, not observed sales.</p>
    </div>
  )
}
