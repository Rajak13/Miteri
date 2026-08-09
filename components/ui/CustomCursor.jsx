'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * CustomCursor — Premium magnetic cursor with 3D ball mini version
 * 
 * Features:
 * - Smooth spring physics following
 * - Magnetic pull toward interactive elements
 * - Context-aware states (default, hover, drag)
 * - Mini 3D ball icon on interactive elements
 * - Respects reduced-motion preferences
 */

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const followerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // default, hover, drag
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Mouse enter/leave handlers for interactive elements
    const handleMouseEnter = (e) => {
      const target = e.target;
      
      // Check if it's an interactive element
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-hover') ||
        target.dataset.cursorHover
      ) {
        setCursorState('hover');
        
        // Magnetic effect - pull cursor toward element center
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        gsap.to(cursorPos.current, {
          x: centerX,
          y: centerY,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      setCursorState('default');
    };

    // Drag state handlers
    const handleMouseDown = () => {
      setCursorState('drag');
    };

    const handleMouseUp = () => {
      setCursorState('default');
    };

    // Animation loop for smooth following
    let animationFrameId;
    const animate = () => {
      const smoothing = cursorState === 'hover' ? 0.15 : 0.12;
      const followerSmoothing = 0.08;

      // Cursor follows mouse with spring physics
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * smoothing;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * smoothing;

      // Follower lags behind cursor
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * followerSmoothing;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * followerSmoothing;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorState]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="custom-cursor"
        data-state={cursorState}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      >
        <div
          ref={cursorInnerRef}
          className="custom-cursor-inner"
          style={{
            width: cursorState === 'hover' ? '48px' : cursorState === 'drag' ? '32px' : '12px',
            height: cursorState === 'hover' ? '48px' : cursorState === 'drag' ? '32px' : '12px',
            borderRadius: '50%',
            backgroundColor: cursorState === 'hover' ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {cursorState === 'hover' && (
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Follower circle */}
      <div
        ref={followerRef}
        className="custom-cursor-follower"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          width: cursorState === 'hover' ? '64px' : '40px',
          height: cursorState === 'hover' ? '64px' : '40px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.4s ease, height 0.4s ease, border-color 0.3s ease',
          mixBlendMode: 'difference',
        }}
      />

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .custom-cursor,
          .custom-cursor-follower {
            display: none !important;
          }
        }

        @media (hover: none) {
          .custom-cursor,
          .custom-cursor-follower {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
