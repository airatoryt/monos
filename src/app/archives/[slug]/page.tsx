import { allPosts } from 'contentlayer/generated';
import { formatMonosDate, renderMarkdown } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ReadingProgress } from './ReadingProgress';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: `${post.title} — MONOS Archives`,
    description: post.excerpt || 'A transmission from the singularity.',
    openGraph: {
      title: `${post.title} — MONOS Archives`,
      description: post.excerpt || 'A transmission from the singularity.',
      type: 'article',
      publishedTime: post.date,
      images: [{ url: '/assets/images/sigil-static.svg', width: 200, height: 200 }],
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) notFound();

  const bodyHtml = renderMarkdown(post.body.raw);

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--void-1)' }}>
      <ReadingProgress />

      <div className="relative pt-32 pb-16 text-center overflow-hidden" style={{ background: 'var(--void-2)' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--crimson-bright) 0%, transparent 70%)' }}
        />
        <div className="font-mono text-xs tracking-[0.2em] mb-6" style={{ color: 'var(--moonlight)' }}>
          <span>{formatMonosDate(post.date)}</span>
          <span className="mx-3" style={{ color: 'var(--void-4)' }}>/</span>
          <span style={{ color: 'var(--crimson-bright)' }}>{post.tag}</span>
        </div>
        <h1
          className="font-origin text-[clamp(1.75rem,5vw,3.5rem)] tracking-[0.05em] leading-tight max-w-3xl mx-auto px-4"
          style={{ color: 'var(--bone)', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
        >
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="font-accent italic text-lg mt-4 max-w-xl mx-auto px-4" style={{ color: 'var(--moonlight)' }}>
            {post.subtitle}
          </p>
        )}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <div
          className="post-body"
          style={{ color: 'var(--bone)' }}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pb-20 text-center" style={{ borderTop: '1px solid var(--void-4)' }}>
        <div className="inline-flex flex-col items-center gap-4 pt-12">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ border: '2px solid var(--crimson-base)', background: 'rgba(255,0,0,0.05)', animation: 'sigilRotate 8s linear infinite' }}
          >
            <img src="/assets/images/sigil-static.svg" alt="" width={24} height={24} className="opacity-60" />
          </div>
          <p className="font-mono text-xs tracking-[0.3em]" style={{ color: 'var(--moonlight)' }}>
            TRANSMISSION COMPLETE
          </p>
          <Link
            href="/archives"
            className="font-mono text-sm tracking-[0.15em] hover:tracking-[0.25em] transition-all"
            style={{ color: 'var(--crimson-bright)' }}
          >
            ← RETURN TO ARCHIVES
          </Link>
        </div>
      </div>

    </main>
  );
}
