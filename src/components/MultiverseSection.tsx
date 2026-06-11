'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SectionHeader } from './SectionHeader';

const revelations = [
  'Every reality branches at every quantum decision, forming an infinite lattice of existence.',
  'The multiverse is not a collection of separate worlds — it is a single wave function collapsing differently for every observer.',
  'What you call chance is the universe exploring every possible path simultaneously.',
];

const stats = [
  { number: '∞', label: 'realities' },
  { number: '11', label: 'dimensions' },
  { number: '01', label: 'substance' },
  { number: '0', label: 'separation' },
];

export function MultiverseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        statsRef.current.filter(Boolean),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
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
      id="multiverse"
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: 'var(--section-multiverse-bg)' }}
    >
      <SectionHeader number="II" title="THE MULTIVERSE" />

      {/* Universe Spheres container for Three.js */}
      <div id="universe-spheres" className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Reveal Texts */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 mb-20">
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

      {/* Stat Cards */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { statsRef.current[i] = el; }}
            className="multiverse-stat flex flex-col items-center p-6 rounded opacity-0"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(180,0,0,0.2)',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            <span
              className="font-multiverse text-5xl font-bold leading-none mb-2"
              style={{ color: 'var(--crimson-bright)' }}
            >
              {stat.number}
            </span>
            <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--moonlight)' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Nebula Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(80,0,80,0.15), transparent 70%)',
          zIndex: 1,
        }}
      />
    </section>
  );
}
