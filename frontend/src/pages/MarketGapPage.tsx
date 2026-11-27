import React, { useState, useEffect } from 'react'
import { Target, MapPin, Store, TrendingUp, Zap } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const gapTrend = Array.from({ length: 6 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun'][i], gap: 60 + i * 4 + Math.random() * 3 }))
const regionalGaps = [
  { region: 'West (MH, GJ)', gap: 32.8, color: '#7C3AED' },
  { region: 'South (TN, KA)', gap: 24.1, color: '#22D3EE' },
  { region: 'North (UP, DL)', gap: 18.6, color: '#10B981' },
  { region: 'East (WB, OD)', gap: 13.9, color: '#F59E0B' },
  { region: 'Central (MP, CG)', gap: 10.6, color: '#D946EF' },
]
const quadrantData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 250, y: Math.random() * 100,
  type: Math.random() > 0.5 ? 'gap' : 'covered',
  name: `Location ${i + 1}`,
}))
const coverageDonut = [
  { name: 'High Demand Low Coverage', value: 41.5, color: '#D946EF' },
  { name: 'High Demand Good Coverage', value: 28.6, color: '#7C3AED' },
  { name: 'Low Demand', value: 18.9, color: '#64748b' },
  { name: 'Others', value: 11.0, color: '#334155' },
]
const topGaps = [
  { rank: 1, location: 'Coimbatore, TN', demand: '₹3.42 Cr', presence: 0.18, score: 96.4 },
  { rank: 2, location: 'Visakhapatnam, AP', demand: '₹2.87 Cr', presence: 0.21, score: 94.1 },
  { rank: 3, location: 'Nagpur, MH', demand: '₹2.61 Cr', presence: 0.24, score: 92.7 },
  { rank: 4, location: 'Lucknow, UP', demand: '₹2.48 Cr', presence: 0.26, score: 91.9 },
  { rank: 5, location: 'Bhubaneswar, OD', demand: '₹2.21 Cr', presence: 0.28, score: 90.6 },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></p>)}
    </div>
  ) : null

export default function MarketGapPage() {
  const [gapData, setGapData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMarketGap().then(d => { setGapData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Demand', value: loading ? '...' : `₹${((gapData?.total_demand || 584000000) / 10000000).toFixed(1)} Cr`, change: '+24.7%', positive: true, icon: Target, color: 'purple' },
    { title: 'Existing Stores', value: loading ? '...' : (gapData?.total_stores || 1248).toLocaleString(), change: '+8.3%', positive: true, icon: Store, color: 'cyan' },
    { title: 'High-Demand Areas', value: loading ? '...' : (gapData?.high_demand_areas || 162).toString(), change: '+31.7%', positive: true, icon: MapPin, color: 'magenta' },
    { title: 'Market Gap Score', value: loading ? '...' : `${(gapData?.market_gap_score || 78.6).toFixed(1)}/100`, change: '', positive: true, icon: TrendingUp, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Market Gap Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Identify high-demand regions with low store presence to find optimal expansion opportunities.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Gap Map */}
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Demand vs Store Coverage</h2>
            <p className="text-slate-500 text-xs mt-0.5">Market gap heatmap across regions</p>
          </div>
          <div className="h-[380px]">
            <InteractiveMap mode="marketgap" height="380px" />
          </div>
          {/* Legend */}
          <div className="p-3 border-t border-white/5 flex items-center gap-4 flex-wrap text-xs text-slate-500">
            {[
              { color: '#10B981', label: 'Top Expansion Opportunity' },
              { color: '#7C3AED', label: 'Existing Store' },
              { color: '#ef4444', label: 'High Demand + Low Coverage (Market Gap)' },
              { color: '#22D3EE', label: 'High Demand + High Coverage' },
              { color: '#334155', label: 'Low Demand Area' },
            ].map(l => <div key={l.label} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: l.color }} />{l.label}</div>)}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Gap by Region */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Market Gap by Region</h3>
            <div className="space-y-2.5">
              {regionalGaps.map(r => (
                <div key={r.region} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{r.region}</span><span className="text-white font-medium">{r.gap}%</span></div>
                    <div className="h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full" style={{ width: `${r.gap}%`, background: r.color }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand vs Presence Quadrant */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-2">Demand vs Presence (Quadrant)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis type="number" dataKey="x" name="Store Presence" domain={[0, 250]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} label={{ value: 'Store Presence (Per 100K)', position: 'insideBottom', fill: '#64748b', fontSize: 9, dy: 10 }} />
                <YAxis type="number" dataKey="y" name="Demand Index" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={125} stroke="#ffffff20" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="#ffffff20" strokeDasharray="3 3" />
                <Scatter data={quadrantData.filter(d => d.type === 'gap')} fill="#D946EF" opacity={0.7} />
                <Scatter data={quadrantData.filter(d => d.type === 'covered')} fill="#22D3EE" opacity={0.4} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Coverage Donut */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Demand vs Store Coverage</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D946EF" strokeWidth="3.8" strokeDasharray="41.5 58.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-sm">162</span></div>
              </div>
              <div className="flex-1 space-y-1">
                {coverageDonut.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-400 flex-1">{d.name}</span>
                    <span className="text-white font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gap Trend */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            Market Gap Trend
            <span className="ml-auto text-emerald-400 text-sm font-normal">↑ +18.2% Market Gap Increase</span>
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={gapTrend}>
              <defs><linearGradient id="gg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D946EF" stopOpacity={0.3} /><stop offset="100%" stopColor="#D946EF" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gap" stroke="#D946EF" fill="url(#gg1)" strokeWidth={2} dot={false} name="Gap Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Gap Locations */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold">Top Market Gap Locations</h3>
            <button className="text-xs text-purple-400 hover:text-purple-300">View All →</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{['#','Location','Demand ↑','Presence','Score'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {topGaps.map(g => (
                <tr key={g.rank} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-slate-500 text-xs">{g.rank}</td>
                  <td className="px-4 py-3 text-white text-xs font-medium">{g.location}</td>
                  <td className="px-4 py-3 text-emerald-400 text-xs">{g.demand}</td>
                  <td className="px-4 py-3 text-xs"><div className="w-16 h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full bg-purple-500" style={{ width: `${g.presence * 100}%` }} /></div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">{g.score}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { val: '162', label: 'Expansion Areas', desc: 'High demand with insufficient store coverage.', color: 'purple' },
          { val: '41.5%', label: '% Demand Gap', desc: 'Market demand not met by existing stores.', color: 'magenta' },
          { val: 'West & South', label: 'Top Opportunity', desc: 'Highest expansion potential (56.9% of total gap).', color: 'cyan' },
        ].map(i => (
          <div key={i.label} className={`rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4 flex items-center gap-4`}>
            <div>
              <p className="text-2xl font-bold text-white font-display">{i.val}</p>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">{i.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
