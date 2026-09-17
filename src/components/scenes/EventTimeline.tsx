import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig, type WeddingEvent } from '../../config/weddingConfig';
import { MapPin, Clock as ClockIcon, Calendar } from 'lucide-react';

/**
 * Scene 09 — Wedding event timeline with scroll-triggered staggered reveals
 */
export default function EventTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.timeline-header'),
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

      section.querySelectorAll('.event-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    };
    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="scene scene-dark relative z-10">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto w-full">
        <p className="timeline-header text-label mb-4">The Celebrations</p>
        <h2 className="timeline-header text-heading-lg mb-4">
          Wedding <span className="text-champagne italic">Events</span>
        </h2>
        <div className="timeline-header gold-line mb-12" />

        {/* Timeline */}
        <div className="relative w-full">
          {/* Vertical line */}
          <div
            className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 hidden md:block"
            style={{ height: '100%' }}
          />

          <div className="flex flex-col gap-8 md:gap-12">
            {weddingConfig.events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`event-card relative flex items-center w-full ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col`}
    >
      {/* Card */}
      <motion.div
        className={`w-full md:w-5/12 p-6 ${isLeft ? 'md:text-right' : 'md:text-left'} text-center`}
        style={{
          background: 'rgba(45, 42, 38, 0.6)',
          border: '1px solid rgba(212, 165, 116, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{
          borderColor: 'rgba(212, 165, 116, 0.35)',
          boxShadow: '0 8px 32px rgba(212, 165, 116, 0.08)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-3xl mb-3">{event.icon}</div>
        <h3 className="font-serif text-xl md:text-2xl text-champagne mb-3">{event.name}</h3>
        <p className="text-body text-sm mb-4">{event.description}</p>

        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-2 text-xs text-muted-rose ${isLeft ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
            <Calendar size={12} />
            <span>{event.date}</span>
          </div>
          <div className={`flex items-center gap-2 text-xs text-muted-rose ${isLeft ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
            <ClockIcon size={12} />
            <span>{event.time}</span>
          </div>
          <div className={`flex items-center gap-2 text-xs text-muted-rose ${isLeft ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
            <MapPin size={12} />
            <span>{event.venue}</span>
          </div>
        </div>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex w-2/12 justify-center">
        <div
          className="w-4 h-4 rounded-full z-10"
          style={{
            background: 'linear-gradient(135deg, #D4A574, #C9A84C)',
            boxShadow: '0 0 12px rgba(212, 165, 116, 0.4)',
          }}
        />
      </div>

      {/* Spacer */}
      <div className="hidden md:block w-5/12" />

      {/* Mobile separator */}
      <div className="md:hidden gold-line-vertical mt-2" />
    </div>
  );
}
