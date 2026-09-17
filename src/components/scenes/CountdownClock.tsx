import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Scene 07 — Animated clock + live countdown timer
 */
export default function CountdownClock() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [clockRevealed, setClockRevealed] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const weddingDate = new Date(
      `${weddingConfig.wedding.date}T${weddingConfig.wedding.time}:00`
    );
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.clock-animate'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
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

  const now = new Date();
  const hourAngle = ((now.getHours() % 12) / 12) * 360 + (now.getMinutes() / 60) * 30;
  const minuteAngle = (now.getMinutes() / 60) * 360;

  const countdownUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <section ref={sectionRef} className="scene scene-dark relative z-10">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <p className="clock-animate text-label mb-4">The Moment</p>

        {/* Clock */}
        <motion.div
          className="clock-animate cursor-pointer mb-8"
          onClick={() => setClockRevealed(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
            {/* Clock face */}
            <circle cx="90" cy="90" r="85" stroke="#D4A574" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="90" cy="90" r="80" stroke="#D4A574" strokeWidth="1" fill="none" opacity="0.2" />

            {/* Hour markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = 90 + 70 * Math.cos(angle);
              const y1 = 90 + 70 * Math.sin(angle);
              const x2 = 90 + 78 * Math.cos(angle);
              const y2 = 90 + 78 * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A574" strokeWidth={i % 3 === 0 ? 2 : 1} opacity={i % 3 === 0 ? 0.6 : 0.3} />
              );
            })}

            {/* Hour hand */}
            <line
              x1="90"
              y1="90"
              x2="90"
              y2="45"
              stroke="#D4A574"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 90 90)`}
              style={{ transition: 'transform 1s ease' }}
            />

            {/* Minute hand */}
            <line
              x1="90"
              y1="90"
              x2="90"
              y2="30"
              stroke="#C4A882"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 90 90)`}
              style={{ transition: 'transform 1s ease' }}
            />

            {/* Center dot */}
            <circle cx="90" cy="90" r="3" fill="#D4A574" />

            {/* Clock icon hint */}
            {!clockRevealed && (
              <text x="90" y="125" textAnchor="middle" fill="#D4A574" fontSize="8" fontFamily="Inter" opacity="0.5">
                TAP
              </text>
            )}
          </svg>
        </motion.div>

        {/* Time Reveal */}
        <motion.div
          className="clock-animate mb-10"
          initial={false}
          animate={{ opacity: clockRevealed ? 1 : 0.4, scale: clockRevealed ? 1 : 0.9 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <Clock size={16} className="text-champagne" />
            <p className="text-label text-xs">Wedding Time</p>
          </div>
          <h3 className="font-serif text-3xl md:text-4xl gold-shimmer">
            {weddingConfig.wedding.displayTime}
          </h3>
        </motion.div>

        {/* Countdown */}
        <div className="clock-animate">
          <p className="text-label mb-6">Countdown to Forever</p>

          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {countdownUnits.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2"
                  style={{
                    background: 'rgba(212, 165, 116, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.2)',
                  }}
                >
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-2xl md:text-3xl text-champagne"
                  >
                    {String(value).padStart(2, '0')}
                  </motion.span>
                </div>
                <span className="text-label text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
