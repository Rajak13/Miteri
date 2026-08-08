# Performance Optimization Guide

## 🎯 Goal: Achieve 90+ Performance Score on Lighthouse

### Current Heavy Components
Your site uses intensive 3D graphics with Three.js, which can impact performance. Here's how to optimize:

---

## 1. Code Splitting with Dynamic Imports

### Optimize page.js
Replace static imports with dynamic imports for heavy 3D components:

```jsx
// BEFORE (in app/page.js)
import HeroKickSequence from '../components/sections/HeroKickSequence';
import FutsalSection from '../components/sections/FutsalSection';
import BasketballSection from '../components/sections/BasketballSection';
import BadmintonSection from '../components/sections/BadmintonSection';

// AFTER
import dynamic from 'next/dynamic';

const HeroKickSequence = dynamic(() => import('../components/sections/HeroKickSequence'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[#080909]">
      <div className="text-[#F4F4F0]">Loading 3D Experience...</div>
    </div>
  )
});

const FutsalSection = dynamic(() => import('../components/sections/FutsalSection'), { ssr: false });
const BasketballSection = dynamic(() => import('../components/sections/BasketballSection'), { ssr: false });
const BadmintonSection = dynamic(() => import('../components/sections/BadmintonSection'), { ssr: false });
```

**Why this helps:**
- Reduces initial JavaScript bundle size
- 3D libraries load only when needed
- Better First Contentful Paint (FCP)

---

## 2. Optimize 3D Models

### Run the optimization script:
```bash
./scripts/optimize-models.sh
```

This will:
- Backup original models
- Apply Draco compression (reduces file size by 50-90%)
- Update models in place

### Manual optimization:
```bash
# For individual models
npx gltf-pipeline -i public/models/football.glb -o public/models/football.glb -d
```

**Expected results:**
- football.glb: ~2MB → ~200KB
- basketball.glb: ~1.5MB → ~180KB
- shuttlecock.glb: ~1MB → ~120KB

---

## 3. Lazy Load 3D Scenes

### Use Intersection Observer for section loading:

```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const BasketballCanvas = dynamic(() => import('../3d/Basketball'), { ssr: false });

export default function BasketballSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="basketball-section">
      {isVisible ? (
        <BasketballCanvas />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="text-[#F4F4F0]">Scroll to load basketball court...</div>
        </div>
      )}
    </section>
  );
}
```

---

## 4. Optimize GSAP & Three.js Imports

### Tree-shake GSAP plugins:
```jsx
// BEFORE
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// AFTER (more tree-shakeable)
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
```

### Optimize Three.js imports:
```jsx
// BEFORE
import * as THREE from 'three';

// AFTER (import only what you need)
import { WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight } from 'three';
```

---

## 5. Font Optimization

### Self-host fonts instead of Google Fonts:

1. Download fonts and place in `/public/fonts/`
2. Update `app/layout.js`:

```jsx
// REMOVE from <head>:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

// ADD to globals.css:
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 300 700;
  font-display: swap;
}

@font-face {
  font-family: 'Space Mono';
  src: url('/fonts/SpaceMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

**Why this helps:**
- Eliminates external DNS lookup
- Reduces render-blocking time
- Better control over font loading

---

## 6. Image Optimization

### Use Next.js Image component:
```jsx
import Image from 'next/image';

// BEFORE
<img src="/og-image.jpg" alt="Miteri Sports" />

// AFTER
<Image
  src="/og-image.jpg"
  alt="Miteri Sports Center Facilities"
  width={1200}
  height={630}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/png;base64,..." // Generate with plaiceholder
/>
```

---

## 7. Reduce Layout Shift (CLS)

### Reserve space for 3D canvases:
```jsx
<div className="h-screen relative" style={{ minHeight: '100vh' }}>
  <HeroCanvas />
</div>
```

### Add skeleton loaders:
```jsx
const CanvasSkeleton = () => (
  <div className="h-screen bg-gradient-to-b from-[#080909] to-[#0D0D0E] animate-pulse">
    <div className="h-full flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-green-500/20 rounded-full" />
    </div>
  </div>
);
```

---

## 8. Preload Critical Assets

### Add to app/layout.js:
```jsx
<head>
  {/* Preload critical models */}
  <link rel="preload" href="/models/football.glb" as="fetch" crossOrigin="anonymous" />
  <link rel="preload" href="/hdr/studio.hdr" as="fetch" crossOrigin="anonymous" />
  
  {/* Preload critical fonts */}
  <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
</head>
```

---

## 9. Optimize Lenis Smooth Scroll

### Conditionally load Lenis:
```jsx
// components/LenisProvider.jsx
'use client';

import { useEffect } from 'react';

export default function LenisProvider({ children }) {
  useEffect(() => {
    // Only load on desktop
    if (window.innerWidth > 1024) {
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      });
    }
  }, []);

  return children;
}
```

---

## 10. Bundle Analysis

### Add to package.json:
```json
"scripts": {
  "analyze": "ANALYZE=true npm run build"
}
```

### Add to next.config.mjs:
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### Install and run:
```bash
npm install --save-dev @next/bundle-analyzer
npm run analyze
```

---

## 📊 Performance Checklist

- [ ] Dynamic import all 3D components
- [ ] Compress GLB models with Draco
- [ ] Lazy load sections with Intersection Observer
- [ ] Self-host fonts
- [ ] Use Next.js Image component
- [ ] Add skeleton loaders
- [ ] Preload critical assets
- [ ] Remove unused CSS
- [ ] Minimize JavaScript execution
- [ ] Enable HTTP/2 server push

---

## 🎯 Target Metrics

After implementing these optimizations:

| Metric | Target | Current (Est.) | After Optimization |
|--------|--------|----------------|-------------------|
| FCP | < 1.8s | ~3.5s | ~1.2s |
| LCP | < 2.5s | ~4.8s | ~2.0s |
| TBT | < 200ms | ~800ms | ~150ms |
| CLS | < 0.1 | ~0.05 | ~0.02 |
| Speed Index | < 3.4s | ~5.2s | ~2.8s |

**Estimated Performance Score: 92-98/100**

---

## 🚀 Quick Wins (30 minutes)

1. Run model optimization script
2. Add dynamic imports to page.js
3. Self-host fonts
4. Add preload tags for critical assets
5. Test with Lighthouse

These 5 changes alone should boost performance by 20-30 points!

---

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Three.js Performance Tips](https://discoverthreejs.com/tips-and-tricks/)
- [Web.dev Performance](https://web.dev/performance/)
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
