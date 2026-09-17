import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'events', label: 'Events' },
  { id: 'venue', label: 'Venue' },
  { id: 'rsvp', label: 'RSVP' },
];

/**
 * Minimal navigation — desktop top bar + mobile hamburger overlay
 */
export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-center gap-10 py-5 px-8"
        style={{
          background: 'linear-gradient(180deg, rgba(26, 23, 20, 0.6) 0%, transparent 100%)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            className="nav-link"
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <motion.button
        className="fixed top-4 right-4 z-[60] md:hidden w-10 h-10 flex items-center justify-center"
        style={{
          background: 'rgba(26, 23, 20, 0.6)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
        whileTap={{ scale: 0.9 }}
      >
        {mobileOpen ? (
          <X size={18} className="text-champagne" />
        ) : (
          <Menu size={18} className="text-ivory" />
        )}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[55] flex flex-col items-center justify-center md:hidden"
            style={{
              background: 'rgba(26, 23, 20, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className="font-serif text-2xl text-ivory hover:text-champagne transition-colors"
                  onClick={() => scrollTo(item.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <motion.div
              className="gold-line mt-12"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
