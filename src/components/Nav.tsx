'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/#origin', label: 'ORIGIN', offset: 0 },
  { href: '/#multiverse', label: 'MULTIVERSE', offset: 1 },
  { href: '/#collapse', label: 'COLLAPSE', offset: 2 },
  { href: '/#point', label: 'THE POINT', offset: 3 },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    let ticking = false;
    const update = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      barRef.current.style.width = progress + '%';
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 backdrop-blur-xl"
      style={{
        height: 'var(--size-nav-height)',
        background: 'rgba(20, 21, 30, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-[1px] pointer-events-none"
        style={{
          background: 'var(--grad-crimson)',
          boxShadow: '0 0 8px var(--crimson-bright)',
          transition: 'width 0.15s var(--ease-cosmic)',
        }}
      />
      <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
        <img src="/assets/images/sigil-static.svg" alt="MONOS" className="w-7 h-7" />
        <span
          className="font-brand font-extrabold tracking-[0.15em] uppercase"
          style={{ color: 'var(--crimson-bright)', textShadow: '0 0 10px var(--crimson-bright)', fontSize: 'var(--text-md)' }}
        >
          MONOS
        </span>
      </Link>
      <div className="flex items-center gap-7">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={isHome ? item.href : `/${item.href}`}
            className={cn(
              'text-xs font-medium tracking-[0.3em] uppercase relative py-1 transition-colors duration-300',
              isHome && pathname === item.href
                ? 'text-crimson-bright'
                : ''
            )}
            style={{ color: 'var(--moonlight)', fontFamily: 'var(--font-mono)' }}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/archives"
          className={cn(
            'text-xs font-medium tracking-[0.3em] uppercase relative py-1 transition-colors duration-300',
            pathname.startsWith('/archives') ? 'text-crimson-bright' : ''
          )}
          style={{ color: 'var(--moonlight)', fontFamily: 'var(--font-mono)' }}
        >
          ARCHIVES
        </Link>
      </div>
    </nav>
  );
}
