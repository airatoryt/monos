'use client';

import { useEffect, useRef, useState } from 'react';

function getAudioBase() {
  if (typeof window === 'undefined') return '/assets/audio';
  return '/assets/audio';
}

export function AudioSystem() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isBlocked, setIsBlocked] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = getAudioBase();
    const audio = new Audio(`${base}/ambient-cosmic.mp3`);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPrompt(false);
        setIsBlocked(false);
      }).catch(() => {
        setIsBlocked(true);
      });
    };

    audio.addEventListener('canplaythrough', tryPlay, { once: true });

    const onInteraction = () => {
      if (!audioRef.current || isPlaying) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPrompt(false);
        setIsBlocked(false);
      }).catch(() => {});
    };

    document.addEventListener('click', onInteraction, { once: true });
    document.addEventListener('keydown', onInteraction, { once: true });

    return () => {
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPrompt(false);
        setIsBlocked(false);
      }).catch(() => {});
    }
  };

  const dismissPrompt = () => {
    setIsBlocked(false);
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
  };

  return (
    <>
      <div
        onClick={toggle}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9998,
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: 'rgba(20, 21, 30, 0.85)',
          backdropFilter: 'blur(12px)',
          border: 'var(--border-thin)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all var(--duration-normal) var(--ease-cosmic)',
          gap: 4,
        }}
        className="audio-btn font-mono"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="4" height="16" rx="1" fill="var(--crimson-bright)" />
            <rect x="15" y="4" width="4" height="16" rx="1" fill="var(--crimson-bright)" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="var(--moonlight)" />
            <line x1="20" y1="8" x2="20" y2="16" stroke="var(--moonlight)" strokeWidth="2" strokeLinecap="round" />
            <line x1="23" y1="5" x2="23" y2="19" stroke="var(--moonlight)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {isPlaying && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            height: 24,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 4,
                borderRadius: 2,
                background: 'var(--crimson-bright)',
                boxShadow: '0 0 6px var(--crimson-bright)',
                animation: `audioBar ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {showPrompt && (
        <div
          ref={promptRef}
          onClick={dismissPrompt}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9997,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            cursor: 'pointer',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') dismissPrompt(); }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'var(--crimson-bright)',
              boxShadow: '0 0 20px var(--crimson-bright), 0 0 40px var(--crimson-bright)',
              animation: 'sigilPulse 2s ease-in-out infinite',
            }}
          />
          <span
            className="font-mono"
            style={{
              color: 'var(--bone)',
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px var(--crimson-bright)',
              animation: 'textGlowPulse 2s ease-in-out infinite',
            }}
          >
            CLICK TO BEGIN THE TRANSMISSION
          </span>
        </div>
      )}
    </>
  );
}
