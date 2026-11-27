import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'

// Eagerly load landing page
import LandingPage from './pages/LandingPage'

// Lazy-load analytics pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SalesPage = lazy(() => import('./pages/SalesPage'))
const DemandPage = lazy(() => import('./pages/DemandPage'))
const StoresPage = lazy(() => import('./pages/StoresPage'))
const MarketGapPage = lazy(() => import('./pages/MarketGapPage'))
const CompetitorsPage = lazy(() => import('./pages/CompetitorsPage'))
const PopulationPage = lazy(() => import('./pages/PopulationPage'))
const RevenuePage = lazy(() => import('./pages/RevenuePage'))
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'))
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'))
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'))
const DatasetsPage = lazy(() => import('./pages/DatasetsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-geo-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Loading GeoIQ...</p>
    </div>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page – standalone layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard pages – wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/demand" element={<DemandPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/market-gap" element={<MarketGapPage />} />
          <Route path="/competitors" element={<CompetitorsPage />} />
          <Route path="/population" element={<PopulationPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
