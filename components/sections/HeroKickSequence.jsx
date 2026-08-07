'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

const HeroCanvas = dynamic(
  () => import('../3d/HeroCanvas'),
  { ssr: false, loading: () => null }
);

const ZONES = [
  { name: 'Futsal',     note: '6 courts · FIFA turf'   },
  { name: 'Basketball', note: '3 courts · FIBA spec'    },
  { name: 'Gym Hall',   note: 'Full rig · open access'  },
  { name: 'Badminton',  note: '4 courts · BWF net'      },
];

function EntryBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes ring-pulse-1 {
            0%   { r: 70;  opacity: 0.15; stroke-width: 1.5px; }
            50%  { r: 240; opacity: 0.06; stroke-width: 1.0px; }
            100% { r: 340; opacity: 0;    stroke-width: 0.5px; }
          }
          @keyframes ring-pulse-2 {
            0%   { r: 50;  opacity: 0.12; }
            50%  { r: 200; opacity: 0.05; }
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
            50%       { transform: translateY(-16px); opacity: 0.35; }
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
        <circle cx="500" cy="300" r="220" fill="none" stroke="#1A1D1C" strokeWidth="0.8" strokeDasharray="24 16" opacity="0.30" />
        <circle cx="500" cy="300" r="224" fill="none" stroke="#3CCB6E" strokeWidth="0.5" strokeDasharray="4 40" opacity="0.15" />
      </g>

      <g className="spin-ring-inner">
        <circle cx="500" cy="300" r="140" fill="none" stroke="#3CCB6E" strokeWidth="0.9" strokeDasharray="12 24" opacity="0.10" />
      </g>

      <line className="court-line-a" x1="600" y1="0" x2="1000" y2="400" stroke="#1A1D1C" strokeWidth="0.8" />
      <line className="court-line-b" x1="720" y1="0" x2="1000" y2="280" stroke="#3CCB6E" strokeWidth="0.6" />
      <line className="court-line-a" x1="0" y1="380" x2="400" y2="600" stroke="#1A1D1C" strokeWidth="0.6" />

      <circle className="marker-1" cx="840" cy="90"  r="3.5" fill="#3CCB6E" opacity="0.30" />
      <circle className="marker-2" cx="160" cy="120" r="3"   fill="#3CCB6E" opacity="0.25" />
      <circle className="marker-3" cx="890" cy="500" r="2.5" fill="#3CCB6E" opacity="0.15" />
    </svg>
  );
}

