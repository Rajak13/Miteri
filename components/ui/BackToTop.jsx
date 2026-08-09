'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * BackToTop — Section-aware floating button
 * 
 * Features:
 * - Appears after scrolling 500px
 * - Changes color based on current section
 * - Smaller, cleaner design
 * - Smooth scroll WITHOUT breaking animations
 */

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState({ bg: '#00C864', text: '#0D0D0E' });
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 500);
      
      // Manually check which section is in view and update colors
      // This avoids creating ScrollTriggers that conflict with animation ScrollTriggers
      const heroEl = document.getElementById('hero-section');
      const futsalEl = document.getElementById('futsal-section');
      const basketballEl = document.getElementById('basketball-section');
      const badmintonEl = document.getElementById('badminton-section');
      const gymEl = document.getElementById('gym-section');
      
      const vh = window.innerHeight;
      const center = scrollY + vh / 2;
      
      // Check which section the center of viewport is in
      if (gymEl) {
        const rect = gymEl.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + gymEl.offsetHeight;
        if (center >= top && center < bottom) {
          setCurrentColor({ bg: '#DC2626', text: '#F4F1EA' });
          return;
        }
      }
      
      if (badmintonEl) {
        const rect = badmintonEl.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + badmintonEl.offsetHeight;
        if (center >= top && center < bottom) {
          setCurrentColor({ bg: '#0091D5', text: '#FFFFFF' });
          return;
        }
      }
      
      if (basketballEl) {
        const rect = basketballEl.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + basketballEl.offsetHeight;
        if (center >= top && center < bottom) {
          setCurrentColor({ bg: '#FF6B35', text: '#F4F1EA' });
          return;
        }
      }
      
      if (futsalEl) {
        const rect = futsalEl.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + futsalEl.offsetHeight;
        if (center >= top && center < bottom) {
          setCurrentColor({ bg: '#00C864', text: '#0D0D0E' });
          return;
        }
      }
      
      // Default to green (hero/futsal)
      setCurrentColor({ bg: '#00C864', text: '#0D0D0E' });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    // Use GSAP for smooth scroll that doesn't break animations
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 1.2,
      ease: 'power2.inOut',
    });
  };
  
  if (!visible) return null;
  
  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="cursor-hover fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
      style={{ 
        backgroundColor: currentColor.bg, 
        color: currentColor.text,
        transition: 'background-color 0.4s ease, color 0.4s ease'
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}
