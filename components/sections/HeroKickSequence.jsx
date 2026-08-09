'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown, Dumbbell } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import gsap from 'gsap';
import LoadingScreen from '../ui/LoadingScreen';

const HeroCanvas = dynamic(
  () => import('../3d/HeroCanvas'),
  { ssr: false, loading: () => null }
);

// ─── Organic contour blob generator ──────────────────────────────────────────
// Uses Catmull-Rom spline control points through N perturbed radial samples
// to produce a smooth, closed, organic SVG path string.
// All math is deterministic (sin-based hash) — no Math.random(), SSR-safe.
function generateBlob(cx, cy, r, seed, N = 10) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    // Deterministic hash: produces values in [0,1] for each (seed, i) pair
    const h0 = Math.sin(seed * 127.1 + i * 311.7) * 0.5 + 0.5;
    const h1 = Math.sin(seed * 89.3  + i * 419.2) * 0.5 + 0.5;
    const perturb = 0.68 + (h0 * 0.40) + (h1 * 0.12); // range ~0.68–1.20
    pts.push({
      x: cx + r * perturb * Math.cos(angle),
      y: cy + r * perturb * Math.sin(angle),
    });
  }
  const n = pts.length;
  // M to first point, then Catmull-Rom → cubic bezier for each segment
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    // Catmull-Rom tangent → bezier control points (alpha = 1/6)
    const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(1);
    const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(1);
    const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(1);
    const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(1);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

