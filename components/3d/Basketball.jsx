'use client';

/**
 * Basketball — Studio 3D Basketball Mesh with Centered Geometry Raycasting & Additive Mouse Drag.
 *
 * Raycasting & Interaction Fix:
 * Extracts standaloneMesh directly from GLTF geometry, centers geometry bounding box, and computes
 * vertex normals so R3F raycasting recognizes mouse hover (hand grab cursor) and drag interactions
 * 100% identically to Football.jsx.
 */

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCENE_BALL_RADIUS = 0.62;

export const Basketball = forwardRef(function Basketball(
  { position = [0, 0, 0], scale = 1.0, opacity = 1.0, spinEnabled = true },
  ref
) {
  const groupRef = useRef();
  const innerRef = useRef();
  const meshRef  = useRef();
  const standaloneMeshRef = useRef(null);

  const { scene }          = useGLTF('/models/basketball.glb');
  const { invalidate, gl } = useThree();

  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const angVel     = useRef({ x: 0, y: 0 });
  const isCoasting = useRef(false);
  const pointerEnabledRef = useRef(true);

  const dragRotationRef = useRef({ x: 0, y: 0 });
  const baseRotationRef = useRef({ x: 0, y: Math.PI, z: 0 });

  const SPIN_SCALE = 0.012;
  const DAMPING    = 0.94;

  const updateCombinedRotation = useCallback(() => {
    if (!innerRef.current) return;
    const base = baseRotationRef.current;
    const drag = dragRotationRef.current;
    innerRef.current.rotation.set(base.x + drag.x, base.y + drag.y, base.z);
  }, []);

  useFrame(() => {
    if (!isCoasting.current || isDragging.current) return;

    const speed = Math.sqrt(angVel.current.x ** 2 + angVel.current.y ** 2);
    if (speed < 1e-4) {
      angVel.current     = { x: 0, y: 0 };
      isCoasting.current = false;
      return;
    }

    dragRotationRef.current.y += angVel.current.y;
    dragRotationRef.current.x = THREE.MathUtils.clamp(
      dragRotationRef.current.x + angVel.current.x,
      -Math.PI * 0.45,
      Math.PI * 0.45
    );

    angVel.current.x *= DAMPING;
    angVel.current.y *= DAMPING;

    updateCombinedRotation();
    invalidate();
  });

  const onPointerDown = useCallback((e) => {
    if (!pointerEnabledRef.current || !spinEnabled) return;
    e.stopPropagation();

    isDragging.current = true;
    isCoasting.current = false;
    angVel.current     = { x: 0, y: 0 };
    prevMouse.current  = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';

    const onMove = (ev) => {
      ev.preventDefault();
      if (!isDragging.current) return;

      const dx = ev.clientX - prevMouse.current.x;
      const dy = ev.clientY - prevMouse.current.y;

      const aY = dx * SPIN_SCALE;
      const aX = dy * SPIN_SCALE;

      dragRotationRef.current.y += aY;
      dragRotationRef.current.x = THREE.MathUtils.clamp(
        dragRotationRef.current.x + aX,
        -Math.PI * 0.45,
        Math.PI * 0.45
      );

      angVel.current    = { x: aX, y: aY };
      prevMouse.current = { x: ev.clientX, y: ev.clientY };

      updateCombinedRotation();
      invalidate();
    };

    const onUp = (ev) => {
      ev.preventDefault();
      isDragging.current = false;
      isCoasting.current = Math.abs(angVel.current.x) > 1e-5 ||
                           Math.abs(angVel.current.y) > 1e-5;
      gl.domElement.style.cursor = 'grab';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      if (isCoasting.current) invalidate();
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup',   onUp,   { passive: false });
  }, [gl, invalidate, updateCombinedRotation, spinEnabled]);

  const onPointerEnter = useCallback((e) => {
    if (!pointerEnabledRef.current || !spinEnabled) return;
    e.stopPropagation();
    gl.domElement.style.cursor = 'grab';
  }, [gl, spinEnabled]);

  const onPointerLeave = useCallback(() => {
    if (!isDragging.current) gl.domElement.style.cursor = '';
  }, [gl]);

  // Extract single centered mesh for 100% accurate R3F raycasting
  const { standaloneMesh, baseScale, materialsRef } = useMemo(() => {
    let rawMesh = null;
    scene.traverse((child) => {
      if (child.isMesh && !rawMesh) {
        rawMesh = child;
      }
    });

    if (!rawMesh) {
      return { standaloneMesh: new THREE.Mesh(), baseScale: 1, materialsRef: [] };
    }

    const geom = rawMesh.geometry.clone();
    geom.computeBoundingBox();
    const box = geom.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geom.translate(-center.x, -center.y, -center.z);
    geom.computeBoundingBox();
    geom.computeVertexNormals();

    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = (SCENE_BALL_RADIUS * 2) / (maxDim || 1);

    const mat = rawMesh.material ? rawMesh.material.clone() : new THREE.MeshStandardMaterial();
    mat.emissiveMap = null;
    mat.emissive = new THREE.Color(0x000000);
    mat.emissiveIntensity = 0.0;
    mat.depthWrite = true;
    mat.transparent = opacity < 0.99;
    mat.opacity = opacity;
    mat.roughness = 0.38;
    mat.metalness = 0.08;

    const mesh = new THREE.Mesh(geom, mat);
    standaloneMeshRef.current = mesh;
    return { standaloneMesh: mesh, baseScale: normScale, materialsRef: [mat] };
  }, [scene, opacity]);

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    setPosition: (x, y, z) => groupRef.current?.position.set(x, y, z),
    setRotation: (x, y, z) => {
      baseRotationRef.current = { x, y, z };
      updateCombinedRotation();
    },
    setOpacity: (op) => {
      materialsRef.forEach((mat) => {
        mat.opacity = op;
        mat.transparent = op < 0.99;
      });
    },
    setVisible: (vis) => {
      if (groupRef.current) {
        groupRef.current.visible = vis;
      }
    },
    setPointerEnabled: (enabled) => {
      pointerEnabledRef.current = enabled;
      const mesh = standaloneMeshRef.current;
      if (mesh) {
        mesh.raycast = enabled
          ? THREE.Mesh.prototype.raycast
          : () => null;
      }
    },
    isDragging: () => isDragging.current,
    isCoasting: () => isCoasting.current,
  }), [materialsRef, updateCombinedRotation]);

  return (
    <group ref={groupRef} position={position}>
      <group ref={innerRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <group ref={meshRef}>
          <primitive
            object={standaloneMesh}
            scale={baseScale * scale}
            onPointerDown={onPointerDown}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
        </group>
      </group>
    </group>
  );
});

useGLTF.preload('/models/basketball.glb');
export default Basketball;
