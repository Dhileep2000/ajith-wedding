import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { RotateCcw, Heart } from 'lucide-react';

interface FinalSceneProps {
  onReplay: () => void;
}

/**
 * Scene 12 — Final cinematic reveal with couple names and replay option
 */
export default function FinalScene({ onReplay }: FinalSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);

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
        },
      });

      tl.fromTo(
        section.querySelectorAll('.finale-text'),
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.4,
          ease: 'power3.out',
        }
      )
        .fromTo(
          section.querySelector('.finale-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power2.inOut' },
          '-=0.3'
        )
        .fromTo(
          section.querySelectorAll('.finale-names'),
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          section.querySelectorAll('.finale-cta'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
          '-=0.3'
        );
    };
    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="scene relative z-10" style={{ minHeight: '100vh' }}>
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Closing text */}
        <p className="finale-text text-label mb-8">{weddingConfig.finale.line1}</p>
        <h2 className="finale-text text-heading-xl mb-8">
          {weddingConfig.finale.line2}
        </h2>

        <div
          className="finale-line gold-line w-24"
          style={{ transformOrigin: 'center' }}
        />

        {/* Couple Names */}
        <div className="mt-10 mb-4">
          <h3 className="finale-names font-serif text-3xl md:text-4xl gold-shimmer">
            {weddingConfig.bride.firstName}
          </h3>
          <p className="finale-names text-ampersand my-2">&</p>
          <h3 className="finale-names font-serif text-3xl md:text-4xl gold-shimmer">
            {weddingConfig.groom.firstName}
          </h3>
        </div>

        {/* Date */}
        <p className="finale-names text-label mt-6 mb-10">
          {weddingConfig.wedding.displayDate}
        </p>

        {/* See You There */}
        <motion.p
          className="finale-cta font-serif text-xl text-champagne italic flex items-center gap-2 mb-10"
          whileHover={{ scale: 1.05 }}
        >
          {weddingConfig.finale.closing}{' '}
          <Heart size={16} className="text-champagne" fill="currentColor" />
        </motion.p>

        {/* Replay */}
        <motion.button
          className="finale-cta btn-premium text-xs"
          onClick={onReplay}
          whileHover={{ scale: 1.03, rotate: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <RotateCcw size={14} />
          <span>{weddingConfig.finale.replay}</span>
        </motion.button>
      </div>
    </section>
  );
}
