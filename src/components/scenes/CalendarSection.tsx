import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { getGoogleCalendarUrl, downloadICSFile } from '../../utils/calendarUtils';
import { Calendar, Download } from 'lucide-react';

/**
 * Scene 06 — Interactive calendar with highlighted wedding date
 */
export default function CalendarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeDate, setActiveDate] = useState<number | null>(null);

  const { year, month, day } = useMemo(() => {
    const d = new Date(weddingConfig.wedding.date);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
    };
  }, []);

  const monthName = new Date(year, month).toLocaleString('en', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [daysInMonth, firstDayOfWeek]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.cal-animate'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
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
    <section ref={sectionRef} className="scene scene-dark relative z-10" id="events">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <p className="cal-animate text-label mb-4">Save the Date</p>
        <h2 className="cal-animate text-heading-lg mb-2">
          {monthName} <span className="text-champagne">{year}</span>
        </h2>
        <div className="cal-animate gold-line mb-8" />

        {/* Calendar Grid */}
        <div
          className="cal-animate w-full max-w-sm p-6 md:p-8"
          style={{
            background: 'rgba(45, 42, 38, 0.6)',
            border: '1px solid rgba(212, 165, 116, 0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map((d) => (
              <div key={d} className="text-label text-xs text-center py-1" style={{ fontSize: '0.65rem' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => {
              const isWeddingDay = d === day;
              const isActive = activeDate === d;

              return (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {d !== null ? (
                    <motion.button
                      className="w-full h-full flex items-center justify-center rounded-full text-sm font-sans relative"
                      style={{
                        color: isWeddingDay ? '#1A1714' : 'rgba(250, 246, 240, 0.7)',
                        background: isWeddingDay
                          ? 'linear-gradient(135deg, #D4A574, #C9A84C)'
                          : isActive
                          ? 'rgba(212, 165, 116, 0.1)'
                          : 'transparent',
                        fontWeight: isWeddingDay ? 600 : 400,
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDate(d)}
                    >
                      {d}
                      {isWeddingDay && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: '2px solid rgba(212, 165, 116, 0.6)',
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 0, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </motion.button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wedding Date Display */}
        <motion.div
          className="cal-animate mt-8 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-champagne">
            {weddingConfig.wedding.displayDate}
          </h3>
        </motion.div>

        {/* Add to Calendar */}
        <div className="cal-animate flex flex-col sm:flex-row gap-3 mt-4">
          <motion.a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium text-xs flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={14} />
            Google Calendar
          </motion.a>
          <motion.button
            className="btn-premium text-xs flex items-center gap-2"
            onClick={() => downloadICSFile()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={14} />
            Apple Calendar
          </motion.button>
        </div>
      </div>
    </section>
  );
}
