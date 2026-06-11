'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

function getAudioBase() {
  if (typeof window === 'undefined') return '/assets/audio';
  return window.location.pathname.startsWith('/archives')
    ? '/assets/audio'
    : '/assets/audio';
}

const TRAIL_MAX = 12;

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const trail: { x: number; y: number }[] = [];
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  const getAudio = useCallback((src: string) => {
    const base = getAudioBase();
    const a = new Audio(`${base}/${src}`);
    return a;
  }, []);

  useEffect(() => {
    clickAudioRef.current = getAudio('click.mp3');
    hoverAudioRef.current = getAudio('hover.mp3');

    if (clickAudioRef.current) clickAudioRef.current.volume = 0.3;
    if (hoverAudioRef.current) hoverAudioRef.current.volume = 0.15;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseDown = () => {
      const a = clickAudioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
      if (dotRef.current) {
        gsap.fromTo(dotRef.current, { scale: 1.6 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]');
      if (!interactive) return;

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
        const a = hoverAudioRef.current;
        if (a) {
          a.currentTime = 0;
          a.play().catch(() => {});
        }
      }, 50);

      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 1.8, borderColor: 'var(--crimson-bright)', duration: 0.3, ease: 'power2.out' });
      }
      if (crossRef.current) {
        gsap.to(crossRef.current, { scale: 1.3, opacity: 0.6, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]');
      if (!interactive) return;

      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 1, borderColor: 'var(--crimson-bright)', duration: 0.3, ease: 'power2.out' });
      }
      if (crossRef.current) {
        gsap.to(crossRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    };

    const lerp = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      const x = Math.round(pos.current.x);
      const y = Math.round(pos.current.y);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      trail.unshift({ x, y });
      if (trail.length > TRAIL_MAX) trail.pop();

      if (trailRef.current) {
        const dots = trailRef.current.children;
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i] as HTMLElement;
          const t = trail[i + 1] || trail[trail.length - 1];
          if (t) {
            dot.style.transform = `translate(${t.x - x}px, ${t.y - y}px)`;
            dot.style.opacity = String(Math.max(0, 1 - i / TRAIL_MAX));
          }
        }
      }

      rafRef.current = requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    rafRef.current = requestAnimationFrame(lerp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
      cancelAnimationFrame(rafRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [getAudio]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: -12,
        left: -12,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--crimson-bright)',
          boxShadow: '0 0 8px var(--crimson-bright)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1.5px solid var(--crimson-bright)',
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s var(--ease-cosmic)',
        }}
      />
      <div
        ref={crossRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 18,
          height: 18,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.3s var(--ease-cosmic), opacity 0.3s var(--ease-cosmic)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ opacity: 0.5, mixBlendMode: 'difference' }}>
          <line x1="0" y1="9" x2="18" y2="9" stroke="var(--crimson-bright)" strokeWidth="1" />
          <line x1="9" y1="0" x2="9" y2="18" stroke="var(--crimson-bright)" strokeWidth="1" />
        </svg>
      </div>
      <div
        ref={trailRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: TRAIL_MAX }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'var(--crimson-bright)',
              opacity: 0,
              boxShadow: '0 0 4px var(--crimson-bright)',
              transition: 'opacity 0.1s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
