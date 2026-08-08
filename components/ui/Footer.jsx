'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0D0D0E] text-[#85878A] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-[#F4F4F0] font-humane font-bold text-lg uppercase mb-3">
              Miteri Sports
            </h3>
            <p className="text-sm leading-relaxed">
              Dharan's premier indoor sports arena offering futsal, basketball, badminton, and gym facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F4F4F0] font-sans font-semibold text-sm uppercase tracking-wider mb-3">
              Facilities
            </h3>
            <ul className="space-y-2 text-sm">
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
                <a href="#gym-section" className="hover:text-[#00C864] transition-colors">
                  Gym Hall
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#F4F4F0] font-sans font-semibold text-sm uppercase tracking-wider mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
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
        <div className="border-t border-[#2A2A2A] my-8"></div>

        {/* 3D Model Credits Section */}
        <div className="mb-8">
          <h3 className="text-[#F4F4F0] font-sans font-semibold text-xs uppercase tracking-wider mb-4">
            3D Model Credits
          </h3>
          <div className="space-y-2 text-xs leading-relaxed">
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2A2A2A] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
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
