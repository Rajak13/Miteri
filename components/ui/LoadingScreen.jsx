'use client';

import React from 'react';
import { Circle } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F2EFE9]">
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
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#00C864] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#00C864] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#00C864] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
