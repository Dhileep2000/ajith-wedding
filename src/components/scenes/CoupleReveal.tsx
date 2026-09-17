import { useRef, useEffect } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Scene 03 — Dramatic couple name reveal with typography animations
 */
export default function CoupleReveal() {
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
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        section.querySelectorAll('.reveal-label'),
        { opacity: 0, y: 20, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.8, stagger: 0.4, ease: 'power3.out' }
      )
        .fromTo(
          section.querySelectorAll('.reveal-name'),
          { opacity: 0, y: 60, filter: 'blur(12px)', scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 1.4,
            stagger: 0.5,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .fromTo(
          section.querySelector('.reveal-amp'),
          { opacity: 0, scale: 0, rotation: -20 },
          { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(2)' },
          '-=0.8'
        )
        .fromTo(
          section.querySelector('.reveal-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power2.inOut' },
          '-=0.5'
        )
        .fromTo(
          section.querySelector('.reveal-combined'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '-=0.3'
        );
    };

    loadGSAP();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="scene scene-dark relative z-10">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Bride */}
        <div className="mb-12">
          <p className="reveal-label text-label mb-3">{weddingConfig.bride.title}</p>
          <h2 className="reveal-name text-heading-xl gold-shimmer">
            {weddingConfig.bride.firstName}
          </h2>
          <p className="reveal-name font-serif text-muted-rose text-lg italic mt-1">
            {weddingConfig.bride.lastName}
          </p>
        </div>

        {/* Ampersand */}
        <div className="reveal-amp my-6">
          <span className="text-ampersand text-5xl md:text-6xl">&</span>
        </div>

        {/* Groom */}
        <div className="mb-12">
          <p className="reveal-label text-label mb-3">{weddingConfig.groom.title}</p>
          <h2 className="reveal-name text-heading-xl gold-shimmer">
            {weddingConfig.groom.firstName}
          </h2>
          <p className="reveal-name font-serif text-muted-rose text-lg italic mt-1">
            {weddingConfig.groom.lastName}
          </p>
        </div>

        {/* Gold Line */}
        <div className="reveal-line gold-line w-24" style={{ transformOrigin: 'center' }} />

        {/* Combined */}
        <div className="reveal-combined mt-10">
          <p className="text-label mb-4">Together Forever</p>
          <h3 className="font-serif text-2xl md:text-3xl text-ivory">
            <span className="gold-shimmer">{weddingConfig.bride.firstName}</span>
            <span className="text-ampersand mx-4">&</span>
            <span className="gold-shimmer">{weddingConfig.groom.firstName}</span>
          </h3>
        </div>
      </div>
    </section>
  );
}