export default function HeroKickSequence({ onNavbarReveal, onGoalUnlocked }) {
  const footballRef = useRef(null);
  const progressRef = useRef(0);

  const [mounted,       setMounted]       = useState(false);
  const [hasKicked,     setHasKicked]     = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [impactFlash,   setImpactFlash]   = useState(false);
  const [showLayout,    setShowLayout]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSettle = useCallback(() => setIsInteractive(true), []);

  const handleSequenceComplete = useCallback(() => {
    setShowLayout(true);
    onGoalUnlocked?.();
    onNavbarReveal?.();
  }, [onGoalUnlocked, onNavbarReveal]);

  const handleKick = useCallback((e) => {
    e?.stopPropagation?.();
    if (hasKicked) return;
    setHasKicked(true);
    setIsInteractive(false);
    gsap.to(progressRef, {
      current: 1.0,
      duration: 2.2,
      ease: 'power1.inOut',
    });
  }, [hasKicked]);

  if (!mounted) return <section className="w-full h-screen bg-[#080909]" />;

  return (
    <section className="relative w-full min-h-screen md:h-screen bg-[#080909] overflow-hidden">

      {!hasKicked && <EntryBackground />}

      {/* Extremely subtle environment radial illumination behind ball (#101513 fading to #080909) */}
      <div className={`absolute top-1/2 ${hasKicked ? 'right-[10%] md:right-[15%]' : 'left-1/2 -translate-x-1/2'} -translate-y-1/2
        w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full
        bg-[radial-gradient(circle,_#101513_0%,_rgba(16,21,19,0.40)_40%,_transparent_75%)]
        blur-3xl pointer-events-none z-0
        transition-all duration-1000 ease-out`}
      />

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <HeroCanvas
          hasKicked={hasKicked}
          isInteractive={isInteractive}
          progressRef={progressRef}
          footballRef={footballRef}
          onSettle={handleSettle}
          setImpactFlash={setImpactFlash}
          onGoalUnlocked={handleSequenceComplete}
          sequenceComplete={showLayout}
        />
      </div>

      {impactFlash && (
        <div className="absolute inset-0 z-20 pointer-events-none
          bg-[radial-gradient(circle_at_60%_40%,_rgba(60,203,110,0.12)_0%,_transparent_55%)]" />
      )}

      {/* PHASE 2 LAYOUT */}
      {/* LEFT COLUMN */}
      <div className={`w-full md:w-[45%] z-20
        flex flex-col justify-between
        px-6 sm:px-10 md:px-14
        pt-28 md:pt-36 lg:pt-40
        pb-8 md:pb-12
        pointer-events-none
        transition-opacity duration-700
        ${hasKicked ? 'relative md:absolute top-0 left-0 bottom-0' : 'hidden'}
        ${showLayout ? 'opacity-100' : 'opacity-0'}`}
      >
        <div>
          <h1
            className="font-humane font-bold text-[#F4F4F0] leading-[0.86] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(3.2rem, 14vw, 9.5rem)' }}
          >
            <span className="block">Dharan's</span>
            <span className="block text-[#3CCB6E]">Premier</span>
            <span className="block">Sports Hub.</span>
          </h1>
        </div>

        <div className="flex flex-col gap-5 md:gap-6 mt-6 md:mt-0">
          <div>
            <p className="text-[#85878A] text-[13px] sm:text-[14px] font-roxborough leading-snug">
              Indoor sports arena — Dharan-11,<br />Koshi Province, Nepal.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#85878A]/60 mb-2.5">
              Open Zones
            </p>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2">
              {ZONES.map((z) => (
                <div key={z.name} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-[#123D27]
                    flex items-center justify-center shrink-0 bg-[#123D27]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3CCB6E]" />
                  </div>
                  <div>
                    <span className="text-[12px] sm:text-[13px] font-sans text-[#F4F4F0] font-medium block md:inline">
                      {z.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#85878A] md:ml-2 block md:inline">
                      {z.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN BOTTOM (Body text) */}
      <div className={`w-full md:w-[55%]
        px-6 sm:px-10 md:px-14 pb-12 md:pb-12 z-20 pointer-events-none
        transition-opacity duration-700 delay-300
        ${hasKicked ? 'relative md:absolute bottom-0 right-0' : 'hidden'}
        ${showLayout ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="text-[#85878A] text-[14px] sm:text-[16px] leading-[1.65]
          font-sans max-w-[440px]">
          Miteri Sports Center brings professional-grade futsal,
          basketball, badminton and gym facilities together in one
          arena — built for Dharan, bookable online.
        </p>
        <a
          href="#facilities-overview"
          className="inline-flex items-center gap-2 mt-4 md:mt-5 text-[13px] font-sans
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
            bg-[#123D27] hover:bg-[#185234] border border-[#3CCB6E]/40 text-[#F4F4F0]
            pl-5 pr-3 py-3 rounded-full shadow-xl shadow-black/40
            transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span className="text-[13px] font-sans font-medium tracking-tight">
            Kick the ball to open
          </span>
          <span className="w-7 h-7 rounded-full bg-[#3CCB6E]
            flex items-center justify-center
            transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={14} className="text-[#080909]" strokeWidth={2.5} />
          </span>
        </button>
        <div className="w-px h-5 bg-[#3CCB6E]/30 animate-pulse" />
      </div>

    </section>
  );
}
