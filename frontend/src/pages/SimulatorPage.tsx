import React, { useState, useCallback } from 'react'
import { Zap, TrendingUp, Store, DollarSign, Play, RefreshCw } from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KpiCard from '../components/common/KpiCard'
import InteractiveMap from '../maps/InteractiveMap'
import { api } from '../services/api'

const scenarios = ['Conservative', 'Moderate', 'Aggressive']

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#11162B] border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color || '#7C3AED' }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>)}
    </div>
  ) : null

function SimSlider({ label, min, max, step, value, onChange, unit = '' }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-sm font-semibold text-white">{value.toLocaleString()}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 bg-white/10" />
      <div className="flex justify-between text-xs text-slate-600 mt-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  )
}

export default function SimulatorPage() {
  const [budget, setBudget] = useState(10)
  const [storeCount, setStoreCount] = useState(5)
  const [captureRate, setCaptureRate] = useState(12)
  const [demandGrowth, setDemandGrowth] = useState(8)
  const [scenario, setScenario] = useState('Moderate')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runSimulation = useCallback(async () => {
    setRunning(true)
    try {
      const r = await api.runSimulator({
        budget_crore: budget,
        store_count: storeCount,
        market_capture_rate: captureRate / 100,
        demand_growth_rate: demandGrowth / 100,
        scenario: scenario.toLowerCase(),
      })
      setResults(r)
    } catch {
      // Use synthetic fallback results
      setResults({
        projected_revenue: budget * 4.2 * storeCount * (captureRate / 10),
        new_coverage: Math.min(68.7 + storeCount * 2.1, 95),
        roi: (budget * 1.6 * captureRate / 100).toFixed(1),
        breakeven_months: Math.round(24 / (captureRate / 10)),
        scenarios: {
          conservative: { revenue: budget * 3.1 * storeCount, coverage: 68.7 + storeCount * 1.4 },
          moderate: { revenue: budget * 4.2 * storeCount, coverage: 68.7 + storeCount * 2.1 },
          aggressive: { revenue: budget * 5.8 * storeCount, coverage: 68.7 + storeCount * 2.8 },
        }
      })
    }
    setRunning(false)
  }, [budget, storeCount, captureRate, demandGrowth, scenario])

  const projRevenue = results?.projected_revenue || budget * 4.2 * storeCount * (captureRate / 10)
  const projCoverage = results?.new_coverage || Math.min(68.7 + storeCount * 2.1, 95)

  const projectionData = Array.from({ length: 5 }, (_, i) => ({
    year: `Year ${i + 1}`,
    baseline: Math.round(1248 + storeCount * 0 * i * 10),
    projected: Math.round(1248 + storeCount * (i + 1) * 8 * (captureRate / 10)),
    revenue: Math.round(124.8 + (i + 1) * storeCount * budget * 0.4),
  }))

  const scenarioCompare = scenarios.map(s => ({
    scenario: s,
    stores: storeCount,
    coverage: s === 'Conservative' ? +(projCoverage - 4).toFixed(1) : s === 'Moderate' ? +projCoverage.toFixed(1) : +(projCoverage + 5).toFixed(1),
    revenue: s === 'Conservative' ? +(projRevenue * 0.75).toFixed(1) : s === 'Moderate' ? +projRevenue.toFixed(1) : +(projRevenue * 1.35).toFixed(1),
  }))

  const kpis = [
    { title: 'Projected Revenue', value: `₹${projRevenue.toFixed(1)} Cr`, change: `+${((projRevenue / 124.8 - 1) * 100).toFixed(1)}%`, positive: true, icon: DollarSign, color: 'purple' },
    { title: 'New Coverage', value: `${projCoverage.toFixed(1)}%`, change: `+${(projCoverage - 68.7).toFixed(1)}pp`, positive: true, icon: Store, color: 'cyan' },
    { title: 'Est. ROI', value: `${((projRevenue / budget - 1) * 100).toFixed(0)}%`, change: 'First 3 yrs', positive: true, icon: TrendingUp, color: 'emerald' },
    { title: 'Breakeven', value: `${Math.round(24 / (captureRate / 10))} mo`, change: 'Approx.', positive: true, icon: Zap, color: 'amber' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Intelligence / What-If Simulator</div>
        <h1 className="text-2xl font-bold font-display text-white">Business Expansion Simulator</h1>
        <p className="text-slate-400 text-sm mt-1">Model different expansion scenarios by adjusting budget, store count, and market capture parameters.</p>
      </div>

      {/* Inputs + Preview */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> Simulation Parameters</h3>
            <div className="space-y-5">
              <SimSlider label="Total Investment Budget (₹ Cr)" min={1} max={50} step={1} value={budget} onChange={setBudget} />
              <SimSlider label="Number of New Stores" min={1} max={30} step={1} value={storeCount} onChange={setStoreCount} />
              <SimSlider label="Market Capture Rate" min={5} max={40} step={1} value={captureRate} onChange={setCaptureRate} unit="%" />
              <SimSlider label="Demand Growth Rate" min={2} max={30} step={1} value={demandGrowth} onChange={setDemandGrowth} unit="%" />

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Expansion Scenario</label>
                <div className="flex gap-2">
                  {scenarios.map(s => (
                    <button key={s} onClick={() => setScenario(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${scenario === s ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={runSimulation} disabled={running}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-50">
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {running ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>

          {/* Quick results */}
          <div className="grid grid-cols-2 gap-3">
            {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Expansion Coverage Map</h2>
            <p className="text-slate-500 text-xs">Current stores + {storeCount} simulated new locations</p>
          </div>
          <div className="h-[420px]">
            <InteractiveMap mode="simulator" height="420px" />
          </div>
        </div>
      </div>

      {/* Projections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue projection */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">5-Year Revenue Projection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="sim1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fill="url(#sim1)" strokeWidth={2} dot={false} name="Revenue (₹ Cr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Comparison */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Scenario Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">{['Scenario','Stores','Coverage','Revenue Uplift'].map(h => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500">{h}</th>)}</tr></thead>
              <tbody>
                {scenarioCompare.map(s => (
                  <tr key={s.scenario} className={`border-b border-white/5 transition-colors ${scenario === s.scenario ? 'bg-purple-900/20' : 'hover:bg-white/3'}`}>
                    <td className="px-4 py-3 text-white text-sm font-medium">{s.scenario}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{s.stores} new</td>
                    <td className="px-4 py-3 text-cyan-400 text-xs">{s.coverage}%</td>
                    <td className="px-4 py-3 text-emerald-400 text-xs font-semibold">₹{s.revenue.toFixed(1)} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            ⚠️ All projections are based on synthetic data models and should not be used for real investment decisions.
          </div>
        </div>
      </div>
    </div>
  )
}
