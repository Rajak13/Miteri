'use client';

import React, { useState } from 'react';

export default function Footer() {
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <footer className="relative z-50 bg-[#0D0D0E] text-[#85878A] py-8 px-6 pointer-events-auto">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* About Section */}
          <div>
            <h3 className="text-[#F4F4F0] font-humane font-bold text-base uppercase mb-2">
              Miteri Sports
            </h3>
            <p className="text-xs leading-relaxed">
              Dharan's premier indoor sports arena offering futsal, basketball, badminton, and gym facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F4F4F0] font-sans font-semibold text-xs uppercase tracking-wider mb-2">
              Facilities
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#futsal-section" className="hover:text-[#00C864] transition-colors">
                  Futsal Courts
                </a>
              </li>
              <li>
                <a href="#basketball-section" className="hover:text-[#FF5500] transition-colors">
                  Basketball Courts
                </a>
              </li>
              <li>
                <a href="#badminton-section" className="hover:text-[#4A90E2] transition-colors">
                  Badminton Courts
                </a>
              </li>
              <li>
                <a href="#gym-section" className="hover:text-[#B91C1C] transition-colors">
                  Gym Hall
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#F4F4F0] font-sans font-semibold text-xs uppercase tracking-wider mb-2">
              Contact
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>Dharan-11, Koshi Province</li>
              <li>Nepal</li>
              <li className="mt-3">
                <a href="mailto:info@miteri.vercel.app" className="hover:text-[#00C864] transition-colors">
                  info@miteri.vercel.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2A2A2A] my-4"></div>

        {/* 3D Model Credits Section - Dropdown */}
        <div className="mb-4">
          <button
            onClick={() => setCreditsOpen(!creditsOpen)}
            className="flex items-center gap-2 text-[#F4F4F0] font-sans font-semibold text-xs uppercase tracking-wider hover:text-[#00C864] transition-colors"
          >
            <span>3D Model Credits</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${creditsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${creditsOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1.5 text-[10px] leading-relaxed">
              <p>
                <a 
                  href="https://skfb.ly/6vxo6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#00C864] transition-colors"
                >
                  "Cafusa Adidas 2013 Confederations Cup Ball"
                </a>
                {' '}by{' '}
                <span className="text-[#F4F4F0]">attix84work</span>
                {' '}is licensed under{' '}
                <a 
                  href="http://creativecommons.org/licenses/by/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#00C864] transition-colors"
                >
                  Creative Commons Attribution
                </a>
                .
              </p>
              <p>
                <a 
                  href="https://skfb.ly/oxWCB" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5500] transition-colors"
                >
                  "Basketball"
                </a>
                {' '}by{' '}
                <span className="text-[#F4F4F0]">Ika3D</span>
                {' '}is licensed under{' '}
                <a 
                  href="http://creativecommons.org/licenses/by/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5500] transition-colors"
                >
                  Creative Commons Attribution
                </a>
                .
              </p>
              <p>
                <a 
                  href="https://skfb.ly/oFwzu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#4A90E2] transition-colors"
                >
                  "Badminton"
                </a>
                {' '}by{' '}
                <span className="text-[#F4F4F0]">liuyi1song</span>
                {' '}is licensed under{' '}
                <a 
                  href="http://creativecommons.org/licenses/by/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#4A90E2] transition-colors"
                >
                  Creative Commons Attribution
                </a>
                .
              </p>
              <p>
                <a 
                  href="https://skfb.ly/oFWwH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#B91C1C] transition-colors"
                >
                  "Dumbbells"
                </a>
                {' '}by{' '}
                <span className="text-[#F4F4F0]">donnichols</span>
                {' '}is licensed under{' '}
                <a 
                  href="http://creativecommons.org/licenses/by/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#B91C1C] transition-colors"
                >
                  Creative Commons Attribution
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[10px]">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>
                © {new Date().getFullYear()} Miteri Sports Center. All rights reserved.
              </p>
              <p className="text-[#5A5A5A]">•</p>
              <p>
                Built by{' '}
                <a 
                  href="https://www.nantio.it.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#F4F4F0] hover:text-[#00C864] transition-colors font-medium"
                >
                  Nantio Studio
                </a>
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#00C864] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#00C864] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
