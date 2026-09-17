import { useRef, useEffect } from 'react';
import { weddingConfig } from '../../config/weddingConfig';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — user interaction will trigger it
      });
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="video-bg"
        src={weddingConfig.video.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="video-overlay" />
    </>
  );
}
