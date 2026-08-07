'use client';

import React, { useMemo } from 'react';

/**
 * generateBlob — Produces a smooth, closed, organic SVG path string.
 *
 * Algorithm: N points distributed radially around (cx,cy) at radius r,
 * each perturbed by a deterministic sin-based hash. Connected with
 * Catmull-Rom → cubic Bézier conversion for C1-continuous curves.
 * No Math.random() — SSR-safe, identical on server and client.
 *
 * @param {number} cx  - Center X in SVG viewBox coords
 * @param {number} cy  - Center Y in SVG viewBox coords
 * @param {number} r   - Base radius
 * @param {number} seed - Perturbation seed (controls shape variation)
 * @param {number} N   - Number of control points (higher = more complex shape)
 * @returns {string}   - SVG path `d` attribute string
 */
function generateBlob(cx, cy, r, seed, N = 10) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    const h0 = Math.sin(seed * 127.1 + i * 311.7) * 0.5 + 0.5;
    const h1 = Math.sin(seed * 89.3  + i * 419.2) * 0.5 + 0.5;
    const perturb = 0.68 + (h0 * 0.40) + (h1 * 0.12); // range ~0.68–1.20
    pts.push({
      x: cx + r * perturb * Math.cos(angle),
      y: cy + r * perturb * Math.sin(angle),
    });
  }
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(1);
    const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(1);
    const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(1);
    const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(1);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

/**
 * ContourLines — Topographic contour line background layer.
 *
 * Renders two clusters of concentric organic blob outlines, positioned
 * to frame a central 3D object. Opacity decreases outward (denser near
 * the focal point, fading toward edges), matching topographic map conventions.
 *
 * Props:
 * @param {string}  color         - Stroke hex color (e.g. '#00C864', '#FF5500', '#009E54')
 * @param {number}  baseOpacity   - Max stroke opacity for innermost rings (0–1)
 * @param {string}  className     - Additional Tailwind classes (for z-index, transitions, etc.)
 * @param {object}  cluster1      - Primary cluster config { cx, cy, rings, r0, rStep, seedOffset, N }
 * @param {object}  cluster2      - Secondary cluster config (same shape, or null to skip)
 */
export default function ContourLines({
  color = '#00C864',
  baseOpacity = 0.18,
  className = 'absolute inset-0 w-full h-full pointer-events-none z-[2]',
  cluster1 = { cx: 760, cy: 425, rings: 11, r0: 55, rStep: 65, seedOffset: 0,   N: 10 },
  cluster2 = { cx: 160, cy: 710, rings:  6, r0: 60, rStep: 72, seedOffset: 200, N:  9 },
}) {
  const paths = useMemo(() => {
    const result = [];

    const buildCluster = (cfg) => {
      if (!cfg) return;
      const { cx, cy, rings, r0, rStep, seedOffset, N } = cfg;
      for (let i = 0; i < rings; i++) {
        const r = r0 + i * rStep;
        const opacity = Math.max(0.03, baseOpacity - i * (baseOpacity / rings) * 1.1);
        const strokeWidth = i < 3 ? 1.2 : 0.8;
        result.push({
          d: generateBlob(cx, cy, r, seedOffset + i * 17.31, N),
          opacity,
          strokeWidth,
        });
      }
    };

    buildCluster(cluster1);
    buildCluster(cluster2);
    return result;
  }, [baseOpacity, cluster1, cluster2]);

  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth={p.strokeWidth}
          strokeOpacity={p.opacity}
        />
      ))}
    </svg>
  );
}
