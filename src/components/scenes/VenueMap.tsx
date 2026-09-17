import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

/**
 * Scene 08 — Venue with animated SVG map route and destination reveal
 */
export default function VenueMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            setTimeout(() => setRevealed(true), 2000);
          },
        },
      });

      tl.fromTo(
        section.querySelectorAll('.venue-animate'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );

      // Animate the route path
      const routePath = section.querySelector('.route-path') as SVGPathElement | null;
      if (routePath) {
        const length = routePath.getTotalLength();
        gsap.set(routePath, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(
          routePath,
          { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' },
          '-=0.5'
        );
      }
    };
    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} id="venue" className="scene scene-dark relative z-10">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <p className="venue-animate text-label mb-4">Follow the Journey</p>
        <h2 className="venue-animate text-heading-lg mb-8">
          The <span className="text-champagne italic">Destination</span>
        </h2>

        {/* Stylized Map */}
        <div className="venue-animate w-full max-w-md mb-8">
          <svg viewBox="0 0 400 300" className="w-full" style={{ opacity: 0.8 }}>
            {/* Map background shapes */}
            <rect x="0" y="0" width="400" height="300" fill="rgba(45, 42, 38, 0.5)" rx="4" />

            {/* Water/Lake */}
            <ellipse cx="280" cy="200" rx="80" ry="50" fill="rgba(212, 165, 116, 0.06)" stroke="rgba(212, 165, 116, 0.1)" strokeWidth="0.5" />

            {/* Roads */}
            <path d="M0 150 L100 140 L200 120 L300 130 L400 150" stroke="rgba(212, 165, 116, 0.15)" strokeWidth="2" fill="none" />
            <path d="M200 0 L190 100 L200 200 L210 300" stroke="rgba(212, 165, 116, 0.1)" strokeWidth="1.5" fill="none" />

            {/* Animated route */}
            <path
              className="route-path"
              d="M40 250 C80 240, 120 200, 160 180 C200 160, 240 140, 280 120 C300 110, 310 115, 310 130"
              stroke="#D4A574"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Start point */}
            <circle cx="40" cy="250" r="5" fill="rgba(212, 165, 116, 0.4)" stroke="#D4A574" strokeWidth="1" />

            {/* Destination marker */}
            <g transform="translate(310, 115)">
              <motion.g
                animate={revealed ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <circle r="12" fill="rgba(212, 165, 116, 0.2)" />
                <circle r="6" fill="#D4A574" />
                <circle r="2.5" fill="#1A1714" />
              </motion.g>
              {revealed && (
                <motion.circle
                  r="18"
                  fill="none"
                  stroke="#D4A574"
                  strokeWidth="0.5"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>

            {/* Tiny buildings */}
            {[
              { x: 150, y: 90 },
              { x: 170, y: 100 },
              { x: 100, y: 160 },
              { x: 250, y: 170 },
            ].map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width={6}
                height={8}
                fill="rgba(212, 165, 116, 0.1)"
                rx="1"
              />
            ))}
          </svg>
        </div>

        {/* Venue Details */}
        <motion.div
          className="venue-animate"
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            y: revealed ? 0 : 20,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 justify-center mb-3">
            <MapPin size={16} className="text-champagne" />
            <p className="text-label text-xs">The Wedding Venue</p>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl gold-shimmer mb-2">
            {weddingConfig.venue.name}
          </h3>
          <p className="font-serif text-lg text-champagne italic mb-4">
            {weddingConfig.venue.city}
          </p>
          <p className="text-body text-sm max-w-sm mx-auto mb-8">
            {weddingConfig.venue.address}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href={weddingConfig.venue.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium text-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation size={14} />
              Get Directions
              <ExternalLink size={12} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
