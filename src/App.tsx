import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Heart, HeartOff, Send, User, Users, Phone, MessageSquare, ExternalLink, Download, ArrowUp, ChevronDown } from 'lucide-react';
import ScrollSequence from './components/experience/ImageSequence';
import { weddingConfig } from './config/weddingConfig';
import { getGoogleCalendarUrl, downloadICSFile } from './utils/calendarUtils';
// Speed Insights for Vercel:
// Note: In Vite/React apps, use '@vercel/speed-insights/react'. Next.js apps use '@vercel/speed-insights/next'.
import { SpeedInsights } from '@vercel/speed-insights/react';

/* ────────────────────────────────────────────────────────────
   Shared animation variants
   ──────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ────────────────────────────────────────────────────────────
   Section wrapper with scroll-triggered reveal
   ──────────────────────────────────────────────────────────── */
const Section = forwardRef<
  HTMLElement,
  {
    children: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
  }
>(({ children, className = '', id, style }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '720px',
        margin: '0 auto',
        ...style,
      }}
    >
      {children}
    </section>
  );
});
Section.displayName = 'Section';

/* ────────────────────────────────────────────────────────────
   Decorative divider
   ──────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div
        style={{
          width: 60,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #D4A574, transparent)',
          margin: '0 auto',
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main App — one continuous invitation page

   STRICT LOADING ORDER:
   1. ajith-i (frames 35–300) → Hero scroll animation → COMPLETE
   2. Ajith & Sneha section  → Invitation / text     → COMPLETE
   3. ajith-b (frames 1–180) → Second scroll animation (deferred)
   ──────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{ background: '#ffffff', color: '#2D2A26', minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════════════════════
         SECTION 1: ajith-i scroll animation (frames 35–300)
         Loads immediately on page open.
         ═══════════════════════════════════════════════════════ */}
      <ScrollSequence
        folder="ajith-i"
        startFrame={35}
        endFrame={300}
        scrollHeight={300}
        bgColor="#ffffff"
      />

      {/* ─── Scroll indicator ─── */}
      <div style={{ textAlign: 'center', padding: '2rem 0 0', background: '#fff' }}>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} style={{ color: '#D4A574' }} />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         SECTION 2: Ajith & Sneha — Invitation content
         Renders immediately (text-only), no images to load.
         ═══════════════════════════════════════════════════════ */}
      <InvitationSection />

      {/* ─── Date & Time ─── */}
      <DateTimeSection />

      {/* ═══════════════════════════════════════════════════════
         SECTION 3: ajith-b scroll animation (frames 1–180)
         deferLoad=true → NO images loaded until user scrolls
         past sections 1 & 2 and this section enters viewport.
         ═══════════════════════════════════════════════════════ */}
      <ScrollSequence
        folder="ajith-b"
        startFrame={1}
        endFrame={180}
        scrollHeight={300}
        bgColor="#FAF6F0"
        deferLoad={true}
      />

      {/* ─── Events ─── */}
      <EventsSection />

      {/* ─── Venue ─── */}
      <VenueSection />

      {/* ─── RSVP ─── */}
      <RSVPFullSection />

      {/* ─── Footer ─── */}
      <FooterSection />

      {/* ─── Vercel Speed Insights (Tracks real-world mobile & desktop performance) ─── */}
      <SpeedInsights />
    </div>
  );
}

/* ====================================================================
   INVITATION SECTION
   ==================================================================== */
function InvitationSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(
        el.querySelectorAll('.inv-anim'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    };
    loadGSAP();
  }, []);

  return (
    <section ref={ref} id="invitation" style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
      {/* Om */}
      <p className="inv-anim" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#D4A574', opacity: 0.5, marginBottom: '1rem' }}>ॐ</p>

      <p className="inv-anim" style={labelStyle}>Shubh Vivah</p>

      <Divider />

      <h1 className="inv-anim" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 400, lineHeight: 1.1, color: '#2D2A26', margin: '1.5rem 0' }}>
        {weddingConfig.bride.firstName}
      </h1>

      <p className="inv-anim" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#D4A574', margin: '0.25rem 0' }}>&</p>

      <h1 className="inv-anim" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 400, lineHeight: 1.1, color: '#2D2A26', margin: '1.5rem 0 2rem' }}>
        {weddingConfig.groom.firstName}
      </h1>

      <Divider />

      <p className="inv-anim" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.875rem, 1.5vw, 1.05rem)', fontWeight: 300, lineHeight: 1.8, color: '#6B5E50', maxWidth: 480, margin: '2rem auto' }}>
        {weddingConfig.invitation.cardMessage}
      </p>

      <p className="inv-anim" style={{ ...labelStyle, marginTop: '2rem' }}>{weddingConfig.wedding.displayDate}</p>
    </section>
  );
}

/* ====================================================================
   DATE & TIME SECTION
   ==================================================================== */
