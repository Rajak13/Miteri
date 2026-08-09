'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollReveal — Choreographed scroll-linked reveal animations
 * 
 * Animation Presets:
 * - 'fadeUp': Fade in while sliding up
 * - 'fadeDown': Fade in while sliding down
 * - 'fadeLeft': Fade in while sliding from left
 * - 'fadeRight': Fade in while sliding from right
 * - 'scale': Scale up from center
 * - 'flip': 3D flip effect
 * - 'blur': Blur to focus
 */

export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  triggerStart = 'top 85%',
  className = '',
  distance = 50,
  once = true,
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(containerRef.current.children);

      // Set initial state based on animation type
      const initialState = {};
      const animateState = {};

      switch (animation) {
        case 'fadeUp':
          initialState.y = distance;
          initialState.opacity = 0;
          animateState.y = 0;
          animateState.opacity = 1;
          break;
        case 'fadeDown':
          initialState.y = -distance;
          initialState.opacity = 0;
          animateState.y = 0;
          animateState.opacity = 1;
          break;
        case 'fadeLeft':
          initialState.x = distance;
          initialState.opacity = 0;
          animateState.x = 0;
          animateState.opacity = 1;
          break;
        case 'fadeRight':
          initialState.x = -distance;
          initialState.opacity = 0;
          animateState.x = 0;
          animateState.opacity = 1;
          break;
        case 'scale':
          initialState.scale = 0.8;
          initialState.opacity = 0;
          animateState.scale = 1;
          animateState.opacity = 1;
          break;
        case 'flip':
          initialState.rotationY = -90;
          initialState.opacity = 0;
          initialState.transformOrigin = 'center center';
          animateState.rotationY = 0;
          animateState.opacity = 1;
          break;
        case 'blur':
          initialState.filter = 'blur(10px)';
          initialState.opacity = 0;
          animateState.filter = 'blur(0px)';
          animateState.opacity = 1;
          break;
        default:
          initialState.opacity = 0;
          animateState.opacity = 1;
      }

      // Set initial state
      gsap.set(elements, initialState);

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: triggerStart,
        once: once,
        onEnter: () => {
          gsap.to(elements, {
            ...animateState,
            duration: duration,
            stagger: stagger,
            delay: delay,
            ease: animation === 'flip' ? 'back.out(1.2)' : 'power3.out',
          });
        },
        onLeaveBack: () => {
          if (!once) {
            gsap.to(elements, {
              ...initialState,
              duration: duration * 0.5,
              stagger: stagger * 0.5,
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animation, delay, duration, stagger, triggerStart, distance, once]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

/**
 * RevealItem — Individual animated item (use inside ScrollReveal)
 */
export function RevealItem({ children, className = '', ...props }) {
  return (
    <div className={`reveal-item ${className}`} {...props}>
      {children}
    </div>
  );
}
