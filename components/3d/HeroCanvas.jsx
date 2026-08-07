'use client';

/**
 * HeroCanvas — WebGL Persistent 3D Ball Multi-Sport Morphing Canvas.
 *
 * Morphing & Visibility Architecture:
 * - When bsp <= 0.001 (Hero & Futsal): Football is 100% visible (opacity 1.0), Basketball is hidden (visible false).
 * - When bsp > 0.001 (Basketball section): Football cross-fades out and sets visible false, Basketball becomes 100% visible and fully rotatable.
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Football from './Football';
import Basketball from './Basketball';
import EntryDropController from './EntryDropController';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── AUTHORED IMMUTABLE TRANSFORM DESIGN CONSTANTS (DESKTOP) ───────────────────
export const HERO_BALL_TRANSFORM = {
  position: [0.00, 0.05, 0.00],
  rotation: [0, Math.PI, 0],
};

export const FUTSAL_BALL_TRANSFORM = {
  position: [-1.15, 0.00, 0.00],
  rotation: [Math.PI * 2.5, Math.PI - Math.PI * 1.5, -0.35],
};

export const BASKETBALL_BALL_TRANSFORM = {
  position: [1.15, 0.00, 0.00],
  rotation: [Math.PI * 3.0, Math.PI * 2.0, 0.25],
};

// ── AUTHORED IMMUTABLE TRANSFORM DESIGN CONSTANTS (MOBILE) ────────────────────
export const HERO_BALL_TRANSFORM_MOBILE = {
  position: [0.00, -0.05, 0.00],
  rotation: [0, Math.PI, 0],
};

export const FUTSAL_BALL_TRANSFORM_MOBILE = {
  position: [0.00, 0.65, 0.00],
  rotation: [Math.PI * 2.5, Math.PI - Math.PI * 1.5, -0.35],
};

export const BASKETBALL_BALL_TRANSFORM_MOBILE = {
  position: [0.00, 0.65, 0.00],
  rotation: [Math.PI * 3.0, Math.PI * 2.0, 0.25],
};

// ── AUTHORED 3D CATMULL-ROM SPLINE TRAJECTORIES (DESKTOP) ─────────────────────
export const HERO_FUTSAL_SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...HERO_BALL_TRANSFORM.position),  // Point 0: [ 0.00,  0.05, 0.00] (Center)
  new THREE.Vector3(-0.35, -0.06,  0.22),             // Point 1: Authored mid-arc Y & Z-depth pop
  new THREE.Vector3(-0.75, +0.05, +0.18),             // Point 2: Leftward sweep into Futsal
  new THREE.Vector3(...FUTSAL_BALL_TRANSFORM.position) // Point 3: [-1.15,  0.00, 0.00] (Futsal left)
], false, 'catmullrom', 0.25);

export const FUTSAL_BASKETBALL_SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...FUTSAL_BALL_TRANSFORM.position),  // Point 0: [-1.15,  0.00, 0.00]
  new THREE.Vector3(-0.40, -0.12, +0.25),               // Point 1: Mid-arc dip & Z-pop
  new THREE.Vector3( 0.50, +0.06, +0.18),               // Point 2: Rightward arc sweep
  new THREE.Vector3(...BASKETBALL_BALL_TRANSFORM.position) // Point 3: [+1.15,  0.00, 0.00]
], false, 'catmullrom', 0.25);

// ── AUTHORED 3D CATMULL-ROM SPLINE TRAJECTORIES (MOBILE) ──────────────────────
export const HERO_FUTSAL_SPLINE_MOBILE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...HERO_BALL_TRANSFORM_MOBILE.position), // Point 0: [0.00, -0.05, 0.00]
  new THREE.Vector3(-0.15,  0.25, +0.25),                    // Point 1: Smooth rise & Z-pop curve
  new THREE.Vector3(-0.10,  0.50, +0.15),                    // Point 2: Upper sweep
  new THREE.Vector3(...FUTSAL_BALL_TRANSFORM_MOBILE.position) // Point 3: [0.00, 0.65, 0.00]
], false, 'catmullrom', 0.25);

export const FUTSAL_BASKETBALL_SPLINE_MOBILE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...FUTSAL_BALL_TRANSFORM_MOBILE.position), // Point 0: [0.00, 0.65, 0.00]
  new THREE.Vector3( 0.20,  0.45, +0.25),                      // Point 1: Smooth dip & Z-pop arc
  new THREE.Vector3( 0.10,  0.58, +0.15),                      // Point 2: Return arc
  new THREE.Vector3(...BASKETBALL_BALL_TRANSFORM_MOBILE.position) // Point 3: [0.00, 0.65, 0.00]
], false, 'catmullrom', 0.25);

function useIsMobile() {
  const { size } = useThree();
  return size.width < 768;
}

function CameraPortalController({
  hasKicked,
  progressRef,
  footballRef,
  basketballRef,
  futsalProgressRef,
  basketballProgressRef,
}) {
  const { camera, invalidate } = useThree();
  const isMobile = useIsMobile();

  const baseZ = isMobile ? 6.2 : 4.4;

  useFrame(() => {
    if (!progressRef) return;

    const p   = Math.min(progressRef.current || 0, 1.0);
    const fp  = Math.min(Math.max(futsalProgressRef?.current || 0, 0.0), 1.0);
    const bsp = Math.min(Math.max(basketballProgressRef?.current || 0, 0.0), 1.0);

    // Initial 150ms impact camera shake (p: 0.0 -> 0.12)
    let shakeX = 0;
    let shakeY = 0;
    if (hasKicked && p > 0 && p < 0.12) {
      const decay = 1 - p / 0.12;
      shakeX = (Math.random() - 0.5) * 0.06 * decay;
      shakeY = (Math.random() - 0.5) * 0.06 * decay;
    }

    if (!hasKicked) {
      // Before kick: ball sits centered at (0.00, -0.15, 0.00)
      const heroPos = isMobile ? [0.00, -0.05, 0.00] : [0.00, -0.15, 0.00];
      const futsalPos = isMobile ? FUTSAL_BALL_TRANSFORM_MOBILE.position : FUTSAL_BALL_TRANSFORM.position;

      const arcY = -0.10 * Math.sin(fp * Math.PI);
      const arcZ =  0.22 * Math.sin(fp * Math.PI);

      const finalX = heroPos[0] + (futsalPos[0] - heroPos[0]) * fp;
      const finalY = heroPos[1] + (futsalPos[1] - heroPos[1]) * fp + arcY;
      const finalZ = heroPos[2] + (futsalPos[2] - heroPos[2]) * fp + arcZ;

      camera.position.set(shakeX, shakeY, baseZ);
      camera.lookAt(shakeX, shakeY, 0);

      footballRef.current?.setPosition?.(finalX, finalY, finalZ);
      basketballRef.current?.setPosition?.(finalX, finalY, finalZ);

      footballRef.current?.setVisible?.(true);
      footballRef.current?.setOpacity?.(1.0);
      basketballRef.current?.setVisible?.(false);
      basketballRef.current?.setOpacity?.(0.0);

      if (fp > 0) {
        const pitchX = fp * Math.PI * 2.5;
        const yawY   = Math.PI - (fp * Math.PI * 1.5);
        const rollZ  = -0.35 * Math.sin(fp * Math.PI);
        footballRef.current?.setRotation?.(pitchX, yawY, rollZ);
        basketballRef.current?.setRotation?.(pitchX, yawY, rollZ);
      }
    } else if (p <= 0.65) {
      // Phase A: Camera dollies forward into centered ball surface (0.00, -0.15, 0.00)
      const zoomProgress = p / 0.65;
      const currentZ = baseZ - (baseZ - 0.52) * zoomProgress;
      const currentX = 0.00 + shakeX;
      const currentY = -0.15 + shakeY;

      camera.position.set(currentX, currentY, currentZ);
      camera.lookAt(currentX, currentY, 0);

      footballRef.current?.setPosition?.(0.00, -0.15, 0.00);
      basketballRef.current?.setPosition?.(0.00, -0.15, 0.00);

      footballRef.current?.setVisible?.(true);
      footballRef.current?.setOpacity?.(1.0);
      basketballRef.current?.setVisible?.(false);
      basketballRef.current?.setOpacity?.(0.0);
    } else if (bsp <= 0.001) {
      // Phase B: Transition ball along HERO_FUTSAL_SPLINE to FUTSAL_BALL_TRANSFORM
      const settleProgress = (p - 0.65) / 0.35;
      
      const activeSpline = isMobile ? HERO_FUTSAL_SPLINE_MOBILE : HERO_FUTSAL_SPLINE;
      const pt = activeSpline.getPoint(fp);
      const finalX = pt.x;
      const finalY = pt.y;
      const finalZ = pt.z;

      const currentZ = 0.52 + (baseZ - 0.52) * settleProgress;
      const currentX = shakeX;
      const currentY = shakeY;

      camera.position.set(currentX, currentY, currentZ);
      camera.lookAt(currentX, currentY, 0);

      footballRef.current?.setPosition?.(finalX, finalY, finalZ);
      basketballRef.current?.setPosition?.(finalX, finalY, finalZ);

      // Authored rotation interpolation
      const heroRot = HERO_BALL_TRANSFORM.rotation;
      const futsalRot = FUTSAL_BALL_TRANSFORM.rotation;

      const pitchX = heroRot[0] + (futsalRot[0] - heroRot[0]) * fp;
      const yawY   = heroRot[1] + (futsalRot[1] - heroRot[1]) * fp;
      
      const rollBase = heroRot[2] + (futsalRot[2] - heroRot[2]) * fp;
      const rollSecondaryTilt = -0.25 * Math.pow(Math.sin(fp * Math.PI), 2);
      const rollZ = rollBase + rollSecondaryTilt;

      footballRef.current?.setRotation?.(pitchX, yawY, rollZ);
      basketballRef.current?.setRotation?.(pitchX, yawY, rollZ);

      // Football 100% visible, Basketball hidden
      footballRef.current?.setVisible?.(true);
      footballRef.current?.setOpacity?.(1.0);
      basketballRef.current?.setVisible?.(false);
      basketballRef.current?.setOpacity?.(0.0);
    } else {
      // Phase C: Transition ball along FUTSAL_BASKETBALL_SPLINE to BASKETBALL_BALL_TRANSFORM
      const activeSpline = isMobile ? FUTSAL_BASKETBALL_SPLINE_MOBILE : FUTSAL_BASKETBALL_SPLINE;
      const pt = activeSpline.getPoint(bsp);
      const finalX = pt.x;
      const finalY = pt.y;
      const finalZ = pt.z;

      camera.position.set(shakeX, shakeY, baseZ);
      camera.lookAt(shakeX, shakeY, 0);

      footballRef.current?.setPosition?.(finalX, finalY, finalZ);
      basketballRef.current?.setPosition?.(finalX, finalY, finalZ);

      // Rotation transition from Futsal to Basketball
      const futsalRot = FUTSAL_BALL_TRANSFORM.rotation;
      const bballRot  = BASKETBALL_BALL_TRANSFORM.rotation;

      const pitchX = futsalRot[0] + (bballRot[0] - futsalRot[0]) * bsp;
      const yawY   = futsalRot[1] + (bballRot[1] - futsalRot[1]) * bsp;
      const rollZ  = futsalRot[2] + (bballRot[2] - futsalRot[2]) * bsp;

      footballRef.current?.setRotation?.(pitchX, yawY, rollZ);
      basketballRef.current?.setRotation?.(pitchX, yawY, rollZ);

      // Model cross-fade morphing & strict visibility switching
      const fbOpacity = Math.max(0, 1 - bsp * 1.5);
      const bbOpacity = Math.min(1, bsp * 1.5);

      footballRef.current?.setVisible?.(fbOpacity > 0.001);
      footballRef.current?.setOpacity?.(fbOpacity);

      basketballRef.current?.setVisible?.(bbOpacity > 0.001);
      basketballRef.current?.setOpacity?.(bbOpacity);
    }

    invalidate();
  });

  return null;
}

function DynamicRadialShadow({ hasKicked, progressRef, futsalProgressRef, basketballProgressRef }) {
  const isMobile    = useIsMobile();
  const groupRef    = useRef();
  const greenMatRef = useRef();
  const orangeMatRef= useRef();

  // Green shadow texture
  const greenTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0.0,  'rgba(0, 158, 84, 1.0)');
    g.addColorStop(0.30, 'rgba(0, 158, 84, 0.45)');
    g.addColorStop(0.60, 'rgba(0, 0, 0, 0.50)');
    g.addColorStop(1.0,  'rgba(0, 0, 0, 0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Orange shadow texture
  const orangeTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0.0,  'rgba(255, 85, 0, 1.0)');
    g.addColorStop(0.30, 'rgba(255, 85, 0, 0.45)');
    g.addColorStop(0.60, 'rgba(0, 0, 0, 0.50)');
    g.addColorStop(1.0,  'rgba(0, 0, 0, 0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const p   = progressRef?.current || 0;
    const fp  = Math.min(Math.max(futsalProgressRef?.current    || 0, 0), 1);
    const bsp = Math.min(Math.max(basketballProgressRef?.current || 0, 0), 1);
    const settleProgress = Math.max(0, (p - 0.65) / 0.35);

    // --- Position ---
    let posX = 0;
    let posY = isMobile ? -0.48 : -0.72;

    if (bsp > 0.001) {
      const futsalShadowX = isMobile ? FUTSAL_BALL_TRANSFORM_MOBILE.position[0] : FUTSAL_BALL_TRANSFORM.position[0];
      const bballShadowX  = isMobile ? BASKETBALL_BALL_TRANSFORM_MOBILE.position[0] : BASKETBALL_BALL_TRANSFORM.position[0];
      posX = futsalShadowX + (bballShadowX - futsalShadowX) * bsp;
      posY = isMobile ? 0.15 : -0.72;
    } else {
      const heroX = hasKicked ? (isMobile ? 0.00 : HERO_BALL_TRANSFORM.position[0] * settleProgress) : 0.00;
      const heroY = isMobile ? -0.48 : -0.72;
      const futsalShadowX = isMobile ? FUTSAL_BALL_TRANSFORM_MOBILE.position[0] : FUTSAL_BALL_TRANSFORM.position[0];
      posX = heroX + (futsalShadowX - heroX) * fp;
      posY = heroY + ((isMobile ? 0.15 : -0.72) - heroY) * fp;
    }

    groupRef.current.position.x = posX;
    groupRef.current.position.y = posY;

    // --- Blend green → orange by bsp ---
    if (greenMatRef.current)  greenMatRef.current.opacity  = 0.50 * (1 - bsp);
    if (orangeMatRef.current) orangeMatRef.current.opacity = 0.50 * bsp;
  });

  if (!greenTex || !orangeTex) return null;
  const shadowSize = isMobile ? 2.6 : 2.8;

  return (
    <group ref={groupRef} position={[0, -0.72, 0]} rotation-x={-Math.PI / 2}>
      {/* Green glow — fades out as basketball section enters */}
      <mesh>
        <planeGeometry args={[shadowSize, shadowSize]} />
        <meshBasicMaterial ref={greenMatRef}  map={greenTex}  transparent depthWrite={false} opacity={0.50} />
      </mesh>
      {/* Orange glow — fades in as basketball section enters */}
      <mesh>
        <planeGeometry args={[shadowSize, shadowSize]} />
        <meshBasicMaterial ref={orangeMatRef} map={orangeTex} transparent depthWrite={false} opacity={0.00} />
      </mesh>
    </group>
  );
}

