'use client';

/**
 * BasketballSection — Obsidian Dark Carbon Theme (#080909) with Electric Orange Accent (#FF5500).
 *
 * 12-Column Grid Layout:
 * - Left 7 Columns (58.3%): Content layout (Headline, FIBA spec badges, description, CTA).
 * - Right 5 Columns (41.6%): Reserved space for 3D Basketball on right (+1.15 X).
 */

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ContourLines from '../ui/ContourLines';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BasketballSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. ScrollTrigger background color transition from Futsal light (#F4F1EA) to Basketball dark (#080909)
      gsap.fromTo(
        el,
        { backgroundColor: '#F4F1EA' },
        {
          backgroundColor: '#080909',
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
      id="basketball-section"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[660px] max-h-[900px] flex flex-col md:flex-row items-center justify-center bg-[#080909] px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-[#FFFFFF]/10 py-8 md:py-0"
    >
      {/* Topographic contour lines — orange strokes on dark background.
          Primary cluster behind the basketball (right ~75%), secondary lower-left. */}
      <ContourLines
        color="#FF5500"
        baseOpacity={0.18}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        cluster1={{ cx: 1100, cy: 440, rings: 11, r0: 55, rStep: 64, seedOffset: 80,  N: 10 }}
        cluster2={{ cx: 200,  cy: 680, rings:  5, r0: 55, rStep: 70, seedOffset: 450, N:  9 }}
      />

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
        {/* Left 7 Columns (58.3%): Basketball section content */}
        <div ref={contentRef} className="col-span-12 md:col-span-7 flex flex-col justify-center gap-4 sm:gap-6 z-10 pr-0 lg:pr-4 order-2 md:order-1">
          {/* Category Tag (Space Mono) */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/25 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="font-stedelijk text-xs tracking-widest uppercase text-[#FF5500]">
              02 / BASKETBALL ARENA
            </span>
          </div>

          {/* Display Headline (Humane + #F4F4F0 white text) */}
          <h2
            className="font-humane font-bold uppercase text-[#F4F4F0] leading-[0.82] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(3.2rem, 6.8vw, 6.0rem)' }}
          >
            FIBA-Spec Hardwood.<br />
            <span className="text-[#FF5500]">High-Flyer Approved.</span>
          </h2>

          {/* Compact Feature Badges (Space Mono) */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#E2E8F0]">
            {[
              '3 Courts',
              'Maple Hardwood',
              'FIBA Glass Backboards',
              'Shot-Clock Integrated',
            ].map((badge) => (
              <span
                key={badge}
                className="bg-[#FFFFFF]/[0.06] border border-[#FF5500]/20 px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-[#F4F4F0] text-[11px] sm:text-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Single High-Impact Sentence (Inter font-sans) */}
          <p className="font-sans text-xs sm:text-base text-[#85878A] leading-relaxed max-w-[520px]">
            Three indoor regulation basketball courts featuring shock-absorbing maple hardwood, pro-grade FIBA glass backboards, and digital shot-clock integration.
          </p>

          {/* CTA Button (Architype Stedelijk + Electric Orange accent) */}
          <div className="pt-1">
            <button
              onClick={() => alert('Opening Miteri Basketball Court Booking…')}
              className="group inline-flex items-center gap-3 bg-[#F4F4F0] hover:bg-[#FFFFFF] text-[#0D0D0E] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-stedelijk text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <span>Book Basketball Court</span>
              <span className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#FF5500] text-[#FFFFFF] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shrink-0">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>

        {/* Right 5 Columns (41.6%): Reserved space for 3D Basketball (Desktop right +1.15 X, Mobile top-right +0.30 X, +0.48 Y) */}
        <div className="col-span-12 md:col-span-5 h-[160px] sm:h-[200px] md:h-full md:min-h-[400px] pointer-events-none shrink-0 order-1 md:order-2" aria-hidden="true" />
      </div>
    </section>
  );
}
