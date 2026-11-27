import React from 'react';

interface AuroraBackgroundProps {
  className?: string;
  opacity?: number;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  opacity = 0.65
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Radial ambient glow orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-purple-900/35 via-violet-600/20 to-transparent blur-[140px]" />
      <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-900/30 via-cyan-500/18 to-transparent blur-[150px]" />
      <div className="absolute -bottom-[20%] left-[25%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-t from-fuchsia-900/25 via-purple-600/15 to-transparent blur-[160px]" />

      {/* Subtle digital vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050509]/40 to-[#050509]" />
    </div>
  );
};

export default AuroraBackground;
