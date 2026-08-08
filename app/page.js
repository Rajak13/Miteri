'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import BookingModal from '../components/ui/BookingModal';
import HeroKickSequence from '../components/sections/HeroKickSequence';
import FutsalSection from '../components/sections/FutsalSection';
import BasketballSection from '../components/sections/BasketballSection';
import BadmintonSection from '../components/sections/BadmintonSection';
import GymSection from '../components/sections/GymSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [navVisible, setNavVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [navTheme, setNavTheme] = useState('green');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState('futsal');

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

  // ScrollTrigger for dynamic Navbar theme + auto-detect current facility section
  useEffect(() => {
    if (!isUnlocked || typeof window === 'undefined') return;

    let stOrange = null;
    let stBlue = null;
    let stRed = null;
    let stFutsalFacility = null;
    let stBballFacility = null;
    let stBadmFacility = null;
    let stGymFacility = null;

    const timer = setTimeout(() => {
      const bballEl = document.getElementById('basketball-section');
      const badmEl  = document.getElementById('badminton-section');
      const gymEl   = document.getElementById('gym-section');
      const futsalEl = document.getElementById('futsal-section');

      // Navbar theme triggers
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

      if (gymEl) {
        stRed = ScrollTrigger.create({
          trigger: gymEl,
          start: 'top 50%',
          onEnter: () => setNavTheme('red'),
          onLeaveBack: () => setNavTheme('blue'),
        });
      }

      // Current facility detection for booking modal
      if (futsalEl) {
        stFutsalFacility = ScrollTrigger.create({
          trigger: futsalEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentFacility('futsal'),
          onEnterBack: () => setCurrentFacility('futsal'),
        });
      }

      if (bballEl) {
        stBballFacility = ScrollTrigger.create({
          trigger: bballEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentFacility('basketball'),
          onEnterBack: () => setCurrentFacility('basketball'),
        });
      }

      if (badmEl) {
        stBadmFacility = ScrollTrigger.create({
          trigger: badmEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentFacility('badminton'),
          onEnterBack: () => setCurrentFacility('badminton'),
        });
      }

      if (gymEl) {
        stGymFacility = ScrollTrigger.create({
          trigger: gymEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentFacility('gym'),
          onEnterBack: () => setCurrentFacility('gym'),
        });
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (stOrange) stOrange.kill();
      if (stBlue) stBlue.kill();
      if (stRed) stRed.kill();
      if (stFutsalFacility) stFutsalFacility.kill();
      if (stBballFacility) stBballFacility.kill();
      if (stBadmFacility) stBadmFacility.kill();
      if (stGymFacility) stGymFacility.kill();
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  const handleBookNow = () => {
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#080909] text-[#0D0D0E]">

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialFacility={currentFacility}
      />

      {/* Navbar — hidden during Phase 1, fades in after kick completes with dynamic theme */}
      <div
        className={`transition-opacity duration-700 ${navVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Navbar
          theme={navTheme}
          onBookNow={handleBookNow}
        />
      </div>

      {/* Hero — manages its own phase state & unlocks scrolling upon kick completion */}
      <HeroKickSequence
        onNavbarReveal={() => setNavVisible(true)}
        onGoalUnlocked={handleUnlock}
      />

      {/* Unlocked Page Sections — Futsal, Basketball, Badminton & Gym Sections */}
      <div className={`transition-opacity duration-700 ${isUnlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <FutsalSection />
        <BasketballSection />
        <BadmintonSection />
        <GymSection />
        <Footer />
      </div>
    </main>
  );
}
