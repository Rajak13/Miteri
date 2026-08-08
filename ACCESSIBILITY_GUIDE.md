# Accessibility (A11y) Guide - Achieving 100/100

## 🎯 Goal: WCAG 2.1 Level AA Compliance

---

## Current Issues to Address

### 1. Color Contrast
Check all text meets minimum contrast ratios:
- **Normal text**: 4.5:1
- **Large text (18px+ or 14px+ bold)**: 3:1

#### Test your colors:
```
Background: #080909 (very dark)
Text: #F4F4F0 (off-white)
Contrast ratio: ~17:1 ✅ (Excellent)

Green accent: #22c55e
Orange accent: #f97316
Blue accent: #3b82f6
```

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### 2. Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```jsx
// Add focus styles to all buttons and links
// In globals.css:

/* Focus visible styles */
*:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
```

#### Test:
1. Tab through entire page
2. Verify all interactive elements are reachable
3. Ensure focus indicators are visible
4. Test skip links (add one to layout.js)

---

### 3. Skip to Content Link

Add to `app/layout.js`:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#080909] text-[#F4F4F0]">
        {/* Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-500 focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        
        <LenisProvider>
          <main id="main-content">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
```

---

### 4. Semantic HTML & ARIA

#### Update Navbar component:
```jsx
<nav role="navigation" aria-label="Main navigation">
  <ul role="list">
    <li><a href="#futsal" aria-label="Jump to Futsal section">Futsal</a></li>
    {/* ... */}
  </ul>
  <button aria-label="Book now at Miteri Sports Center">Book Now</button>
</nav>
```

#### Update sections with proper landmarks:
```jsx
<section 
  id="futsal-section" 
  aria-labelledby="futsal-heading"
>
  <h2 id="futsal-heading">Futsal Court</h2>
  {/* content */}
</section>
```

---

### 5. Alt Text for All Visual Content

#### Canvas/3D scenes need labels:
```jsx
<div 
  role="img" 
  aria-label="Interactive 3D football field with animated ball"
  className="h-screen"
>
  <HeroCanvas />
</div>
```

#### Decorative images:
```jsx
<img src="/decorative.svg" alt="" role="presentation" />
// Empty alt for decorative images
```

---

### 6. Form Accessibility

When you add booking forms:

```jsx
<form aria-labelledby="booking-form-heading">
  <h2 id="booking-form-heading">Book a Court</h2>
  
  <div>
    <label htmlFor="name" className="block mb-2">
      Full Name <span aria-label="required">*</span>
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      aria-required="true"
      aria-describedby="name-error"
      aria-invalid={errors.name ? "true" : "false"}
    />
    {errors.name && (
      <p id="name-error" role="alert" className="text-red-500">
        {errors.name}
      </p>
    )}
  </div>

  <button type="submit" aria-busy={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Book Now'}
  </button>
</form>
```

---

### 7. Motion & Animation Controls

Add motion preference detection:

```jsx
// components/LenisProvider.jsx
'use client';

import { useEffect } from 'react';

export default function LenisProvider({ children }) {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Only enable smooth scroll if user hasn't requested reduced motion
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({ duration: 1.2 });
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

Add to `globals.css`:
```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 8. Screen Reader Announcements

For dynamic content updates:

```jsx
// components/LiveRegion.jsx
export function LiveRegion({ message, politeness = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Usage in page.js
{isUnlocked && (
  <LiveRegion message="Content unlocked. You can now scroll." />
)}
```

---

### 9. Add Screen Reader Only Utility Class

In `globals.css`:
```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

### 10. Touch Target Size

Ensure all interactive elements are at least 44x44px:

```css
/* Minimum touch target size */
button,
a[href],
input,
select,
textarea {
  min-height: 44px;
  min-width: 44px;
}

/* For smaller visual elements, extend hit area */
.small-button {
  padding: 12px; /* Increases clickable area */
}
```

---

## 🧪 Testing Checklist

### Automated Testing
- [ ] Run Lighthouse Accessibility audit
- [ ] Use [axe DevTools](https://www.deque.com/axe/devtools/)
- [ ] Use [WAVE browser extension](https://wave.webaim.org/extension/)
- [ ] Run [Pa11y](https://pa11y.org/) automated tests

```bash
# Install Pa11y
npm install -g pa11y

# Test your site
pa11y http://localhost:3000
```

### Manual Testing

#### Keyboard Navigation
- [ ] Tab through entire page
- [ ] Shift+Tab backward navigation works
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate within components (if applicable)
- [ ] No keyboard traps

#### Screen Reader Testing
- [ ] Test with NVDA (Windows, free)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)

#### Visual Testing
- [ ] Zoom to 200% - content still readable
- [ ] Test with high contrast mode
- [ ] Test with different color blind simulations
- [ ] Test in dark mode and light mode

#### Mobile Testing
- [ ] Test with device screen reader
- [ ] Pinch to zoom works
- [ ] Text size adjustments work
- [ ] Orientation changes handled properly

---

## 🎯 Quick Wins (20 minutes)

1. Add skip to content link
2. Add focus-visible styles
3. Add ARIA labels to nav and sections
4. Add sr-only utility class
5. Test with Lighthouse

---

## 📋 ARIA Cheat Sheet

### Landmarks
```jsx
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main" id="main-content">
<aside role="complementary">
<footer role="contentinfo">
<section role="region" aria-labelledby="section-title">
```

### Interactive Elements
```jsx
<button aria-pressed="true">Toggle</button>
<button aria-expanded="false" aria-controls="menu-id">Menu</button>
<button aria-label="Close dialog">×</button>
<a aria-current="page">Current Page</a>
```

### Dynamic Content
```jsx
<div role="alert" aria-live="assertive">Error!</div>
<div role="status" aria-live="polite">Loading...</div>
<div aria-busy="true">Processing...</div>
<div aria-hidden="true">Decorative content</div>
```

### Forms
```jsx
<input aria-required="true" required />
<input aria-invalid="true" aria-describedby="error-id" />
<input aria-describedby="help-text" />
<fieldset aria-describedby="group-help">
```

---

## 🚫 Common Mistakes to Avoid

1. **Don't use placeholder as label**
   ```jsx
   // ❌ Bad
   <input placeholder="Enter name" />
   
   // ✅ Good
   <label htmlFor="name">Name</label>
   <input id="name" placeholder="John Doe" />
   ```

2. **Don't hide focus indicators**
   ```css
   /* ❌ Never do this */
   *:focus { outline: none; }
   
   /* ✅ Do this */
   *:focus-visible { outline: 2px solid currentColor; }
   ```

3. **Don't use divs for buttons**
   ```jsx
   // ❌ Bad
   <div onClick={handleClick}>Click me</div>
   
   // ✅ Good
   <button onClick={handleClick}>Click me</button>
   ```

4. **Don't forget alt text**
   ```jsx
   // ❌ Bad
   <img src="logo.png" />
   
   // ✅ Good
   <img src="logo.png" alt="Miteri Sports Center logo" />
   ```

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)
- [Inclusive Components](https://inclusive-components.design/)

---

## 🎯 Expected Score After Implementation

**Accessibility Score: 95-100/100**

Common deductions:
- -2 points: Color contrast issues (none expected)
- -3 points: Missing ARIA labels (will fix)
- -5 points: Keyboard navigation issues (will fix)
- -5 points: Missing semantic HTML (will fix)

After following this guide, you should achieve 98-100/100!
