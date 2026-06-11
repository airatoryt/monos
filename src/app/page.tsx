'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { MultiverseSection } from '@/components/MultiverseSection';
import { CollapseSection } from '@/components/CollapseSection';
import { PointSection } from '@/components/PointSection';

export default function HomePage() {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollProgress =
            window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
          document.documentElement.style.setProperty(
            '--scroll-progress',
            String(scrollProgress)
          );
          ticking = false;
        });
        ticking = true;
      }

      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const threshold = window.innerHeight * 0.5;
        if (rect.top < threshold && rect.bottom > threshold) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section id="origin">
        <HeroSection />
      </section>

      <section
        id="multiverse"
        className="relative"
        style={{ minHeight: '200vh', background: 'var(--section-multiverse-bg)' }}
      >
        <div className="page-content">
          <MultiverseSection />
        </div>
      </section>

      <section
        id="collapse"
        className="relative"
        style={{ minHeight: '200vh', background: 'var(--section-collapse-bg)' }}
      >
        <div className="page-content">
          <CollapseSection />
        </div>
      </section>

      <section
        id="point"
        className="relative"
        style={{ minHeight: '200vh', background: 'var(--section-point-bg)' }}
      >
        <div className="page-content">
          <PointSection />
        </div>
      </section>
    </>
  );
}
