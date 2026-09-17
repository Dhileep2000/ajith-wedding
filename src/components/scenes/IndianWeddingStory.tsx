import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Scene 05 — Indian Wedding Story with cultural motifs
 * Modern luxury aesthetic with mandap arch, diyas, rangoli geometry
 */
export default function IndianWeddingStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        section.querySelectorAll('.story-element'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );

      // Animate diya flames
      gsap.to(section.querySelectorAll('.diya-flame'), {
        scaleY: 1.3,
        scaleX: 0.9,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.15 },
      });

      // Animate rangoli rotation
      gsap.to(section.querySelector('.rangoli'), {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
      });
    };

    loadGSAP();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="scene scene-dark relative z-10 overflow-hidden">
      {/* Mandap Arch SVG */}
      <div className="story-element absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl" style={{ opacity: 0.12 }}>
        <svg viewBox="0 0 600 300" fill="none" className="w-full">
          {/* Main arch */}
          <path d="M50 300 L50 100 C50 40 300 0 300 0 C300 0 550 40 550 100 L550 300" stroke="#D4A574" strokeWidth="1.5" fill="none" />
          {/* Inner arch */}
          <path d="M100 300 L100 130 C100 70 300 30 300 30 C300 30 500 70 500 130 L500 300" stroke="#D4A574" strokeWidth="0.8" fill="none" opacity="0.5" />
          {/* Decorative elements on arch */}
          <circle cx="300" cy="15" r="8" stroke="#D4A574" strokeWidth="0.5" fill="none" />
          <circle cx="300" cy="15" r="4" fill="#D4A574" opacity="0.3" />
          {/* Pillars */}
          <rect x="45" y="250" width="15" height="50" fill="none" stroke="#D4A574" strokeWidth="0.5" opacity="0.4" />
          <rect x="540" y="250" width="15" height="50" fill="none" stroke="#D4A574" strokeWidth="0.5" opacity="0.4" />
          {/* Floral garlands */}
          <path d="M120 120 Q200 160 300 140 Q400 120 480 140" stroke="#D4A574" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="3 4" />
        </svg>
      </div>

      {/* Rangoli pattern */}
      <div className="rangoli absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.06 }}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 250 250)`}>
              <path d="M250 100 Q280 180 250 250 Q220 180 250 100" stroke="#D4A574" strokeWidth="0.5" fill="none" />
              <circle cx="250" cy="100" r="4" fill="#D4A574" opacity="0.5" />
            </g>
          ))}
          <circle cx="250" cy="250" r="20" stroke="#D4A574" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="250" r="60" stroke="#D4A574" strokeWidth="0.3" fill="none" />
          <circle cx="250" cy="250" r="120" stroke="#D4A574" strokeWidth="0.2" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <p className="story-element text-label mb-6">A Sacred Beginning</p>

        <h2 className="story-element text-heading-lg mb-8">
          Where Tradition Meets{' '}
          <span className="font-serif italic text-champagne">Forever</span>
        </h2>

        <div className="story-element gold-line mb-8" />

        <p className="story-element text-body max-w-lg mb-12">
          In the glow of sacred fire, under the canopy of blessings, two families unite in the
          timeless traditions of love. Every ritual, every moment — a thread in the tapestry of their story.
        </p>

        {/* Diyas Row */}
        <div className="story-element flex gap-16 mb-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="diya-flame w-3 h-5 rounded-full mb-1" style={{
                background: 'radial-gradient(ellipse, #FFC857 0%, #D4A574 60%, transparent 100%)',
                transformOrigin: 'bottom center',
                filter: 'blur(0.5px)',
              }} />
              <svg width="28" height="16" viewBox="0 0 28 16">
                <path d="M4 0 C4 0 0 8 2 14 L26 14 C28 8 24 0 24 0 Z" fill="#8B6914" opacity="0.6" />
                <path d="M6 2 L22 2 L24 12 L4 12 Z" fill="#D4A574" opacity="0.3" />
              </svg>
            </div>
          ))}
        </div>

        {/* Cultural Elements Grid */}
        <div className="story-element grid grid-cols-3 gap-8 md:gap-16 w-full max-w-md">
          {[
            { symbol: '🪷', label: 'Purity' },
            { symbol: '🔥', label: 'Sacred Fire' },
            { symbol: '✨', label: 'Blessings' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.symbol}</span>
              <span className="text-label text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
