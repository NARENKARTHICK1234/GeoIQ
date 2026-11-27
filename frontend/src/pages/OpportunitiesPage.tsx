import React, { useState, useEffect } from 'react'
import { Target, MapPin, TrendingUp, Zap, ArrowUpRight } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'
import { Link } from 'react-router-dom'

const candidates = [
  { rank: 1, location: 'Coimbatore', state: 'Tamil Nadu', demand: 94, competition: 18, population: 2.1, score: 96.4, opportunity: 'High' },
  { rank: 2, location: 'Visakhapatnam', state: 'Andhra Pradesh', demand: 91, competition: 22, population: 2.0, score: 94.1, opportunity: 'High' },
  { rank: 3, location: 'Nagpur', state: 'Maharashtra', demand: 88, competition: 25, population: 2.4, score: 92.7, opportunity: 'High' },
  { rank: 4, location: 'Lucknow', state: 'Uttar Pradesh', demand: 85, competition: 28, population: 3.5, score: 91.2, opportunity: 'High' },
  { rank: 5, location: 'Bhubaneswar', state: 'Odisha', demand: 82, competition: 20, population: 1.0, score: 89.8, opportunity: 'High' },
  { rank: 6, location: 'Indore', state: 'Madhya Pradesh', demand: 80, competition: 32, population: 2.2, score: 87.5, opportunity: 'Medium' },
  { rank: 7, location: 'Kochi', state: 'Kerala', demand: 78, competition: 35, population: 2.1, score: 85.2, opportunity: 'Medium' },
  { rank: 8, location: 'Chandigarh', state: 'Punjab', demand: 75, competition: 30, population: 1.1, score: 83.1, opportunity: 'Medium' },
]

const topRadar = [
  { subject: 'Demand', A: 94, B: 91, C: 88 },
  { subject: 'Low Comp.', A: 82, B: 78, C: 75 },
  { subject: 'Population', A: 70, B: 65, C: 80 },
  { subject: 'Revenue Pot.', A: 88, B: 84, C: 76 },
  { subject: 'Growth Rate', A: 92, B: 86, C: 80 },
  { subject: 'Accessibility', A: 76, B: 72, C: 84 },
]

const badgeColor = (val: string) => {
  if (val === 'High') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
}

const CustomTooltip = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>)}
    </div>
  ) : null

export default function OpportunitiesPage() {
  const [oppData, setOppData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getExpansionOpportunities().then(d => { setOppData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Opportunities', value: loading ? '...' : (oppData?.total || 97).toString(), change: '+12', positive: true, icon: Target, color: 'purple' },
    { title: 'High Priority', value: loading ? '...' : (oppData?.high_priority || 32).toString(), change: '+8', positive: true, icon: Zap, color: 'magenta' },
    { title: 'Avg Opportunity Score', value: loading ? '...' : (oppData?.avg_score || 78.6).toFixed(1), change: '+3.2', positive: true, icon: TrendingUp, color: 'cyan' },
    { title: 'Est. Revenue Potential', value: '₹48 Cr', change: '+14.8%', positive: true, icon: MapPin, color: 'emerald' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Analysis / Expansion Opportunities</div>
        <h1 className="text-2xl font-bold font-display text-white">Expansion Opportunities</h1>
        <p className="text-slate-400 text-sm mt-1">Ranked expansion candidates based on demand, competition, population, and revenue potential scores.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Opportunity Map</h2>
            <p className="text-slate-500 text-xs">Marker size = opportunity score; green = high priority</p>
          </div>
          <div className="h-[400px]">
            <InteractiveMap mode="opportunities" height="400px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Radar Chart */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-2">Top 3 Candidates Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={topRadar}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Coimbatore" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
                <Radar name="Vizag" dataKey="B" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.15} />
                <Radar name="Nagpur" dataKey="C" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 justify-center mt-2">
              {[{ label: 'Coimbatore', color: '#7C3AED' }, { label: 'Vizag', color: '#22D3EE' }, { label: 'Nagpur', color: '#10B981' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full" style={{ background: l.color }} /><span className="text-slate-400">{l.label}</span></div>
              ))}
            </div>
          </div>

          {/* Demand vs Competition Scatter */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-2">Demand vs Competition</h3>
            <ResponsiveContainer width="100%" height={160}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis type="number" dataKey="competition" name="Competition" domain={[0, 50]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="demand" name="Demand Score" domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={candidates} fill="#A855F7" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Opportunity Table */}
      <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> All Expansion Candidates (Top 8)</h3>
          <Link to="/recommendations" className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300">View Recommendations <ArrowUpRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{['Rank','Location','State','Demand Score','Competition','Population (M)','Opportunity Score','Priority'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.rank} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-purple-400 font-bold">#{c.rank}</td>
                  <td className="px-4 py-3 text-white font-medium">{c.location}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.state}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full bg-purple-500" style={{ width: `${c.demand}%` }} /></div><span className="text-xs text-white">{c.demand}</span></div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{c.competition}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{c.population}M</td>
                  <td className="px-4 py-3"><span className="text-cyan-400 font-bold text-sm">{c.score}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor(c.opportunity)}`}>{c.opportunity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
