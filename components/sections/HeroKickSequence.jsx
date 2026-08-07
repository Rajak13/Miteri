'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, ArrowDown, Dumbbell } from 'lucide-react';
import gsap from 'gsap';

const HeroCanvas = dynamic(
  () => import('../3d/HeroCanvas'),
  { ssr: false, loading: () => null }
);

function FutsalIcon({ className = "w-3.5 h-3.5 text-[#3CCB6E]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 7 14.85 9.07 13.76 12.43 10.24 12.43 9.15 9.07 12 7" />
      <line x1="12" y1="7" x2="12" y2="2" />
      <line x1="14.85" y1="9.07" x2="19.51" y2="7.55" />
      <line x1="13.76" y1="12.43" x2="16.62" y2="16.36" />
      <line x1="10.24" y1="12.43" x2="7.38" y2="16.36" />
      <line x1="9.15" y1="9.07" x2="4.49" y2="7.55" />
    </svg>
  );
}

function BasketballIcon({ className = "w-3.5 h-3.5 text-[#3CCB6E]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M5.5 5.5A12 12 0 0 1 18.5 18.5" />
      <path d="M18.5 5.5A12 12 0 0 0 5.5 18.5" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function BadmintonIcon({ className = "w-3.5 h-3.5 text-[#3CCB6E]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="20" r="2.5" />
      <path d="M8.2 17.5L5 4h14l-3.2 13.5" />
      <path d="M9.2 10.5h5.6" />
      <line x1="12" y1="4" x2="12" y2="17.5" />
    </svg>
  );
}

const ZONES = [
  { name: 'Futsal',     note: '6 courts · FIFA turf',   icon: FutsalIcon },
  { name: 'Basketball', note: '3 courts · FIBA spec',   icon: BasketballIcon },
  { name: 'Gym Hall',   note: 'Full rig · open access', icon: Dumbbell },
  { name: 'Badminton',  note: '4 courts · BWF net',     icon: BadmintonIcon },
];

function EntryBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes ring-pulse-1 {
            0%   { r: 70;  opacity: 0.18; stroke-width: 1.5px; }
            50%  { r: 240; opacity: 0.08; stroke-width: 1.0px; }
            100% { r: 340; opacity: 0;    stroke-width: 0.5px; }
          }
          @keyframes ring-pulse-2 {
            0%   { r: 50;  opacity: 0.14; }
            50%  { r: 200; opacity: 0.06; }
            100% { r: 300; opacity: 0;    }
          }
          @keyframes arena-spin {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(360deg); }
          }
          @keyframes arena-spin-rev {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(-360deg);}
          }
          @keyframes line-stroke {
            0%   { stroke-dashoffset: 800; opacity: 0; }
            20%  { opacity: 0.08; }
            100% { stroke-dashoffset: 0; opacity: 0.08; }
          }
          @keyframes float-marker {
            0%, 100% { transform: translateY(0px);   opacity: 0.20; }
            50%       { transform: translateY(-16px); opacity: 0.38; }
          }
          .pulse-ring-1 {
            transform-origin: 500px 300px;
            animation: ring-pulse-1 4.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          }
          .pulse-ring-2 {
            transform-origin: 500px 300px;
            animation: ring-pulse-2 4.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            animation-delay: 1.4s;
          }
          .spin-ring-outer {
            transform-box: fill-box;
            transform-origin: center;
            animation: arena-spin 22s linear infinite;
          }
          .spin-ring-inner {
            transform-box: fill-box;
            transform-origin: center;
            animation: arena-spin-rev 15s linear infinite;
          }
          .court-line-a {
            stroke-dasharray: 800;
            animation: line-stroke 2.4s ease-out forwards;
          }
          .court-line-b {
            stroke-dasharray: 800;
            animation: line-stroke 2.4s ease-out forwards;
            animation-delay: 0.5s;
          }
          .marker-1 { animation: float-marker 3.5s ease-in-out infinite; }
          .marker-2 { animation: float-marker 3.5s ease-in-out infinite; animation-delay: 1.0s; }
          .marker-3 { animation: float-marker 3.5s ease-in-out infinite; animation-delay: 2.0s; }
        `}</style>
      </defs>

      <circle className="pulse-ring-1" cx="500" cy="300" r="70" fill="none" stroke="#3CCB6E" />
      <circle className="pulse-ring-2" cx="500" cy="300" r="50" fill="none" stroke="#3CCB6E" />

      <g className="spin-ring-outer">
        <circle cx="500" cy="300" r="220" fill="none" stroke="#0D0D0E" strokeWidth="0.8" strokeDasharray="24 16" opacity="0.08" />
        <circle cx="500" cy="300" r="224" fill="none" stroke="#3CCB6E" strokeWidth="0.5" strokeDasharray="4 40" opacity="0.15" />
      </g>

      <g className="spin-ring-inner">
        <circle cx="500" cy="300" r="140" fill="none" stroke="#3CCB6E" strokeWidth="0.9" strokeDasharray="12 24" opacity="0.10" />
      </g>

      <line className="court-line-a" x1="600" y1="0" x2="1000" y2="400" stroke="#0D0D0E" strokeWidth="0.8" />
      <line className="court-line-b" x1="720" y1="0" x2="1000" y2="280" stroke="#3CCB6E" strokeWidth="0.6" />
      <line className="court-line-a" x1="0" y1="380" x2="400" y2="600" stroke="#0D0D0E" strokeWidth="0.6" />

      <circle className="marker-1" cx="840" cy="90"  r="3.5" fill="#3CCB6E" opacity="0.25" />
      <circle className="marker-2" cx="160" cy="120" r="3"   fill="#3CCB6E" opacity="0.22" />
      <circle className="marker-3" cx="890" cy="500" r="2.5" fill="#0D0D0E" opacity="0.15" />
    </svg>
  );
}

export default function HeroKickSequence({ onNavbarReveal, onGoalUnlocked }) {
  const footballRef = useRef(null);
  const progressRef = useRef(0);

  const leftColRef  = useRef(null);
  const rightColRef = useRef(null);

  const [mounted,          setMounted]          = useState(false);
  const [hasKicked,        setHasKicked]        = useState(false);
  const [isInteractive,    setIsInteractive]    = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [showLayout,       setShowLayout]       = useState(false);
  const [darkTheme,        setDarkTheme]        = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Direct DOM opacity mutation on scroll (zero React state re-renders during scroll)
  useEffect(() => {
    if (!showLayout) return;

    const handleScroll = () => {
      const sy = window.scrollY || 0;
      const op = Math.max(0, 1 - sy / 320);
      if (leftColRef.current)  leftColRef.current.style.opacity  = op;
      if (rightColRef.current) rightColRef.current.style.opacity = op;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showLayout]);

  const handleSettle = useCallback(() => setIsInteractive(true), []);

  const handleKick = useCallback((e) => {
    e?.stopPropagation?.();
    if (hasKicked) return;

    // 1. Instantly trigger squash/stretch impact feedback on 3D ball
    footballRef.current?.triggerKickImpulse?.();

    // 2. Trigger 250ms green radial shockwave ring
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 280);

    setHasKicked(true);
    setIsInteractive(false);

    // 3. Single GSAP timeline driving portal zoom-through & background transition
    gsap.to(progressRef, {
      current: 1.0,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (progressRef.current >= 0.50 && !darkTheme) {
          setDarkTheme(true);
        }
        if (progressRef.current >= 0.68 && !showLayout) {
          setShowLayout(true);
          onGoalUnlocked?.();
          onNavbarReveal?.();
        }
      },
    });
  }, [hasKicked, darkTheme, showLayout, onGoalUnlocked, onNavbarReveal]);

  if (!mounted) return <section id="hero-section" className="w-full h-screen bg-[#F2EFE9]" />;

  return (
    <section id="hero-section" className={`relative w-full min-h-screen md:h-screen overflow-hidden transition-colors duration-1000 ${
      darkTheme ? 'bg-[#080909]' : 'bg-[#F2EFE9]'
    }`}>

      {!hasKicked && <EntryBackground />}

      {/* Local Background Contrast Aura — Appears in Phase 2 on dark theme behind ball */}
      <div className={`absolute top-1/2 right-[10%] md:right-[15%] -translate-y-1/2
        w-[480px] sm:w-[620px] h-[480px] sm:h-[620px] rounded-full
        bg-[radial-gradient(circle,_#1E3A2B_0%,_#101C15_45%,_transparent_75%)]
        blur-3xl pointer-events-none z-0
        transition-opacity duration-1000 ease-out
        ${darkTheme ? 'opacity-85' : 'opacity-0'}`}
      />

      {/* Impact Shockwave Ring at moment of kick (250ms) */}
      {shockwaveActive && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="w-44 h-44 rounded-full border-2 border-[#3CCB6E] animate-ping opacity-75" />
        </div>
      )}

      {/* 3D WebGL Canvas Layer — pointer-events-auto so WebGL canvas receives mouse events for hover grab cursor & drag rotation */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <HeroCanvas
          hasKicked={hasKicked}
          isInteractive={isInteractive}
          progressRef={progressRef}
          footballRef={footballRef}
          onSettle={handleSettle}
          onGoalUnlocked={() => {}}
          sequenceComplete={showLayout}
        />
      </div>

      {/* PHASE 2 LAYOUT */}
      {/* LEFT COLUMN (Desktop left side, Mobile top header) */}
      <div
        ref={leftColRef}
        className={`w-full md:w-[48%] lg:w-[44%] z-40
          flex flex-col justify-between
          px-6 sm:px-10 md:px-12 lg:px-14
          pt-20 sm:pt-24 md:pt-28 lg:pt-32
          pb-4 md:pb-10
          pointer-events-none
          transition-opacity duration-300
          ${hasKicked ? 'absolute top-0 left-0 right-0 md:right-auto md:bottom-0' : 'hidden'}
          ${showLayout ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3CCB6E]/10 border border-[#3CCB6E]/20 mb-2 md:hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3CCB6E] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#3CCB6E]">PREMIER SPORTS ARENA</span>
          </div>
          <h1
            className="font-humane font-bold text-[#F4F4F0] leading-[0.85] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(2.4rem, 7.5vw, 5.4rem)' }}
          >
            <span className="block">Dharan's</span>
            <span className="block text-[#3CCB6E]">Premier</span>
            <span className="block">Sports Hub.</span>
          </h1>
          <p className="text-[#85878A] text-[12px] sm:text-[14px] font-roxborough leading-snug mt-2 md:mt-3">
            Indoor sports arena — Dharan-11, Koshi Province, Nepal.
          </p>
        </div>

        {/* Desktop-only Open Zones List */}
        <div className="hidden md:flex flex-col gap-4 md:gap-5 mt-4 md:mt-2 pointer-events-auto">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#85878A]/60 mb-2">
              Open Zones
            </p>
            <div className="flex flex-col gap-2">
              {ZONES.map((z) => {
                const IconComponent = z.icon;
                return (
                  <div key={z.name} className="flex items-center gap-2.5">
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md border border-[#3CCB6E]/30
                      flex items-center justify-center shrink-0 bg-[#123D27]/40 shadow-sm">
                      <IconComponent className="w-3.5 h-3.5 text-[#3CCB6E]" />
                    </div>
                    <div>
                      <span className="text-[12px] sm:text-[13px] font-sans text-[#F4F4F0] font-medium inline">
                        {z.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-[#85878A] ml-2 inline">
                        {z.note}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN / BOTTOM DECK (Desktop bottom-right, Mobile bottom deck) */}
      <div
        ref={rightColRef}
        className={`w-full md:w-[50%] lg:w-[48%]
          px-6 sm:px-10 md:px-12 lg:px-14 pb-6 md:pb-10 z-40 pointer-events-none
          transition-opacity duration-300
          ${hasKicked ? 'absolute bottom-0 left-0 right-0 md:left-auto md:right-0' : 'hidden'}
          ${showLayout ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Mobile Open Zones Strip */}
        <div className="md:hidden flex items-center justify-between gap-1.5 mb-3 pointer-events-auto overflow-x-auto pb-1 scrollbar-none">
          {ZONES.map((z) => (
            <div key={z.name} className="flex items-center gap-1.5 bg-[#123D27]/50 border border-[#3CCB6E]/30 px-2.5 py-1 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CCB6E]" />
              <span className="text-[11px] font-sans font-medium text-[#F4F4F0]">{z.name}</span>
            </div>
          ))}
        </div>

        <p className="text-[#85878A] text-[12px] sm:text-[15px] leading-[1.50] sm:leading-[1.60]
          font-sans max-w-[420px] pointer-events-auto">
          Miteri Sports Center brings professional-grade futsal,
          basketball, badminton and gym facilities together in one
          arena — built for Dharan, bookable online.
        </p>
        <a
          href="#futsal-section"
          className="inline-flex items-center gap-2 mt-2 sm:mt-4 text-[12px] sm:text-[13px] font-sans
            text-[#85878A] hover:text-[#3CCB6E] transition-colors duration-200
            pointer-events-auto"
        >
          Discover more
          <ArrowDown size={13} strokeWidth={1.5} />
        </a>
      </div>

      {/* PHASE 1 — Kick Button */}
      <div className={`absolute inset-x-0 bottom-8 sm:bottom-10 z-50 flex flex-col items-center gap-3
        pointer-events-auto transition-opacity duration-300
        ${hasKicked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <button
          id="kick-cta"
          onClick={handleKick}
          className="group flex items-center gap-2.5
            bg-[#0D0D0E] hover:bg-[#222] text-white
            pl-5 pr-3 py-3 rounded-full shadow-xl
            transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-[13px] font-sans font-medium tracking-tight">
            Kick the ball to open
          </span>
          <span className="w-7 h-7 rounded-full bg-[#3CCB6E]
            flex items-center justify-center
            transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={14} className="text-[#0D0D0E]" strokeWidth={2.5} />
          </span>
        </button>
        <div className="w-px h-5 bg-[#0D0D0E]/20 animate-pulse" />
      </div>

    </section>
  );
}
