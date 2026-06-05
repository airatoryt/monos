# MONOS — The Crimson Singularity

Where all universes collapse into a single point. An immersive cosmic experience with Arlecchino-inspired crimson moon aesthetics.

## Features

- 🌑 **3D Cosmos** — Interactive Three.js scene with particles, universe spheres, and a black hole
- 🔴 **Neon Crimson Theme** — Blood red and black color palette inspired by Arlecchino's Balemoon
- ✖️ **Custom Cross Cursor** — Animated cursor with trail effects
- 🎵 **Ambient Music** — Cosmic ambient soundtrack with fade controls
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🎬 **Scroll Animations** — GSAP ScrollTrigger powered cinematic transitions
- 💥 **Balemoon Burst** — Epic particle burst effect on scroll/page transitions

## Pages

1. **The Dire Balemoon** — Landing hero with crimson moon and title reveal
2. **The Multiverse** — 3D universe spheres floating in space
3. **The Collapse** — Everything converges to the singularity with black hole
4. **The Point** — Philosophy, contact form, and footer

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Three.js (WebGL 3D graphics)
- GSAP + ScrollTrigger (animations)
- Custom cursor system
- Responsive design

## Setup

1. Clone or download this repository
2. Open `index.html` in a browser
3. Click anywhere to enable audio
4. Scroll to explore the cosmic journey

## Deployment (Netlify)

1. Push to GitHub
2. Connect repository to Netlify
3. Set build command: (leave empty)
4. Set publish directory: `/` or `monos-website`
5. Deploy!

## Customization

### Colors
Edit CSS variables in `css/main.css`:
```css
:root {
    --neon-red: #FF0000;
    --crimson: #511720;
    --blood-red: #8B0000;
    /* ... */
}
```

### Audio
Replace `assets/audio/ambient-cosmic.mp3` with your own track.

Recommended free sources:
- [Freesound.org](https://freesound.org) (CC licensed)
- [Incompetech](https://incompetech.com) (Kevin MacLeod)
- [Pixabay Music](https://pixabay.com/music) (Royalty-free)

## File Structure

```
monos-website/
├── index.html
├── css/
│   ├── main.css
│   ├── animations.css
│   ├── cursor.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── particles.js
│   ├── three-scene.js
│   ├── scroll-animations.js
│   ├── cursor.js
│   └── audio.js
├── assets/
│   └── audio/
│       └── ambient-cosmic.mp3
└── README.md
```

## Keyboard Shortcuts

- `↑` / `←` — Previous section
- `↓` / `→` — Next section
- `M` — Toggle music

## License

Free to use. Music placeholder included - replace with your own non-copyright track.
