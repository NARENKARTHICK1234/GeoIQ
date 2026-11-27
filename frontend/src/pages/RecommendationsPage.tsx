import React, { useState, useEffect } from 'react'
import { MapPin, TrendingUp, DollarSign, Zap, Star, CheckCircle } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const topRecs = [
  {
    rank: 1, location: 'Coimbatore', state: 'Tamil Nadu', storeType: 'Flagship',
    score: 96.4, demandScore: 94, popScore: 85, competitionScore: 92, revenueScore: 88,
    estRevenue: '₹8.4 Cr', paybackYears: 2.1, investmentReq: '₹2.2 Cr',
    rationale: 'High electronics demand, low competitor density, strong 25-45 age demographic. South Tamil Nadu hub with rail connectivity.',
    tags: ['High Demand', 'Low Competition', 'Strong Demographics'],
  },
  {
    rank: 2, location: 'Visakhapatnam', state: 'Andhra Pradesh', storeType: 'Flagship',
    score: 94.1, demandScore: 91, popScore: 82, competitionScore: 88, revenueScore: 85,
    estRevenue: '₹7.8 Cr', paybackYears: 2.3, investmentReq: '₹2.0 Cr',
    rationale: 'Port city with growing IT sector, increasing disposable income. Strong fashion and electronics demand projected.',
    tags: ['Port City', 'IT Hub', 'Growing Income'],
  },
  {
    rank: 3, location: 'Nagpur', state: 'Maharashtra', storeType: 'Standard',
    score: 92.7, demandScore: 88, popScore: 90, competitionScore: 80, revenueScore: 82,
    estRevenue: '₹6.9 Cr', paybackYears: 2.5, investmentReq: '₹1.8 Cr',
    rationale: 'Central India logistics hub, large catchment area. Home & Living and Grocery segments show above-average demand.',
    tags: ['Logistics Hub', 'Central India', 'Catchment Area'],
  },
]

const paybackData = topRecs.map(r => ({
  location: r.location,
  payback: r.paybackYears,
  revenue: parseFloat(r.estRevenue.replace('₹', '').replace(' Cr', '')),
}))

const radarData = (rec: typeof topRecs[0]) => [
  { subject: 'Demand', value: rec.demandScore },
  { subject: 'Competition', value: rec.competitionScore },
  { subject: 'Population', value: rec.popScore },
  { subject: 'Revenue', value: rec.revenueScore },
  { subject: 'Growth', value: Math.round((rec.score + rec.demandScore) / 2) },
  { subject: 'Access', value: Math.round(rec.popScore * 0.9) },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>)}
    </div>
  ) : null

export default function RecommendationsPage() {
  const [selected, setSelected] = useState(0)
  const [recData, setRecData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getRecommendations().then(d => { setRecData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Top Recommendations', value: loading ? '...' : (recData?.total_recommendations || 10).toString(), change: 'AI-Scored', positive: true, icon: Star, color: 'purple' },
    { title: 'Est. Total Revenue', value: '₹68 Cr', change: 'If all opened', positive: true, icon: DollarSign, color: 'emerald' },
    { title: 'Avg Payback Period', value: '2.3 yrs', change: '-0.4 yrs', positive: true, icon: TrendingUp, color: 'cyan' },
    { title: 'Avg Opportunity Score', value: loading ? '...' : `${(recData?.avg_score || 94.4).toFixed(1)}`, change: '+2.1', positive: true, icon: Zap, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Intelligence / Location Recommendations</div>
        <h1 className="text-2xl font-bold font-display text-white">Location Recommendations</h1>
        <p className="text-slate-400 text-sm mt-1">AI-scored top expansion site recommendations with detailed rationale, financial projections, and comparison analysis.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      {/* Top 3 Cards */}
      <div className="grid lg:grid-cols-3 gap-5">
        {topRecs.map((rec, i) => (
          <div key={rec.rank} onClick={() => setSelected(i)}
            className={`rounded-2xl backdrop-blur-md border p-5 cursor-pointer transition-all ${selected === i ? 'bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-[#11162B]/80 border-white/10 hover:border-white/20'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">#{rec.rank}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{rec.location}</p>
                  <p className="text-slate-500 text-xs">{rec.state}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-bold text-lg">{rec.score}</p>
                <p className="text-slate-500 text-xs">Score</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-xs text-slate-500">Est. Revenue</p>
                <p className="text-sm text-emerald-400 font-semibold">{rec.estRevenue}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-xs text-slate-500">Payback Period</p>
                <p className="text-sm text-amber-400 font-semibold">{rec.paybackYears} yrs</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rec.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-500/20">{t}</span>)}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>
          </div>
        ))}
      </div>

      {/* Detail view for selected */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Recommended Sites Map</h2>
            <p className="text-slate-500 text-xs">Top 10 AI-scored expansion locations</p>
          </div>
          <div className="h-[380px]">
            <InteractiveMap mode="recommendations" height="380px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Radar for selected */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-2">Score Breakdown – {topRecs[selected].location}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData(topRecs[selected])}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Payback Period Chart */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Payback Period Comparison</h3>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={paybackData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="location" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="payback" fill="#F59E0B" radius={[0, 3, 3, 0]} name="Payback (yrs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Investment Details */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Investment Summary – {topRecs[selected].location}</h3>
            <div className="space-y-2">
              {[
                { label: 'Store Type', val: topRecs[selected].storeType },
                { label: 'Investment Required', val: topRecs[selected].investmentReq },
                { label: 'Est. Annual Revenue', val: topRecs[selected].estRevenue },
                { label: 'Payback Period', val: `${topRecs[selected].paybackYears} years` },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500">{r.label}</span>
                  <span className="text-xs text-white font-medium">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data. Recommendations are based on modeled scores, not real market research.</p>
    </div>
  )
}
