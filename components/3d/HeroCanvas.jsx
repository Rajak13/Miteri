'use client';

/**
 * HeroCanvas — 3D Canvas tuned for Obsidian Dark Carbon Theme (#0A0B0D).
 *
 * Direct multi-point studio lights with key, fill, and green rim highlights
 * give the dark leather football an extraordinary, tactile 3D pop against obsidian background.
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Football from './Football';
import EntryDropController from './EntryDropController';
import KickMotionController from './KickMotionController';

const SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 0.00, -0.15,  0.00),  // P0 start (exact Phase 1 rest spot)
  new THREE.Vector3( 0.35,  0.20,  0.10),  // P1 kick impulse
  new THREE.Vector3( 1.60,  0.45, -0.20),  // P2 off-screen right
  new THREE.Vector3( 1.70,  0.00, -0.30),  // P3 apex curve
  new THREE.Vector3( 1.10,  0.15, -0.15),  // P4 return arc
  new THREE.Vector3( 0.65,  0.05, -0.05),  // P5 upper landing approach
  new THREE.Vector3( 0.52, -0.05,  0.00),  // P6 arrival bounce
  new THREE.Vector3( 0.50, -0.05,  0.00),  // P7 final grounded rest spot
]);

function useIsMobile() {
  const { size } = useThree();
  return size.width < 768;
}

function SceneCamera() {
  const isMobile = useIsMobile();
  const fov = isMobile ? 54 : 48;
  const z   = isMobile ? 3.2 : 2.8;

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, z]}
      fov={fov}
      onUpdate={(cam) => cam.lookAt(0, 0, 0)}
    />
  );
}

function DynamicRadialShadow({ hasKicked, progressRef }) {
  const isMobile = useIsMobile();
  const meshRef  = useRef();

  const shadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c   = document.createElement('canvas');
    c.width   = 64;
    c.height  = 64;
    const ctx = c.getContext('2d');
    const g   = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0.0, 'rgba(0, 0, 0, 0.75)');
    g.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef?.current || 0;
    const targetX = hasKicked ? (isMobile ? 0.00 : 0.50 * p) : 0.00;
    const targetY = hasKicked ? (isMobile ? -0.55 : -0.45 + 0.10 * p) : (isMobile ? -0.55 : -0.45);

    meshRef.current.position.x = targetX;
    meshRef.current.position.y = targetY;
  });

  if (!shadowTexture) return null;
  const shadowSize = isMobile ? 2.2 : 1.8;

  return (
    <mesh ref={meshRef} position={[0, -0.45, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[shadowSize, shadowSize]} />
      <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} opacity={0.70} />
    </mesh>
  );
}

function WebGLContextHandler() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;
    const onLost     = (e) => { e.preventDefault(); };
    const onRestored = ()  => { invalidate(); };
    canvas.addEventListener('webglcontextlost',     onLost,     false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);
    return () => {
      canvas.removeEventListener('webglcontextlost',     onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl, invalidate]);
  return null;
}

export default function HeroCanvas({
  hasKicked,
  isInteractive,
  progressRef,
  footballRef,
  onSettle,
  setImpactFlash,
  onGoalUnlocked,
  sequenceComplete,
}) {
  const spinEnabled = (isInteractive && !hasKicked) || !!sequenceComplete;

  return (
    <Canvas
      className="w-full h-full"
      style={{ touchAction: 'none' }}
      frameloop="demand"
      gl={{
        antialias:                    true,
        alpha:                        true,
        powerPreference:              'default',
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer:        false,
        depth:                        true,
        stencil:                      false,
      }}
      dpr={[1, 1.5]}
    >
      <WebGLContextHandler />
      <SceneCamera />

      {/* Dramatic Studio Lighting for Obsidian Dark Carbon Theme */}
      <ambientLight     intensity={1.2} color="#F4F4F0" />
      <hemisphereLight  args={['#FFFFFF', '#141619', 1.0]} />
      <directionalLight position={[ 3,  6,  5]} intensity={4.2} color="#FFFFFF" />
      <directionalLight position={[-4,  2,  3]} intensity={2.0} color="#39D477" />  {/* Kinetic Green Rim Light */}
      <directionalLight position={[ 0,  4, -4]} intensity={1.8} color="#E8F5EE" />

      <DynamicRadialShadow hasKicked={hasKicked} progressRef={progressRef} />

      {!hasKicked && (
        <EntryDropController
          footballRef={footballRef}
          onSettle={onSettle}
        />
      )}

      <KickMotionController
        progressRef={progressRef}
        footballRef={footballRef}
        hasKicked={hasKicked}
        masterSpline={SPLINE}
        setImpactFlash={setImpactFlash}
        onGoalUnlocked={onGoalUnlocked}
      />

      <Football
        ref={footballRef}
        position={[0, -0.15, 0]}
        scale={1.0}
        spinEnabled={spinEnabled}
      />
    </Canvas>
  );
}