function ScrollTriggerSetup({ futsalProgressRef, basketballProgressRef }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let stFutsal = null;
    let stBball  = null;

    const setupTriggers = () => {
      if (stFutsal) stFutsal.kill();
      if (stBball)  stBball.kill();

      // 1. Futsal Section Scroll Trigger — Scrubs continuously throughout the entire Futsal section until Basketball section enters
      const futsalEl = document.getElementById('futsal-section');
      if (futsalEl) {
        stFutsal = ScrollTrigger.create({
          trigger: futsalEl,
          start: 'top 95%',
          end: 'bottom 85%',
          scrub: true,
          onUpdate: (self) => {
            futsalProgressRef.current = self.progress;
            invalidate();
          },
        });
      } else {
        stFutsal = ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: '+=800',
          scrub: true,
          onUpdate: (self) => {
            futsalProgressRef.current = self.progress;
            invalidate();
          },
        });
      }

      // 2. Basketball Section Morph Trigger — Scrubs Football -> Basketball transition as user scrolls into #basketball-section
      const bballEl = document.getElementById('basketball-section');
      if (bballEl) {
        stBball = ScrollTrigger.create({
          trigger: bballEl,
          start: 'top 85%',
          end: 'top 15%',
          scrub: true,
          onUpdate: (self) => {
            basketballProgressRef.current = self.progress;
            invalidate();
          },
        });
      }
    };

    setupTriggers();

    const timer = setTimeout(() => {
      setupTriggers();
      ScrollTrigger.refresh();
    }, 150);

    window.addEventListener('resize', ScrollTrigger.refresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', ScrollTrigger.refresh);
      if (stFutsal) stFutsal.kill();
      if (stBball)  stBball.kill();
    };
  }, [invalidate, futsalProgressRef, basketballProgressRef]);

  return null;
}

