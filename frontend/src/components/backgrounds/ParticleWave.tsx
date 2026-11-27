import React, { useEffect, useRef } from 'react';
import { useBackground } from './BackgroundProvider';

interface ParticleWaveProps {
  color?: string; // default purple-cyan
  opacity?: number;
  height?: number;
  className?: string;
}

export const ParticleWave: React.FC<ParticleWaveProps> = ({
  color = 'purple',
  opacity = 0.85,
  height = 240,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reducedMotion } = useBackground();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!reducedMotion) {
        step += 0.018;
      }

      const numLines = 14;
      const points = 70;
      const width = canvas.width;
      const h = canvas.height;

      for (let j = 0; j < numLines; j++) {
        ctx.beginPath();
        const progress = j / numLines;
        
        // Gradient from electric purple to neon cyan & magenta
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, `rgba(124, 58, 237, ${0.15 + progress * 0.4})`);
        grad.addColorStop(0.5, `rgba(168, 85, 247, ${0.25 + progress * 0.5})`);
        grad.addColorStop(0.8, `rgba(34, 211, 238, ${0.3 + progress * 0.55})`);
        grad.addColorStop(1, `rgba(217, 70, 239, ${0.2 + progress * 0.45})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + j * 0.15;

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * width;
          const angle = (i * 0.18) + step + (j * 0.35);
          const y = h * 0.65 + Math.sin(angle) * (20 + j * 3.5) + Math.cos(angle * 0.5) * 15;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw small glowing dots along every 4th point of upper lines
          if (j > 8 && i % 4 === 0) {
            ctx.fillStyle = j % 2 === 0 ? 'rgba(34, 211, 238, 0.7)' : 'rgba(168, 85, 247, 0.7)';
            ctx.fillRect(x - 1, y - 1, 2.5, 2.5);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion, height, color]);

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
