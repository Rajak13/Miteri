'use client';

/**
 * Navbar — Floating Studio Navbar with Dynamic Multi-Sport Theme Support.
 *
 * Theme Modes:
 * - 'green' (Hero & Futsal): Green logo mark (#3CCB6E), green CTA hover (#123D27 + #3CCB6E border).
 * - 'orange' (Basketball): Electric Orange logo mark (#FF5500), electric orange CTA hover (#3A1200 + #FF5500 border).
 * - 'blue' (Badminton): Court Blue logo mark (#0091D5), blue CTA hover (#002840 + #0091D5 border).
 */

import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Futsal',      href: '#futsal-section' },
  { label: 'Basketball',  href: '#basketball-section' },
  { label: 'Gym Hall',    href: '#basketball-section' },
  { label: 'Badminton',   href: '#badminton-section' },
  { label: 'About',       href: '#hero-section' },
];

export default function Navbar({ onBookNow, theme = 'green' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOrange = theme === 'orange';
  const isBlue   = theme === 'blue';
  const isRed    = theme === 'red';

  const accentColor = isRed ? '#B91C1C' : isBlue ? '#0091D5' : isOrange ? '#FF5500' : '#00C864';
  const ctaHoverBg  = isRed
    ? 'hover:bg-[#3A0808] hover:border-[#B91C1C]/50 hover:text-[#B91C1C]'
    : isBlue
    ? 'hover:bg-[#002840] hover:border-[#0091D5]/50 hover:text-[#0091D5]'
    : isOrange
    ? 'hover:bg-[#3A1200] hover:border-[#FF5500]/50 hover:text-[#FF5500]'
    : 'hover:bg-[#0A2E1A] hover:border-[#00C864]/50 hover:text-[#00C864]';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0D]/90 backdrop-blur-md border-b border-[#1A1D1C] transition-colors duration-500">
      <nav
        aria-label="Main navigation"
        className="max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-10 h-14"
      >
        {/* ── LEFT: Logo ─────────────────────────────────── */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0 group focus:outline-none"
          aria-label="Miteri Sports Center"
        >
          {/* Dynamic Snowflake / Star mark */}
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            style={{ color: accentColor }}
            className="transition-colors duration-500"
            aria-hidden="true"
          >
            <line x1="12" y1="2"  x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2"  y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span
            style={{ '--hover-color': accentColor }}
            className="font-stedelijk text-[15px] tracking-tight text-[#F4F4F0] transition-colors duration-300"
          >
            Miteri
          </span>
        </a>

        {/* ── CENTER: Nav links (desktop) ────────────────── */}
        <div className="hidden md:flex items-center gap-7" role="menubar">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              role="menuitem"
              className="text-[11px] text-[#85878A] hover:text-[#F4F4F0] transition-colors duration-150 font-mono tracking-widest uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── RIGHT: CTA + mobile toggle ─────────────────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBookNow}
            className={`hidden md:flex items-center gap-1.5 text-[11px] font-stedelijk tracking-wide text-[#F4F4F0] bg-[#1A1D1C] border border-[#1A1D1C] ${ctaHoverBg} px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer`}
          >
            Book a Court
          </button>

          {/* Mobile "Book" always visible */}
          <button
            onClick={onBookNow}
            style={{ color: accentColor }}
            className="md:hidden text-[11px] font-stedelijk tracking-wide transition-colors duration-500"
          >
            Book
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden p-1 text-[#85878A] hover:text-[#F4F4F0]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0B0D] border-b border-[#1A1D1C] px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[11px] text-[#85878A] hover:text-[#F4F4F0] py-1 font-mono tracking-widest uppercase"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { onBookNow?.(); setMobileOpen(false); }}
            style={{ backgroundColor: accentColor }}
            className="mt-2 w-full text-center text-[#0A0B0D] text-[11px] font-stedelijk tracking-wide py-2 rounded-full transition-colors duration-500"
          >
            Book a Court
          </button>
        </div>
      )}
    </header>
  );
}