function DateTimeSection() {
  const ref = useRef<HTMLElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calcTime = useCallback(() => {
    const w = new Date(`${weddingConfig.wedding.date}T${weddingConfig.wedding.time}:00`);
    const diff = w.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, []);

  useEffect(() => {
    setTimeLeft(calcTime());
    const id = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(id);
  }, [calcTime]);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(el.querySelectorAll('.dt-anim'), { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
    };
    loadGSAP();
  }, []);

  const units = [
    { v: timeLeft.days, l: 'Days' },
    { v: timeLeft.hours, l: 'Hours' },
    { v: timeLeft.minutes, l: 'Minutes' },
    { v: timeLeft.seconds, l: 'Seconds' },
  ];

  return (
    <Section ref={ref} id="date" style={{ textAlign: 'center' }}>
      <p className="dt-anim" style={labelStyle}>Save the Date</p>

      <h2 className="dt-anim" style={headingStyle}>{weddingConfig.wedding.displayDate}</h2>

      <div className="dt-anim" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '0.5rem 0 1.5rem' }}>
        <Clock size={16} style={{ color: '#D4A574' }} />
        <span style={{ ...labelStyle, margin: 0 }}>{weddingConfig.wedding.displayTime}</span>
      </div>

      <Divider />

      {/* Countdown */}
      <p className="dt-anim" style={{ ...labelStyle, marginTop: '2rem', marginBottom: '1.5rem' }}>Countdown to Forever</p>

      <div className="dt-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 400, margin: '0 auto 2rem' }}>
        {units.map(({ v, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={countdownBox}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#8B6914' }}>
                {String(v).padStart(2, '0')}
              </span>
            </div>
            <span style={{ ...labelStyle, fontSize: '0.6rem', margin: '0.5rem 0 0' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Calendar buttons */}
      <div className="dt-anim" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          <Calendar size={14} /> Google Calendar
        </a>
        <button onClick={() => downloadICSFile()} style={btnStyle}>
          <Download size={14} /> Apple Calendar
        </button>
      </div>
    </Section>
  );
}

/* ====================================================================
   EVENTS SECTION
   ==================================================================== */
function EventsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll('.ev-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
          });
      });
    };
    loadGSAP();
  }, []);

  return (
    <Section ref={ref} id="events" style={{ textAlign: 'center' }}>
      <p style={labelStyle}>The Celebrations</p>
      <h2 style={headingStyle}>Wedding Events</h2>
      <Divider />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {weddingConfig.events.map((ev) => (
          <motion.div
            key={ev.id}
            className="ev-card"
            style={eventCard}
            whileHover={{ borderColor: 'rgba(212,165,116,0.4)', boxShadow: '0 8px 30px rgba(212,165,116,0.08)' }}
          >
            <span style={{ fontSize: '1.75rem', marginBottom: 8 }}>{ev.icon}</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#2D2A26', marginBottom: 8 }}>{ev.name}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#6B5E50', lineHeight: 1.6, marginBottom: 12 }}>{ev.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={eventMeta}><Calendar size={12} />{ev.date}</div>
              <div style={eventMeta}><Clock size={12} />{ev.time}</div>
              <div style={eventMeta}><MapPin size={12} />{ev.venue}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ====================================================================
   VENUE SECTION
   ==================================================================== */
function VenueSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(el.querySelectorAll('.ven-anim'), { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
    };
    loadGSAP();
  }, []);

  return (
    <Section ref={ref} id="venue" style={{ textAlign: 'center' }}>
      <p className="ven-anim" style={labelStyle}>The Venue</p>
      <h2 className="ven-anim" style={headingStyle}>{weddingConfig.venue.name}</h2>
      <p className="ven-anim" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.15rem', color: '#D4A574', marginBottom: '0.5rem' }}>{weddingConfig.venue.city}</p>

      <Divider />

      <p className="ven-anim" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#6B5E50', lineHeight: 1.7, maxWidth: 420, margin: '1.5rem auto 2rem' }}>
        {weddingConfig.venue.address}
      </p>

      <motion.a
        className="ven-anim"
        href={weddingConfig.venue.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...btnStyle, display: 'inline-flex' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Navigation size={14} /> Get Directions <ExternalLink size={12} />
      </motion.a>
    </Section>
  );
}

/* ====================================================================
   RSVP SECTION
   ==================================================================== */
type RSVPState = 'initial' | 'form' | 'done' | 'declined';

function RSVPFullSection() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<RSVPState>('initial');
  const [form, setForm] = useState({ name: '', guests: '1', phone: '', message: '' });

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(el.querySelectorAll('.rsvp-anim'), { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
    };
    loadGSAP();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
    data.push({ ...form, attending: true, ts: new Date().toISOString() });
    localStorage.setItem('wedding-rsvp', JSON.stringify(data));
    setState('done');
  };

  return (
    <Section ref={ref} id="rsvp" style={{ textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        {state === 'initial' && (
          <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            <p className="rsvp-anim" style={labelStyle}>RSVP</p>
            <h2 className="rsvp-anim" style={headingStyle}>{weddingConfig.rsvp.heading}</h2>
            <Divider />
            <div className="rsvp-anim" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: '2rem' }}>
              <motion.button style={{ ...btnStyle, background: 'rgba(212,165,116,0.1)', borderColor: 'rgba(212,165,116,0.5)' }} onClick={() => setState('form')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Heart size={16} style={{ color: '#D4A574' }} /> {weddingConfig.rsvp.yesButton}
              </motion.button>
              <motion.button style={btnStyle} onClick={() => { localStorage.setItem('wedding-rsvp', JSON.stringify([{ attending: false, ts: new Date().toISOString() }])); setState('declined'); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <HeartOff size={16} /> {weddingConfig.rsvp.noButton}
              </motion.button>
            </div>
          </motion.div>
        )}

        {state === 'form' && (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ maxWidth: 380, margin: '0 auto' }}>
            <p style={labelStyle}>We're So Happy!</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#8B6914', marginBottom: '1.5rem' }}>Tell Us About You</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
              <InputField icon={<User size={14} />} placeholder="Your Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <div style={{ position: 'relative' }}>
                <Users size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#D4A574', opacity: 0.6 }} />
                <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} style={{ ...inputStyle, paddingLeft: 36 }}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                </select>
              </div>
              <InputField icon={<Phone size={14} />} placeholder="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
              <div style={{ position: 'relative' }}>
                <MessageSquare size={14} style={{ position: 'absolute', left: 12, top: 14, color: '#D4A574', opacity: 0.6 }} />
                <textarea placeholder="Message for the couple" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...inputStyle, paddingLeft: 36, resize: 'none', minHeight: 80 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <motion.button type="submit" style={{ ...btnStyle, background: 'rgba(212,165,116,0.1)', borderColor: 'rgba(212,165,116,0.5)' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Send size={14} /> Confirm RSVP
              </motion.button>
              <motion.button type="button" style={btnStyle} onClick={() => setState('initial')} whileHover={{ scale: 1.03 }}>Back</motion.button>
            </div>
          </motion.form>
        )}

        {state === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💛</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#8B6914', marginBottom: '0.75rem' }}>Thank You!</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#6B5E50' }}>{weddingConfig.rsvp.confirmationMessage}</p>
          </motion.div>
        )}

        {state === 'declined' && (
          <motion.div key="declined" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤍</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#D4A574', marginBottom: '0.75rem' }}>We Understand</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#6B5E50' }}>{weddingConfig.rsvp.declineMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ====================================================================
   FOOTER
   ==================================================================== */
function FooterSection() {
  return (
    <section style={{ textAlign: 'center', padding: '4rem 1.5rem 3rem', borderTop: '1px solid rgba(212,165,116,0.15)' }}>
      <Divider />
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: '#6B5E50', margin: '1.5rem 0 0.5rem' }}>
        {weddingConfig.finale.line1}
      </p>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#2D2A26', marginBottom: '1.5rem' }}>
        {weddingConfig.finale.line2}
      </h3>

      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#8B6914' }}>
        {weddingConfig.bride.firstName} <span style={{ fontStyle: 'italic', color: '#D4A574', margin: '0 0.5rem' }}>&</span> {weddingConfig.groom.firstName}
      </p>
      <p style={{ ...labelStyle, marginTop: '0.75rem' }}>{weddingConfig.wedding.displayDate}</p>

      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: '#D4A574', marginTop: '2rem' }}>
        {weddingConfig.finale.closing} <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle' }} fill="#D4A574" />
      </p>

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ ...btnStyle, marginTop: '2rem' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowUp size={14} /> {weddingConfig.finale.replay}
      </motion.button>

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#C4A882', marginTop: '3rem' }}>
        Made with love
      </p>
    </section>
  );
}

/* ====================================================================
   INPUT FIELD HELPER
   ==================================================================== */
function InputField({ icon, placeholder, value, onChange, type = 'text', required = false }: {
  icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#D4A574', opacity: 0.6 }}>{icon}</div>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} style={{ ...inputStyle, paddingLeft: 36 }} />
    </div>
  );
}

/* ====================================================================
   SHARED STYLES
   ==================================================================== */
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.7rem',
  fontWeight: 500,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#D4A574',
  marginBottom: '0.75rem',
};

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  color: '#2D2A26',
  marginBottom: '0.5rem',
};

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '0.75rem 1.75rem',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#2D2A26',
  border: '1px solid rgba(212,165,116,0.35)',
  background: 'transparent',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.75rem',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.85rem',
  color: '#2D2A26',
  background: 'rgba(212,165,116,0.04)',
  border: '1px solid rgba(212,165,116,0.2)',
  outline: 'none',
  transition: 'border-color 0.3s',
};

const countdownBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem',
  border: '1px solid rgba(212,165,116,0.2)',
  background: 'rgba(212,165,116,0.03)',
};

const eventCard: React.CSSProperties = {
  padding: '2rem 1.5rem',
  border: '1px solid rgba(212,165,116,0.15)',
  background: '#fff',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const eventMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'var(--font-sans)',
  fontSize: '0.78rem',
  color: '#8B7B6B',
};
