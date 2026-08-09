'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * AnimatedText — Kinetic typography with scroll-triggered letter animations
 * 
 * Animation Modes:
 * - 'slideUp': Letters slide up and fade in
 * - 'fadeIn': Simple opacity fade
 * - 'scale': Letters scale up from 0
 * - 'rotate': Letters rotate in
 * - 'wave': Staggered wave effect
 */

// Simple text splitter (no paid plugin needed)
function splitTextIntoChars(element) {
  const text = element.textContent;
  const chars = [];
  
  element.innerHTML = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span');
    span.textContent = char;
    span.className = 'char inline-block';
    span.style.display = 'inline-block';
    
    // Preserve spaces
    if (char === ' ') {
      span.style.width = '0.25em';
    }
    
    element.appendChild(span);
    chars.push(span);
  }
  
  return chars;
}

export default function AnimatedText({
  children,
  as: Component = 'h2',
  animation = 'slideUp',
  stagger = 0.02,
  duration = 0.6,
  delay = 0,
  className = '',
  triggerStart = 'top 80%',
  ...props
}) {
  const textRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!textRef.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Split text into characters
      charsRef.current = splitTextIntoChars(textRef.current);
      const chars = charsRef.current;

      // Set initial state based on animation type
      switch (animation) {
        case 'slideUp':
          gsap.set(chars, {
            y: 30,
            opacity: 0,
          });
          break;
        case 'scale':
          gsap.set(chars, {
            scale: 0,
            opacity: 0,
          });
          break;
        case 'rotate':
          gsap.set(chars, {
            rotation: -45,
            opacity: 0,
            transformOrigin: 'center center',
          });
          break;
        case 'wave':
          gsap.set(chars, {
            y: (i) => (i % 2 === 0 ? -20 : 20),
            opacity: 0,
          });
          break;
        default:
          gsap.set(chars, {
            opacity: 0,
          });
      }

      // Animate on scroll
      ScrollTrigger.create({
        trigger: textRef.current,
        start: triggerStart,
        onEnter: () => {
          switch (animation) {
            case 'slideUp':
              gsap.to(chars, {
                y: 0,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'power3.out',
              });
              break;
            case 'scale':
              gsap.to(chars, {
                scale: 1,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'back.out(1.7)',
              });
              break;
            case 'rotate':
              gsap.to(chars, {
                rotation: 0,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'power2.out',
              });
              break;
            case 'wave':
              gsap.to(chars, {
                y: 0,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'elastic.out(1, 0.5)',
              });
              break;
            default:
              gsap.to(chars, {
                opacity: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'power2.out',
              });
          }
        },
      });
    }, textRef);

    return () => {
      ctx.revert();
    };
  }, [animation, stagger, duration, delay, triggerStart, children]);

  return (
    <Component ref={textRef} className={className} {...props}>
      {children}
    </Component>
  );
}
