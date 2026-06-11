'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrambleText } from './scramble-text';

export function HeroSection() {
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, delay: 1.5 })
      .fromTo(taglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, '-=0.6')
      .fromTo(scrollPromptRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.4');
  }, []);

  const renderThorns = () => {
    const thorns: JSX.Element[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i;
      const length = 20 + Math.sin(i * 1.5) * 10;
      thorns.push(
        <div
          key={i}
          className="absolute top-1/2 left-1/2"
          style={{
            width: '2px',
            height: `${length}px`,
            background: 'var(--crimson-bright)',
            transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-60px)`,
            transformOrigin: 'bottom center',
            boxShadow: `0 0 6px var(--crimson-bright)`,
          }}
        />
      );
    }
    return thorns;
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--void-0)' }}
    >
      {/* Crimson Moon */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'clamp(200px, 40vw, 500px)',
          height: 'clamp(200px, 40vw, 500px)',
          background: 'radial-gradient(circle at 35% 35%, var(--crimson-bright), #4a0000 50%, #1a0000 80%, transparent 100%)',
          boxShadow: '0 0 80px var(--crimson-bright), 0 0 200px rgba(180, 0, 0, 0.4), inset 0 0 60px rgba(255, 50, 50, 0.15)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.7,
        }}
      />

      {/* Thorn Container */}
      <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {renderThorns()}
      </div>

      {/* Brand Meta */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] opacity-50"
        style={{ color: 'var(--moonlight)' }}
      >
        EVERYTHING. ONE. · EST. ∞
      </div>

      {/* MONOS Title */}
      <h1
        id="hero-title"
        className="font-brand text-center relative z-10"
        style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textShadow: '0 0 20px var(--crimson-bright), 0 0 60px rgba(180, 0, 0, 0.6), 0 0 120px rgba(180, 0, 0, 0.3)',
          color: 'var(--bone)',
          lineHeight: 1,
        }}
      >
        <ScrambleText text="MONOS" />
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="font-mono text-sm tracking-[0.15em] mt-4 relative z-10 opacity-0"
        style={{ color: 'var(--moonlight)' }}
      >
        Where all universes collapse into a single point
      </p>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="font-accent text-xs tracking-[0.4em] uppercase mt-2 relative z-10 opacity-0"
        style={{ color: 'var(--crimson-bright)' }}
      >
        The Dire Balemoon Rises
      </p>

      {/* Scroll Prompt */}
      <div
        ref={scrollPromptRef}
        className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0"
        style={{ zIndex: 10 }}
      >
        <span className="animate-float text-lg" style={{ color: 'var(--crimson-bright)' }}>⬥</span>
        <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: 'var(--moonlight)' }}>
          DESCEND
        </span>
      </div>

      {/* Hero Sigil */}
      <div className="absolute bottom-28 right-8 opacity-20 z-0">
        <img src="/static.svg" alt="" className="w-16 h-16" />
      </div>
    </section>
  );
}
