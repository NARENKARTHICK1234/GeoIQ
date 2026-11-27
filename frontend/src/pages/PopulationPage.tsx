import React, { useState, useEffect } from 'react'
import { Users, MapPin, TrendingUp, DollarSign } from 'lucide-react'
import { BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const urbanRuralData = [
  { type: 'Metro', population: 42, purchasing: 55, color: '#7C3AED' },
  { type: 'Tier 1', population: 28, purchasing: 27, color: '#22D3EE' },
  { type: 'Tier 2', population: 18, purchasing: 13, color: '#10B981' },
  { type: 'Tier 3', population: 12, purchasing: 5, color: '#F59E0B' },
]
const popDemandScatter = Array.from({ length: 30 }, (_, i) => ({
  population: Math.random() * 20 + 1,
  demand: Math.random() * 100 + 20,
  state: ['MH', 'TN', 'UP', 'KA', 'WB', 'GJ', 'RJ'][Math.floor(Math.random() * 7)],
}))
const statePopulation = [
  { state: 'UP', pop: 23.4, potential: 78 }, { state: 'MH', pop: 12.5, potential: 92 },
  { state: 'WB', pop: 10.2, potential: 68 }, { state: 'TN', pop: 7.9, potential: 85 },
  { state: 'GJ', pop: 7.1, potential: 72 }, { state: 'KA', pop: 6.7, potential: 88 },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label || payload[0]?.payload?.state}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></p>)}
    </div>
  ) : null

export default function PopulationPage() {
  const [popData, setPopData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPopulationAnalysis().then(d => { setPopData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Population Covered', value: '1.4 Billion', change: 'India', positive: true, icon: Users, color: 'purple' },
    { title: 'Urban Coverage', value: loading ? '...' : `${(popData?.urban_coverage || 68.4).toFixed(1)}%`, change: '+3.2pp', positive: true, icon: MapPin, color: 'cyan' },
    { title: 'Avg Purchasing Power', value: loading ? '...' : `₹${(popData?.avg_purchasing_power || 48200).toLocaleString()}`, change: '+8.1%', positive: true, icon: DollarSign, color: 'emerald' },
    { title: 'Pop-Demand Correlation', value: loading ? '...' : (popData?.pop_demand_correlation || 0.78).toFixed(2), change: 'Strong', positive: true, icon: TrendingUp, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Analysis / Population Analysis</div>
        <h1 className="text-2xl font-bold font-display text-white">Population & Purchasing Potential Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Analyze population density, purchasing power, and demand correlations to identify high-potential markets.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Population Density Map – India</h2>
            <p className="text-slate-500 text-xs">Population-weighted choropleth with purchasing potential overlay</p>
          </div>
          <div className="h-[400px]">
            <InteractiveMap mode="choropleth" height="400px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Urban/Rural Split */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Population vs Purchasing Power by City Type</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={urbanRuralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="population" fill="#7C3AED" radius={[2, 2, 0, 0]} name="Population %" />
                <Bar dataKey="purchasing" fill="#22D3EE" radius={[2, 2, 0, 0]} name="Purchasing Power %" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Population Demand Scatter */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Population vs Demand Correlation</h3>
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis type="number" dataKey="population" name="Population (M)" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="demand" name="Demand Index" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={popDemandScatter} fill="#A855F7" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* State Potential */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">State Purchasing Potential Index</h3>
            <div className="space-y-2">
              {statePopulation.map(s => (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-6">{s.state}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${s.potential}%` }} />
                  </div>
                  <span className="text-xs text-white w-6 text-right">{s.potential}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
