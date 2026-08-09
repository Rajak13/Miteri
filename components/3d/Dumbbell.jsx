'use client';

/**
 * Dumbbell — Full GLTF scene render + merged hit mesh for reliable drag rotation.
 * dumbbells.glb — visual uses cloned scene, interaction uses merged geometry.
 */

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SCENE_HIT_RADIUS = 0.72;

export const Dumbbell = forwardRef(function Dumbbell(
  { position = [0, 0, 0], scale = 1.0, opacity = 1.0, spinEnabled = true, onLoad },
  ref
) {
  const groupRef = useRef();
  const innerRef = useRef();
  const meshRef  = useRef();
  const hitMeshRef = useRef(null);

  const { scene }          = useGLTF('/models/dumbbells.glb');
  const { invalidate, gl } = useThree();

  // Signal when model is loaded
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  const isDragging        = useRef(false);
  const prevMouse         = useRef({ x: 0, y: 0 });
  const angVel            = useRef({ x: 0, y: 0 });
  const isCoasting        = useRef(false);
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

  useFrame(() => {
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
  }, [gl]);

  const { standaloneObject, hitMesh, baseScale, materialsRef } = useMemo(() => {
    const clonedScene = scene.clone(true);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clonedScene.position.set(-center.x, -center.y, -center.z);

    const wrapper = new THREE.Group();
    wrapper.add(clonedScene);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = (SCENE_HIT_RADIUS * 2) / (maxDim || 1);

    const mats = [];
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.raycast = () => null;

        const applyMat = (m) => {
          const mat = m.clone();
          mat.envMapIntensity = 2.0;
          mat.roughness       = 0.25;
          mat.metalness       = 0.75;
          mat.transparent     = opacity < 0.99;
          mat.opacity         = opacity;
          mat.depthWrite      = true;
          mats.push(mat);
          return mat;
        };

        if (Array.isArray(child.material)) {
          child.material = child.material.map(applyMat);
        } else if (child.material) {
          child.material = applyMat(child.material);
        }
      }
    });

    // Merged geometry for accurate raycasting
    const sourceMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh) sourceMeshes.push(child);
    });

    let interactionMesh = new THREE.Mesh();
    if (sourceMeshes.length > 0) {
      const geoms = sourceMeshes.map((mesh) => {
        const geom = mesh.geometry.clone();
        geom.applyMatrix4(mesh.matrixWorld);
        geom.translate(-center.x, -center.y, -center.z);
        return geom;
      });
      const merged = mergeGeometries(geoms, false);
      geoms.forEach((g) => g.dispose());
      if (merged) {
        merged.computeBoundingBox();
        merged.computeVertexNormals();
        const hitMat = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        interactionMesh = new THREE.Mesh(merged, hitMat);
        interactionMesh.raycast = () => null;
      }
    }

    return {
      standaloneObject: wrapper,
      hitMesh: interactionMesh,
      baseScale: normScale,
      materialsRef: mats,
    };
  }, [scene, opacity]);

  useEffect(() => {
    hitMeshRef.current = hitMesh;
  }, [hitMesh]);

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    setPosition: (x, y, z) => groupRef.current?.position.set(x, y, z),
    setRotation: (x, y, z) => {
      baseRotationRef.current = { x, y, z };
      updateCombinedRotation();
    },
    setScale: (x, y, z) => {
      if (meshRef.current) {
        meshRef.current.scale.set(x, y, z);
      }
    },
    setOpacity: (op) => {
      materialsRef.forEach((mat) => {
        mat.opacity = op;
        mat.transparent = op < 0.99;
      });
    },
    setVisible: (vis) => {
      if (groupRef.current) groupRef.current.visible = vis;
    },
    setPointerEnabled: (enabled) => {
      pointerEnabledRef.current = enabled;
      const mesh = hitMeshRef.current;
      if (mesh) {
        mesh.raycast = enabled
          ? THREE.Mesh.prototype.raycast
          : () => null;
      }
    },
    isDragging: () => isDragging.current,
    isCoasting: () => isCoasting.current,
  }), [materialsRef, updateCombinedRotation, hitMesh]);

  return (
    <group ref={groupRef} position={position}>
      <group ref={innerRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <group ref={meshRef}>
          <group scale={baseScale * scale}>
            <primitive object={standaloneObject} />
            <primitive
              object={hitMesh}
              onPointerDown={onPointerDown}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            />
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload('/models/dumbbells.glb');
export default Dumbbell;
