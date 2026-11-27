import React, { createContext, useContext, useState } from 'react';
import { Filter, Calendar, MapPin, Store, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types';

const STATES = [
  'All States',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Delhi',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Rajasthan',
  'Odisha',
  'Madhya Pradesh'
];

const REGIONS = ['All Regions', 'South', 'West', 'North', 'East', 'Central'];
const STORE_TYPES = ['All Store Types', 'Flagship', 'Standard', 'Express', 'Franchise'];
const DATE_RANGES = ['Last 30 Days', 'Last 6 Months', 'Year 2024 (Full)'];

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: {
    region: 'All Regions',
    state: 'All States',
    city: 'All',
    category: 'All',
    storeType: 'All Store Types',
    dateRange: 'Year 2024 (Full)'
  },
  setFilters: () => {},
  resetFilters: () => {}
});

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    region: 'All Regions',
    state: 'All States',
    city: 'All',
    category: 'All',
    storeType: 'All Store Types',
    dateRange: 'Year 2024 (Full)'
  });

  const resetFilters = () => {
    setFilters({
      region: 'All Regions',
      state: 'All States',
      city: 'All',
      category: 'All',
      storeType: 'All Store Types',
      dateRange: 'Year 2024 (Full)'
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);

export const FilterCard: React.FC<{ onApply?: () => void }> = ({ onApply }) => {
  const { filters, setFilters, resetFilters } = useFilters();

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-900/20 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-white">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {/* Date Range */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-purple-400" /> Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full text-xs px-3 py-2 rounded-lg bg-[#080B16] border border-purple-500/20 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {DATE_RANGES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-cyan-400" /> Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="w-full text-xs px-3 py-2 rounded-lg bg-[#080B16] border border-purple-500/20 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-violet-400" /> State
          </label>
          <select
            value={filters.state}
            onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            className="w-full text-xs px-3 py-2 rounded-lg bg-[#080B16] border border-purple-500/20 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Store Type */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <Store className="w-3 h-3 text-emerald-400" /> Store Type
          </label>
          <select
            value={filters.storeType}
            onChange={(e) => setFilters(prev => ({ ...prev, storeType: e.target.value }))}
            className="w-full text-xs px-3 py-2 rounded-lg bg-[#080B16] border border-purple-500/20 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {STORE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-purple transition-all"
      >
        Apply Filters
      </button>
    </div>
  );
};
