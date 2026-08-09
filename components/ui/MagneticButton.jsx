'use client';

import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';

/**
 * MagneticButton — Premium button with advanced microinteractions
 * 
 * Features:
 * - Magnetic pull effect (button follows cursor)
 * - 3D lift on hover (transform + shadow)
 * - Ripple effect on click
 * - Smooth GSAP animations
 * - Customizable colors and sizes
 */

export default function MagneticButton({
  children,
  onClick,
  variant = 'primary', // primary, secondary, outline
  size = 'default', // sm, default, lg
  icon = true,
  iconBg = '#00C864',
  className = '',
  ...props
}) {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Magnetic effect on mouse move
  const handleMouseMove = useCallback((e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  // Reset position on mouse leave
  const handleMouseLeave = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    setIsHovered(false);

    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  // Ripple effect on click
  const handleClick = useCallback((e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // Bounce animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    // Call parent onClick
    if (onClick) onClick(e);
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Variant styles
  const variantStyles = {
    primary: 'bg-[#0D0D0E] hover:bg-[#1A1D1C] text-[#F4F1EA]',
    secondary: 'bg-[#00C864] hover:bg-[#1CE47C] text-[#0D0D0E]',
    outline: 'bg-transparent border-2 border-[#F4F4F0] hover:bg-[#F4F4F0] hover:text-[#0D0D0E] text-[#F4F4F0]',
    orange: 'bg-[#FF5500] hover:bg-[#FF6B1A] text-[#F4F4F0]',
    blue: 'bg-[#0077C8] hover:bg-[#0091D5] text-[#FFFFFF]',
    red: 'bg-[#991B1B] hover:bg-[#B91C1C] text-[#F4F1EA]',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    default: 'px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm',
    lg: 'px-7 py-4 text-sm sm:text-base',
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`
        cursor-hover group relative inline-flex items-center gap-3 
        rounded-full font-stedelijk font-semibold tracking-tight 
        transition-all duration-300 
        shadow-md
        overflow-hidden
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      {...props}
    >
      {/* Ripple container */}
      <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
      </span>

      {/* Button content */}
      <span className="relative z-10">{children}</span>

      {/* Icon with rotation on hover */}
      {icon && (
        <span
          className="relative z-10 w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <ArrowUpRight size={14} strokeWidth={2.5} className="text-[#0D0D0E]" />
        </span>
      )}

      {/* Shine effect on hover */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.8s ease',
        }}
      />

      {/* CSS for ripple animation */}
      <style jsx>{`
        @keyframes ripple {
          to {
            width: 500px;
            height: 500px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </button>
  );
}
