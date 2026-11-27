import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Store, Target, Download } from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const stateRevenue = [
  { state: 'MH', revenue: 22.8, margin: 21.4, opCost: 17.9 },
  { state: 'TN', revenue: 18.9, margin: 19.8, opCost: 15.1 },
  { state: 'UP', revenue: 16.4, margin: 17.2, opCost: 13.6 },
  { state: 'KA', revenue: 14.3, margin: 20.1, opCost: 11.4 },
  { state: 'WB', revenue: 12.7, margin: 16.4, opCost: 10.6 },
  { state: 'RJ', revenue: 10.4, margin: 18.9, opCost: 8.4 },
  { state: 'GJ', revenue: 9.8, margin: 17.6, opCost: 8.1 },
]

const profitRanking = [
  { rank: 1, store: 'Mumbai Flagship', revenue: '₹4.8 Cr', margin: '24.2%', profit: '₹1.16 Cr', trend: '+18.4%' },
  { rank: 2, store: 'Bangalore Central', revenue: '₹4.1 Cr', margin: '22.8%', profit: '₹0.93 Cr', trend: '+15.2%' },
  { rank: 3, store: 'Chennai Prime', revenue: '₹3.8 Cr', margin: '21.5%', profit: '₹0.82 Cr', trend: '+17.1%' },
  { rank: 4, store: 'Hyderabad Hub', revenue: '₹3.5 Cr', margin: '20.9%', profit: '₹0.73 Cr', trend: '+13.8%' },
  { rank: 5, store: 'Delhi NCR', revenue: '₹3.3 Cr', margin: '19.6%', profit: '₹0.65 Cr', trend: '+12.4%' },
]

const revenueTrend = [
  { q: 'Q1-23', revenue: 28.4, profit: 5.2 }, { q: 'Q2-23', revenue: 31.2, profit: 5.9 },
  { q: 'Q3-23', revenue: 29.8, profit: 5.6 }, { q: 'Q4-23', revenue: 34.6, profit: 7.1 },
  { q: 'Q1-24', revenue: 36.2, profit: 7.6 }, { q: 'Q2-24', revenue: 38.9, profit: 8.4 },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">₹{typeof p.value === 'number' ? p.value.toFixed(1) : p.value} Cr</span></p>)}
    </div>
  ) : null

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getRevenueAnalysis().then(d => { setRevenueData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Revenue', value: loading ? '...' : `₹${((revenueData?.total_revenue || 124800000) / 10000000).toFixed(1)} Cr`, change: '+14.2%', positive: true, icon: DollarSign, color: 'purple' },
    { title: 'Net Profit', value: loading ? '...' : `₹${((revenueData?.net_profit || 23300000) / 10000000).toFixed(1)} Cr`, change: '+18.6%', positive: true, icon: TrendingUp, color: 'emerald' },
    { title: 'Avg Profit Margin', value: loading ? '...' : `${(revenueData?.avg_margin || 18.7).toFixed(1)}%`, change: '+2.4pp', positive: true, icon: Target, color: 'cyan' },
    { title: 'Revenue per Store', value: loading ? '...' : `₹${(revenueData?.revenue_per_store || 103000).toLocaleString()}`, change: '+5.8%', positive: true, icon: Store, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500 mb-1">Analysis / Revenue Analysis</div>
          <h1 className="text-2xl font-bold font-display text-white">Revenue & Profitability Analysis</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze revenue patterns, profit margins, and store profitability across geographic regions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Revenue Distribution Map</h2>
            <p className="text-slate-500 text-xs">Bubble size = revenue; color = profit margin</p>
          </div>
          <div className="h-[380px]">
            <InteractiveMap mode="revenue" height="380px" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Revenue Trend */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Revenue & Profit Trend (Quarterly)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <ComposedChart data={revenueTrend}>
                <defs>
                  <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="q" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#7C3AED" radius={[2, 2, 0, 0]} opacity={0.7} name="revenue" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={false} name="profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* State Revenue Bars */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Revenue by State</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stateRevenue} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="state" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[0, 3, 3, 0]} name="revenue">
                  {stateRevenue.map((_, i) => <Cell key={i} fill={`hsl(${260 + i * 12}, 70%, ${55 - i * 2}%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Margin Comparison */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Profit Margin by State</h3>
            <div className="space-y-2">
              {stateRevenue.map(s => (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-6">{s.state}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${s.margin}%` }} />
                  </div>
                  <span className="text-xs text-emerald-400 w-10 text-right">{s.margin}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profitability Ranking Table */}
      <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Top Performing Stores by Profitability</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">{['Rank','Store','Revenue','Profit Margin','Net Profit','YoY Trend'].map(h => <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {profitRanking.map(r => (
              <tr key={r.rank} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3 text-purple-400 font-bold">#{r.rank}</td>
                <td className="px-5 py-3 text-white font-medium">{r.store}</td>
                <td className="px-5 py-3 text-white">{r.revenue}</td>
                <td className="px-5 py-3 text-emerald-400">{r.margin}</td>
                <td className="px-5 py-3 text-cyan-400">{r.profit}</td>
                <td className="px-5 py-3 text-emerald-400">{r.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
