'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';
export function ScrambleText({ text, className, style }: ScrambleTextProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    
    let frameId: number;
    let currentText = '';
    let progress = 0;
    const targetText = text;
    const maxProgress = targetText.length;
    
    const animate = () => {
      if (!el) return;
      progress = Math.min(progress + 0.5, maxProgress);
      
      let output = '';
      for (let i = 0; i < targetText.length; i++) {
        if (i < Math.floor(progress)) {
          output += targetText[i];
        } else if (i === Math.floor(progress)) {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          output += ' ';
        }
      }
      el.textContent = output;
      
      if (progress < maxProgress) {
        frameId = requestAnimationFrame(animate);
      } else {
        el.textContent = targetText;
      }
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [text]);
  
  return <span ref={elRef} className={className} style={style}>{text}</span>;
}
