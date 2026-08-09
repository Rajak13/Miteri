'use client';

import React, { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';

export default function LoadingScreen({ progress = 0 }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    // Smoothly animate progress
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= progress) return prev;
        return Math.min(prev + 2, progress);
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F2EFE9] transition-opacity duration-500">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Football Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#00C864]/10 animate-pulse flex items-center justify-center">
            <Circle size={40} className="text-[#00C864] animate-spin" strokeWidth={2.5} />
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-[#00C864]/5 blur-xl animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="font-humane font-bold text-2xl text-[#0D0D0E] mb-2">
            Miteri Sports
          </h2>
          <p className="font-mono text-xs text-[#85878A] uppercase tracking-widest">
            Loading Experience
          </p>
          
          {/* Progress bar */}
          <div className="w-48 h-1 bg-[#0D0D0E]/10 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-[#00C864] transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          
          {/* Progress percentage */}
          <p className="font-mono text-[10px] text-[#85878A] mt-2">
            {Math.round(displayProgress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
