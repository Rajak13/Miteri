'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SectionTransitions — Smooth color bleed transitions between sections
 * 
 * Features:
 * - Gradual background color morphing with GSAP
 * - Smooth text color transitions
 * - Coordinated with scroll position
 * - Creates "bleed zones" between sections
 */

export default function SectionTransitions() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Hero → Futsal Transition (Dark #080909 → Light Cream #F4F1EA)
      ScrollTrigger.create({
        trigger: '#futsal-section',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const hero = document.getElementById('hero-section');
          const futsal = document.getElementById('futsal-section');
          
          if (hero && futsal) {
            // Interpolate background color
            const r = Math.round(8 + (244 - 8) * progress);
            const g = Math.round(9 + (241 - 9) * progress);
            const b = Math.round(9 + (234 - 9) * progress);
            
            hero.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        },
      });

      // Futsal → Basketball Transition (Light Cream #F4F1EA → Dark #080909)
      ScrollTrigger.create({
        trigger: '#basketball-section',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const futsal = document.getElementById('futsal-section');
          const basketball = document.getElementById('basketball-section');
          
          if (futsal && basketball) {
            const r = Math.round(244 + (8 - 244) * progress);
            const g = Math.round(241 + (9 - 241) * progress);
            const b = Math.round(234 + (9 - 234) * progress);
            
            futsal.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        },
      });

      // Basketball → Badminton Transition (Dark #080909 → Light Sky #EEF6FC)
      ScrollTrigger.create({
        trigger: '#badminton-section',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const basketball = document.getElementById('basketball-section');
          const badminton = document.getElementById('badminton-section');
          
          if (basketball && badminton) {
            const r = Math.round(8 + (238 - 8) * progress);
            const g = Math.round(9 + (246 - 9) * progress);
            const b = Math.round(9 + (252 - 9) * progress);
            
            basketball.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        },
      });

      // Badminton → Gym Transition (Light Sky #EEF6FC → Dark Crimson #1A0505)
      ScrollTrigger.create({
        trigger: '#gym-section',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const badminton = document.getElementById('badminton-section');
          const gym = document.getElementById('gym-section');
          
          if (badminton && gym) {
            const r = Math.round(238 + (26 - 238) * progress);
            const g = Math.round(246 + (5 - 246) * progress);
            const b = Math.round(252 + (5 - 252) * progress);
            
            badminton.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        },
      });

      // Add subtle gradient overlays for depth during transitions
      const sections = ['#hero-section', '#futsal-section', '#basketball-section', '#badminton-section', '#gym-section'];
      
      sections.forEach((sectionId, index) => {
        const section = document.querySelector(sectionId);
        if (!section) return;

        // Create gradient overlay element
        const overlay = document.createElement('div');
        overlay.className = 'section-transition-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20%;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.5s ease;
        `;

        // Set gradient based on next section's color
        if (index < sections.length - 1) {
          const gradients = [
            'linear-gradient(to bottom, transparent, rgba(244, 241, 234, 0.1))', // Hero → Futsal
            'linear-gradient(to bottom, transparent, rgba(8, 9, 9, 0.1))',      // Futsal → Basketball
            'linear-gradient(to bottom, transparent, rgba(238, 246, 252, 0.1))', // Basketball → Badminton
            'linear-gradient(to bottom, transparent, rgba(26, 5, 5, 0.1))',     // Badminton → Gym
          ];
          overlay.style.background = gradients[index] || 'none';
        }

        section.style.position = 'relative';
        section.appendChild(overlay);

        // Animate overlay opacity during scroll
        if (index < sections.length - 1) {
          ScrollTrigger.create({
            trigger: sections[index + 1],
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            onUpdate: (self) => {
              overlay.style.opacity = self.progress * 0.6;
            },
          });
        }
      });

      // Add smooth border transitions between sections
      const sectionElements = document.querySelectorAll('[id$="-section"]');
      sectionElements.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            gsap.to(section, {
              borderTopColor: 'rgba(255, 255, 255, 0.08)',
              duration: 0.8,
              ease: 'power2.out',
            });
          },
          onLeave: () => {
            gsap.to(section, {
              borderTopColor: 'rgba(255, 255, 255, 0.03)',
              duration: 0.8,
              ease: 'power2.out',
            });
          },
          onEnterBack: () => {
            gsap.to(section, {
              borderTopColor: 'rgba(255, 255, 255, 0.08)',
              duration: 0.8,
              ease: 'power2.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(section, {
              borderTopColor: 'rgba(255, 255, 255, 0.03)',
              duration: 0.8,
              ease: 'power2.out',
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
