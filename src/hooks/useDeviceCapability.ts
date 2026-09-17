import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

/**
 * Detects device performance tier for adaptive quality
 */
export function useDeviceCapability(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (cores <= 2 || memory <= 2) {
      setTier('low');
    } else if (isMobile || cores <= 4 || memory <= 4) {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, []);

  return tier;
}

/**
 * Returns true if running on a mobile device
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return mobile;
}
