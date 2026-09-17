import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, VolumeX, Volume2 } from 'lucide-react';
import { weddingConfig } from '../../config/weddingConfig';

/**
 * Minimal floating music player with visualizer bars
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bars, setBars] = useState([3, 5, 2, 4, 3]);

  // Animate visualizer bars
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBars(Array.from({ length: 5 }, () => 2 + Math.random() * 8));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const hasMusic = Boolean(weddingConfig.music.url);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={weddingConfig.music.url} loop preload="none" />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-14 right-0 flex items-center gap-2 p-2 mb-2"
            style={{
              background: 'rgba(26, 23, 20, 0.9)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.button
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center text-champagne"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!hasMusic}
              style={{ opacity: hasMusic ? 1 : 0.3 }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </motion.button>

            <motion.button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center text-champagne"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!hasMusic}
              style={{ opacity: hasMusic ? 1 : 0.3 }}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </motion.button>

            {/* Visualizer */}
            <div className="flex items-end gap-0.5 h-5 ml-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="music-visualizer-bar"
                  style={{
                    height: isPlaying ? `${h}px` : '2px',
                    opacity: isPlaying ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-11 h-11 flex items-center justify-center rounded-full"
        style={{
          background: 'rgba(26, 23, 20, 0.8)',
          border: '1px solid rgba(212, 165, 116, 0.3)',
          backdropFilter: 'blur(12px)',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1, borderColor: 'rgba(212, 165, 116, 0.6)' }}
        whileTap={{ scale: 0.95 }}
      >
        <Music size={16} className="text-champagne" />
      </motion.button>
    </div>
  );
}
