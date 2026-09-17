import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { useIsMobile } from '../../hooks/useDeviceCapability';

/**
 * Scene 04 — Interactive 3D invitation card with tilt and open/close
 */
export default function Invitation3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse/touch tilt effect
  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner || isOpen) return;

    const handleMove = (clientX: number, clientY: number) => {
      const rect = card.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      const rotateX = y * -12;
      const rotateY = x * 12;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleLeave = () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleMouse);
    card.addEventListener('touchmove', handleTouch, { passive: true });
    card.addEventListener('mouseleave', handleLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouse);
      card.removeEventListener('touchmove', handleTouch);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, [isOpen]);

  // GSAP scroll trigger
  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector('.invitation-card-wrapper'),
        { opacity: 0, y: 80, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    };
    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="scene scene-dark relative z-10">
      <p className="text-label mb-8">The Invitation</p>

      <div className="invitation-card-wrapper">
        <div
          ref={cardRef}
          className="card-3d cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          style={{ perspective: '1200px' }}
        >
          <div
            ref={innerRef}
            className="card-3d-inner relative"
            style={{
              width: isMobile ? '320px' : '420px',
              minHeight: isMobile ? '460px' : '560px',
              transition: isOpen ? 'transform 0.6s ease' : 'transform 0.1s ease-out',
            }}
          >
            <AnimatePresence mode="wait">
              {!isOpen ? (
                /* ── Card Front ── */
                <motion.div
                  key="front"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(45, 42, 38, 0.95), rgba(26, 23, 20, 0.98))',
                    border: '1px solid rgba(212, 165, 116, 0.3)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 165, 116, 0.1)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Ornamental corners */}
                  <CornerOrnament position="top-left" />
                  <CornerOrnament position="top-right" />
                  <CornerOrnament position="bottom-left" />
                  <CornerOrnament position="bottom-right" />

                  {/* Inner border */}
                  <div
                    className="absolute inset-4 border pointer-events-none"
                    style={{ borderColor: 'rgba(212, 165, 116, 0.15)' }}
                  />

                  <p className="text-label mb-6">{weddingConfig.invitation.label}</p>
                  <div className="gold-line mb-6" />

                  <h3 className="font-serif text-3xl md:text-4xl gold-shimmer mb-2">
                    {weddingConfig.bride.firstName}
                  </h3>
                  <span className="text-ampersand my-1">&</span>
                  <h3 className="font-serif text-3xl md:text-4xl gold-shimmer mt-2">
                    {weddingConfig.groom.firstName}
                  </h3>

                  <div className="gold-line mt-6 mb-6" />

                  <p className="text-label text-xs" style={{ color: 'rgba(212, 165, 116, 0.6)' }}>
                    Tap to Open
                  </p>
                </motion.div>
              ) : (
                /* ── Card Inside ── */
                <motion.div
                  key="inside"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(250, 246, 240, 0.03), rgba(45, 42, 38, 0.95))',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Ornamental corners */}
                  <CornerOrnament position="top-left" />
                  <CornerOrnament position="top-right" />
                  <CornerOrnament position="bottom-left" />
                  <CornerOrnament position="bottom-right" />

                  <div
                    className="absolute inset-4 border pointer-events-none"
                    style={{ borderColor: 'rgba(212, 165, 116, 0.1)' }}
                  />

                  {/* Om / Shubh symbol */}
                  <p className="font-serif text-champagne text-2xl mb-4" style={{ opacity: 0.7 }}>
                    ॐ
                  </p>

                  <p className="text-label mb-4 text-xs">Shubh Vivah</p>

                  <div className="gold-line mb-4" />

                  <p className="text-body text-sm leading-relaxed max-w-xs mb-6">
                    {weddingConfig.invitation.cardMessage}
                  </p>

                  <div className="gold-line mb-4" />

                  <h4 className="font-serif text-xl gold-shimmer mb-1">
                    {weddingConfig.bride.firstName} & {weddingConfig.groom.firstName}
                  </h4>
                  <p className="text-label text-xs mt-2">{weddingConfig.wedding.displayDate}</p>
                  <p className="text-body text-xs mt-1">
                    {weddingConfig.venue.name}, {weddingConfig.venue.city}
                  </p>

                  <p
                    className="text-label text-xs mt-6"
                    style={{ color: 'rgba(212, 165, 116, 0.5)' }}
                  >
                    Tap to Close
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerOrnament({ position }: { position: string }) {
  const rotations: Record<string, string> = {
    'top-left': '0deg',
    'top-right': '90deg',
    'bottom-right': '180deg',
    'bottom-left': '270deg',
  };

  const positions: Record<string, React.CSSProperties> = {
    'top-left': { top: 8, left: 8 },
    'top-right': { top: 8, right: 8 },
    'bottom-right': { bottom: 8, right: 8 },
    'bottom-left': { bottom: 8, left: 8 },
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="absolute"
      style={{
        ...positions[position],
        transform: `rotate(${rotations[position]})`,
        opacity: 0.4,
      }}
    >
      <path
        d="M2 22 L2 12 C2 6 6 2 12 2 L22 2"
        stroke="#D4A574"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="12" cy="2" r="1.5" fill="#D4A574" opacity="0.5" />
    </svg>
  );
}
