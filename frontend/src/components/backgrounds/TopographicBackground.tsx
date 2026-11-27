import React from 'react';

export const TopographicBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.25 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          d="M0,150 Q300,50 600,180 T1200,120 T1800,200 L1800,900 L0,900 Z"
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <path
          d="M0,220 Q400,120 800,240 T1600,190 T2000,280"
          fill="none"
          stroke="rgba(34, 211, 238, 0.25)"
          strokeWidth="1.2"
        />
        <path
          d="M0,320 Q500,200 1000,340 T1800,310"
          fill="none"
          stroke="rgba(217, 70, 239, 0.18)"
          strokeWidth="1.2"
          strokeDasharray="6 3"
        />
        <path
          d="M0,450 Q350,380 750,480 T1500,420"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};
