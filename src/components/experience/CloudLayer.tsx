import { useRef, useEffect, useMemo } from 'react';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

interface CloudProps {
  opacity?: number;
}

/**
 * Multi-layered parallax cloud system with soft atmospheric clouds
 * positioned around screen edges. Uses Canvas 2D for performance.
 */
export default function CloudLayer({ opacity = 1 }: CloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceCapability();
  const animFrame = useRef<number>(0);

  const cloudConfig = useMemo(() => {
    const count = tier === 'high' ? 14 : tier === 'medium' ? 8 : 5;
    return generateClouds(count);
  }, [tier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      time += 0.003;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      cloudConfig.forEach((cloud) => {
        const drift = Math.sin(time * cloud.speed + cloud.phase) * cloud.drift;
        const x = cloud.x * w + drift;
        const y = cloud.y * h + Math.cos(time * cloud.speed * 0.5) * 8;

        drawCloud(ctx, x, y, cloud.size * Math.min(w, h) * 0.15, cloud.opacity * opacity);
      });

      animFrame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener('resize', resize);
    };
  }, [cloudConfig, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="cloud-layer"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

interface CloudData {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  drift: number;
  opacity: number;
}

function generateClouds(count: number): CloudData[] {
  const clouds: CloudData[] = [];
  // Distribute clouds around edges
  const positions: Array<{ x: number; y: number }> = [
    // Left edge
    { x: -0.05, y: 0.15 },
    { x: -0.08, y: 0.5 },
    { x: -0.03, y: 0.8 },
    // Right edge
    { x: 1.0, y: 0.2 },
    { x: 1.05, y: 0.55 },
    { x: 0.98, y: 0.85 },
    // Top corners
    { x: 0.1, y: -0.05 },
    { x: 0.85, y: -0.03 },
    // Bottom edges
    { x: 0.15, y: 0.95 },
    { x: 0.8, y: 0.92 },
    { x: 0.5, y: 0.98 },
    // Extra depth clouds
    { x: 0.3, y: 0.1 },
    { x: 0.7, y: 0.12 },
    { x: 0.5, y: 0.05 },
  ];

  for (let i = 0; i < Math.min(count, positions.length); i++) {
    clouds.push({
      x: positions[i].x,
      y: positions[i].y,
      size: 0.6 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      drift: 15 + Math.random() * 25,
      opacity: 0.15 + Math.random() * 0.25,
    });
  }
  return clouds;
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  // Soft cloud shape — multiple overlapping radial gradients
  const puffs = [
    { dx: 0, dy: 0, r: size },
    { dx: -size * 0.6, dy: -size * 0.15, r: size * 0.7 },
    { dx: size * 0.5, dy: -size * 0.1, r: size * 0.75 },
    { dx: -size * 0.3, dy: size * 0.2, r: size * 0.65 },
    { dx: size * 0.35, dy: size * 0.15, r: size * 0.6 },
    { dx: -size * 0.8, dy: size * 0.05, r: size * 0.5 },
    { dx: size * 0.75, dy: 0, r: size * 0.55 },
  ];

  puffs.forEach(({ dx, dy, r }) => {
    const grad = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
    grad.addColorStop(0, 'rgba(245, 230, 208, 0.5)');
    grad.addColorStop(0.3, 'rgba(245, 230, 208, 0.25)');
    grad.addColorStop(0.6, 'rgba(232, 213, 196, 0.1)');
    grad.addColorStop(1, 'rgba(232, 213, 196, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}
