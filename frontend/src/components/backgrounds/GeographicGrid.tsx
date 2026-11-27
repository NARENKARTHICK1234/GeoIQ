import React from 'react';

export const GeographicGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.22 }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ opacity }}
    >
      {/* Precision coordinate grid lines */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geo-grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(124, 58, 237, 0.28)"
              strokeWidth="0.75"
            />
            {/* Small corner crosses */}
            <circle cx="80" cy="0" r="1.5" fill="rgba(34, 211, 238, 0.45)" />
            <circle cx="0" cy="80" r="1.5" fill="rgba(168, 85, 247, 0.45)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-grid-pattern)" />
      </svg>
      {/* Subtle radial fade for grid */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
};
