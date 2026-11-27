import React, { useState, useEffect } from 'react'
import { Store, MapPin, TrendingUp, Target, Layers, ToggleLeft, ToggleRight } from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const performanceTrend = [
  { month: 'Jan', sales: 8 }, { month: 'Feb', sales: 10 }, { month: 'Mar', sales: 12 },
  { month: 'Apr', sales: 15 }, { month: 'May', sales: 18 }, { month: 'Jun', sales: 24 },
  { month: 'Jul', sales: 28 }, { month: 'Aug', sales: 32 }, { month: 'Sep', sales: 36 },
  { month: 'Oct', sales: 38 }, { month: 'Nov', sales: 40 }, { month: 'Dec', sales: 42 },
]

const regionSales = [
  { region: 'South', sales: 4.0 }, { region: 'West', sales: 3.2 }, { region: 'North', sales: 2.8 },
  { region: 'East', sales: 1.8 }, { region: 'Central', sales: 1.2 },
]

const storeTypes = [
  { type: 'Flagship', revenue: '₹4.8 Cr', share: 48, color: '#7C3AED' },
  { type: 'Standard', revenue: '₹3.6 Cr', share: 36, color: '#22D3EE' },
  { type: 'Express', revenue: '₹2.1 Cr', share: 21, color: '#10B981' },
  { type: 'Franchise', revenue: '₹1.9 Cr', share: 19, color: '#F59E0B' },
]

const topStores = [
  { id: 'ST-1029', location: 'Coimbatore', state: 'Tamil Nadu', sales: '₹94.2 L', growth: '+18.6%', footfall: '28,430', radius: '10 km', perf: 'Excellent' },
  { id: 'ST-0876', location: 'Vijayawada', state: 'Andhra Pradesh', sales: '₹87.5 L', growth: '+16.9%', footfall: '24,980', radius: '8 km', perf: 'Excellent' },
  { id: 'ST-0641', location: 'Indore', state: 'Madhya Pradesh', sales: '₹83.1 L', growth: '+15.4%', footfall: '23,760', radius: '10 km', perf: 'Good' },
  { id: 'ST-0914', location: 'Guwahati', state: 'Assam', sales: '₹79.6 L', growth: '+14.8%', footfall: '21,905', radius: '8 km', perf: 'Good' },
]

const badgeColor = (val: string) => {
  if (val === 'Excellent') return 'bg-emerald-500/20 text-emerald-400'
  if (val === 'Good') return 'bg-cyan-500/20 text-cyan-400'
  return 'bg-amber-500/20 text-amber-400'
}

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>
      ))}
    </div>
  ) : null

