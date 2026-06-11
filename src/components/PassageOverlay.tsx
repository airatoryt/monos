'use client';

import { useEffect, useRef } from 'react';

export function PassageOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = () => {
      progressRef.current += (targetRef.current - progressRef.current) * 0.05;
      const p = progressRef.current;
      const w = width;
      const h = height;

      // Get Three.js canvas below
      const threeCanvas = document.querySelector('canvas');
      if (threeCanvas && threeCanvas !== canvas) {
        ctx.drawImage(threeCanvas, 0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      if (p > 0.01) {
        if (p < 0.25) {
          const alpha = Math.min(1, p / 0.25);
          ctx.fillStyle = `rgba(20, 21, 30, ${alpha * 0.3})`;
          ctx.fillRect(0, 0, w, h);
        }

        if (p >= 0.25 && p < 0.45) {
          // TEAR MODE — RGB split, scan lines, data corruption
          const intensity = (p - 0.25) / 0.2;
          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data;
          const split = Math.floor(6 * intensity);

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const i = (y * w + x) * 4;
              const ri = (y * w + Math.min(w - 1, x + split)) * 4;
              const bi = (y * w + Math.max(0, x - split)) * 4;
              data[i] = data[ri] || data[i];
              data[i + 2] = data[bi] || data[i + 2];
            }
          }

          // Scan lines
          for (let y = 0; y < h; y += 3) {
            for (let x = 0; x < w; x++) {
              const i = (y * w + x) * 4;
              data[i] = data[i] * 0.6;
              data[i + 1] = data[i + 1] * 0.6;
              data[i + 2] = data[i + 2] * 0.6;
            }
          }

          // Data corruption blocks
          if (frame % 4 === 0) {
            const bx = Math.floor(Math.random() * w);
            const by = Math.floor(Math.random() * h);
            const bw = 20 + Math.floor(Math.random() * 40);
            const bh = 2 + Math.floor(Math.random() * 6);
            for (let dy = by; dy < Math.min(h, by + bh); dy++) {
              for (let dx = bx; dx < Math.min(w, bx + bw); dx++) {
                const i = (dy * w + dx) * 4;
                data[i] = 255;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = Math.floor(180 * intensity);
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          ctx.fillStyle = `rgba(255, 0, 0, ${0.05 * intensity})`;
          ctx.fillRect(0, 0, w, h);

        } else if (p >= 0.45 && p < 0.65) {
          // SCAFFOLD MODE — grid overlay, vertex dots, inverted colors
          const intensity = (p - 0.45) / 0.2;

          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
          ctx.putImageData(imageData, 0, 0);

          ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 * intensity})`;
          ctx.lineWidth = 1;
          const step = 60;
          for (let x = 0; x < w; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          for (let x = 0; x < w; x += step) {
            for (let y = 0; y < h; y += step) {
              ctx.beginPath();
              ctx.arc(x, y, 2 * intensity, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 0, 0, ${0.6 * intensity})`;
              ctx.fill();
            }
          }

        } else if (p >= 0.65 && p < 0.85) {
          // CONVERGENCE MODE — radial collapse toward center
          const intensity = (p - 0.65) / 0.2;
          const cx = w / 2;
          const cy = h / 2;
          const maxRad = Math.sqrt(cx * cx + cy * cy);
          const radius = maxRad * (1 - intensity * 0.6);

          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(0.6, 'rgba(20, 21, 30, 0.1)');
          gradient.addColorStop(1, `rgba(20, 21, 30, ${0.9 * intensity})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, w, h);

          const imageData = ctx.getImageData(cx - radius, cy - radius, radius * 2, radius * 2);
          const distort = 1 + 0.3 * intensity;
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(canvas, cx - radius * distort, cy - radius * distort, radius * 2 * distort, radius * 2 * distort);

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 0, 0, ${0.5 * intensity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

        } else if (p >= 0.85) {
          // EMERGENCE MODE — fade out
          const alpha = (p - 0.85) / 0.15;
          ctx.fillStyle = `rgba(20, 21, 30, ${Math.max(0, 1 - alpha) * 0.5})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 4,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
