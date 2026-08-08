'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ContourLines from '../ui/ContourLines';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FutsalSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. ScrollTrigger background color transition from Hero dark (#080909) to Futsal light (#F4F1EA)
      gsap.fromTo(
        el,
        { backgroundColor: '#080909' },
        {
          backgroundColor: '#F4F1EA',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );

      // 2. Smooth reveal animation for content elements upon entering viewport
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
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
      id="futsal-section"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[660px] max-h-[900px] flex flex-col md:flex-row items-center justify-center bg-[#F4F1EA] px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-[#0D0D0E]/10 py-8 md:py-0"
    >
      {/* Topographic contour lines — dark green strokes on light cream background.
          Primary cluster behind the ball (left ~30%), secondary upper-right. */}
      <ContourLines
        color="#009E54"
        baseOpacity={0.15}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        cluster1={{ cx: 350, cy: 440, rings: 10, r0: 50, rStep: 62, seedOffset: 40,  N: 10 }}
        cluster2={{ cx: 1300, cy: 180, rings:  5, r0: 55, rStep: 68, seedOffset: 300, N:  9 }}
      />

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
        {/* Left 5 Columns (41.6%): Reserved space for 3D ball (Desktop left -1.15 X, Mobile top-left -0.30 X, +0.48 Y) */}
        <div className="col-span-12 md:col-span-5 h-[160px] sm:h-[200px] md:h-full md:min-h-[400px] pointer-events-none shrink-0" aria-hidden="true" />

        {/* Right 7 Columns (58.3%): Hyper-minimal Futsal section content */}
        <div ref={contentRef} className="col-span-12 md:col-span-7 flex flex-col justify-center gap-4 sm:gap-6 z-10 pl-0 lg:pl-4">
          {/* Category Tag (Space Mono) */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#0D0D0E]/[0.06] border border-[#0D0D0E]/15 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#009E54] animate-pulse" />
            <span className="font-stedelijk text-xs tracking-widest uppercase text-[#0D0D0E]">
              01 / FUTSAL ARENA
            </span>
          </div>

          {/* Display Headline (Humane + #0D0D0E dark text) */}
          <h2
            className="font-humane font-bold uppercase text-[#0D0D0E] leading-[0.82] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(3.2rem, 6.8vw, 6.0rem)' }}
          >
            FIFA-Grade Turf.<br />
            <span className="text-[#009E54]">Built for Match Day.</span>
          </h2>

          {/* Compact Feature Badges (Space Mono) */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#0D0D0E]">
            {[
              '6 Courts',
              'Shock-pad Turf',
              'LED 500 Lux',
              'Bleacher Seating',
            ].map((badge) => (
              <span
                key={badge}
                className="bg-[#0D0D0E]/[0.05] border border-[#0D0D0E]/10 px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-[11px] sm:text-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Single High-Impact Sentence (Inter font-sans) */}
          <p className="font-sans text-xs sm:text-base text-[#4A4D52] leading-relaxed max-w-[500px]">
            Six regulation-size indoor futsal courts equipped with pro shock-absorbing turf underlayment and 500 Lux broadcast lighting — built for Dharan.
          </p>

          {/* CTA Button (Architype Stedelijk + Emerald Match Green accent) */}
          <div className="pt-1">
            <button
              onClick={() => alert('Opening Miteri Futsal Court Booking…')}
              className="group inline-flex items-center gap-3 bg-[#0D0D0E] hover:bg-[#1A1D1C] text-[#F4F1EA] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-stedelijk text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <span>Book Futsal Court</span>
              <span className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#00C864] text-[#0D0D0E] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shrink-0">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
