'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/ui/Navbar';
import HeroKickSequence from '../components/sections/HeroKickSequence';
import FutsalSection from '../components/sections/FutsalSection';
import BasketballSection from '../components/sections/BasketballSection';
import BadmintonSection from '../components/sections/BadmintonSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [navVisible, setNavVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [navTheme, setNavTheme] = useState('green');

  // Lock scroll on mount & reset to top on page refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      if (!isUnlocked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isUnlocked]);

  // ScrollTrigger for dynamic Navbar theme: green → orange → blue
  useEffect(() => {
    if (!isUnlocked || typeof window === 'undefined') return;

    let stOrange = null;
    let stBlue = null;
    const timer = setTimeout(() => {
      const bballEl = document.getElementById('basketball-section');
      const badmEl  = document.getElementById('badminton-section');

      if (bballEl) {
        stOrange = ScrollTrigger.create({
          trigger: bballEl,
          start: 'top 50%',
          onEnter: () => setNavTheme('orange'),
          onLeaveBack: () => setNavTheme('green'),
        });
      }

      if (badmEl) {
        stBlue = ScrollTrigger.create({
          trigger: badmEl,
          start: 'top 50%',
          onEnter: () => setNavTheme('blue'),
          onLeaveBack: () => setNavTheme('orange'),
        });
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (stOrange) stOrange.kill();
      if (stBlue) stBlue.kill();
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <main className="min-h-screen bg-[#080909] text-[#0D0D0E]">

      {/* Navbar — hidden during Phase 1, fades in after kick completes with dynamic theme */}
      <div
        className={`transition-opacity duration-700 ${navVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Navbar
          theme={navTheme}
          onBookNow={() => alert('Opening Miteri Sports Booking…')}
        />
      </div>

      {/* Hero — manages its own phase state & unlocks scrolling upon kick completion */}
      <HeroKickSequence
        onNavbarReveal={() => setNavVisible(true)}
        onGoalUnlocked={handleUnlock}
      />

      {/* Unlocked Page Sections — Futsal & Basketball Sections */}
      <div className={`transition-opacity duration-700 ${isUnlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <FutsalSection />
        <BasketballSection />
        <BadmintonSection />
      </div>
    </main>
  );
}