export default function StoresPage() {
  const [mapView, setMapView] = useState<'coverage' | 'clustering' | 'heatmap'>('coverage')
  const [showGaps, setShowGaps] = useState(false)
  const [storeData, setStoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [layers, setLayers] = useState({ stores: true, coverage: true, demand: true, population: false, competitors: false, recommended: false })

  useEffect(() => {
    api.getStoreAnalysis().then(d => { setStoreData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Stores', value: loading ? '...' : (storeData?.total_stores || 1248).toLocaleString(), change: '+6.4%', positive: true, icon: Store, color: 'purple' },
    { title: 'Area Coverage', value: loading ? '...' : `${(storeData?.area_coverage || 68.7).toFixed(1)}%`, change: '+4.2pp', positive: true, icon: Target, color: 'cyan' },
    { title: 'Total Sales', value: '₹12.4 Cr', change: '+14.2%', positive: true, icon: TrendingUp, color: 'emerald' },
    { title: 'High Demand Areas', value: loading ? '...' : (storeData?.high_demand_areas || 246).toString(), change: '+18.3%', positive: true, icon: MapPin, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            Store Location Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">Analyze existing store locations, coverage areas, and performance across regions.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option>All India</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option>All Store Types</option>
            <option>Flagship</option>
            <option>Standard</option>
            <option>Express</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-3 flex-wrap">
            {(['Coverage View', 'Clustering', 'Heatmap'] as const).map(v => (
              <button key={v} onClick={() => setMapView(v.toLowerCase().replace(' view', '') as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mapView === v.toLowerCase().replace(' view', '') ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                <Layers className="w-3 h-3" /> {v}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-white/5">
            <div>
              <p className="text-xs text-slate-500 mb-2">Map Layers</p>
              <div className="space-y-1.5">
                {Object.entries(layers).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" checked={val} onChange={e => setLayers(l => ({ ...l, [key]: e.target.checked }))} className="accent-purple-500" />
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Location Filters</p>
              <div className="space-y-2">
                <select className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white">
                  <option>All States</option>
                </select>
                <select className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white">
                  <option>All Cities</option>
                </select>
                <select className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white">
                  <option>All Types</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <span>Show Coverage Gaps</span>
                  <button onClick={() => setShowGaps(g => !g)} className="ml-auto">
                    {showGaps ? <ToggleRight className="w-5 h-5 text-purple-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                  </button>
                </label>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <InteractiveMap mode="stores" height="300px" showCoverage={layers.coverage} />
          </div>
          {/* Legend */}
          <div className="p-3 border-t border-white/5 flex items-center gap-4 flex-wrap text-xs text-slate-500">
            {[
              { color: '#7C3AED', label: 'Our Store (1,248)' },
              { color: '#22D3EE', label: 'Coverage Area (5–10 km)' },
              { color: '#D946EF', label: 'High Demand Area' },
              { color: '#F59E0B', label: 'Medium Demand' },
              { color: '#64748b', label: 'Low Demand' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Performance Trend */}
          <div className="flex-1 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold">Store Performance Trend</h3>
              <select className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-white">
                <option>Sales</option>
                <option>Footfall</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#22D3EE" fill="url(#sg2)" strokeWidth={2} dot={false} name="sales (₹ Cr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Store Coverage */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Store Coverage</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7C3AED" strokeWidth="3.8" strokeDasharray="68.7 31.3" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D946EF" strokeWidth="3.8" strokeDasharray="21.4 78.6" strokeLinecap="round" strokeDashoffset="-68.7" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-sm">68.7%</span></div>
              </div>
              <div className="space-y-2 flex-1">
                {[{ label: 'Covered Area', val: '68.7%', color: '#7C3AED' }, { label: 'Demand Gap', val: '21.4%', color: '#D946EF' }, { label: 'Low Presence', val: '9.9%', color: '#64748b' }].map(r => (
                  <div key={r.label} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                    <span className="text-slate-400 flex-1">{r.label}</span>
                    <span className="text-white font-medium">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Type Performance */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold">Store Type Performance</h3>
              <select className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-white">
                <option>Sales</option>
              </select>
            </div>
            <div className="space-y-2.5">
              {storeTypes.map(s => (
                <div key={s.type} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-16">{s.type}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.share}%`, background: s.color }} />
                  </div>
                  <span className="text-xs text-white w-14 text-right">{s.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store Performance Table */}
      <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2"><Store className="w-4 h-4 text-purple-400" /> Store Performance (Top Locations)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Store ID', 'Location', 'State', 'Sales (₹)', 'YoY Growth', 'Footfall', 'Coverage Radius', 'Performance'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topStores.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-purple-400 font-mono text-xs">{s.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{s.location}</td>
                  <td className="px-5 py-3 text-slate-400">{s.state}</td>
                  <td className="px-5 py-3 text-white">{s.sales}</td>
                  <td className="px-5 py-3 text-emerald-400">{s.growth}</td>
                  <td className="px-5 py-3 text-slate-300">{s.footfall}</td>
                  <td className="px-5 py-3 text-slate-300">{s.radius}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor(s.perf)}`}>{s.perf}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All data shown is synthetic demonstration data. Coverage radius is an approximation based on 5–10 km store reach.</p>
    </div>
  )
}
