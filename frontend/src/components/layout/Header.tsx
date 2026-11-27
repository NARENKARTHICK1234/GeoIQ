import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, HelpCircle, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Overview Dashboard",
  subtitle = "A complete geographic view of sales, stores, demand, and expansion opportunities."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/sales?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 px-8 py-4 bg-[#080B16]/80 backdrop-blur-md border-b border-purple-900/15 flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search locations, states, or stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-12 py-1.5 text-xs rounded-xl bg-[#11162B]/90 border border-purple-500/20 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl bg-[#11162B] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl bg-[#11162B] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-purple-900/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shadow-glow-purple cursor-pointer">
            <div className="w-full h-full bg-[#080B16] rounded-full flex items-center justify-center font-bold text-xs text-cyan-300">
              G
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
