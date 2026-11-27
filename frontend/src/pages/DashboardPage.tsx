import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Store, Users, MapPin, DollarSign, 
  Target, Zap, BarChart3, ChevronRight, ArrowUpRight 
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const COLORS = ['#7C3AED', '#22D3EE', '#10B981', '#F59E0B', '#D946EF', '#F43F5E']

const salesTrend = [
  { month: 'Jan', revenue: 85, sales: 320 }, { month: 'Feb', revenue: 92, sales: 350 },
  { month: 'Mar', revenue: 88, sales: 335 }, { month: 'Apr', revenue: 105, sales: 420 },
  { month: 'May', revenue: 115, sales: 455 }, { month: 'Jun', revenue: 110, sales: 440 },
  { month: 'Jul', revenue: 125, sales: 490 }, { month: 'Aug', revenue: 118, sales: 470 },
  { month: 'Sep', revenue: 130, sales: 510 }, { month: 'Oct', revenue: 142, sales: 555 },
  { month: 'Nov', revenue: 155, sales: 600 }, { month: 'Dec', revenue: 165, sales: 640 },
]

const regionalData = [
  { name: 'South', value: 32.4, color: '#7C3AED' },
  { name: 'West', value: 26.8, color: '#22D3EE' },
  { name: 'North', value: 18.1, color: '#10B981' },
  { name: 'East', value: 12.7, color: '#F59E0B' },
  { name: 'Central', value: 10.0, color: '#D946EF' },
]

const topStates = [
  { state: 'Maharashtra', abbr: 'MH', value: 22.8, color: '#7C3AED' },
  { state: 'Karnataka', abbr: 'KA', value: 18.9, color: '#A855F7' },
  { state: 'Tamil Nadu', abbr: 'TN', value: 16.4, color: '#22D3EE' },
  { state: 'Delhi', abbr: 'DL', value: 14.2, color: '#06B6D4' },
  { state: 'West Bengal', abbr: 'WB', value: 11.6, color: '#10B981' },
]

const opportunities = [
  { rank: 1, location: 'Coimbatore, TN', demand: 92, presence: 'Low', opportunity: 'High', score: 94 },
  { rank: 2, location: 'Visakhapatnam, AP', demand: 88, presence: 'Low', opportunity: 'High', score: 91 },
  { rank: 3, location: 'Indore, MP', demand: 85, presence: 'Medium', opportunity: 'High', score: 88 },
  { rank: 4, location: 'Nagpur, MH', demand: 82, presence: 'Low', opportunity: 'High', score: 85 },
  { rank: 5, location: 'Bhubaneswar, OD', demand: 78, presence: 'Medium', opportunity: 'Medium', score: 80 },
]

const badgeColor = (val: string) => {
  if (val === 'High') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  if (val === 'Medium') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
  return 'bg-red-500/20 text-red-400 border border-red-500/30'
}

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>
      ))}
    </div>
  ) : null

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null)
  const [mapData, setMapData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getOverview(), api.getGeoJSON()]).then(([ov, geo]) => {
      setOverview(ov)
      setMapData(geo)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Revenue', value: loading ? '...' : `₹${((overview?.total_revenue || 124800000) / 10000000).toFixed(1)} Cr`, change: '+14.7%', positive: true, icon: DollarSign, color: 'purple' },
    { title: 'Total Sales Units', value: loading ? '...' : (overview?.total_sales || 421000).toLocaleString(), change: '+11.6%', positive: true, icon: BarChart3, color: 'cyan' },
    { title: 'Total Stores', value: loading ? '...' : (overview?.total_stores || 121).toLocaleString(), change: '+8.9%', positive: true, icon: Store, color: 'emerald' },
    { title: 'Total Customers', value: loading ? '...' : (overview?.total_customers || 89200).toLocaleString(), change: '+11.6%', positive: true, icon: Users, color: 'violet' },
    { title: 'Avg Revenue/Store', value: `₹13.9K`, change: '+5.8%', positive: true, icon: TrendingUp, color: 'amber' },
    { title: 'Market Coverage', value: loading ? '...' : `${(overview?.market_coverage || 68.7).toFixed(1)}%`, change: '+4.2pp', positive: true, icon: Target, color: 'cyan' },
    { title: 'High-Demand Regions', value: loading ? '...' : (overview?.high_demand_regions || 162).toString(), change: '+31.7%', positive: true, icon: MapPin, color: 'magenta' },
    { title: 'Expansion Opportunities', value: loading ? '...' : (overview?.expansion_opportunities || 32).toString(), change: '+4.2pp', positive: true, icon: Zap, color: 'purple' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map – left 3/5 */}
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" /> Sales Performance by Location</h2>
            <p className="text-slate-500 text-xs mt-0.5">Total sales and store distribution across India</p>
          </div>
          <div className="h-[400px]">
            <InteractiveMap mode="stores" height="400px" />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Sales Trend */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Sales Trend</h3>
              <span className="text-xs text-slate-500">Monthly</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fill="url(#revGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Donut */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Sales by Region</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="40%" height={120}>
                <PieChart>
                  <Pie data={regionalData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                    {regionalData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {regionalData.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-slate-400">{r.name}</span>
                    </div>
                    <span className="text-white font-medium">{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demand vs Store Presence */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-2">Demand vs Store Presence</h3>
            <p className="text-slate-500 text-xs mb-3">High Demand / Low Presence Areas</p>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D946EF" strokeWidth="3.8"
                    strokeDasharray="41.5 58.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">32</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">32</p>
                <p className="text-xs text-slate-400">Gap Areas identified</p>
                <Link to="/market-gap" className="text-xs text-purple-400 flex items-center gap-1 mt-1 hover:text-purple-300">
                  View Analysis <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Key Insights</h3>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, color: 'text-emerald-400', title: 'Highest Sales Region', desc: 'South region leads with ₹40.4 Cr (32.4%)' },
              { icon: Target, color: 'text-purple-400', title: 'Expansion Potential', desc: '32 locations with high demand but low store coverage' },
              { icon: Store, color: 'text-cyan-400', title: 'Store Performance', desc: 'Avg. sales per store increased by 5.8% vs. previous period' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                <Icon className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} />
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing States */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Top Performing States</h3>
          <div className="space-y-3">
            {topStates.map((s) => (
              <div key={s.state} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: s.color + '33' }}>
                  {s.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{s.state}</span>
                    <span className="text-sm text-white font-medium">₹{s.value} Cr</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.value / 25) * 100}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expansion Opportunities Table */}
      <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> Expansion Opportunities (Top 5)</h3>
          <Link to="/opportunities" className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300">View All <ChevronRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Location', 'Demand Score', 'Store Presence', 'Opportunity'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => (
                <tr key={o.rank} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-slate-500">{o.rank}</td>
                  <td className="px-5 py-3 text-white font-medium">{o.location}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full max-w-[80px]">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${o.demand}%` }} />
                      </div>
                      <span className="text-white text-xs">{o.demand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor(o.presence)}`}>{o.presence}</span></td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor(o.opportunity)}`}>{o.opportunity}</span></td>
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
