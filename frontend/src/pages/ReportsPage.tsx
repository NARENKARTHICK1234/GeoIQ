import React, { useState } from 'react'
import { FileText, Download, BarChart3, MapPin, TrendingUp, Calendar, CheckCircle, Loader2 } from 'lucide-react'
import { api } from '../services/api'

const reportTypes = [
  { id: 'executive_summary', name: 'Executive Summary', desc: 'High-level KPIs, top opportunities, and key insights for C-suite stakeholders.', icon: BarChart3, pages: 8, color: 'purple' },
  { id: 'geographic_analysis', name: 'Geographic Sales Analysis', desc: 'Detailed state-wise, city-wise, and regional breakdown of sales performance.', icon: MapPin, pages: 15, color: 'cyan' },
  { id: 'market_gap', name: 'Market Gap Analysis', desc: 'Comprehensive demand vs. presence analysis with expansion opportunity ranking.', icon: TrendingUp, pages: 12, color: 'emerald' },
  { id: 'expansion_plan', name: 'Expansion Recommendation Plan', desc: 'Top 10 location recommendations with financial projections and investment requirements.', icon: FileText, pages: 20, color: 'amber' },
]

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('executive_summary')
  const [dateRange, setDateRange] = useState('last_12_months')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerated(false)
    try {
      await api.generateReport({ report_type: selectedType, date_range: dateRange })
    } catch {}
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 2000)
  }

  const selectedReport = reportTypes.find(r => r.id === selectedType)!

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Management / Reports & Export</div>
        <h1 className="text-2xl font-bold font-display text-white">Reports & Export</h1>
        <p className="text-slate-400 text-sm mt-1">Generate comprehensive analytical reports and export data for stakeholder presentations.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Report Config */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
            <h3 className="text-white font-semibold mb-4">Report Configuration</h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Report Type</label>
                <div className="space-y-2">
                  {reportTypes.map(r => (
                    <label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedType === r.id ? 'bg-purple-900/30 border border-purple-500/40' : 'bg-white/3 border border-white/5 hover:bg-white/5'}`}>
                      <input type="radio" name="reportType" value={r.id} checked={selectedType === r.id} onChange={() => setSelectedType(r.id)} className="accent-purple-500" />
                      <div>
                        <p className="text-white text-sm font-medium">{r.name}</p>
                        <p className="text-slate-500 text-xs">{r.pages} pages</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">Date Range</label>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="last_6_months">Last 6 Months</option>
                  <option value="last_12_months">Last 12 Months (Full Year)</option>
                </select>
              </div>

              <button onClick={handleGenerate} disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-70">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {generating ? 'Generating Report...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Report Summary */}
          <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <selectedReport.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">{selectedReport.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedReport.desc}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {selectedReport.pages} pages</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Generated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Report sections */}
            <div className="space-y-2">
              {[
                'Executive Summary & KPIs',
                'Geographic Sales Distribution',
                'Market Gap Analysis',
                'Store Network Overview',
                'Competitor Landscape',
                'Expansion Opportunities (Top 10)',
                'Financial Projections',
                'Actionable Recommendations',
              ].slice(0, selectedReport.pages > 12 ? 8 : 5).map((section, i) => (
                <div key={section} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3">
                  <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                  <span className="text-sm text-slate-300">{section}</span>
                  {generated && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Download Options */}
          {(generated || true) && (
            <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" /> Export Options
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Download PDF', icon: FileText, color: 'purple', desc: 'Full report with charts' },
                  { label: 'Export CSV', icon: Download, color: 'cyan', desc: 'Raw data export' },
                  { label: 'Export Excel', icon: Download, color: 'emerald', desc: 'Formatted spreadsheet' },
                  { label: 'GeoJSON Export', icon: MapPin, color: 'amber', desc: 'Geographic boundaries' },
                  { label: 'Share Link', icon: FileText, color: 'violet', desc: 'Shareable report URL' },
                  { label: 'API Export', icon: BarChart3, color: 'magenta', desc: 'JSON API endpoint' },
                ].map(opt => (
                  <button key={opt.label} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all text-left group">
                    <opt.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                    <div>
                      <p className="text-white text-xs font-medium">{opt.label}</p>
                      <p className="text-slate-500 text-xs">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All reports contain synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
