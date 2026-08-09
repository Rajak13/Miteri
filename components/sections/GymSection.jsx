'use client';

/**
 * GymSection — Dark Crimson Theme (#1A0505 → #2D0A0A) with Gym Red Accent (#B91C1C).
 *
 * 12-Column Grid Layout:
 * - Right 5 Columns (41.6%): Reserved space for 3D Dumbbell on right (+1.15 X).
 * - Left 7 Columns (58.3%): Content layout (Headline, equipment badges, description, CTA).
 */

import React, { useEffect, useRef } from 'react';
import ContourLines from '../ui/ContourLines';
import MagneticButton from '../ui/MagneticButton';
import AnimatedText from '../ui/AnimatedText';
import ScrollReveal, { RevealItem } from '../ui/ScrollReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GymSection({ onBookNow }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Background scrubs from Badminton light (#EEF6FC) → Gym dark crimson (#1A0505)
      gsap.fromTo(
        el,
        { backgroundColor: '#EEF6FC' },
        {
          backgroundColor: '#1A0505',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gym-section"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[660px] max-h-[900px] flex flex-col md:flex-row items-center justify-center bg-[#1A0505] px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-[#B91C1C]/15 py-8 md:py-0"
    >
      <ContourLines
        color="#B91C1C"
        baseOpacity={0.18}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        cluster1={{ cx: 1050, cy: 440, rings: 10, r0: 50, rStep: 62, seedOffset: 600, N: 10 }}
        cluster2={{ cx: 140, cy: 180, rings:  5, r0: 55, rStep: 68, seedOffset: 820, N:  9 }}
      />

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
        {/* Left 7 Columns: Gym section content */}
        <div ref={contentRef} className="col-span-12 md:col-span-7 flex flex-col justify-center gap-4 sm:gap-6 z-10 pr-0 lg:pr-4">
          <ScrollReveal animation="fadeUp" delay={0.1} duration={0.6}>
            <RevealItem>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#B91C1C]/10 border border-[#B91C1C]/25 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse" />
                <span className="font-stedelijk text-xs tracking-widest uppercase text-[#DC2626]">
                  04 / FITNESS CENTER
                </span>
              </div>
            </RevealItem>
          </ScrollReveal>

          <AnimatedText
            as="h2"
            animation="slideUp"
            stagger={0.015}
            duration={0.7}
            className="font-humane font-bold uppercase text-[#F4F1EA] leading-[0.82] tracking-[-0.01em] max-w-[900px]"
            style={{ fontSize: 'clamp(3.2rem, 6.8vw, 6.0rem)' }}
          >
            Full Equipment. Built for Strength.
          </AnimatedText>

          <ScrollReveal animation="scale" stagger={0.08} delay={0.2} duration={0.5}>
            {[
              'Free Weights',
              'Power Racks',
              'Cardio Zone',
              'Open 6AM',
            ].map((badge) => (
              <RevealItem key={badge}>
                <span className="inline-block bg-[#B91C1C]/[0.12] border border-[#B91C1C]/25 px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-[11px] sm:text-xs font-mono text-[#F4F1EA] mr-2 mb-2">
                  {badge}
                </span>
              </RevealItem>
            ))}
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.3} duration={0.7}>
            <RevealItem>
              <p className="font-sans text-xs sm:text-base text-[#C4A8A8] leading-relaxed max-w-[500px]">
                Modern gym facility equipped with free weights, power racks, cardio machines, and functional training zones. Professional-grade equipment for strength training and conditioning in Dharan.
              </p>
            </RevealItem>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.4} duration={0.6}>
            <RevealItem>
              <div className="pt-1">
                <MagneticButton
                  onClick={() => onBookNow?.('gym')}
                  variant="red"
                  iconBg="#F4F1EA"
                >
                  Book Training Session
                </MagneticButton>
              </div>
            </RevealItem>
          </ScrollReveal>
        </div>

        {/* Right 5 Columns: Reserved space for 3D dumbbell (Desktop right +1.15 X) */}
        <div className="col-span-12 md:col-span-5 h-[160px] sm:h-[200px] md:h-full md:min-h-[400px] pointer-events-none shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
