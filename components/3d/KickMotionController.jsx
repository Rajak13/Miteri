'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const _qY    = new THREE.Quaternion();
const _qX    = new THREE.Quaternion();
const _axisY = new THREE.Vector3(0, 1, 0);
const _axisX = new THREE.Vector3(1, 0, 0);

export default function KickMotionController({
  progressRef,
  footballRef,
  hasKicked,
  masterSpline,
  setImpactFlash,
  onGoalUnlocked,
}) {
  const { invalidate } = useThree();
  const flashed   = useRef(false);
  const completed = useRef(false);

  useFrame(() => {
    if (completed.current) return;
    if (!hasKicked || !footballRef.current) return;

    const p = Math.min(progressRef.current, 0.9999);
    if (p <= 0) return;

    const pt  = masterSpline.getPointAt(p);
    const tan = masterSpline.getTangentAt(p);

    // Use setPosition so livePos is kept in sync — prevents React reconciliation glitch
    footballRef.current.setPosition(pt.x, pt.y, pt.z);

    // Spin the inner group via the outer group's quaternion (kick spin is on whole ball)
    const g = footballRef.current.group;
    if (g) {
      _qY.setFromAxisAngle(_axisY, tan.x * 0.07);
      _qX.setFromAxisAngle(_axisX, tan.y * 0.07);
      g.quaternion.premultiply(_qY).premultiply(_qX);
    }

    if (p >= 0.94 && !flashed.current) {
      flashed.current = true;
      setImpactFlash?.(true);
      setTimeout(() => setImpactFlash?.(false), 350);
    }

    if (p >= 0.99) {
      completed.current = true;
      const final = masterSpline.getPointAt(0.9999);
      footballRef.current.setPosition(final.x, final.y, final.z);
      onGoalUnlocked?.();
      return;
    }

    invalidate();
  });

  return null;
}
