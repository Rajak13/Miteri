'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const DROP_H  = 1.15;
const GAMMA   = 4.2;
const OMEGA   = 8.5;

export default function EntryDropController({ footballRef, onSettle }) {
  const { invalidate, size } = useThree();
  const isMobile  = size.width < 768;
  const restY     = isMobile ? -0.37 : -0.15;  // shifted down on mobile to match ResponsiveFootball
  const startTime = useRef(null);
  const settled   = useRef(false);

  useFrame((state) => {
    if (settled.current || !footballRef.current) return;

    const now = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = now;

    const t = now - startTime.current;
    const g = footballRef.current.group;

    if (t > 1.2) {
      footballRef.current.setPosition(0, restY, 0);
      g?.scale.set(1, 1, 1);
      settled.current = true;
      onSettle?.();
      invalidate();
      return;
    }

    const envelope = Math.exp(-GAMMA * t);
    const cosVal   = Math.cos(OMEGA * t);
    footballRef.current.setPosition(0, restY + DROP_H * envelope * Math.abs(cosVal), 0);

    const absCos = Math.abs(cosVal);
    if (g && t > 0.12 && absCos < 0.25 && envelope > 0.15) {
      const sq = (0.25 - absCos) / 0.25 * envelope;
      g.scale.set(1 + 0.14 * sq, 1 - 0.28 * sq, 1 + 0.14 * sq);
    } else {
      g?.scale.set(1, 1, 1);
    }

    invalidate();
  });

  return null;
}
