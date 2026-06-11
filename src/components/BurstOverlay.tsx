'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function getAudioBase() {
  if (typeof window === 'undefined') return '/assets/audio';
  return window.location.pathname.startsWith('/archives')
    ? '/assets/audio'
    : '/assets/audio';
}

export function BurstOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);
  const wingLeftRef = useRef<HTMLDivElement>(null);
  const wingRightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const chromaticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const base = getAudioBase();

    const triggerBurst = () => {
      const tl = gsap.timeline();

      const whoosh = new Audio(`${base}/whoosh.mp3`);
      whoosh.volume = 0.3;
      whoosh.play().catch(() => {});

      tl.call(() => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto';
        if (flashRef.current) flashRef.current.style.display = 'block';
      }, [], 0)
      .to(flashRef.current, { opacity: 1, duration: 0.1 }, 0.2)
      .call(() => {
        const rumble = new Audio(`${base}/rumble.mp3`);
        rumble.volume = 0.4;
        rumble.play().catch(() => {});
      }, [], 0.3)
      .to(shockwaveRef.current, {
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.3)
      .fromTo(sigilRef.current,
        { scale: 0, opacity: 0, rotation: 0 },
        { scale: 1.2, opacity: 1, rotation: 360, duration: 1, ease: 'power3.out' },
        0.3
      )
      .to(sigilRef.current, { scale: 1, opacity: 0.6, duration: 0.4, ease: 'power2.in' }, 1.1)
      .to(flashRef.current, { opacity: 0, duration: 0.3 }, 1.0)
      .call(() => {
        const burst = new Audio(`${base}/burst.mp3`);
        burst.volume = 0.5;
        burst.play().catch(() => {});
      }, [], 1.1)
      .call(() => {
        if (chromaticRef.current) {
          chromaticRef.current.style.display = 'block';
          gsap.to(chromaticRef.current, { opacity: 1, duration: 0.15 });
        }
      }, [], 1.1)
      .to(chromaticRef.current, { opacity: 0, duration: 0.6, delay: 0.3 }, 1.1)
      .call(() => {
        if (chromaticRef.current) chromaticRef.current.style.display = 'none';
      }, [], 2.0);

      // Wings
      gsap.fromTo(wingLeftRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 0.5, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(wingRightRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 0.5, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );

      // Particles
      if (particlesRef.current) {
        const p = particlesRef.current.children;
        for (let i = 0; i < p.length; i++) {
          const el = p[i] as HTMLElement;
          const angle = Math.random() * Math.PI * 2;
          const vel = 100 + Math.random() * 400;
          const tx = Math.cos(angle) * vel;
          const ty = Math.sin(angle) * vel;
          gsap.fromTo(el,
            { x: 0, y: 0, scale: 1, opacity: 1 },
            {
              x: tx,
              y: ty,
              scale: 0,
              opacity: 0,
              duration: 0.8 + Math.random() * 0.6,
              ease: 'power3.out',
              delay: 0.2 + Math.random() * 0.2,
            }
          );
        }
      }

      // Screen shake
      gsap.to('body', {
        x: gsap.utils.random(-4, 4),
        y: gsap.utils.random(-4, 4),
        duration: 0.05,
        repeat: 8,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set('body', { x: 0, y: 0 });
          if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
        },
      });
    };

    (window as any).monosBurst = { triggerBurst };

    return () => {
      delete (window as any).monosBurst;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Flash */}
      <div
        ref={flashRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'white',
          opacity: 0,
          display: 'none',
        }}
      />

      {/* Chromatic Aberration */}
      <div
        ref={chromaticRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'none',
          opacity: 0,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.08)', transform: 'translateX(3px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,255,0.08)', transform: 'translateX(-3px)' }} />
      </div>

      {/* Shockwave */}
      <div
        ref={shockwaveRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '2px solid var(--crimson-bright)',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 1,
          boxShadow: '0 0 60px var(--crimson-bright)',
        }}
      />

      {/* Sigil */}
      <div
        ref={sigilRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          opacity: 0,
        }}
      >
        <img
          src="/assets/images/sigil-static.svg"
          alt=""
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 30px var(--crimson-bright))' }}
        />
      </div>

      {/* Wings */}
      <div
        ref={wingLeftRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 120,
          transform: 'translate(-100%, -50%)',
          opacity: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, var(--crimson-bright) 50%, transparent 100%)',
            clipPath: 'polygon(100% 50%, 0% 0%, 70% 50%, 0% 100%)',
            opacity: 0.3,
            filter: 'blur(2px)',
          }}
        />
      </div>
      <div
        ref={wingRightRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 120,
          transform: 'translate(0%, -50%)',
          opacity: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, var(--crimson-bright) 50%, transparent 100%)',
            clipPath: 'polygon(0% 50%, 100% 0%, 30% 50%, 100% 100%)',
            opacity: 0.3,
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Particles */}
      <div
        ref={particlesRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: Math.random() > 0.5 ? 'var(--crimson-bright)' : 'var(--moonlight)',
              boxShadow: `0 0 6px var(--crimson-bright)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
