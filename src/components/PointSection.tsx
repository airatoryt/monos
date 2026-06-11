'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { ContactForm } from './ContactForm';

const tenets = [
  {
    numeral: 'I',
    title: 'ONE SUBSTANCE',
    text: 'All distinctions are modes of a single underlying reality.',
  },
  {
    numeral: 'II',
    title: 'ILLUSION IS REAL',
    text: 'A dream occurring in the One is as real as the One itself.',
  },
  {
    numeral: 'III',
    title: 'SEPARATION IS VOID',
    text: 'The apparent many is the One experiencing itself from no point.',
  },
];

export function PointSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);
  const tenetsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sigilRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        tenetsRef.current.filter(Boolean),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="point"
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: 'var(--section-point-bg)' }}
    >
      <SectionHeader number="IV" title="THE POINT" />

      {/* Singularity Visualization */}
      <div ref={sigilRef} className="flex justify-center mb-16 opacity-0">
        <div
          className="relative flex items-center justify-center animate-spin-slow"
          style={{ width: 'clamp(120px, 20vw, 220px)', height: 'clamp(120px, 20vw, 220px)', animationDuration: '12s' }}
        >
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(180,0,0,0.3), transparent 70%)',
              boxShadow: '0 0 80px var(--crimson-bright), 0 0 160px rgba(180,0,0,0.2)',
            }}
          />
          {/* Sigil ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: '80%',
              height: '80%',
              border: '1px solid var(--crimson-bright)',
              boxShadow: '0 0 20px var(--crimson-bright), inset 0 0 20px rgba(180,0,0,0.2)',
            }}
          />
          {/* Core */}
          <div
            className="absolute rounded-full"
            style={{
              width: '20%',
              height: '20%',
              background: 'var(--crimson-bright)',
              boxShadow: '0 0 40px var(--crimson-bright), 0 0 80px rgba(180,0,0,0.6)',
            }}
          />
        </div>
      </div>

      {/* Philosophy Content */}
      <div className="max-w-3xl mx-auto text-center mb-16 relative z-10">
        <h3
          className="font-brand text-4xl md:text-5xl font-bold mb-6"
          style={{
            color: 'var(--bone)',
            textShadow: '0 0 30px var(--crimson-bright)',
          }}
        >
          MONOS
        </h3>
        <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'var(--moonlight)' }}>
          The Many is merely the One appearing as separate. Every star, every void, every thought — all are
          modulations of the single substance that has always been and will always be. To know this is to know
          the end of seeking.
        </p>
        <blockquote
          className="font-multiverse text-lg tracking-wider italic border-l-2 pl-6 mx-auto text-left max-w-xl"
          style={{
            borderColor: 'var(--crimson-bright)',
            color: 'var(--bone)',
          }}
        >
          &ldquo;The One does not become the many — the many never left the One.&rdquo;
        </blockquote>
      </div>

      {/* Tenets Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20 relative z-10">
        {tenets.map((tenet, i) => (
          <div
            key={i}
            ref={(el) => { tenetsRef.current[i] = el; }}
            className="flex flex-col p-8 rounded opacity-0"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(180,0,0,0.15)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            <span className="font-point text-4xl mb-4" style={{ color: 'var(--crimson-bright)' }}>
              {tenet.numeral}
            </span>
            <h4 className="font-brand text-lg tracking-wider mb-3" style={{ color: 'var(--bone)' }}>
              {tenet.title}
            </h4>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--moonlight)' }}>
              {tenet.text}
            </p>
          </div>
        ))}
      </div>

      {/* Link to Archives */}
      <div className="text-center mb-20 relative z-10">
        <Link
          href="/archives"
          className="font-mono text-xs tracking-[0.3em] uppercase inline-block px-8 py-3 transition-all duration-300 hover:tracking-[0.4em]"
          style={{
            color: 'var(--bone)',
            border: '1px solid var(--crimson-bright)',
            background: 'rgba(180,0,0,0.05)',
          }}
        >
          Enter the Archives
        </Link>
      </div>

      {/* Contact Form */}
      <div className="max-w-lg mx-auto mb-20 relative z-10">
        <ContactForm />
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center gap-4 pt-12" style={{ borderTop: '1px solid rgba(180,0,0,0.15)' }}>
        <div className="flex items-center justify-center">
          <img src="/static.svg" alt="" className="w-10 h-10 opacity-40" />
        </div>
        <p className="font-brand text-sm tracking-[0.3em]" style={{ color: 'var(--moonlight)' }}>
          ALL PATHS CONVERGE
        </p>
      </footer>
    </section>
  );
}
