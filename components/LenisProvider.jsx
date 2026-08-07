'use client';

/**
 * LenisProvider — Canonical Lenis + GSAP ScrollTrigger sync
 *
 * Wiring pattern from Darkroom Engineering's satus starter kit:
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add((time) => { lenis.raf(time * 1000) })
 *   gsap.ticker.lagSmoothing(0)
 *
 * This ensures the GSAP ticker drives Lenis (not rAF), keeping
 * ScrollTrigger's scrub position and 3D canvas in perfect sync
 * with smooth scroll position.
 */

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Canonical satus wiring: Lenis scroll events update ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP ticker drives Lenis RAF (not requestAnimationFrame) so
    // the scroll position is always in sync with GSAP timelines
    const gsapTickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTickerFn);

    // Disable GSAP's lag smoothing so tick deltas are never clamped
    // (this prevents jank when tab is backgrounded and re-focused)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(gsapTickerFn);
      lenis.destroy();
    };
  }, []);

  return children;
}
