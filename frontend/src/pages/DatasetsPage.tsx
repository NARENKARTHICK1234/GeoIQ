import React, { useState, useRef } from 'react'
import { Database, Upload, Download, Eye, CheckCircle, AlertCircle, FileText, Trash2 } from 'lucide-react'

const sampleDatasets = [
  { name: 'India Sales Transactions', records: 12500, size: '2.4 MB', status: 'active', type: 'Sales', date: '2024-01-01' },
  { name: 'Store Locations', records: 121, size: '28 KB', status: 'active', type: 'Stores', date: '2024-01-01' },
  { name: 'Customer Demand', records: 7020, size: '890 KB', status: 'active', type: 'Demand', date: '2024-01-01' },
  { name: 'Competitor Locations', records: 294, size: '45 KB', status: 'active', type: 'Competitors', date: '2024-01-01' },
  { name: 'Expansion Candidates', records: 97, size: '18 KB', status: 'active', type: 'Candidates', date: '2024-01-01' },
  { name: 'Location Master', records: 117, size: '22 KB', status: 'active', type: 'Geography', date: '2024-01-01' },
]

const previewData = [
  { transaction_id: 'TXN-001', date: '2024-01-15', state: 'Maharashtra', city: 'Mumbai', amount: 4850, category: 'Electronics', store_id: 'ST-0001' },
  { transaction_id: 'TXN-002', date: '2024-01-15', state: 'Tamil Nadu', city: 'Chennai', amount: 2340, category: 'Fashion', store_id: 'ST-0014' },
  { transaction_id: 'TXN-003', date: '2024-01-16', state: 'Karnataka', city: 'Bangalore', amount: 6720, category: 'Electronics', store_id: 'ST-0022' },
  { transaction_id: 'TXN-004', date: '2024-01-16', state: 'Delhi', city: 'New Delhi', amount: 1890, category: 'Grocery', store_id: 'ST-0031' },
]

export default function DatasetsPage() {
  const [dragging, setDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv') || f.name.endsWith('.xlsx'))
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const qualityChecks = [
    { name: 'Missing Values', status: 'pass', detail: '0 missing values detected' },
    { name: 'Date Format', status: 'pass', detail: 'All dates in YYYY-MM-DD format' },
    { name: 'Coordinate Range', status: 'pass', detail: 'All coordinates within India bounds' },
    { name: 'Revenue Range', status: 'pass', detail: 'No outliers beyond 3σ detected' },
    { name: 'Store ID Match', status: 'pass', detail: 'All store IDs match master list' },
    { name: 'Category Validation', status: 'warn', detail: '3 unknown categories mapped to Others' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <div className="text-xs text-slate-500 mb-1">Management / Dataset Management</div>
        <h1 className="text-2xl font-bold font-display text-white">Dataset Management</h1>
        <p className="text-slate-400 text-sm mt-1">Upload, manage, and validate your geographic sales and store data for analysis.</p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${dragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-[#11162B]/40 hover:border-purple-500/40 hover:bg-purple-500/5'}`}>
        <input ref={fileRef} type="file" accept=".csv,.xlsx" multiple onChange={handleFileSelect} className="hidden" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center">
            <Upload className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Drop CSV or Excel files here</p>
            <p className="text-slate-500 text-sm mt-1">or <span className="text-purple-400 underline">click to browse</span></p>
            <p className="text-slate-600 text-xs mt-2">Supported: .csv, .xlsx · Max 50 MB per file</p>
          </div>
        </div>
      </div>

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{f.name}</p>
                  <p className="text-slate-500 text-xs">{(f.size / 1024).toFixed(1)} KB</p>
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ready</span>
                <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Datasets */}
      <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2"><Database className="w-4 h-4 text-purple-400" /> Sample Datasets (Synthetic Demonstration Data)</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">{['Dataset Name','Records','Size','Type','Status','Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {sampleDatasets.map(d => (
              <tr key={d.name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3 text-white font-medium">{d.name}</td>
                <td className="px-5 py-3 text-slate-300 text-xs">{d.records.toLocaleString()}</td>
                <td className="px-5 py-3 text-slate-300 text-xs">{d.size}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300">{d.type}</span></td>
                <td className="px-5 py-3"><span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3 h-3" /> Active</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview + Validation */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="text-white font-semibold flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /> Data Preview – Sales Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">{['transaction_id','date','state','city','amount','category','store_id'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 font-mono">{h}</th>)}</tr></thead>
              <tbody>
                {previewData.map(r => (
                  <tr key={r.transaction_id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-4 py-2 text-purple-400 font-mono text-xs">{r.transaction_id}</td>
                    <td className="px-4 py-2 text-slate-300 text-xs">{r.date}</td>
                    <td className="px-4 py-2 text-slate-300 text-xs">{r.state}</td>
                    <td className="px-4 py-2 text-slate-300 text-xs">{r.city}</td>
                    <td className="px-4 py-2 text-emerald-400 text-xs font-medium">₹{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs"><span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{r.category}</span></td>
                    <td className="px-4 py-2 text-cyan-400 font-mono text-xs">{r.store_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Checks */}
        <div className="rounded-2xl backdrop-blur-md bg-[#11162B]/80 border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Data Quality Checks</h3>
          <div className="space-y-3">
            {qualityChecks.map(c => (
              <div key={c.name} className={`p-3 rounded-lg flex items-start gap-3 ${c.status === 'pass' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                {c.status === 'pass' ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                <div>
                  <p className={`text-xs font-semibold ${c.status === 'pass' ? 'text-emerald-300' : 'text-amber-300'}`}>{c.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white/5 text-center">
            <p className="text-xs text-slate-500">Overall Quality Score</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">96.4%</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">* All built-in datasets are synthetic demonstration data for internship purposes.</p>
    </div>
  )
}
