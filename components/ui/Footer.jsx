'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0D0D0E] border-t border-[#2A2A2A]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-8 sm:py-10">
        
        {/* Top Row — Credits & Built By */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[#2A2A2A]">
          
          {/* 3D Model Credits */}
          <div className="space-y-1.5 text-[10px] sm:text-xs font-mono text-[#5A5A5A] leading-relaxed">
            <p className="uppercase tracking-wider text-[#85878A] mb-2">3D Assets</p>
            <p>
              <a href="https://skfb.ly/6vxo6" target="_blank" rel="noopener noreferrer" className="hover:text-[#00C864] transition-colors">
                Football
              </a>
              {' '}by attix84work
            </p>
            <p>
              <a href="https://skfb.ly/oxWCB" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5500] transition-colors">
                Basketball
              </a>
              {' '}by Ika3D
            </p>
            <p>
              <a href="https://skfb.ly/oFwzu" target="_blank" rel="noopener noreferrer" className="hover:text-[#4A90E2] transition-colors">
                Badminton
              </a>
              {' '}by liuyi1song
            </p>
            <p className="text-[9px] sm:text-[10px] text-[#3A3A3A] mt-2">
              Licensed under{' '}
              <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-[#85878A] transition-colors">
                CC BY 4.0
              </a>
            </p>
          </div>

          {/* Built By */}
          <div className="text-right">
            <p className="font-stedelijk text-[10px] tracking-widest uppercase text-[#5A5A5A] mb-1.5">
              Design & Development
            </p>
            <a 
              href="https://www.nantio.it.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-humane text-xl sm:text-2xl text-[#F4F4F0] hover:text-[#00C864] transition-colors uppercase"
            >
              Nantio Studio
            </a>
          </div>
        </div>

        {/* Bottom Row — Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs font-mono text-[#5A5A5A]">
          <p>© {new Date().getFullYear()} Miteri Sports Center</p>
          <p>Dharan-11, Koshi Province, Nepal</p>
        </div>

      </div>
    </footer>
  );
}

