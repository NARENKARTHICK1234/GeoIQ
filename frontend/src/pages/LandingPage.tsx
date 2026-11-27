import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, TrendingUp, Target, Zap, Globe, BarChart3, 
  ArrowRight, Play, Upload, ChevronRight, Shield, 
  Layers, Users, Database, Star, CheckCircle
} from 'lucide-react'
import ParticleGlobe from '../components/backgrounds/ParticleGlobe'
import AuroraBackground from '../components/backgrounds/AuroraBackground'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

const FloatingCard = ({ children, className = '', delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`backdrop-blur-md bg-[#11162B]/80 border border-white/10 rounded-xl p-4 ${className}`}
  >
    {children}
  </motion.div>
)

export default function LandingPage() {
  const salesCount = useCounter(248)
  const locCount = useCounter(10000)
  const vizCount = useCounter(50)

  const features = [
    { icon: Globe, title: 'Geographic Analytics', desc: 'Visualize sales data across Indian states, cities, and districts with interactive choropleth maps.', color: 'from-purple-500 to-violet-500' },
    { icon: Target, title: 'Market Gap Detection', desc: 'Identify high-demand, low-presence regions to discover untapped expansion opportunities.', color: 'from-cyan-500 to-blue-500' },
    { icon: TrendingUp, title: 'Revenue Intelligence', desc: 'Analyze revenue patterns, profit margins, and store performance across all geographies.', color: 'from-emerald-500 to-teal-500' },
    { icon: Zap, title: 'AI-Powered Scoring', desc: 'Rank expansion candidates using weighted demand, competition, population, and revenue scores.', color: 'from-amber-500 to-orange-500' },
    { icon: BarChart3, title: 'What-If Simulator', desc: 'Simulate business expansion scenarios with budget, store count, and market capture controls.', color: 'from-magenta-500 to-pink-500' },
    { icon: Database, title: 'Dataset Management', desc: 'Upload your own CSV data or use the included 12,500+ synthetic Indian market transactions.', color: 'from-indigo-500 to-purple-500' },
  ]

  const steps = [
    { n: '01', title: 'Load Data', desc: 'Upload your sales, store, and customer data or use our built-in synthetic Indian market dataset.' },
    { n: '02', title: 'Analyze Geography', desc: 'Explore interactive maps showing sales distribution, demand heatmaps, and competitor presence.' },
    { n: '03', title: 'Identify Gaps', desc: 'GeoIQ pinpoints high-demand, low-coverage regions ranked by expansion potential score.' },
    { n: '04', title: 'Expand Smarter', desc: 'Download actionable reports with specific location recommendations and financial projections.' },
  ]

  return (
    <div className="relative min-h-screen bg-[#050509] overflow-x-hidden font-sans">
      {/* Aurora ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AuroraBackground />
      </div>

      {/* NAV */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-display">GeoIQ</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium hover:from-purple-500 hover:to-violet-500 transition-all">
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative z-10 min-h-[90vh] flex items-center px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto pt-8">
          {/* Left: Text + CTA */}
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium w-fit">
              <BarChart3 className="w-3.5 h-3.5" /> Geospatial Business Expansion Intelligence Platform
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-6xl font-bold font-display leading-tight">
              <span className="text-white">Map Opportunities.</span><br />
              <span className="text-white">Discover Markets.</span><br />
              <span className="bg-gradient-to-r from-purple-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent">Expand Smarter.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Analyze location-based sales, demand, and market dynamics with powerful geospatial analytics to identify the best areas for <span className="text-purple-300 font-medium">business expansion.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25">
                <Zap className="w-4 h-4" /> Explore Dashboard
              </Link>
              <Link to="/datasets" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                <Play className="w-4 h-4 text-cyan-400" /> Load Demo Dataset
              </Link>
              <Link to="/datasets" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 transition-all">
                <Upload className="w-4 h-4" /> Upload Dataset
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: MapPin, val: `${locCount.toLocaleString()}+`, label: 'Locations Analyzed' },
                { icon: BarChart3, val: `${vizCount}+`, label: 'Visualizations' },
                { icon: Layers, val: '15', label: 'Analytics Pages' },
                { icon: Zap, val: 'AI-Powered', label: 'Location Insights' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-400 text-sm">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-semibold">{val}</span>
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Globe + Floating cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <ParticleGlobe />
            </div>
            {/* Floating metric cards */}
            <FloatingCard className="absolute top-2 right-2 w-48 z-20" delay={0.5}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Sales Growth</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">+24.8%</p>
              <div className="mt-2 h-8 flex items-end gap-0.5">
                {[3,5,4,7,6,8,9,10,8,11,10,12].map((h, i) => (
                  <div key={i} style={{ height: `${h * 3}px` }} className="flex-1 bg-emerald-500/50 rounded-sm" />
                ))}
              </div>
            </FloatingCard>
            <FloatingCard className="absolute top-48 right-0 w-48 z-20" delay={0.65}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Expansion Opportunities</span>
              </div>
              <p className="text-3xl font-bold text-white">32</p>
              <p className="text-xs text-slate-500 mt-1">High-demand, low-presence areas</p>
            </FloatingCard>
            <FloatingCard className="absolute bottom-8 right-2 w-48 z-20" delay={0.8}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Market Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-white">68.7%</p>
                <div className="w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22D3EE" strokeWidth="3"
                      strokeDasharray={`${68.7} ${100 - 68.7}`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </FloatingCard>
            {/* Demo label */}
            <div className="absolute bottom-4 right-0 text-[10px] text-slate-600">* Synthetic demonstration data</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-20 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4">Platform Features</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to analyze geographic markets and make data-driven expansion decisions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group p-6 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-20 px-8 lg:px-16 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4">How GeoIQ Works</h2>
            <p className="text-slate-400 text-lg">Four simple steps from raw data to actionable expansion intelligence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                className="relative p-6 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10">
                <div className="text-5xl font-bold text-purple-500/20 font-display mb-3">{s.n}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-purple-500/40 w-8 h-8 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative z-10 py-20 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 backdrop-blur-md">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4">Ready to Expand Smarter?</h2>
            <p className="text-slate-400 text-lg mb-8">Join analysts using GeoIQ to identify the highest-potential markets for business growth.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25">
                <Zap className="w-5 h-5" /> Start Analyzing Now
              </Link>
              <Link to="/reports" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                <BarChart3 className="w-5 h-5" /> View Sample Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-400 font-display">GeoIQ – Geospatial Business Expansion Intelligence</span>
          </div>
          <div className="text-xs text-slate-600">
            Data Analytics Internship · Task 4 · All data is synthetic demonstration data
          </div>
        </div>
      </footer>
    </div>
  )
}
