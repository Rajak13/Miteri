'use client';

/**
 * Football — Studio 3D Football Mesh with Additive Mouse Drag Rotation Layer & Visibility Controls.
 */

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SCENE_BALL_RADIUS = 0.65;

export const Football = forwardRef(function Football(
  { position = [0, 0, 0], scale = 1.0, opacity = 1.0, spinEnabled = true },
  ref
) {
  const groupRef = useRef();
  const innerRef = useRef();
  const meshRef  = useRef();
  const standaloneMeshRef = useRef(null);

  const { scene }          = useGLTF('/models/football.glb');
  const { invalidate, gl } = useThree();

  const isDragging      = useRef(false);
  const prevMouse       = useRef({ x: 0, y: 0 });
  const angVel          = useRef({ x: 0, y: 0 });
  const isCoasting      = useRef(false);
  const squashTimer     = useRef(0);
  const pointerEnabledRef = useRef(true);

  const dragRotationRef = useRef({ x: 0, y: 0 });
  const baseRotationRef = useRef({ x: 0, y: Math.PI, z: 0 });

  const SPIN_SCALE = 0.009;
  const DAMPING    = 0.88;

  const updateCombinedRotation = useCallback(() => {
    if (!innerRef.current) return;
    const base = baseRotationRef.current;
    const drag = dragRotationRef.current;
    innerRef.current.rotation.set(base.x + drag.x, base.y + drag.y, base.z);
  }, []);

  useFrame((state, delta) => {
    if (squashTimer.current > 0) {
      squashTimer.current -= delta;
      if (squashTimer.current <= 0) {
        squashTimer.current = 0;
        if (meshRef.current) meshRef.current.scale.set(1, 1, 1);
      } else {
        const p = squashTimer.current / 0.12;
        const sy = 0.86 + (1 - 0.86) * (1 - p);
        const sx = 1.14 - (1.14 - 1) * (1 - p);
        if (meshRef.current) meshRef.current.scale.set(sx, sy, sx);
      }
      invalidate();
    }

    if (!isCoasting.current || isDragging.current) return;

    const speed = Math.sqrt(angVel.current.x ** 2 + angVel.current.y ** 2);
    if (speed < 1e-4) {
      angVel.current     = { x: 0, y: 0 };
      isCoasting.current = false;
      return;
    }

    dragRotationRef.current.y += angVel.current.y;
    dragRotationRef.current.x += angVel.current.x;

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
      dragRotationRef.current.x += aX;

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
  }, [gl, spinEnabled]);

  // football.glb has 2 mesh halves — merge + center them for full rendering and raycasting
  const { standaloneMesh, baseScale, materialsRef } = useMemo(() => {
    const sourceMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh) sourceMeshes.push(child);
    });

    if (sourceMeshes.length === 0) {
      return { standaloneMesh: new THREE.Mesh(), baseScale: 1, materialsRef: [] };
    }

    scene.updateMatrixWorld(true);

    const geoms = sourceMeshes.map((mesh) => {
      const geom = mesh.geometry.clone();
      geom.applyMatrix4(mesh.matrixWorld);
      return geom;
    });

    const mergedGeom = mergeGeometries(geoms, false);
    geoms.forEach((geom) => geom.dispose());

    if (!mergedGeom) {
      return { standaloneMesh: new THREE.Mesh(), baseScale: 1, materialsRef: [] };
    }

    mergedGeom.computeBoundingBox();
    const center = new THREE.Vector3();
    mergedGeom.boundingBox.getCenter(center);
    mergedGeom.translate(-center.x, -center.y, -center.z);
    mergedGeom.computeBoundingBox();
    mergedGeom.computeVertexNormals();

    const size = new THREE.Vector3();
    mergedGeom.boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = (SCENE_BALL_RADIUS * 2) / (maxDim || 1);

    const rawMat = sourceMeshes[0].material;
    const mat = rawMat
      ? (Array.isArray(rawMat) ? rawMat[0] : rawMat).clone()
      : new THREE.MeshStandardMaterial();
    mat.envMapIntensity = 2.4;
    mat.roughness       = 0.26;
    mat.metalness       = 0.16;
    mat.depthWrite      = true;
    mat.transparent     = opacity < 0.99;
    mat.opacity         = opacity;

    const mesh = new THREE.Mesh(mergedGeom, mat);
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
    triggerKickImpulse: () => {
      squashTimer.current = 0.12;
      if (meshRef.current) meshRef.current.scale.set(1.14, 0.86, 1.14);
      invalidate();
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
  }), [invalidate, updateCombinedRotation, materialsRef]);

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

useGLTF.preload('/models/football.glb');
export default Football;
