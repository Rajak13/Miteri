'use client';

/**
 * LenisProvider — Config B High-Responsiveness Smooth Scroll.
 *
 * Configured for immediate, symmetric direction-reversal response (duration: 0.08s, cubic ease)
 * eliminating reverse scroll latency without dead-stops or overshoot.
 */

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.08, // 80ms Config B lower inertia
      easing: (t) => 1 - Math.pow(1 - t, 3), // Symmetric cubic easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
    });

    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    // Canonical Darkroom Engineering wiring: Lenis scroll events update ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP ticker drives Lenis RAF
    const gsapTickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTickerFn);

    // Disable GSAP's lag smoothing so tick deltas are never clamped
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (typeof window !== 'undefined') {
        window.__lenis = null;
      }
      gsap.ticker.remove(gsapTickerFn);
      lenis.destroy();
    };
  }, []);

  return children;
}
