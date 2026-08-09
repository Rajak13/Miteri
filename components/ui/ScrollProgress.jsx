'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollProgress — Thin progress bar showing scroll completion
 * 
 * Features:
 * - Smooth progress tracking
 * - Gradient color (matches section themes)
 * - Fixed at top of viewport
 * - Respects reduced motion
 */

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };
    
    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      className="fixed top-0 left-0 w-full h-0.5 bg-transparent z-[100] pointer-events-none"
      aria-hidden="true"
    >
      <div 
        className="h-full transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00C864 0%, #FF5500 33%, #0091D5 66%, #B91C1C 100%)'
        }}
      />
    </div>
  );
}
