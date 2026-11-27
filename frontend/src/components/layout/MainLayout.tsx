import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageBackground } from '../backgrounds/PageBackground';

const ROUTE_META: Record<string, { title: string; subtitle: string; variant: any }> = {
  '/dashboard': {
    title: 'Overview Dashboard',
    subtitle: 'A complete geographic view of sales, stores, demand, and expansion opportunities.',
    variant: 'overview'
  },
  '/sales': {
    title: 'Geographic Sales Analysis',
    subtitle: 'Analyze region-wise sales performance, identify high-growth markets, and uncover expansion opportunities.',
    variant: 'sales'
  },
  '/demand': {
    title: 'Customer Demand Analysis',
    subtitle: 'Analyze location-based customer demand, identify high-demand regions, and discover unmet market opportunities.',
    variant: 'demand'
  },
  '/stores': {
    title: 'Store Location Analysis',
    subtitle: 'Analyze existing store locations, coverage areas, capacities, and store performance across regions.',
    variant: 'stores'
  },
  '/market-gap': {
    title: 'Market Gap Analysis',
    subtitle: 'Identify high-demand regions with low store presence to uncover optimal expansion opportunities.',
    variant: 'market-gap'
  },
  '/competitors': {
    title: 'Competitor Analysis',
    subtitle: 'Analyze competitor locations, density, market saturation, and competitive proximity.',
    variant: 'competitors'
  },
  '/population': {
    title: 'Population & Demographic Analysis',
    subtitle: 'Evaluate population density, purchasing potential scores, and urban-rural demand dynamics.',
    variant: 'population'
  },
  '/revenue': {
    title: 'Regional Revenue Analysis',
    subtitle: 'Review revenue contribution, profit margins, and operating cost dynamics across states.',
    variant: 'revenue'
  },
  '/opportunities': {
    title: 'Expansion Opportunities',
    subtitle: 'Explore ranked candidate locations evaluated by our multi-factor geospatial opportunity index.',
    variant: 'opportunities'
  },
  '/recommendations': {
    title: 'Smart Location Recommendations',
    subtitle: 'Explainable AI recommendation engine with dynamic factor weights and financial payback models.',
    variant: 'recommendations'
  },
  '/simulator': {
    title: 'What-If Expansion Simulator',
    subtitle: 'Simulate business expansion strategies, model capital expenditures, and project market coverage gains.',
    variant: 'simulator'
  },
  '/datasets': {
    title: 'Dataset Management',
    subtitle: 'Upload, validate, inspect schemas, and manage retail and geographic datasets.',
    variant: 'datasets'
  },
  '/reports': {
    title: 'Reports & Export',
    subtitle: 'Generate and download comprehensive geospatial intelligence reports in PDF, CSV, and Excel.',
    variant: 'reports'
  },
  '/settings': {
    title: 'Platform Settings',
    subtitle: 'Configure map preferences, scoring weights, themes, and application defaults.',
    variant: 'settings'
  }
};

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const currentMeta = ROUTE_META[location.pathname] || {
    title: 'GeoIQ Analytics',
    subtitle: 'Geospatial Business Expansion Platform',
    variant: 'default'
  };

  return (
    <div className="flex min-h-screen bg-[#050509] text-[#F8FAFC] relative">
      {/* Background Visualizations */}
      <PageBackground variant={currentMeta.variant} showWave={true} />

      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header title={currentMeta.title} subtitle={currentMeta.subtitle} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
