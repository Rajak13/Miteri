'use client';

/**
 * BadmintonSection — Light Sky-Court Theme (#EEF6FC) with Badminton Blue Accent (#0091D5).
 *
 * 12-Column Grid Layout:
 * - Left 5 Columns (41.6%): Reserved space for 3D Shuttlecock on left (-1.15 X).
 * - Right 7 Columns (58.3%): Content layout (Headline, BWF spec badges, description, CTA).
 */

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ContourLines from '../ui/ContourLines';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BadmintonSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Background scrubs from Basketball dark (#080909) → Badminton light sky (#EEF6FC)
      gsap.fromTo(
        el,
        { backgroundColor: '#080909' },
        {
          backgroundColor: '#EEF6FC',
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
      id="badminton-section"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[660px] max-h-[900px] flex flex-col md:flex-row items-center justify-center bg-[#EEF6FC] px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-[#0091D5]/15 py-8 md:py-0"
    >
      <ContourLines
        color="#0091D5"
        baseOpacity={0.16}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        cluster1={{ cx: 350, cy: 440, rings: 10, r0: 50, rStep: 62, seedOffset: 120, N: 10 }}
        cluster2={{ cx: 1300, cy: 180, rings:  5, r0: 55, rStep: 68, seedOffset: 520, N:  9 }}
      />

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
        {/* Left 5 Columns: Reserved space for 3D shuttlecock (Desktop left -1.15 X) */}
        <div className="col-span-12 md:col-span-5 h-[160px] sm:h-[200px] md:h-full md:min-h-[400px] pointer-events-none shrink-0" aria-hidden="true" />

        {/* Right 7 Columns: Badminton section content */}
        <div ref={contentRef} className="col-span-12 md:col-span-7 flex flex-col justify-center gap-4 sm:gap-6 z-10 pl-0 lg:pl-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#0091D5]/10 border border-[#0091D5]/25 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#0091D5] animate-pulse" />
            <span className="font-stedelijk text-xs tracking-widest uppercase text-[#0077C8]">
              03 / BADMINTON ARENA
            </span>
          </div>

          <h2
            className="font-humane font-bold uppercase text-[#0D0D0E] leading-[0.82] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(3.2rem, 6.8vw, 6.0rem)' }}
          >
            BWF-Spec Courts.<br />
            <span className="text-[#0091D5]">Smash-Ready Floors.</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#0D0D0E]">
            {[
              '4 Courts',
              'Sprung Maple',
              'Pro Net Systems',
              'Ceiling 12m+',
            ].map((badge) => (
              <span
                key={badge}
                className="bg-[#0091D5]/[0.08] border border-[#0091D5]/20 px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-[11px] sm:text-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="font-sans text-xs sm:text-base text-[#4A6278] leading-relaxed max-w-[500px]">
            Four regulation indoor badminton courts with BWF-certified sprung flooring, tournament-grade net tension systems, and 12-metre ceiling clearance for competitive play in Dharan.
          </p>

          <div className="pt-1">
            <button
              onClick={() => alert('Opening Miteri Badminton Court Booking…')}
              className="group inline-flex items-center gap-3 bg-[#0077C8] hover:bg-[#0091D5] text-[#FFFFFF] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-stedelijk text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <span>Book Badminton Court</span>
              <span className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#FFFFFF] text-[#0077C8] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shrink-0">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