// ─── Topographic contour lines ────────────────────────────────────────────────
// Two clusters: primary (behind ball, center-right) + secondary (lower-left).
// Each cluster has 10 concentric rings with decreasing opacity outward.
function ContourLines({ darkTheme }) {
  const rings = useMemo(() => {
    const result = [];

    // Cluster 1 — Primary: behind the 3D ball (~60% from left, 47% from top)
    // 10 rings, innermost tightest, outermost bleeds well off-screen
    const c1x = 760, c1y = 425;
    for (let i = 0; i < 11; i++) {
      const r = 55 + i * 65;
      const opacity = Math.max(0.04, 0.18 - i * 0.013);
      result.push({ d: generateBlob(c1x, c1y, r, i * 17.31, 10), opacity, width: i < 3 ? 1.2 : 0.8 });
    }

    // Cluster 2 — Secondary: lower-left, bleeds off edge behind text column
    const c2x = 160, c2y = 710;
    for (let i = 0; i < 6; i++) {
      const r = 60 + i * 72;
      const opacity = Math.max(0.03, 0.11 - i * 0.014);
      result.push({ d: generateBlob(c2x, c2y, r, 200 + i * 23.71, 9), opacity, width: 0.8 });
    }

    return result;
  }, []);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-[6] transition-opacity duration-1000 ${
        darkTheme ? 'opacity-100' : 'opacity-0'
      }`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {rings.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          fill="none"
          stroke="#00C864"
          strokeWidth={ring.width}
          strokeOpacity={ring.opacity}
        />
      ))}
    </svg>
  );
}

function FutsalIcon({ className = "w-3.5 h-3.5 text-[#00C864]" }) {
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

function BasketballIcon({ className = "w-3.5 h-3.5 text-[#00C864]" }) {
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

function BadmintonIcon({ className = "w-3.5 h-3.5 text-[#00C864]" }) {
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

      <circle className="pulse-ring-1" cx="500" cy="300" r="70" fill="none" stroke="#00C864" />
      <circle className="pulse-ring-2" cx="500" cy="300" r="50" fill="none" stroke="#00C864" />

      <g className="spin-ring-outer">
        <circle cx="500" cy="300" r="220" fill="none" stroke="#0D0D0E" strokeWidth="0.8" strokeDasharray="24 16" opacity="0.08" />
        <circle cx="500" cy="300" r="224" fill="none" stroke="#00C864" strokeWidth="0.5" strokeDasharray="4 40" opacity="0.15" />
      </g>

      <g className="spin-ring-inner">
        <circle cx="500" cy="300" r="140" fill="none" stroke="#00C864" strokeWidth="0.9" strokeDasharray="12 24" opacity="0.10" />
      </g>

      <line className="court-line-a" x1="600" y1="0" x2="1000" y2="400" stroke="#0D0D0E" strokeWidth="0.8" />
      <line className="court-line-b" x1="720" y1="0" x2="1000" y2="280" stroke="#00C864" strokeWidth="0.6" />
      <line className="court-line-a" x1="0" y1="380" x2="400" y2="600" stroke="#0D0D0E" strokeWidth="0.6" />

      <circle className="marker-1" cx="840" cy="90"  r="3.5" fill="#00C864" opacity="0.25" />
      <circle className="marker-2" cx="160" cy="120" r="3"   fill="#00C864" opacity="0.22" />
      <circle className="marker-3" cx="890" cy="500" r="2.5" fill="#0D0D0E" opacity="0.15" />
    </svg>
  );
}

export default function HeroKickSequence({ onNavbarReveal, onGoalUnlocked }) {
  const footballRef = useRef(null);
  const progressRef = useRef(0);

  const [mounted,          setMounted]          = useState(false);
  const [hasKicked,        setHasKicked]        = useState(false);
  const [isInteractive,    setIsInteractive]    = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [showLayout,       setShowLayout]       = useState(false);
  const [darkTheme,        setDarkTheme]        = useState(false);
  const [modelsLoaded,     setModelsLoaded]     = useState(false);
  const [loadingProgress,  setLoadingProgress]  = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // Simulate loading progress while waiting for models
  useEffect(() => {
    if (modelsLoaded) {
      setLoadingProgress(100);
      return;
    }

    // Fake progress that slows down as it approaches 90%
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Wait at 90% for actual model loading
        const increment = (90 - prev) * 0.1; // Logarithmic slowdown
        return Math.min(prev + increment, 90);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // Lock scroll during kick sequence (until layout is shown)
  useEffect(() => {
    if (hasKicked && !showLayout) {
      // Prevent scrolling during animation
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [hasKicked, showLayout]);

  // Hide 3D canvas when scrolling past gym section into footer
  useEffect(() => {
    const handleScroll = () => {
      const gymEl = document.getElementById('gym-section');
      if (!gymEl) return;
      
      const rect = gymEl.getBoundingClientRect();
      const vh = window.innerHeight;
      
      // Start fading earlier – when the bottom of the gym section is at
      // ~55% of the viewport and continue until it's at 15%
      const fadeStart = vh * 0.55;   // begin fade
      const fadeEnd   = vh * 0.15;   // fully gone

      let opacity = 1;
      if (rect.bottom <= fadeEnd) {
        opacity = 0;
      } else if (rect.bottom < fadeStart) {
        // Linear fade between fadeStart → fadeEnd
        opacity = (rect.bottom - fadeEnd) / (fadeStart - fadeEnd);
      }

      // Direct DOM write – zero React re-renders while scrolling
      const canvasWrapper = document.querySelector('.hero-canvas-wrapper');
      if (canvasWrapper) {
        canvasWrapper.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        canvasWrapper.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto';
        canvasWrapper.style.zIndex = opacity < 0.05 ? '0' : '10';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Direct DOM opacity mutation on scroll (zero React state re-renders during scroll)
  useEffect(() => {
    if (!showLayout) return;

    const handleScroll = () => {
      const sy = window.scrollY || 0;
      const op = Math.max(0, 1 - sy / 320);
      // Fade ALL hero content columns (mobile + desktop) via class
      document.querySelectorAll('.hero-fade-col').forEach(el => {
        el.style.opacity = op;
      });
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

    // 2. Trigger 250ms Emerald Match Green radial shockwave ring
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
    <section id="hero-section" className={`relative w-full h-[100svh] overflow-hidden transition-colors duration-1000 ${
      darkTheme ? 'bg-[#080b08]' : 'bg-[#F2EFE9]'
    }`}>
      {!modelsLoaded && <LoadingScreen progress={loadingProgress} />}

      {!hasKicked && <EntryBackground />}

      {/*
        ═══════════════════════════════════════════════════════════════
        HERO BACKGROUND — 4 INDEPENDENT LAYERS (verified, not merged)
        Base: #080b08  |  ≥65% canvas stays within 10% brightness of base
        ═══════════════════════════════════════════════════════════════

        LAYER 1 — Ground-plane contact glow
          radial-gradient(ellipse 700px 180px at 50% 92%,
            rgba(52,199,123,0.35) 0%,
            rgba(52,199,123,0.12) 40%,
            transparent 70%)
          → Wide flat ellipse directly under ball, bright centre, fast falloff

        LAYER 2 — Distant ambient mass, upper-right
          radial-gradient(circle 900px at 78% 25%,
            rgba(20,90,55,0.18) 0%,
            rgba(20,90,55,0.06) 50%,
            transparent 75%)
          → Low opacity, large, behind ball

        LAYER 3 — Secondary ambient, lower-left (behind text column)
          radial-gradient(circle 600px at 12% 70%,
            rgba(15,60,40,0.10) 0%,
            transparent 70%)
          → Barely visible, breaks flatness without reducing text contrast

        LAYER 4 — Rim-light arc upper-left of ball silhouette
          Fixed div, z-15, rgba(120,255,180,0.40), blur 20px
          → Implies key light hitting from upper-left, matches 3D rig
        ═══════════════════════════════════════════════════════════════
      */}

      {/* LAYER 1: Ground-plane glow — flat ellipse beneath the ball
           Calibrated for dark-background reality: 0.35 alpha on #080b08
           renders as rgb(23,77,50) at center — visible but not blown out.
           Position 72%: ball shadow lands at ~60-70% viewport height,
           not 92% which would be below the fold on most monitors. */}
      <div
        className={`absolute inset-0 pointer-events-none z-[4] transition-opacity duration-1000 ${darkTheme ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 700px 180px at 50% 72%, rgba(52,199,123,0.55) 0%, rgba(52,199,123,0.25) 45%, transparent 70%)',
        }}
      />

      {/* LAYER 2: Distant ambient mass — upper-right
           0.18 alpha on near-black = rgb(10,25,16) — perceptually invisible.
           Raised to 0.40 = rgb(16,44,30) — subtle but distinguishable. */}
      <div
        className={`absolute inset-0 pointer-events-none z-[4] transition-opacity duration-1000 ${darkTheme ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle 900px at 78% 25%, rgba(20,90,55,0.40) 0%, rgba(20,90,55,0.12) 50%, transparent 75%)',
        }}
      />

      {/* LAYER 3: Secondary ambient — lower-left, behind text column
           Kept intentionally dim (0.20) — breaks flatness behind left text
           without bleeding into the right copy column. */}
      <div
        className={`absolute inset-0 pointer-events-none z-[4] transition-opacity duration-1000 ${darkTheme ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle 600px at 12% 70%, rgba(15,60,40,0.20) 0%, transparent 70%)',
        }}
      />

      {/* LAYER 4: Rim-light arc — absolute (NOT fixed) so it stays inside the hero
           and scrolls away when the user navigates to other sections.
           Upper-left arc implies key-light direction matching the 3D rig. */}
      {darkTheme && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse 52% 52% at 20% 18%, rgba(120,255,180,0.45) 0%, rgba(120,255,180,0.12) 38%, transparent 60%)',
            filter: 'blur(16px)',
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      )}

      {/* Topographic contour line clusters — organic blobs via Catmull-Rom splines */}
      <ContourLines darkTheme={darkTheme} />

      {/* Impact Shockwave Ring at moment of kick (250ms) */}
      {shockwaveActive && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="w-44 h-44 rounded-full border-2 border-[#00C864] animate-ping opacity-75" />
        </div>
      )}

      {/* 3D WebGL Canvas Layer — pointer-events-auto so WebGL canvas receives mouse events for hover grab cursor & drag rotation 
          BUT when fading out, remove pointer events so footer links become clickable */}
      <div className="hero-canvas-wrapper fixed inset-0 transition-opacity duration-300" style={{ opacity: 1, zIndex: 10 }}>
        <Suspense fallback={null}>
          <HeroCanvas
            hasKicked={hasKicked}
            isInteractive={isInteractive}
            progressRef={progressRef}
            footballRef={footballRef}
            onSettle={handleSettle}
            onGoalUnlocked={() => {}}
            sequenceComplete={showLayout}
            onModelsLoaded={() => setModelsLoaded(true)}
          />
        </Suspense>
      </div>

      {/* PHASE 2 — RESPONSIVE LAYOUT */}
      <div className={`relative z-40 w-full h-full pointer-events-none
        transition-opacity duration-300
        ${hasKicked ? 'block' : 'hidden'}
        ${showLayout ? 'opacity-100' : 'opacity-0'}`}
      >

        {/* ═══ DESKTOP: 3-zone grid (md+) ═══ */}
        <div className="hidden md:grid max-w-[1440px] mx-auto h-full px-12 lg:px-16 grid-cols-12 items-center gap-8">

          {/* Zone 1: Left — Headline + Open Zones */}
          <div className="hero-fade-col col-span-5 flex flex-col justify-center gap-5 lg:gap-7">
            <div className="pointer-events-auto">
              <h1
                className="font-humane font-bold text-[#F4F4F0] uppercase leading-[0.82] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(3.6rem, 7.2vw, 6.2rem)' }}
              >
                <span className="block">Dharan's</span>
                <span className="block text-[#00C864]">Premier</span>
                <span className="block">Sports Hub.</span>
              </h1>
              <p className="text-[#85878A] text-[14px] font-sans leading-snug mt-3">
                Indoor sports arena — Dharan-11, Koshi Province, Nepal.
              </p>
            </div>

            {/* OPEN ZONES Facility List */}
            <div className="flex flex-col gap-2 mt-1 pointer-events-auto">
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#85878A]/60 mb-1">
                Open Zones
              </p>
              <div className="flex flex-col gap-2">
                {ZONES.map((z) => {
                  const IconComponent = z.icon;
                  return (
                    <div key={z.name} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md border border-[#00C864]/30 flex items-center justify-center shrink-0 bg-[#0A2E1A]/40">
                        <IconComponent className="w-3.5 h-3.5 text-[#00C864]" />
                      </div>
                      <div>
                        <span className="text-[13px] font-sans text-[#F4F4F0] font-medium">{z.name}</span>
                        <span className="text-[11px] font-mono text-[#85878A] ml-2">{z.note}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Zone 2: Center — 3D ball space */}
          <div className="col-span-3 h-full pointer-events-none" aria-hidden="true" />

          {/* Zone 3: Right — Lead-in + CTA */}
          <div className="hero-fade-col col-span-4 flex flex-col justify-center gap-6 lg:gap-8 pl-2 lg:pl-6">
            <p className="text-[#85878A] text-[14px] lg:text-[15px] leading-[1.65] font-sans max-w-[340px] pointer-events-auto">
              <strong className="text-[#F4F4F0] font-semibold block mb-1.5">
                Professional-grade sports arena.
              </strong>
              Miteri Sports Center brings futsal, basketball, badminton and gym facilities together in one arena — built for Dharan, bookable online.
            </p>

            <div className="pointer-events-auto">
              <MagneticButton
                onClick={() => {
                  const el = document.getElementById('futsal-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="secondary"
                size="default"
                iconBg="#0D0D0E"
              >
                Explore Facilities
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* ═══ MOBILE: Vertical stack (< md) ═══ */}
        {/* The fixed WebGL canvas renders the ball in the viewport center.
            We build an explicit top / spacer / bottom layout so text never overlaps. */}
        <div className="flex md:hidden flex-col h-full">

          {/* TOP — Headline block (sits above the ball) */}
          <div
            className="hero-fade-col px-5 pt-16 pb-2 pointer-events-auto flex flex-col gap-2"
          >
            <h1
              className="font-humane font-bold text-[#F4F4F0] uppercase leading-[0.82] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(3.2rem, 14vw, 5.0rem)' }}
            >
              <span className="block">Dharan's</span>
              <span className="block text-[#00C864]">Premier</span>
              <span className="block">Sports Hub.</span>
            </h1>
            <p className="text-[#85878A] text-[12px] font-sans leading-snug mt-1">
              Indoor sports arena — Dharan-11, Koshi Province, Nepal.
            </p>
          </div>

          {/* MID SPACER — this empty flex block reserves height for the 3D ball */}
          <div className="flex-1 min-h-[220px]" aria-hidden="true" />

          {/* BOTTOM — Zones + CTA (sits below the ball) */}
          <div
            className="hero-fade-col px-5 pb-10 flex flex-col gap-4 pointer-events-auto"
          >
            {/* Compact 2-column zone strip */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {ZONES.map((z) => {
                const IconComponent = z.icon;
                return (
                  <div key={z.name} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-[#00C864]/30 flex items-center justify-center shrink-0 bg-[#0A2E1A]/60">
                      <IconComponent className="w-3 h-3 text-[#00C864]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-sans text-[#F4F4F0] font-medium block leading-tight">{z.name}</span>
                      <span className="text-[9px] font-mono text-[#85878A] block leading-tight">{z.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                const el = document.getElementById('futsal-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group w-full inline-flex items-center justify-center gap-3 bg-[#00C864] hover:bg-[#1CE47C] text-[#0D0D0E] py-3.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
            >
              <span>Explore Facilities</span>
              <span className="w-5 h-5 rounded-full bg-[#0D0D0E] text-[#00C864] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shrink-0">
                <ArrowUpRight size={12} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* PHASE 1 — Kick Button */}
      <div className={`absolute inset-x-0 bottom-8 sm:bottom-10 z-50 flex flex-col items-center gap-3
        pointer-events-auto transition-opacity duration-300
        ${hasKicked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <button
          id="kick-cta"
          onClick={handleKick}
          data-magnetic
          className="group flex items-center gap-2.5
            bg-[#0D0D0E] hover:bg-[#222] text-white
            pl-5 pr-3 py-3 rounded-full shadow-xl
            transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-[13px] font-sans font-medium tracking-tight">
            Kick the ball to open
          </span>
          <span className="w-7 h-7 rounded-full bg-[#00C864]
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
