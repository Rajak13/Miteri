'use client';

/**
 * Football — 3D Football Mesh with Direct Geometry Extraction & Centroid Baking.
 *
 * Problem Solved:
 * Raw GLTF model files (e.g. Sketchfab/FBX exports) contain nested scene graph nodes
 * with non-zero translation matrices (e.g. Sketchfab_model translated by [-28, 292, -147]).
 * When rotating parent groups, nested child meshes orbit around the parent origin.
 *
 * Solution:
 * We extract the raw BufferGeometry directly, discard all GLTF parent nodes,
 * and translate geometry vertices so the bounding box centroid is EXPLICITLY at (0,0,0).
 *
 * Result:
 * The resulting standalone THREE.Mesh has ZERO parent offsets. Rotating innerRef
 * turns the ball dead-center on its origin with 100% guaranteed zero translation/movement.
 */

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCENE_BALL_RADIUS = 0.62;

export const Football = forwardRef(function Football(
  { position = [0, 0, 0], scale = 1.0, spinEnabled = false },
  ref
) {
  const groupRef = useRef(); // Outer group — position ONLY
  const innerRef = useRef(); // Inner group — spin rotation ONLY

  const { scene }          = useGLTF('/models/football.glb');
  const { invalidate, gl } = useThree();

  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const angVel     = useRef({ x: 0, y: 0 });
  const isCoasting = useRef(false);

  const SPIN_SCALE = 0.009;
  const DAMPING    = 0.88;

  // Frame momentum coasting on innerRef rotation ONLY
  useFrame(() => {
    if (!innerRef.current || !isCoasting.current || isDragging.current) return;

    const speed = Math.sqrt(angVel.current.x ** 2 + angVel.current.y ** 2);
    if (speed < 1e-4) {
      angVel.current     = { x: 0, y: 0 };
      isCoasting.current = false;
      return;
    }

    innerRef.current.rotation.y += angVel.current.y;
    innerRef.current.rotation.x = THREE.MathUtils.clamp(
      innerRef.current.rotation.x + angVel.current.x,
      -Math.PI * 0.42,
      Math.PI * 0.42
    );

    angVel.current.x *= DAMPING;
    angVel.current.y *= DAMPING;
    invalidate();
  });

  const onPointerDown = useCallback((e) => {
    if (!spinEnabled) return;
    e.stopPropagation();

    isDragging.current = true;
    isCoasting.current = false;
    angVel.current     = { x: 0, y: 0 };
    prevMouse.current  = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';

    const onMove = (ev) => {
      ev.preventDefault();
      if (!isDragging.current || !innerRef.current) return;

      const dx = ev.clientX - prevMouse.current.x;
      const dy = ev.clientY - prevMouse.current.y;

      const aY = dx * SPIN_SCALE;  // Horizontal drag → Y-axis spin
      const aX = dy * SPIN_SCALE;  // Vertical drag   → X-axis pitch

      innerRef.current.rotation.y += aY;
      innerRef.current.rotation.x = THREE.MathUtils.clamp(
        innerRef.current.rotation.x + aX,
        -Math.PI * 0.42,
        Math.PI * 0.42
      );

      angVel.current    = { x: aX, y: aY };
      prevMouse.current = { x: ev.clientX, y: ev.clientY };
      invalidate();
    };

    const onUp = (ev) => {
      ev.preventDefault();
      isDragging.current = false;
      isCoasting.current = Math.abs(angVel.current.x) > 1e-5 ||
                           Math.abs(angVel.current.y) > 1e-5;
      gl.domElement.style.cursor = spinEnabled ? 'grab' : '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      if (isCoasting.current) invalidate();
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup',   onUp,   { passive: false });
  }, [spinEnabled, gl, invalidate]);

  const onPointerEnter = useCallback(() => {
    if (spinEnabled) gl.domElement.style.cursor = 'grab';
  }, [spinEnabled, gl]);

  const onPointerLeave = useCallback(() => {
    if (!isDragging.current) gl.domElement.style.cursor = '';
  }, [gl]);

  // Extract raw mesh geometry, discard GLTF parent nodes, and translate vertices to (0,0,0)
  const { standaloneMesh, baseScale } = useMemo(() => {
    let rawMesh = null;
    scene.traverse((child) => {
      if (child.isMesh && !rawMesh) {
        rawMesh = child;
      }
    });

    if (!rawMesh) {
      return { standaloneMesh: new THREE.Mesh(), baseScale: 1 };
    }

    const geom = rawMesh.geometry.clone();
    geom.computeBoundingBox();
    const box = geom.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Shift all vertex positions so geometric center is EXPLICITLY at (0,0,0)
    geom.translate(-center.x, -center.y, -center.z);
    geom.computeBoundingBox();
    geom.computeVertexNormals();

    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = (SCENE_BALL_RADIUS * 2) / maxDim;

    const mat = rawMesh.material ? rawMesh.material.clone() : new THREE.MeshStandardMaterial();
    mat.envMapIntensity = 2.4;
    mat.roughness       = 0.24;
    mat.metalness       = 0.10;

    const mesh = new THREE.Mesh(geom, mat);
    return { standaloneMesh: mesh, baseScale: normScale };
  }, [scene]);

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    setPosition: (x, y, z) => groupRef.current?.position.set(x, y, z),
    setRotation: (x, y, z) => {
      if (innerRef.current) {
        innerRef.current.rotation.set(x, y, z);
      }
    },
  }), []);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <group ref={innerRef} position={[0, 0, 0]}>
        <primitive object={standaloneMesh} scale={baseScale * scale} />
      </group>
    </group>
  );
});

useGLTF.preload('/models/football.glb');
export default Football;
