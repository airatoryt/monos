import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Cursor } from '@/components/Cursor';
import { ThreeBackground } from '@/components/ThreeBackground';
import { AudioSystem } from '@/components/AudioSystem';
import { BurstOverlay } from '@/components/BurstOverlay';
import { Loader } from '@/components/Loader';
import { PassageOverlay } from '@/components/PassageOverlay';

export const metadata: Metadata = {
  title: 'MONOS — The Crimson Singularity',
  description:
    'Where all universes collapse into a single point. An immersive cosmic experience exploring the philosophy of Monism.',
  metadataBase: new URL('https://monos.vercel.app'),
  openGraph: {
    title: 'MONOS — The Crimson Singularity',
    description:
      'Where all universes collapse into a single point. An immersive cosmic experience exploring the philosophy of Monism.',
    url: 'https://monos.vercel.app',
    siteName: 'MONOS',
    images: [
      {
        url: '/assets/images/sigil-static.svg',
        width: 200,
        height: 200,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONOS — The Crimson Singularity',
    description:
      'Where all universes collapse into a single point. An immersive cosmic experience exploring the philosophy of Monism.',
    images: ['/assets/images/sigil-static.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-bone">
      <body className="min-h-screen overflow-x-hidden antialiased">
        <Loader />
        <Cursor />
        <Nav />
        <ThreeBackground />
        <AudioSystem />
        <BurstOverlay />
        <PassageOverlay />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
