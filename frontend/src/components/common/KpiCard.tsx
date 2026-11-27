import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changePositive?: boolean;
  positive?: boolean;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  color?: string;
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changePositive,
  positive = true,
  changeLabel = 'vs prev period',
  icon: Icon,
  iconColor,
  color = 'purple'
}) => {
  const isPositive = changePositive !== undefined ? changePositive : positive;

  const colorMap: Record<string, string> = {
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    magenta: 'text-magenta-400',
    red: 'text-rose-400'
  };

  const finalIconColor = iconColor || colorMap[color] || 'text-cyan-400';

  return (
    <div className="glass-panel glass-panel-hover p-4 relative overflow-hidden flex flex-col justify-between rounded-xl">
      {/* Background ambient glow corner */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400 tracking-wide">{title}</p>
          <h3 className="text-xl font-bold font-display text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/25 shadow-inner">
          <Icon className={`w-4 h-4 ${finalIconColor}`} />
        </div>
      </div>

      {change !== undefined && change !== '' && (
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-purple-900/15 text-[10px]">
          <span
            className={`flex items-center font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
          <span className="text-slate-500 truncate">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
