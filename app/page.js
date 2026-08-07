'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import HeroKickSequence from '../components/sections/HeroKickSequence';

export default function Home() {
  const [navVisible, setNavVisible] = useState(false);

  return (
    <main className="min-h-screen bg-[#F2EFE9] text-[#0D0D0E]">

      {/* Navbar — hidden during Phase 1, fades in after kick completes */}
      <div
        className={`transition-opacity duration-700 ${navVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Navbar onBookNow={() => alert('Opening Miteri Sports Booking…')} />
      </div>

      {/* Hero — manages its own phase state */}
      <HeroKickSequence
        onNavbarReveal={() => setNavVisible(true)}
        onGoalUnlocked={() => {}}
      />

      {/* ── Facility Index ───────────────────────────────────────────── */}
      <section
        id="facilities-overview"
        className="bg-[#F2EFE9] py-24 px-8 sm:px-14 border-t border-[#0D0D0E]/10"
      >
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[11px] font-mono tracking-widest uppercase text-[#0D0D0E]/35 mb-10">
            [ 04 Zones // One Arena ]
          </p>

          <div className="divide-y divide-[#0D0D0E]/10">
            {[
              { title: 'Futsal',     tag: 'FIFA Turf'      },
              { title: 'Basketball', tag: 'FIBA Hardwood'  },
              { title: 'Gym Hall',   tag: 'Full Rig'       },
              { title: 'Badminton',  tag: 'BWF Court'      },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group flex items-baseline gap-6 sm:gap-10 py-7 cursor-pointer -mx-4 px-4 hover:bg-[#0D0D0E]/[0.02] transition-colors duration-200"
              >
                <span className="font-mono text-xs text-[#0D0D0E]/25 w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="font-humane font-bold uppercase text-[#0D0D0E] flex-1 leading-none"
                  style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
                >
                  {item.title}
                </h3>
                <span className="hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#0D0D0E]/25 group-hover:text-[#3CCB6E] transition-colors duration-200 shrink-0">
                  {item.tag}
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
