import { useRef, useEffect, useCallback, memo } from 'react';

const BATCH_SIZE = 5;

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
 * Reusable high-performance scroll-driven image sequence.
 *
 * - Canvas-based rendering for GPU-accelerated display.
 * - Lazy-loads only the current frame + small neighbor buffer on demand.
 * - Each image load is independent; failures show nearest cached frame.
 * - Never blocks page content below — all loading is async and non-blocking.
 * - IntersectionObserver to pause work when off-screen.
 * - Optional `deferLoad` to delay all loading until visible (for strict ordering).
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

  // Draw image to canvas
  const drawToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

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
  }, []);

  // Load a single image — fully isolated, never throws
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
        cacheRef.current.set(frame, img);
        loadingRef.current.delete(frame);
        resolve(img);
      };
      img.onerror = () => {
        loadingRef.current.delete(frame);
        resolve(null);
      };
    });
  }, [folder]);

  // Background-preload neighbors in small batches
  const preloadNeighbors = useCallback(
    (center: number) => {
      if (!activatedRef.current) return;
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        const offsets: number[] = [];
        for (let i = 1; i <= BATCH_SIZE; i++) {
          offsets.push(i, -i);
        }
        let idx = 0;
        const loadNext = () => {
          if (idx >= offsets.length || !isVisibleRef.current) return;
          const frame = center + offsets[idx];
          idx++;
          if (frame >= startFrame && frame <= endFrame && !cacheRef.current.has(frame)) {
            loadImage(frame).then(() => {
              setTimeout(loadNext, 20);
            });
          } else {
            loadNext();
          }
        };
        loadNext();
      }, 80);
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
        for (let d = 1; d <= 10; d++) {
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
        // Activate deferred component the first time it becomes visible
        if (entry.isIntersecting && !activatedRef.current) {
          activatedRef.current = true;
          // Load the first frame immediately
          loadImage(startFrame).then((img) => {
            if (img) {
              drawnFrameRef.current = startFrame;
              drawToCanvas(img);
            }
          });
          preloadNeighbors(startFrame);
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [loadImage, preloadNeighbors, drawToCanvas, startFrame]);

  // Load the first frame on mount (only if not deferred)
  useEffect(() => {
    if (deferLoad) return;
    loadImage(startFrame).then((img) => {
      if (img) {
        drawnFrameRef.current = startFrame;
        drawToCanvas(img);
      }
    });
    preloadNeighbors(startFrame);
  }, [deferLoad, loadImage, preloadNeighbors, drawToCanvas, startFrame]);

  // Scroll handler — maps scroll position to frame number
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

        // Fire onComplete when scroll reaches the end
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

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const frame = currentFrameRef.current;
      const cached = cacheRef.current.get(frame);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        drawToCanvas(cached);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawToCanvas]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${scrollHeight}vh`, position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgColor,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
});

export default ScrollSequence;
