'use client';

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const TARGET_GOAL_WIDTH_METERS = 3.0;

export const Goal = forwardRef(function Goal(
  {
    position = [-1.6, -0.45, -2.6],
    rotation = [0, -Math.PI * 0.24, 0],
    scale = 1.0,
    visible = true,
    showDebug = false,
    ...props
  },
  ref
) {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/goal.glb');

  // UNIFORM NORMALIZATION BASED ON FRONT GOAL FRAME (BAR) GEOMETRY ALONE
  const { clonedScene, uniformScale, spatialCoords } = useMemo(() => {
    const clone = scene.clone(true);

    let barMesh = null;

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes('Bar')) {
          barMesh = child;
        }

        if (child.material) {
          const mat = child.material.clone();
          mat.envMapIntensity = 1.8;
          if (child.name.includes('Bar') || child.name.includes('Case')) {
            mat.color = new THREE.Color('#FFFFFF');
            mat.roughness = 0.15;
            mat.metalness = 0.2;
          } else if (child.name.includes('Net') || child.name.includes('Wire')) {
            mat.color = new THREE.Color('#E5E7EB');
            mat.roughness = 0.4;
            mat.transparent = true;
            mat.opacity = 0.95;
          }
          child.material = mat;
        }
      }
    });

    const barBox = barMesh ? new THREE.Box3().setFromObject(barMesh) : new THREE.Box3().setFromObject(clone);
    const barSize = new THREE.Vector3();
    barBox.getSize(barSize);

    const barCenter = new THREE.Vector3();
    barBox.getCenter(barCenter);

    const rawWidth = Math.max(barSize.x, 0.1);
    const normScale = (3.0 / 8.38) * scale;

    clone.position.set(-barCenter.x * normScale, -barBox.min.y * normScale, -barCenter.z * normScale);

    const theta = rotation[1];
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);

    const depthDir = new THREE.Vector3(-sinT, 0, -cosT).normalize();
    const widthDir = new THREE.Vector3(cosT, 0, -sinT).normalize();

    const halfW = 1.5 * scale;
    const basePos = new THREE.Vector3(...position);

    const leftFrontPostWorld = basePos.clone().sub(widthDir.clone().multiplyScalar(halfW));
    const rightFrontPostWorld = basePos.clone().add(widthDir.clone().multiplyScalar(halfW));
    leftFrontPostWorld.y = position[1] + 1.0 * scale;
    rightFrontPostWorld.y = position[1] + 1.0 * scale;

    const goalMouthCenter = basePos.clone().add(new THREE.Vector3(0, 1.0 * scale, 0));
    const goalLinePlane = new THREE.Plane().setFromNormalAndCoplanarPoint(depthDir, goalMouthCenter);
    const netImpactTarget = goalMouthCenter.clone().add(depthDir.clone().multiplyScalar(1.0 * scale));
    netImpactTarget.y = position[1] + 0.5 * scale;

    return {
      clonedScene: clone,
      uniformScale: normScale,
      spatialCoords: {
        rawBarWidth: rawWidth,
        rawBarHeight: barSize.y,
        uniformScale: normScale,
        leftFrontPostWorld,
        rightFrontPostWorld,
        goalMouthCenter,
        goalLinePlane,
        goalDepthDirection: depthDir,
        netImpactTarget,
      },
    };
  }, [scene, position, rotation, scale]);

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    getSpatialCoordinates: () => spatialCoords,
  }));

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} {...props}>
      <primitive object={clonedScene} scale={uniformScale} />

      {showDebug && (
        <group>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#00FFFF" wireframe />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <planeGeometry args={[2.4 * scale, 1.6 * scale]} />
            <meshBasicMaterial color="#FFFF00" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.45, -0.9]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#00FF00" wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
});

useGLTF.preload('/models/goal.glb');
export default Goal;
