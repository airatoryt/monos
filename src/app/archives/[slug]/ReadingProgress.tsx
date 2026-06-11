'use client';

import { useEffect } from 'react';

export function ReadingProgress() {
  useEffect(() => {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="reading-progress-bar"
      className="fixed top-[var(--size-nav-height)] left-0 h-0.5 z-50 pointer-events-none"
      style={{
        width: '0%',
        background: 'var(--crimson-bright)',
        boxShadow: '0 0 8px var(--crimson-bright)',
        transition: 'width 0.1s linear',
      }}
    />
  );
}
