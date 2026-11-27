import React from 'react';
import { AuroraBackground } from './AuroraBackground';
import { GeographicGrid } from './GeographicGrid';
import { ParticleWave } from './ParticleWave';
import { NetworkBackground } from './NetworkBackground';
import { TopographicBackground } from './TopographicBackground';
import { FloatingParticles } from './FloatingParticles';

interface PageBackgroundProps {
  variant?: 'overview' | 'sales' | 'demand' | 'stores' | 'market-gap' | 'competitors' | 'population' | 'revenue' | 'opportunities' | 'recommendations' | 'simulator' | 'datasets' | 'reports' | 'settings' | 'default';
  showWave?: boolean;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({
  variant = 'default',
  showWave = true
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050509]">
      {/* Base Aurora Glow */}
      <AuroraBackground opacity={0.7} />

      {/* Grid Pattern */}
      <GeographicGrid opacity={0.25} />

      {/* Variant-specific dynamic layer */}
      {variant === 'market-gap' && <NetworkBackground opacity={0.35} />}
      {variant === 'competitors' && <NetworkBackground opacity={0.4} />}
      {variant === 'stores' && <TopographicBackground opacity={0.35} />}
      {variant === 'sales' && <TopographicBackground opacity={0.28} />}
      {variant === 'demand' && <FloatingParticles count={55} opacity={0.6} />}
      {variant === 'population' && <FloatingParticles count={40} opacity={0.45} />}
      {variant === 'opportunities' && <NetworkBackground opacity={0.3} />}
      {variant === 'recommendations' && <NetworkBackground opacity={0.35} />}
      {variant === 'simulator' && <GeographicGrid opacity={0.35} />}

      {/* Ambient particles on all analytics pages */}
      <FloatingParticles count={25} opacity={0.35} />

      {/* Digital undulating terrain wave at bottom */}
      {showWave && (
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-60">
          <ParticleWave height={190} />
        </div>
      )}
    </div>
  );
};
