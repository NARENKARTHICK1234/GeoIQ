import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  Store,
  SplitSquareVertical,
  Crosshair,
  Users,
  TrendingUp,
  Target,
  Sparkles,
  Sliders,
  Database,
  FileSpreadsheet,
  Settings,
  ArrowRight
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Geographic Sales', path: '/sales', icon: MapPin },
  { name: 'Customer Demand', path: '/demand', icon: Flame },
  { name: 'Store Analysis', path: '/stores', icon: Store },
  { name: 'Market Gap', path: '/market-gap', icon: SplitSquareVertical },
  { name: 'Competitor Analysis', path: '/competitors', icon: Crosshair },
  { name: 'Population Analysis', path: '/population', icon: Users },
  { name: 'Revenue Analysis', path: '/revenue', icon: TrendingUp },
  { name: 'Expansion Opportunities', path: '/opportunities', icon: Target },
  { name: 'Location Recommendations', path: '/recommendations', icon: Sparkles },
  { name: 'What-If Simulator', path: '/simulator', icon: Sliders },
  { name: 'Dataset Management', path: '/datasets', icon: Database },
  { name: 'Reports & Export', path: '/reports', icon: FileSpreadsheet },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#080B16]/95 border-r border-purple-900/20 backdrop-blur-xl flex flex-col justify-between z-30 select-none">
      {/* Top Header Logo */}
      <div className="p-5 border-b border-purple-900/15">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-500 to-cyan-400 p-[1.5px] shadow-glow-purple flex items-center justify-center">
            <div className="w-full h-full bg-[#080B16] rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                Q
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                GeoIQ
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight leading-tight">
              Geospatial Business Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/90 to-violet-600/80 text-white shadow-glow-purple font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-purple-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-glow-cyan animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Promo Card */}
      <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-purple-950/40 to-[#11162B]/80 border border-purple-500/25 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-purple-600/30 blur-2xl" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-semibold text-slate-200">
              Expand Smarter
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Deploy AI-driven geospatial strategy across 13 states.
          </p>
          <Link
            to="/recommendations"
            className="w-full flex items-center justify-between text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white transition-all shadow-md group-hover:shadow-glow-purple"
          >
            <span>Smart Recommend</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
