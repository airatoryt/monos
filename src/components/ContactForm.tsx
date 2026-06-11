'use client';

import { useState, useRef, useEffect } from 'react';

const SocialLink = ({ icon, onClick, platform }: {
  icon: React.ReactNode;
  onClick: () => void;
  platform: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);
    
    let animationFrame: number;
    const particles: any[] = [];
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      targetX: number;
      targetY: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 0;
        this.maxLife = 60 + Math.random() * 60;
        this.size = 2 + Math.random() * 3;
        this.color = isHovered 
          ? `hsl(${240 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`
          : `hsl(${0 + Math.random() * 30}, 80%, ${30 + Math.random() * 30}%)`;
        this.targetX = x;
        this.targetY = y;
      }
      
      update() {
        this.life++;
        const progress = this.life / this.maxLife;
        
        if (isHovered) {
          const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
          const distance = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);
          this.x += Math.cos(angle) * distance * 0.05 / (this.maxLife - this.life);
          this.y += Math.sin(angle) * distance * 0.05 / (this.maxLife - this.life);
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }
      
      draw() {
        const alpha = 1 - (this.life / this.maxLife);
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx!.fillStyle = this.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx!.fill();
      }
    }
    
    const createParticles = () => {
      particles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      if (isHovered) {
        for (let i = 0; i < 40; i++) {
          const angle = (Math.PI * 2 * i) / 40 + Date.now() * 0.001;
          const radius = 40;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          particles.push(new Particle(x, y));
        }
      } else {
        for (let i = 0; i < 20; i++) {
          particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          ));
        }
      }
    };
    
    createParticles();
    
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        if (particle.life >= particle.maxLife) {
          particles.splice(index, 1);
        }
      });
      
      if (isHovered) {
        ctx!.save();
        ctx!.globalCompositeOperation = 'screen';
        ctx!.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx!.beginPath();
        ctx!.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
        
        if (Date.now() % 120 < 60) {
          ctx!.save();
          ctx!.globalCompositeOperation = 'screen';
          ctx!.fillStyle = 'rgba(255, 100, 100, 0.2)';
          ctx!.beginPath();
          ctx!.moveTo(canvas.width / 2, canvas.height / 2);
          ctx!.lineTo(canvas.width / 2 + 60 * Math.cos(Date.now() * 0.005), 
                     canvas.height / 2 + 60 * Math.sin(Date.now() * 0.005));
          ctx!.strokeStyle = 'rgba(255, 0, 0, 0.5)';
          ctx!.lineWidth = 1;
          ctx!.stroke();
          ctx!.restore();
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [isHovered]);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group flex items-center gap-3 px-6 py-3 font-mono text-sm tracking-[0.15em] transition-all duration-300 hover:tracking-[0.25em]"
      style={{
        color: isHovered ? 'var(--crimson-bright)' : 'var(--moonlight)',
        border: `1px solid ${isHovered ? 'var(--crimson-bright)' : 'var(--void-4)'}`,
        background: isHovered ? 'rgba(255, 0, 0, 0.1)' : 'var(--void-2)',
        textShadow: isHovered ? '0 0 10px var(--crimson-bright)' : 'none',
      }}
    >
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 group-hover:text-[var(--crimson-bright)] transition-colors">
        {platform}
      </span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
    </button>
  );
};

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

        {/* Social Links with Particle Effects */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <SocialLink
            platform="DISCORD"
            onClick={() => window.open('https://discord.gg/your-server', '_blank')}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M9 12a1 1 0 1 1 2 0 1 1-2 0z" />
                <path d="M15 12a1 1 0 1 1-2 0 1 1 2 0z" />
                <path d="M13.5 15.5c-1.5 1.5-3.5 1.5-5 0" />
              </svg>
            }
          />
          <SocialLink
            platform="TELEGRAM"
            onClick={() => window.open('https://t.me/yourchannel', '_blank')}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.8 8.1L12 17.5l-3.8-4.4 2.6-2.6L16 9.1z" />
              </svg>
            }
          />
          <SocialLink
            platform="GITHUB"
            onClick={() => window.open('https://github.com/airatoryt/monos', '_blank')}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.1 7 9.3.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.4 0-2.9 0 0 1-1.3 3.3-1.3 2.4 0 4.3 1.3 3.3 1.3.2.2.4.5.4.9.1.6.2 1.2.3 1.8.2.1.3.2.5.3 1.2-.4 2.3-1.3 2.3-1.3.2-.2.3-.4.3-.7 0-.6-.3-.8-.5-1 .5-.6.8-1.4.8-2.2 0-2-1.7-3.6-4-4 0 0-.3-.2-.7-.2H7c-.4 0-.7.2-.7.2-.4.3-.5.8-.5 2 0 .8.3 1.5.8 2.2-.2.3-.3.5-.3.9-.3.2-.5.5-.5.9 0 1.3 1 2.4 2.1 2.7.3.2.4.3.5.3.3.1.5.4.5.8v3.3c0 .3.2.6.8.5 4-1.2 7-4.9 7-9.3z" />
              </svg>
            }
          />
          <SocialLink
            platform="EMAIL"
            onClick={() => window.open('mailto:your.email@example.com')}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            }
          />
        </div>

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
