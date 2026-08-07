'use client';

/**
 * HeroCanvas — Premium Sports Photography Studio 3D Scene.
 *
 * Studio Lighting Setup:
 * - Key Light: Large soft neutral light from upper-left/front (intensity 2.4, #F8FAFC).
 *              Reveals leather texture and polygon seams while keeping the ball predominantly dark.
 * - Rim Light: Soft green light from rear-right (intensity 1.2, #3CCB6E).
 *              Creates a thin green separation line along silhouette edges.
 * - Ground Shadow: Soft wide radial contact shadow (low opacity 0.40, wide radius 2.4).
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Football from './Football';
import EntryDropController from './EntryDropController';
import KickMotionController from './KickMotionController';

const SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 0.00, -0.15,  0.00),  // P0 start
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
    g.addColorStop(0.0, 'rgba(0, 0, 0, 0.45)');
    g.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
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
  const shadowSize = isMobile ? 2.6 : 2.4;

  return (
    <mesh ref={meshRef} position={[0, -0.45, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[shadowSize, shadowSize]} />
      <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} opacity={0.40} />
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

      {/* Premium Sports Photography Studio 3D Lighting */}
      <ambientLight intensity={0.6} color="#FFFFFF" />
      
      {/* Key Light: Large soft neutral light from upper-left/front */}
      <directionalLight position={[-3.5, 5.0, 4.0]} intensity={2.4} color="#F8FAFC" />
      
      {/* Rim Light: Very soft green light from rear-right (#3CCB6E, low intensity 1.2) */}
      <directionalLight position={[4.0, 2.0, -3.0]} intensity={1.2} color="#3CCB6E" />
      
      {/* Subtle Fill Light from bottom-front */}
      <directionalLight position={[0.0, -2.0, 3.0]} intensity={0.5} color="#E8ECE9" />

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
