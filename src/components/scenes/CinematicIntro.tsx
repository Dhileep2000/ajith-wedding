import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

/**
 * Scene 01 — Cinematic opening with scroll-driven image sequence behind it.
 * White background, dark text for contrast over the images.
 * The text content overlays the image sequence canvas.
 */
export default function CinematicIntro({ onEnter }: CinematicIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const loadGSAP = async () => {
      const { gsap } = await import('gsap');

      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        '.intro-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      )
        .fromTo(
          '.intro-tagline',
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          '.intro-heading-line',
          { opacity: 0, y: 50, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.3,
            ease: 'power3.out',
          },
          '-=0.8'
        )
        .fromTo(
          '.intro-names',
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.intro-ampersand',
          { opacity: 0, scale: 0.5, rotation: -10 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)' },
          '-=0.8'
        )
        .fromTo(
          '.intro-subtitle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          '.intro-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power2.inOut' },
          '-=0.8'
        )
        .fromTo(
          '.intro-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        );
    };

    loadGSAP();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-10"
      style={{
        /* The section sticks over the image-sequence scroll container */
        position: 'sticky',
        top: 0,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        pointerEvents: 'none', /* allow scroll-through to image sequence */
      }}
    >
      {/* Semi-transparent white overlay so text stays readable over images */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(2px)',
          zIndex: 0,
        }}
      />

      <div
        className="flex flex-col items-center text-center max-w-4xl mx-auto relative"
        style={{ zIndex: 1, pointerEvents: 'auto' }}
      >
        {/* Label */}
        <p
          className="intro-label mb-6 opacity-0"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8B6914',
          }}
        >
          {weddingConfig.invitation.label}
        </p>

        {/* Tagline */}
        <p
          className="intro-tagline mb-8 opacity-0"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            letterSpacing: '0.05em',
            color: '#8B6914',
          }}
        >
          {weddingConfig.invitation.tagline}
        </p>

        {/* Main Heading */}
        <div className="mb-8">
          {weddingConfig.invitation.heading.map((line, i) => (
            <h1
              key={i}
              className="intro-heading-line opacity-0"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#1A1714',
              }}
            >
              {line}
            </h1>
          ))}
        </div>

        {/* Gold Line */}
        <div
          className="intro-line"
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #D4A574, transparent)',
            margin: '1.5rem auto',
            transformOrigin: 'center',
          }}
        />

        {/* Couple Names */}
        <div className="intro-names mt-8 mb-4 opacity-0">
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#8B6914',
            }}
          >
            {weddingConfig.bride.firstName}
          </h2>
          <p
            className="intro-ampersand my-2 opacity-0"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              color: '#D4A574',
            }}
          >
            &
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#8B6914',
            }}
          >
            {weddingConfig.groom.firstName}
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="intro-subtitle mt-6 mb-10 opacity-0"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: '#2D2A26',
            maxWidth: '32rem',
            margin: '1.5rem auto 2.5rem',
          }}
        >
          {weddingConfig.invitation.subtitle}
        </p>

        {/* CTA Button — white bg variant for the light theme */}
        <motion.button
          className="intro-cta opacity-0"
          onClick={onEnter}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2.5rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#1A1714',
            border: '1px solid rgba(139, 105, 20, 0.4)',
            background: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span>{weddingConfig.invitation.cta}</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </section>
  );
}
