import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';

/**
 * Scene 10 — Cinematic horizontal photo gallery with parallax depth
 */
export default function StoryGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.gallery-header'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    };
    loadGSAP();
  }, []);

  // Mouse drag scrolling for desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onUp);
    };
  }, []);

  // Gradient colors for placeholder images
  const gradients = [
    'linear-gradient(135deg, #2D2A26, #4A3728)',
    'linear-gradient(135deg, #3A2E24, #5A4430)',
    'linear-gradient(135deg, #2A2520, #483A2C)',
    'linear-gradient(135deg, #352C24, #4E3E30)',
    'linear-gradient(135deg, #2E2822, #443628)',
  ];

  return (
    <section ref={sectionRef} id="story" className="scene-dark relative z-10 py-24">
      <div className="flex flex-col items-center text-center mb-12 px-4">
        <p className="gallery-header text-label mb-4">Our Story</p>
        <h2 className="gallery-header text-heading-lg mb-4">
          A Journey of <span className="text-champagne italic">Love</span>
        </h2>
        <div className="gallery-header gold-line" />
      </div>

      {/* Horizontal Gallery */}
      <div
        ref={scrollRef}
        className="gallery-scroll"
        style={{ cursor: 'grab' }}
      >
        {weddingConfig.story.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <div
              className="relative overflow-hidden group"
              style={{
                width: 'clamp(280px, 40vw, 380px)',
                height: 'clamp(380px, 50vw, 500px)',
              }}
            >
              {/* Placeholder image with gradient */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: gradients[index % gradients.length],
                }}
              >
                {/* Decorative placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(212, 165, 116, 0.1)',
                      border: '1px solid rgba(212, 165, 116, 0.2)',
                    }}
                  >
                    <span className="font-serif text-2xl text-champagne" style={{ opacity: 0.5 }}>
                      {chapter.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(180deg, transparent 40%, rgba(26, 23, 20, 0.9) 100%)',
                }}
              />

              {/* Chapter info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-label text-xs mb-2">{chapter.year}</p>
                <h3 className="font-serif text-xl text-ivory mb-2 group-hover:text-champagne transition-colors duration-300">
                  {chapter.title}
                </h3>
                <p className="text-body text-sm" style={{ opacity: 0.7 }}>
                  {chapter.caption}
                </p>
              </div>

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #D4A574, transparent)' }}
              />
            </div>
          </motion.div>
        ))}

        {/* End spacer */}
        <div style={{ minWidth: '2rem', flexShrink: 0 }} />
      </div>

      {/* Scroll hint */}
      <div className="flex justify-center mt-8">
        <p className="text-label text-xs" style={{ opacity: 0.4 }}>
          ← Drag or swipe to explore →
        </p>
      </div>
    </section>
  );
}
