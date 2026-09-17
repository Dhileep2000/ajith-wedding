import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ButterflyMotionProps {
  /** Normalized progress 0-1 along journey */
  progress?: number;
  /** Is visible */
  visible?: boolean;
  /** Scale multiplier */
  scale?: number;
}

/**
 * Animated SVG butterfly with natural wing movement and curved path motion.
 * Acts as the visual guide through the wedding story.
 */
export default function ButterflyMotion({
  progress = 0,
  visible = true,
  scale = 1,
}: ButterflyMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, rotation: 0 });
  const animFrame = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const getPathPosition = useCallback(
    (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Bezier-inspired flight path across the screen
      const cx1 = w * 0.2;
      const cy1 = h * 0.3;
      const cx2 = w * 0.8;
      const cy2 = h * 0.6;
      const endX = w * 0.5;
      const endY = h * 0.5;
      const startX = w * 0.1;
      const startY = h * 0.7;

      const u = 1 - t;
      const x = u * u * u * startX + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * endX;
      const y = u * u * u * startY + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * endY;

      // Calculate rotation from tangent
      const dt = 0.01;
      const t2 = Math.min(t + dt, 1);
      const u2 = 1 - t2;
      const x2 =
        u2 * u2 * u2 * startX + 3 * u2 * u2 * t2 * cx1 + 3 * u2 * t2 * t2 * cx2 + t2 * t2 * t2 * endX;
      const y2 =
        u2 * u2 * u2 * startY + 3 * u2 * u2 * t2 * cy1 + 3 * u2 * t2 * t2 * cy2 + t2 * t2 * t2 * endY;
      const rotation = Math.atan2(y2 - y, x2 - x) * (180 / Math.PI);

      return { x, y, rotation };
    },
    []
  );

  useEffect(() => {
    if (reducedMotion || !visible) return;

    let time = 0;
    const animate = () => {
      time += 0.008;
      // Add subtle natural drift to the flight path
      const wobbleX = Math.sin(time * 3) * 8;
      const wobbleY = Math.cos(time * 2.3) * 5;

      const pos = getPathPosition(progress);
      posRef.current = {
        x: pos.x + wobbleX,
        y: pos.y + wobbleY,
        rotation: pos.rotation + Math.sin(time * 4) * 5,
      };

      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${posRef.current.rotation}deg) scale(${scale})`;
      }

      animFrame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animFrame.current);
  }, [progress, visible, scale, getPathPosition, reducedMotion]);

  if (!visible || reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-20 pointer-events-none"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      <svg
        width="48"
        height="40"
        viewBox="0 0 48 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(212, 165, 116, 0.4))' }}
      >
        {/* Left wing */}
        <g className="butterfly-wing-left">
          <path
            d="M24 20 C20 12, 8 4, 4 8 C0 12, 4 20, 10 22 C14 23, 20 22, 24 20Z"
            fill="url(#wingGradLeft)"
            opacity="0.9"
          />
          <path
            d="M24 20 C22 24, 12 32, 8 30 C4 28, 6 22, 12 20 C16 19, 22 19, 24 20Z"
            fill="url(#wingGradLeft2)"
            opacity="0.85"
          />
        </g>
        {/* Right wing */}
        <g className="butterfly-wing-right">
          <path
            d="M24 20 C28 12, 40 4, 44 8 C48 12, 44 20, 38 22 C34 23, 28 22, 24 20Z"
            fill="url(#wingGradRight)"
            opacity="0.9"
          />
          <path
            d="M24 20 C26 24, 36 32, 40 30 C44 28, 42 22, 36 20 C32 19, 26 19, 24 20Z"
            fill="url(#wingGradRight2)"
            opacity="0.85"
          />
        </g>
        {/* Body */}
        <ellipse cx="24" cy="20" rx="1.5" ry="6" fill="#8B6914" />
        {/* Antennae */}
        <path d="M23 14 C21 10, 19 8, 18 6" stroke="#C4A882" strokeWidth="0.5" fill="none" />
        <path d="M25 14 C27 10, 29 8, 30 6" stroke="#C4A882" strokeWidth="0.5" fill="none" />
        <circle cx="18" cy="6" r="1" fill="#D4A574" />
        <circle cx="30" cy="6" r="1" fill="#D4A574" />
        {/* Wing patterns */}
        <circle cx="14" cy="14" r="2.5" fill="rgba(201, 168, 76, 0.3)" />
        <circle cx="34" cy="14" r="2.5" fill="rgba(201, 168, 76, 0.3)" />
        <circle cx="14" cy="24" r="1.8" fill="rgba(201, 168, 76, 0.25)" />
        <circle cx="34" cy="24" r="1.8" fill="rgba(201, 168, 76, 0.25)" />

        <defs>
          <linearGradient id="wingGradLeft" x1="24" y1="8" x2="4" y2="20">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
          <linearGradient id="wingGradLeft2" x1="24" y1="20" x2="8" y2="30">
            <stop offset="0%" stopColor="#C4A882" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
          <linearGradient id="wingGradRight" x1="24" y1="8" x2="44" y2="20">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
          <linearGradient id="wingGradRight2" x1="24" y1="20" x2="40" y2="30">
            <stop offset="0%" stopColor="#C4A882" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
