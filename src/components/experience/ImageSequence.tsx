import { useRef, useEffect, useCallback, memo } from 'react';

// Forward-biased preloading: on scroll, users scroll forward 90% of the time
const FORWARD_BATCH = 6;
const BACKWARD_BATCH = 2;

interface ScrollSequenceProps {
  /** Image folder path under /images/ */
  folder: string;
  /** First frame number (inclusive) */
  startFrame: number;
  /** Last frame number (inclusive) */
  endFrame: number;
  /** Scroll height multiplier in vh (default 300) */
  scrollHeight?: number;
  /** Background color while loading */
  bgColor?: string;
  /** Whether to defer loading until the component enters the viewport.
   *  When true, no images are loaded until an IntersectionObserver fires. */
  deferLoad?: boolean;
  /** Callback fired when the scroll sequence reaches the end (progress >= 0.98) */
  onComplete?: () => void;
}

function getImagePath(folder: string, index: number): string {
  const num = String(index).padStart(3, '0');
  return `/images/${folder}/ezgif-frame-${num}.jpg`;
}

/**
 * Mobile-optimized, 60fps+ scroll-driven image sequence.
 *
 * Performance enhancements:
 * - DPR capped to max 2 on mobile (prevents 3x/4x Retina memory churn & jank).
 * - Canvas dimensions cached on resize; zero DOM layout thrashing in scroll loop.
 * - Hardware accelerated compositing (transform: translate3d).
 * - Forward-biased async image preloading with decoding: async.
 * - Dynamic viewport height support (100dvh / 100vh) for mobile address bars.
 */
const ScrollSequence = memo(function ScrollSequence({
  folder,
  startFrame,
  endFrame,
  scrollHeight = 300,
  bgColor = '#FAF6F0',
  deferLoad = false,
  onComplete,
}: ScrollSequenceProps) {
  const totalFrames = endFrame - startFrame + 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameRef = useRef(startFrame);
  const loadingRef = useRef<Set<number>>(new Set());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isVisibleRef = useRef(!deferLoad);
  const drawnFrameRef = useRef(0);
  const activatedRef = useRef(!deferLoad);
  const completeFiredRef = useRef(false);

  // Cached canvas rendering dimensions to avoid getBoundingClientRect layout thrashing
  const dimensionsRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });

  // Update cached dimensions on resize
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Cap DPR at 2.0 to prevent mobile GPUs from choking on 3x/4x screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    dimensionsRef.current = { w, h, dpr };
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  // Draw image to canvas with cover fit
  const drawToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let { w, h } = dimensionsRef.current;
    if (w === 0 || h === 0) {
      updateDimensions();
      w = dimensionsRef.current.w;
      h = dimensionsRef.current.h;
    }
    if (w === 0 || h === 0) return;

    // Draw with cover-fit
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }, [updateDimensions]);

  // Load single image with asynchronous decoding
  const loadImage = useCallback((frame: number): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const cached = cacheRef.current.get(frame);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        resolve(cached);
        return;
      }
      if (loadingRef.current.has(frame)) {
        resolve(null);
        return;
      }

      loadingRef.current.add(frame);
      const img = new Image();
      img.decoding = 'async';
      img.src = getImagePath(folder, frame);
      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(() => {
            cacheRef.current.set(frame, img);
            loadingRef.current.delete(frame);
            resolve(img);
          }).catch(() => {
            cacheRef.current.set(frame, img);
            loadingRef.current.delete(frame);
            resolve(img);
          });
        } else {
          cacheRef.current.set(frame, img);
          loadingRef.current.delete(frame);
          resolve(img);
        }
      };
      img.onerror = () => {
        loadingRef.current.delete(frame);
        resolve(null);
      };
    });
  }, [folder]);

  // Forward-biased neighbor preloading
  const preloadNeighbors = useCallback(
    (center: number) => {
      if (!activatedRef.current) return;
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        const offsets: number[] = [];
        // Prioritize frames ahead (direction of scroll)
        for (let i = 1; i <= FORWARD_BATCH; i++) offsets.push(i);
        // Then frames behind
        for (let i = 1; i <= BACKWARD_BATCH; i++) offsets.push(-i);

        let idx = 0;
        const loadNext = () => {
          if (idx >= offsets.length || !isVisibleRef.current) return;
          const frame = center + offsets[idx];
          idx++;
          if (frame >= startFrame && frame <= endFrame && !cacheRef.current.has(frame)) {
            loadImage(frame).then(() => {
              // Smooth small delay to avoid micro-stutter
              setTimeout(loadNext, 16);
            });
          } else {
            loadNext();
          }
        };
        loadNext();
      }, 50);
    },
    [loadImage, startFrame, endFrame]
  );

  // Show a specific frame on the canvas
  const showFrame = useCallback(
    (frame: number) => {
      if (!activatedRef.current) return;
      if (frame === drawnFrameRef.current) return;

      const cached = cacheRef.current.get(frame);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        drawnFrameRef.current = frame;
        drawToCanvas(cached);
      } else {
        loadImage(frame).then((img) => {
          if (img && currentFrameRef.current === frame) {
            drawnFrameRef.current = frame;
            drawToCanvas(img);
          }
        });
        // Show nearest available frame as fallback
        for (let d = 1; d <= 12; d++) {
          for (const sign of [1, -1]) {
            const alt = frame + d * sign;
            const altImg = cacheRef.current.get(alt);
            if (altImg && altImg.complete && altImg.naturalWidth > 0) {
              drawToCanvas(altImg);
              return;
            }
          }
        }
      }
    },
    [loadImage, drawToCanvas]
  );

  // IntersectionObserver — activates deferred loading and pauses when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !activatedRef.current) {
          activatedRef.current = true;
          updateDimensions();
          loadImage(startFrame).then((img) => {
            if (img) {
              drawnFrameRef.current = startFrame;
              drawToCanvas(img);
            }
          });
          preloadNeighbors(startFrame);
        }
      },
      { threshold: 0, rootMargin: '300px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [loadImage, preloadNeighbors, drawToCanvas, updateDimensions, startFrame]);

  // Initial load when not deferred
  useEffect(() => {
    if (deferLoad) return;
    updateDimensions();
    loadImage(startFrame).then((img) => {
      if (img) {
        drawnFrameRef.current = startFrame;
        drawToCanvas(img);
      }
    });
    preloadNeighbors(startFrame);
  }, [deferLoad, loadImage, preloadNeighbors, drawToCanvas, updateDimensions, startFrame]);

  // High-performance scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking || !isVisibleRef.current || !activatedRef.current) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.offsetHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;

        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
        const frame = Math.round(startFrame + progress * (totalFrames - 1));
        const clamped = Math.max(startFrame, Math.min(endFrame, frame));

        if (clamped !== currentFrameRef.current) {
          currentFrameRef.current = clamped;
          showFrame(clamped);
          preloadNeighbors(clamped);
        }

        // Fire onComplete callback
        if (onComplete && progress >= 0.98 && !completeFiredRef.current) {
          completeFiredRef.current = true;
          onComplete();
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFrame, preloadNeighbors, startFrame, endFrame, totalFrames, onComplete]);

  // Handle window resize & orientation change
  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
      const frame = currentFrameRef.current;
      const cached = cacheRef.current.get(frame);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        drawToCanvas(cached);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [drawToCanvas, updateDimensions]);

  return (
    <div
      ref={containerRef}
      style={{
        height: `${scrollHeight}vh`,
        position: 'relative',
        contain: 'paint layout',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          minHeight: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgColor,
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            touchAction: 'pan-y',
          }}
        />
      </div>
    </div>
  );
});

export default ScrollSequence;

