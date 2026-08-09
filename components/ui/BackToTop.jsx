'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BackToTop — Section-aware floating button
 * 
 * Features:
 * - Appears after scrolling 500px
 * - Changes color based on current section
 * - Smaller, cleaner design
 * - Smooth scroll to top
 */

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    // Section color mappings
    const sections = [
      { selector: '#hero-section', bg: '#00C864', text: '#0D0D0E' },         // Green
      { selector: '#futsal-section', bg: '#00C864', text: '#0D0D0E' },       // Green
      { selector: '#basketball-section', bg: '#FF6B35', text: '#F4F1EA' },   // Orange
      { selector: '#badminton-section', bg: '#0091D5', text: '#FFFFFF' },    // Blue
      { selector: '#gym-section', bg: '#DC2626', text: '#F4F1EA' },          // Red
    ];
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section.selector,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(buttonRef.current, {
            backgroundColor: section.bg,
            color: section.text,
            duration: 0.4,
            ease: 'power2.out',
          });
        },
        onEnterBack: () => {
          gsap.to(buttonRef.current, {
            backgroundColor: section.bg,
            color: section.text,
            duration: 0.4,
            ease: 'power2.out',
          });
        },
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [visible]);
  
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };
  
  if (!visible) return null;
  
  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="cursor-hover fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
      style={{ backgroundColor: '#00C864', color: '#0D0D0E' }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}
