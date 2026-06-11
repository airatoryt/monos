'use client';

interface SectionHeaderProps {
  number: string;
  title: string;
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="text-center mb-10 flex flex-col items-center gap-3">
      <span className="tracking-[0.4em] opacity-85 uppercase" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300 }}>
        {number}
      </span>
      <h2 className="font-bold uppercase m-0 tracking-[0.05em]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
        {title}
      </h2>
      <div className="w-[140px] h-[1px] mt-3" style={{ background: 'var(--grad-crimson)', boxShadow: '0 0 12px var(--crimson-bright)' }} />
    </div>
  );
}
