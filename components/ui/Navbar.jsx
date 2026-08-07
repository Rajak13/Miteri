'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Futsal',      href: '#facilities-overview' },
  { label: 'Basketball',  href: '#facilities-overview' },
  { label: 'Gym Hall',    href: '#facilities-overview' },
  { label: 'Badminton',   href: '#facilities-overview' },
  { label: 'About',       href: '#about' },
];

export default function Navbar({ onBookNow }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0D]/90 backdrop-blur-md border-b border-[#1A1D1C]">
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
          {/* Snowflake-style mark */}
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            className="text-[#39D477]"
            aria-hidden="true"
          >
            <line x1="12" y1="2"  x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2"  y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span
            className="font-stedelijk text-[15px] tracking-tight text-[#F4F4F0] group-hover:text-[#39D477] transition-colors duration-200"
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
              className="text-[13px] text-[#85878A] hover:text-[#F4F4F0] transition-colors duration-150 font-sans tracking-tight"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── RIGHT: CTA + mobile toggle ─────────────────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBookNow}
            className="hidden md:flex items-center gap-1.5 text-[13px] font-sans text-[#F4F4F0] bg-[#1A1D1C] hover:bg-[#123D27] border border-[#1A1D1C] hover:border-[#39D477]/40 px-4 py-1.5 rounded-full transition-all duration-200"
          >
            Book a Court
          </button>

          {/* Mobile "Book" always visible */}
          <button
            onClick={onBookNow}
            className="md:hidden text-[12px] font-medium text-[#39D477] font-sans"
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
              className="text-[14px] text-[#85878A] hover:text-[#F4F4F0] py-1 font-sans"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { onBookNow?.(); setMobileOpen(false); }}
            className="mt-2 w-full text-center bg-[#39D477] text-[#0A0B0D] text-[13px] font-semibold font-sans py-2 rounded-full"
          >
            Book a Court
          </button>
        </div>
      )}
    </header>
  );
}
