'use client';

import { useEffect, useRef, useState } from 'react';

export function Loader() {
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime = performance.now();
    const duration = 5000;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const raw = Math.min(elapsed / duration, 1);

      // Font loading progress
      let fontProgress = 0;
      if (document.fonts) {
        fontProgress = Math.min(document.fonts.status === 'loaded' ? 1 : 0.5, 1);
      }

      progressRef.current = Math.max(raw * 0.7, fontProgress * 0.9);

      if (barRef.current) {
        barRef.current.style.width = `${progressRef.current * 100}%`;
      }

      if (progressRef.current >= 1) {
        complete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const complete = () => {
      if (barRef.current) barRef.current.style.width = '100%';
      setTimeout(() => {
        document.body.classList.add('loaded');
        setHidden(true);
        window.dispatchEvent(new CustomEvent('monos:loaded'));
      }, 1000);
    };

    const onFontsReady = () => {
      startTime = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    document.fonts.ready.then(onFontsReady);

    // Safety timeout
    const safety = setTimeout(() => {
      if (progressRef.current < 1) {
        progressRef.current = 1;
        complete();
      }
    }, duration);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(safety);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        background: 'var(--void-0)',
        transition: 'opacity 1s var(--ease-cosmic)',
        opacity: hidden ? 0 : 1,
      }}
    >
      {/* Radial gradient so MONOS title shows through */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, var(--void-0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Rotating Sigil */}
      <div
        style={{
          width: 60,
          height: 60,
          animation: 'sigilRotate 3s linear infinite',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="/assets/images/sigil-static.svg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 0 20px var(--crimson-bright)) drop-shadow(0 0 40px var(--crimson-base))',
          }}
        />
      </div>

      {/* Text */}
      <span
        className="font-mono"
        style={{
          color: 'var(--moonlight)',
          fontSize: 'var(--text-sm)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
          animation: 'textGlowPulse 2s ease-in-out infinite',
        }}
      >
        AWAKENING THE SINGULARITY
      </span>

      {/* Loading bar */}
      <div
        style={{
          width: 200,
          height: 2,
          background: 'var(--void-4)',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'var(--grad-crimson)',
            boxShadow: '0 0 10px var(--crimson-bright)',
            transition: 'width 0.2s var(--ease-cosmic)',
          }}
        />
      </div>
    </div>
  );
}
