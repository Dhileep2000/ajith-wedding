import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { weddingConfig } from '../../config/weddingConfig';

/**
 * Subtle share button with WhatsApp, copy link, and native share
 */
export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = weddingConfig.share.url || window.location.href;
  const shareText = weddingConfig.share.message;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-14 left-0 flex flex-col gap-2 p-3 mb-2"
            style={{
              background: 'rgba(26, 23, 20, 0.9)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              backdropFilter: 'blur(12px)',
              minWidth: '160px',
            }}
          >
            <motion.button
              className="flex items-center gap-3 text-xs text-ivory/70 hover:text-champagne transition-colors py-1"
              onClick={handleWhatsApp}
              whileHover={{ x: 2 }}
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-3 text-xs text-ivory/70 hover:text-champagne transition-colors py-1"
              onClick={handleCopy}
              whileHover={{ x: 2 }}
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </motion.button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <motion.button
                className="flex items-center gap-3 text-xs text-ivory/70 hover:text-champagne transition-colors py-1"
                onClick={handleNativeShare}
                whileHover={{ x: 2 }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </motion.button>
            )}
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
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, borderColor: 'rgba(212, 165, 116, 0.6)' }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={16} className="text-champagne" />
      </motion.button>
    </div>
  );
}
