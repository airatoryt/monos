'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SectionHeader } from './SectionHeader';

const revelations = [
  'When all dimensions fold back into the singularity, space and time cease to have meaning.',
  'The black hole is the universe returning to its origin — a collapse so complete it births a new beginning.',
  'At the center of every great darkness lies the seed of all that was, is, and will be.',
];

const collapseData = [
  { label: 'Entropy', value: '→ ZERO' },
  { label: 'Velocity', value: '∞c' },
  { label: 'Distance', value: '0' },
];

export function CollapseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        blockquoteRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        revealRefs.current.filter(Boolean),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collapse"
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: 'var(--section-collapse-bg)' }}
    >
      <SectionHeader number="III" title="THE COLLAPSE" />

      {/* Black Hole Container */}
      <div className="relative mx-auto mb-20" style={{ width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)' }}>
        {/* Accretion Disk Layer 1 — outer, slow */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--crimson-bright), transparent 60%, var(--crimson-bright) 80%, transparent)',
            opacity: 0.15,
            transform: 'rotate(0deg) scaleX(2.5)',
            filter: 'blur(4px)',
          }}
        />
        {/* Accretion Disk Layer 2 — middle */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 180deg, transparent, rgba(180,0,0,0.3), transparent 50%, rgba(180,0,0,0.4) 70%, transparent)',
            opacity: 0.25,
            transform: 'rotate(120deg) scaleX(1.8)',
            filter: 'blur(2px)',
            animationDirection: 'reverse',
            animationDuration: '8s',
          }}
        />
        {/* Accretion Disk Layer 3 — inner, fast */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 90deg, transparent, rgba(255,50,50,0.5), transparent 40%, rgba(180,0,0,0.6) 60%, transparent)',
            opacity: 0.35,
            transform: 'rotate(60deg) scaleX(1.3)',
            animationDuration: '3s',
          }}
        />
        {/* Event Horizon */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            top: '20%',
            left: '20%',
            background: 'radial-gradient(circle, #000 30%, #1a0000 60%, transparent 100%)',
            boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(180,0,0,0.2)',
          }}
        />
        {/* Thorn Ring */}
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (360 / 16) * i;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: '3px',
                  height: '18px',
                  background: 'var(--crimson-bright)',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(${-50}%)`,
                  transformOrigin: 'bottom center',
                  boxShadow: '0 0 8px var(--crimson-bright)',
                  opacity: 0.6,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Collapse Data Bar */}
      <div
        className="flex justify-center gap-12 md:gap-20 mb-16 relative z-10"
        style={{ color: 'var(--moonlight)' }}
      >
        {collapseData.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">{item.label}</span>
            <span className="font-brand text-lg tracking-wider" style={{ color: 'var(--crimson-bright)' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Blockquote */}
      <blockquote
        ref={blockquoteRef}
        className="font-collapse text-center text-2xl md:text-3xl max-w-2xl mx-auto mb-20 leading-relaxed opacity-0 relative"
        style={{ color: 'var(--bone)' }}
      >
        <span className="absolute -top-4 -left-6 text-6xl opacity-30" style={{ color: 'var(--crimson-bright)' }}>&ldquo;</span>
        EVERY PATH LEADS TO THE POINT
        <span className="absolute -bottom-10 -right-6 text-6xl opacity-30" style={{ color: 'var(--crimson-bright)' }}>&rdquo;</span>
      </blockquote>

      {/* Reveal Texts */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {revelations.map((text, i) => (
          <p
            key={i}
            ref={(el) => { revealRefs.current[i] = el; }}
            className="font-body text-base leading-relaxed tracking-wide opacity-0"
            style={{ color: 'var(--moonlight)' }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
