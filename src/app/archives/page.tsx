'use client';

import { allPosts } from 'contentlayer/generated';
import { formatMonosDate } from '@/lib/utils';
import Link from 'next/link';

export default function ArchivesPage() {
  return (
    <main
      className="relative min-h-screen"
      style={{ background: 'var(--void-1)' }}
    >
      {/* Header */}
      <div
        className="relative pt-32 pb-20 text-center overflow-hidden"
        style={{ background: 'var(--void-2)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, var(--crimson-bright) 0%, transparent 70%)',
          }}
        />
        <h1
          className="font-point text-[clamp(3rem,10vw,7rem)] leading-none mb-4"
          style={{ color: 'var(--crimson-bright)', textShadow: '0 0 40px var(--crimson-bright)' }}
        >
          V
        </h1>
        <h2
          className="font-origin text-2xl tracking-[0.3em] uppercase"
          style={{ color: 'var(--bone)' }}
        >
          THE ARCHIVES
        </h2>
        <p
          className="font-mono text-sm mt-6 max-w-xl mx-auto px-4"
          style={{ color: 'var(--moonlight)' }}
        >
          Each transmission is a fragment of the infinite. Scroll through the
          echoes of consciousness as it remembers itself.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post, index) => (
            <Link key={post._id} href={`/archives/${post.slug}`} className="group block">
              <article
                className="relative h-full border rounded-lg overflow-hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-cosmic)]"
                style={{
                  borderColor: 'var(--void-4)',
                  background: 'var(--void-2)',
                  '--card-index': index,
                  animation: `fadeIn 0.6s ease-out both`,
                  animationDelay: `${index * 0.08}s`,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--crimson-bright)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(180,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--void-4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image area */}
                <div
                  className="relative w-full h-48 flex items-center justify-center overflow-hidden"
                  style={{ background: 'var(--void-3)' }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, var(--crimson-bright), transparent 70%)',
                    }}
                  />
                  <img
                    src="/assets/images/sigil-static.svg"
                    alt=""
                    className="w-16 h-16 opacity-40 transition-opacity"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  {/* Date + Tag */}
                  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.15em]">
                    <span style={{ color: 'var(--moonlight)' }}>
                      {formatMonosDate(post.date)}
                    </span>
                    {post.tag && (
                      <>
                        <span style={{ color: 'var(--void-4)' }}>/</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em]"
                          style={{
                            color: 'var(--crimson-bright)',
                            border: '1px solid var(--crimson-base)',
                            background: 'rgba(255,0,0,0.05)',
                          }}
                        >
                          {post.tag}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-origin text-lg tracking-[0.05em] leading-tight transition-colors duration-[var(--duration-normal)]"
                    style={{ color: 'var(--bone)' }}
                  >
                    {post.title}
                  </h3>

                  {/* Subtitle */}
                  {post.subtitle && (
                    <p
                      className="font-accent italic text-sm leading-relaxed"
                      style={{ color: 'var(--moonlight)' }}
                    >
                      {post.subtitle}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p
                    className="font-body text-sm leading-relaxed line-clamp-3 mt-1"
                    style={{ color: 'var(--moonlight)' }}
                  >
                    {post.excerpt || ''}
                  </p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between mt-4 pt-4"
                    style={{ borderTop: '1px solid var(--void-4)' }}
                  >
                    <span
                      className="font-mono text-[11px] tracking-[0.1em]"
                      style={{ color: 'var(--moonlight)' }}
                    >
                      {post.readTime} MIN READ
                    </span>
                    <span
                      className="font-mono text-[11px] tracking-[0.15em] group-hover:tracking-[0.25em] transition-all duration-[var(--duration-normal)]"
                      style={{ color: 'var(--crimson-bright)' }}
                    >
                      READ →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
