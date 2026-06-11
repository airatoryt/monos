'use client';

import { useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const charCount = message.length;
  const isWarning = charCount >= 400;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (typeof window !== 'undefined' && (window as any).monosBurst?.triggerBurst) {
        (window as any).monosBurst.triggerBurst();
      }
    }, 1500);
  };

  return (
    <section
      className="relative w-full max-w-2xl mx-auto px-6 py-16"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {/* Corner brackets */}
      <div
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          boxShadow: 'inset 3px 3px 0 0 var(--crimson-bright)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          boxShadow: 'inset -3px 3px 0 0 var(--crimson-bright)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          boxShadow: 'inset 3px -3px 0 0 var(--crimson-bright)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          boxShadow: 'inset -3px -3px 0 0 var(--crimson-bright)',
        }}
      />

      <div className="text-center mb-10">
        <h2
          className="font-point text-3xl tracking-[0.1em]"
          style={{
            color: 'var(--crimson-bright)',
            textShadow: '0 0 20px var(--crimson-bright)',
          }}
        >
          REACH INTO THE VOID
        </h2>
        <p
          className="font-mono text-xs tracking-[0.3em] mt-3"
          style={{ color: 'var(--moonlight)' }}
        >
          Initiate Communication Channel
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
        style={{
          opacity: submitted ? 0 : 1,
          transition: `opacity var(--duration-slow, 0.6s) var(--ease-cosmic)`,
          pointerEvents: submitted ? 'none' : 'auto',
        }}
      >
        {/* Identification */}
        <div className="relative group">
          <label
            className="absolute -top-2.5 left-3 px-2 text-[11px] tracking-[0.2em] z-10"
            style={{
              color: 'var(--moonlight)',
              background: 'var(--section-point-bg)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            IDENTIFICATION
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none transition-all duration-[var(--duration-normal)] ease-[var(--ease-cosmic)] rounded-none"
            style={{
              background: 'var(--void-2)',
              borderLeft: '2px solid var(--crimson-bright)',
              color: 'var(--bone)',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px var(--crimson-bright), 0 0 24px var(--crimson-base)';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-glow)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-bright)';
            }}
          />
        </div>

        {/* Signal Origin */}
        <div className="relative group">
          <label
            className="absolute -top-2.5 left-3 px-2 text-[11px] tracking-[0.2em] z-10"
            style={{
              color: 'var(--moonlight)',
              background: 'var(--section-point-bg)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            SIGNAL ORIGIN
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none transition-all duration-[var(--duration-normal)] ease-[var(--ease-cosmic)] rounded-none"
            style={{
              background: 'var(--void-2)',
              borderLeft: '2px solid var(--crimson-bright)',
              color: 'var(--bone)',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px var(--crimson-bright), 0 0 24px var(--crimson-base)';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-glow)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-bright)';
            }}
          />
        </div>

        {/* Transmission */}
        <div className="relative group">
          <label
            className="absolute -top-2.5 left-3 px-2 text-[11px] tracking-[0.2em] z-10"
            style={{
              color: 'var(--moonlight)',
              background: 'var(--section-point-bg)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            TRANSMISSION
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            rows={5}
            className="w-full px-4 py-3 text-sm outline-none resize-none transition-all duration-[var(--duration-normal)] ease-[var(--ease-cosmic)] rounded-none"
            style={{
              background: 'var(--void-2)',
              borderLeft: '2px solid var(--crimson-bright)',
              color: 'var(--bone)',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px var(--crimson-bright), 0 0 24px var(--crimson-base)';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-glow)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderLeftColor = 'var(--crimson-bright)';
            }}
          />
          <div
            className="absolute bottom-2 right-3 font-mono text-[11px] tracking-[0.1em] transition-colors duration-[var(--duration-normal)]"
            style={{
              color: isWarning ? 'var(--crimson-bright)' : 'var(--moonlight)',
            }}
          >
            {charCount}/500
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !name || !email || !message}
            className="group relative flex items-center gap-3 px-8 py-3 font-mono text-sm tracking-[0.2em] transition-all duration-[var(--duration-normal)] ease-[var(--ease-cosmic)] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              color: 'var(--crimson-bright)',
              border: '1px solid var(--crimson-base)',
              background: 'transparent',
            }}
          >
            {loading ? (
              <span
                className="block w-3.5 h-3.5 rounded-full animate-spin"
                style={{
                  border: '2px solid var(--void-4)',
                  borderTopColor: 'var(--crimson-bright)',
                }}
              />
            ) : null}
            <span className="group-hover:tracking-[0.3em] transition-all duration-[var(--duration-normal)]">
              TRANSMIT
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-[var(--duration-normal)]">
              →
            </span>
          </button>
        </div>
      </form>

      {/* Success state */}
      {submitted && (
        <div
          className="flex flex-col items-center gap-6 text-center animate-fadeIn"
          style={{
            animation: 'contactFadeIn 0.6s var(--ease-cosmic) forwards',
          }}
        >
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ animation: 'sigilRotate 6s linear infinite' }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ color: 'var(--crimson-bright)' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="20" />
              <line x1="50" y1="5" x2="50" y2="95" />
              <line x1="5" y1="50" x2="95" y2="50" />
            </svg>
          </div>
          <h3
            className="font-point text-2xl tracking-[0.15em]"
            style={{
              color: 'var(--crimson-bright)',
              textShadow: '0 0 20px var(--crimson-bright)',
            }}
          >
            SIGNAL RECEIVED
          </h3>
          <p
            className="font-mono text-sm max-w-md"
            style={{ color: 'var(--moonlight)' }}
          >
            Your transmission has been absorbed into the void. The One has heard.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes contactFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
