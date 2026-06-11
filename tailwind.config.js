const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        origin: ['Cinzel', 'serif'],
        multiverse: ['"Chakra Petch"', 'sans-serif'],
        collapse: ['"Russo One"', 'sans-serif'],
        point: ['"Major Mono Display"', 'monospace'],
        brand: ['Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        accent: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        bone: '#DDD3E3',
        moonlight: '#B8A9C4',
        crimson: {
          bright: '#FF0000',
          base: '#511720',
          rich: '#8B0000',
          glow: '#FF1A6B',
          dark: '#C81E1E',
        },
        void: {
          '0': '#000000',
          '1': '#0A0A0F',
          '2': '#0F1016',
          '3': '#14151E',
          '4': '#1A1B26',
        },
      },
      backgroundImage: {
        'grad-crimson': 'linear-gradient(90deg, var(--crimson-bright) 0%, var(--crimson-base) 50%, var(--crimson-rich) 100%)',
        'grad-event': 'radial-gradient(circle at 50% 50%, var(--crimson-bright) 0%, var(--crimson-rich) 40%, transparent 70%)',
        'grad-void': 'radial-gradient(circle at 50% 50%, var(--void-3) 0%, var(--void-1) 100%)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-med': 'spin 10s linear infinite',
        'pulse-crimson': 'pulseCrimson 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'scythe': 'scytheFloat 2s ease-in-out infinite',
        'disk': 'diskSpin 3s linear infinite',
        'disk-reverse': 'diskSpin 2s linear infinite reverse',
        'horizon': 'horizonPulse 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'typewriter': 'typewriter 0.03s steps(1) infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        pulseCrimson: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scytheFloat: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
        },
        diskSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        horizonPulse: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.05)', opacity: '0.8' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'organic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