function WebGLContextHandler() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;
    const onLost = (e) => {
      e.preventDefault();
    };
    const onRestored = () => {
      invalidate();
    };
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
  sequenceComplete,
}) {
  const spinEnabled = (isInteractive && !hasKicked) || !!sequenceComplete;
  const futsalProgressRef = useRef(0);
  const basketballProgressRef = useRef(0);
  const basketballRef = useRef(null);

  return (
    <Canvas
      className="w-full h-full pointer-events-auto"
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
      <ScrollTriggerSetup
        futsalProgressRef={futsalProgressRef}
        basketballProgressRef={basketballProgressRef}
      />

      <PerspectiveCamera
        makeDefault
        position={[0, -0.15, 3.9]}
        fov={34}
        onUpdate={(cam) => cam.lookAt(0, -0.15, 0)}
      />

      <CameraPortalController
        hasKicked={hasKicked}
        progressRef={progressRef}
        footballRef={footballRef}
        basketballRef={basketballRef}
        futsalProgressRef={futsalProgressRef}
        basketballProgressRef={basketballProgressRef}
      />

      {/* Lighting Rig — tuned for lighting coherence with CSS environment layers:
           Ambient reduced to 0.35 so the key/rim/fill directionals cast real shadows.
           Key light: upper-left [-3.5,5,4] — bright highlight on upper-left face
           Rim A: rear-right [4,2,-3]  — emerald edge on ball's right silhouette
           Rim B: rear-left [-4,2,-3]  — orange edge on ball's left (basketball phase)
           Fill: lower-right [3.5,-2,2] — prevents right side going pure black  */}
      <ambientLight intensity={0.35} color="#FFFFFF" />

      {/* Key Light: Upper-left cool-white — the primary source */}
      <directionalLight position={[-3.5, 5.0, 4.0]} intensity={5.5} color="#F8FAFC" />

      {/* Fill Light: Lower-right — prevents crush on the fill side */}
      <directionalLight position={[3.5, -2.0, 2.0]} intensity={1.6} color="#C8D8E8" />

      {/* Rim Light A: Emerald rear-right — matches CSS Layer 3 (right rim echo) */}
      <directionalLight position={[4.0, 2.0, -3.0]} intensity={4.0} color="#00B85E" />

      {/* Rim Light B: Orange rear-left — basketball phase, matched in shadow plane */}
      <directionalLight position={[-4.0, 2.0, -3.0]} intensity={4.0} color="#FF5500" />

      {/* Front specular — soft centre highlight for catch-light */}
      <directionalLight position={[0.0, 0.5, 4.0]} intensity={1.2} color="#FFFFFF" />

      <DynamicRadialShadow
        hasKicked={hasKicked}
        progressRef={progressRef}
        futsalProgressRef={futsalProgressRef}
        basketballProgressRef={basketballProgressRef}
      />

      {!hasKicked && (
        <EntryDropController
          footballRef={footballRef}
          onSettle={onSettle}
        />
      )}

      {/* 3D Football Mesh */}
      <Football
        ref={footballRef}
        position={[0, -0.15, 0]}
        scale={1.0}
        spinEnabled={spinEnabled}
      />

      {/* 3D Basketball Mesh (Morph Target) */}
      <Basketball
        ref={basketballRef}
        position={[0, -0.15, 0]}
        scale={1.0}
        opacity={0.0}
        spinEnabled={spinEnabled}
      />
    </Canvas>
  );
}
