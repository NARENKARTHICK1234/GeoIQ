import React, { useState } from 'react'
import { Settings, Moon, Sun, Map, Sliders, RefreshCw, Save, CheckCircle } from 'lucide-react'

type WeightKey = 'demand' | 'competition' | 'population' | 'revenue' | 'growth'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mapTiles, setMapTiles] = useState('carto_dark')
  const [animationIntensity, setAnimationIntensity] = useState(70)
  const [saved, setSaved] = useState(false)
  const [weights, setWeights] = useState<Record<WeightKey, number>>({
    demand: 35, competition: 25, population: 20, revenue: 15, growth: 5,
  })

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  const handleWeightChange = (key: WeightKey, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setWeights({ demand: 35, competition: 25, population: 20, revenue: 15, growth: 5 })
    setAnimationIntensity(70)
    setTheme('dark')
    setMapTiles('carto_dark')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const weightColors: Record<WeightKey, string> = {
    demand: '#7C3AED', competition: '#22D3EE', population: '#10B981', revenue: '#F59E0B', growth: '#D946EF',
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" /> Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Customize GeoIQ appearance, map preferences, and scoring weights.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Theme & Appearance */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><Sun className="w-4 h-4 text-amber-400" /> Appearance</h3>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 block mb-3">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'dark', icon: Moon, label: 'Dark (Default)' },
                  { id: 'light', icon: Sun, label: 'Light' },
                ].map(t => (
                  <label key={t.id} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${theme === t.id ? 'bg-purple-900/30 border border-purple-500/40' : 'bg-white/5 border border-white/10 hover:bg-white/8'}`}>
                    <input type="radio" name="theme" value={t.id} checked={theme === t.id} onChange={() => setTheme(t.id as any)} className="accent-purple-500" />
                    <t.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-3">Map Tiles</label>
              <select value={mapTiles} onChange={e => setMapTiles(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                <option value="carto_dark">CartoDB Dark (Default)</option>
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="carto_light">CartoDB Light</option>
                <option value="stamen_toner">Stamen Toner</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-slate-400">Animation Intensity</label>
                <span className="text-xs text-white">{animationIntensity}%</span>
              </div>
              <input type="range" min={0} max={100} value={animationIntensity} onChange={e => setAnimationIntensity(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 bg-white/10" />
              <div className="flex justify-between text-xs text-slate-600 mt-1"><span>Minimal</span><span>Full</span></div>
            </div>
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold flex items-center gap-2"><Sliders className="w-4 h-4 text-cyan-400" /> Opportunity Scoring Weights</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${totalWeight === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              Total: {totalWeight}%
            </span>
          </div>
          {totalWeight !== 100 && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              ⚠️ Weights must sum to 100%. Currently: {totalWeight}%
            </div>
          )}
          <div className="space-y-5">
            {(Object.entries(weights) as [WeightKey, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-slate-300 capitalize">{key} Score</label>
                  <span className="text-sm font-semibold text-white">{val}%</span>
                </div>
                <input type="range" min={5} max={60} step={5} value={val}
                  onChange={e => handleWeightChange(key, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10"
                  style={{ accentColor: weightColors[key] }} />
                <div className="mt-1 h-1 rounded-full" style={{ background: weightColors[key], width: `${val}%`, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all">
          <RefreshCw className="w-4 h-4" /> Reset to Defaults
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all">
          {saved ? <><CheckCircle className="w-4 h-4 text-emerald-300" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}
