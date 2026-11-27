import React, { useState, useEffect } from 'react'
import { Users, MapPin, TrendingUp, Store, Shield } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const brandDist = [
  { name: 'Brand A', stores: 234, share: 23.4, color: '#ef4444' },
  { name: 'Brand B', stores: 198, share: 19.8, color: '#f97316' },
  { name: 'Brand C', stores: 167, share: 16.7, color: '#eab308' },
  { name: 'Brand D', stores: 145, share: 14.5, color: '#22c55e' },
  { name: 'Others', stores: 256, share: 25.6, color: '#64748b' },
]
const typeDist = [
  { name: 'Modern Retail', value: 38.2, color: '#7C3AED' },
  { name: 'E-commerce', value: 24.6, color: '#22D3EE' },
  { name: 'Traditional', value: 20.1, color: '#10B981' },
  { name: 'Specialty', value: 17.1, color: '#F59E0B' },
]
const compVsOurs = [
  { state: 'MH', ours: 28, competitors: 65 }, { state: 'TN', ours: 24, competitors: 52 },
  { state: 'UP', ours: 20, competitors: 48 }, { state: 'KA', ours: 19, competitors: 44 },
  { state: 'WB', ours: 16, competitors: 38 }, { state: 'GJ', ours: 12, competitors: 32 },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>)}
    </div>
  ) : null

export default function CompetitorsPage() {
  const [compData, setCompData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCompetitorAnalysis().then(d => { setCompData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Competitors', value: loading ? '...' : (compData?.total_competitors || 294).toString(), change: '+12.1%', positive: false, icon: Store, color: 'red' },
    { title: 'Markets With Competition', value: loading ? '...' : `${(compData?.markets_with_competition || 78.4).toFixed(1)}%`, change: '+5.2%', positive: false, icon: MapPin, color: 'amber' },
    { title: 'Competitor Brands', value: loading ? '...' : (compData?.competitor_brands || 12).toString(), change: '+2', positive: false, icon: Shield, color: 'purple' },
    { title: 'Uncontested Markets', value: loading ? '...' : `${(compData?.uncontested_markets || 21.6).toFixed(1)}%`, change: '+3.1pp', positive: true, icon: TrendingUp, color: 'emerald' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Analysis / Competitor Analysis</div>
        <h1 className="text-2xl font-bold font-display text-white">Competitor Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Map competitor presence, analyze competitive intensity, and identify low-competition markets for expansion.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Competitor Distribution Map</h2>
            <p className="text-slate-500 text-xs">Competitor locations overlaid with our store network</p>
          </div>
          <div className="h-[400px]">
            <InteractiveMap mode="competitors" height="400px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Brand Distribution */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Competitor Brand Distribution</h3>
            <div className="space-y-2.5">
              {brandDist.map(b => (
                <div key={b.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: b.color }} />
                  <span className="text-xs text-slate-300 flex-1">{b.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full" style={{ width: `${b.share}%`, background: b.color }} /></div>
                    <span className="text-xs text-white w-8 text-right">{b.stores}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Distribution Donut */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Competitor Type Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={100}>
                <PieChart>
                  <Pie data={typeDist} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" stroke="none">
                    {typeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {typeDist.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-400 flex-1">{d.name}</span>
                    <span className="text-white font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competition Intensity */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Our Stores vs Competitors</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={compVsOurs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="state" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ours" fill="#7C3AED" radius={[2, 2, 0, 0]} name="Our Stores" />
                <Bar dataKey="competitors" fill="#ef4444" radius={[2, 2, 0, 0]} name="Competitors" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-5 flex items-start gap-3">
        <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-semibold text-sm">Competitive Landscape Insight</p>
          <p className="text-slate-400 text-sm mt-1">Competitor density is highest in Maharashtra, Tamil Nadu, and Delhi NCR. Tier 2 cities in Rajasthan, Odisha, and Assam show significantly lower competition, presenting prime expansion opportunities for GeoIQ.</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
