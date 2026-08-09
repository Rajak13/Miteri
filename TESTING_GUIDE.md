# Phase 1 Testing Guide

## Quick Start

```bash
cd /Users/rajak/Downloads/miteri
npm run dev
```

Open http://localhost:3000

---

## What to Test

### 1. Custom Magnetic Cursor (Desktop Only)

**Where:** Entire site  
**How to Test:**
1. Move mouse around — cursor should be a white dot with follower ring
2. Hover over buttons — cursor should expand to 48px circle
3. Click button — cursor should shrink to 32px
4. Drag 3D balls — cursor should show drag state

**Expected Behavior:**
- ✅ Smooth spring physics following
- ✅ Magnetic pull toward buttons
- ✅ Size changes on hover/click
- ✅ No cursor on mobile/touch devices

**Common Issues:**
- If cursor flickers: Check z-index in CustomCursor.jsx
- If cursor doesn't appear: Check `@media (hover: hover)` in globals.css

---

### 2. Magnetic Button Interactions

**Where:** All "Book" buttons in sections  
**How to Test:**
1. Hover button — should lift up with shadow
2. Move mouse around button — button should follow slightly
3. Click button — should show ripple effect + bounce
4. Watch for shine effect — gradient sweeps across on hover

**Expected Behavior:**
- ✅ Button follows cursor (magnetic)
- ✅ 3D lift on hover
- ✅ Ripple spreads from click point
- ✅ Icon rotates 45° on hover
- ✅ Elastic bounce on click

**Common Issues:**
- If button doesn't follow: Check GSAP import
- If ripple doesn't show: Check overflow:hidden on button

---

### 3. Section Color Transitions

**Where:** Between all sections  
**How to Test:**
1. Scroll from Hero → Futsal
2. Watch background color morph from dark → cream
3. Continue scrolling through all sections
4. Scroll back up — colors should reverse smoothly

**Expected Behavior:**
- ✅ Gradual color interpolation (not instant)
- ✅ Smooth RGB transitions
- ✅ No color "jumps"
- ✅ Works in both directions

**Colors to Watch:**
- Hero: #080909 (dark)
- Futsal: #F4F1EA (cream)
- Basketball: #080909 (dark)
- Badminton: #EEF6FC (sky blue)
- Gym: #1A0505 (dark crimson)

**Common Issues:**
- If colors jump: Check ScrollTrigger scrub value
- If overlays don't appear: Check z-index in SectionTransitions.jsx

---

### 4. Kinetic Typography

**Where:** FutsalSection headline  
**How to Test:**
1. Scroll down to Futsal section
2. Watch headline letters animate in one by one
3. Letters should slide up and fade in with stagger

**Expected Behavior:**
- ✅ Each letter animates individually
- ✅ Smooth stagger effect (0.015s per letter)
- ✅ Slide up + fade in motion
- ✅ Animation triggers at "top 80%"

**Common Issues:**
- If letters don't animate: Check AnimatedText ScrollTrigger start position
- If text is invisible: Check initial opacity in AnimatedText.jsx

---

### 5. Element Choreography

**Where:** FutsalSection content  
**How to Test:**
1. Scroll to Futsal section slowly
2. Watch elements animate in sequence:
   - Category tag (fadeUp, 0.1s delay)
   - Headline (letter animation)
   - Badges (scale stagger, 0.2s delay)
   - Description (fadeUp, 0.3s delay)
   - Button (fadeUp, 0.4s delay)

**Expected Behavior:**
- ✅ Perfect timing sequence
- ✅ Badges pop in one by one
- ✅ Each element waits for previous
- ✅ Smooth, orchestrated feel

**Common Issues:**
- If elements don't stagger: Check ScrollReveal delay props
- If all animate at once: Check stagger value

---

## Browser Testing Checklist

### Desktop Browsers
- [ ] Chrome (latest) — Full support
- [ ] Firefox (latest) — Full support
- [ ] Safari (latest) — Full support
- [ ] Edge (latest) — Full support

### Mobile Browsers
- [ ] iOS Safari — Cursor disabled, buttons work
- [ ] Chrome Mobile — Cursor disabled, buttons work
- [ ] Samsung Internet — Touch gestures work

### Accessibility Testing
- [ ] Keyboard navigation — Tab through all buttons
- [ ] Reduced motion — Animations respect preference
- [ ] Screen reader — ARIA labels present

---

## Performance Checklist

### Chrome DevTools Performance Tab
1. Record while scrolling
2. Check for:
   - [ ] 60fps maintained
   - [ ] No layout thrashing
   - [ ] No memory leaks

### Lighthouse Scores
Run: `npm run build && npx serve out`

Expected Scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 100

---

## Known Limitations

### Current Phase 1 Scope
✅ **Implemented:**
- Custom cursor
- Button microinteractions
- Section transitions
- Kinetic typography
- Scroll choreography

⏳ **Not Yet Implemented (Phase 2):**
- Sound design
- Interactive 3D courts
- Physics simulations
- Advanced shaders
- Functional booking system

---

## Debugging Tips

### If Animations Don't Work
1. Open DevTools Console
2. Look for GSAP errors
3. Check: `typeof gsap !== 'undefined'`
4. Verify ScrollTrigger registered

### If Cursor Doesn't Appear
1. Check if touch device: `'ontouchstart' in window`
2. Verify CSS: `cursor: none !important` in globals.css
3. Check mix-blend-mode support

### If Colors Don't Transition
1. Verify section IDs: `#hero-section`, `#futsal-section`, etc.
2. Check ScrollTrigger start/end values
3. Open GSAP DevTools (if available)

---

## Next Steps After Testing

### If Everything Works ✅
- Move to Phase 2: 3D Innovation
- Start with interactive court environments
- Add physics-based ball interactions

### If Issues Found ❌
1. Document the issue
2. Check console for errors
3. Verify file paths
4. Check GSAP/React versions

---

## Quick Fixes

### Cursor Not Showing
```javascript
// In CustomCursor.jsx, check line 15
const isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) return; // This hides cursor on mobile
```

### Animations Too Fast/Slow
```javascript
// Adjust in component props
<AnimatedText duration={0.7} stagger={0.015} />
<ScrollReveal duration={0.8} stagger={0.1} />
```

### Colors Not Smooth
```javascript
// In SectionTransitions.jsx, adjust scrub value
scrub: 1, // Higher = smoother but slower
```

---

## Support

If you encounter issues:
1. Check browser console
2. Verify GSAP version: `npm ls gsap`
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

---

**Happy Testing! 🚀**

The site should feel noticeably more premium now. Every interaction should feel intentional and polished.
