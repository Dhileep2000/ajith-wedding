import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '../../config/weddingConfig';
import { Heart, HeartOff, Send, User, Users, Phone, MessageSquare } from 'lucide-react';

type RSVPState = 'initial' | 'yes-form' | 'submitted' | 'declined';

/**
 * Scene 11 — Premium RSVP with animated form and cinematic confirmation
 */
export default function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<RSVPState>('initial');
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.rsvp-animate'),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
    existing.push({ ...formData, timestamp: new Date().toISOString(), attending: true });
    localStorage.setItem('wedding-rsvp', JSON.stringify(existing));
    setState('submitted');
  };

  const handleDecline = () => {
    const existing = JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
    existing.push({ attending: false, timestamp: new Date().toISOString() });
    localStorage.setItem('wedding-rsvp', JSON.stringify(existing));
    setState('declined');
  };

  return (
    <section ref={sectionRef} id="rsvp" className="scene scene-dark relative z-10">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ── Initial State ── */}
          {state === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <p className="rsvp-animate text-label mb-4">RSVP</p>
              <h2 className="rsvp-animate text-heading-lg mb-4">{weddingConfig.rsvp.heading}</h2>
              <div className="rsvp-animate gold-line mb-10" />

              <div className="rsvp-animate flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="btn-premium"
                  onClick={() => setState('yes-form')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(212, 165, 116, 0.15)',
                    borderColor: 'rgba(212, 165, 116, 0.5)',
                  }}
                >
                  <Heart size={16} className="text-champagne" />
                  <span>{weddingConfig.rsvp.yesButton}</span>
                </motion.button>

                <motion.button
                  className="btn-premium"
                  onClick={handleDecline}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <HeartOff size={16} />
                  <span>{weddingConfig.rsvp.noButton}</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Form State ── */}
          {state === 'yes-form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center"
            >
              <p className="text-label mb-4">We're So Happy!</p>
              <h3 className="font-serif text-2xl text-champagne mb-8">Tell Us About You</h3>

              <div className="w-full max-w-sm flex flex-col gap-4 mb-8">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-champagne" style={{ opacity: 0.5 }} />
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input-premium pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-champagne" style={{ opacity: 0.5 }} />
                  <select
                    className="input-premium pl-10 appearance-none"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n} style={{ background: '#2D2A26', color: '#FAF6F0' }}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-champagne" style={{ opacity: 0.5 }} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input-premium pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-champagne" style={{ opacity: 0.5 }} />
                  <textarea
                    placeholder="A Message for the Couple"
                    className="input-premium pl-10 min-h-24 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  className="btn-premium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(212, 165, 116, 0.15)',
                    borderColor: 'rgba(212, 165, 116, 0.5)',
                  }}
                >
                  <Send size={14} />
                  <span>Confirm RSVP</span>
                </motion.button>

                <motion.button
                  type="button"
                  className="btn-premium text-xs"
                  onClick={() => setState('initial')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Back
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* ── Submitted State ── */}
          {state === 'submitted' && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-5xl mb-6"
              >
                💛
              </motion.div>
              <h3 className="font-serif text-3xl gold-shimmer mb-4">Thank You!</h3>
              <p className="text-body max-w-xs">{weddingConfig.rsvp.confirmationMessage}</p>

              {/* Celebration particles */}
              <div className="relative w-40 h-20 mt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i % 2 === 0 ? '#D4A574' : '#C9A84C',
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 120,
                      y: (Math.random() - 0.5) * 80,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Declined State ── */}
          {state === 'declined' && (
            <motion.div
              key="declined"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl mb-6">🤍</div>
              <h3 className="font-serif text-2xl text-champagne mb-4">We Understand</h3>
              <p className="text-body max-w-xs">{weddingConfig.rsvp.declineMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
