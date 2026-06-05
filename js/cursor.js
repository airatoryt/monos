/* MONOS - Custom Cursor */
/* Cross/X cursor with trail effects */

(function() {
    'use strict';
    
    // ========== CURSOR CONFIGURATION ==========
    const CURSOR_CONFIG = {
        trail: {
            enabled: true,
            length: 10,
            interval: 30,
            colors: ['#FF0000', '#511720', '#FF4444']
        },
        effects: {
            hoverScale: 1.5,
            clickScale: 0.5,
            ringExpand: 25
        }
    };
    
    // ========== CURSOR CLASS ==========
    class MonosCursor {
        constructor() {
            this.isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
            
            if (this.isMobile) {
                this.hideCursor();
                return;
            }
            
            this.cursor = document.getElementById('cursor');
            this.cursorDot = document.querySelector('.cursor-dot');
            this.cursorRing = document.querySelector('.cursor-ring');
            this.cursorCross = document.querySelector('.cursor-cross');
            this.cursorTrail = document.getElementById('cursorTrail');
            
            this.mouseX = 0;
            this.mouseY = 0;
            this.dotX = 0;
            this.dotY = 0;
            this.ringX = 0;
            this.ringY = 0;
            this.crossX = 0;
            this.crossY = 0;
            
            this.trailParticles = [];
            this.lastTrailTime = 0;
            
            // Sound effects
            this.clickSound = new Audio('assets/audio/click.mp3');
            this.hoverSound = new Audio('assets/audio/hover.mp3');
            this.clickSound.volume = 0.4;
            this.hoverSound.volume = 0.2;
            
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.animate();
        }
        
        bindEvents() {
            // Mouse move
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                
                // Create trail particle
                this.createTrailParticle(e.clientX, e.clientY);
            });
            
            // Mouse down
            document.addEventListener('mousedown', () => {
                this.cursor.classList.add('click');
                this.createClickBurst();
                this.playClickSound();
            });
            
            // Mouse up
            document.addEventListener('mouseup', () => {
                this.cursor.classList.remove('click');
            });
            
            // Interactive elements hover
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"], .nav-link, .footer-link');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                    this.cursor.setAttribute('data-state', 'link');
                    this.playHoverSound();
                });
                
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                    this.cursor.removeAttribute('data-state');
                });
            });
            
            // Text input focus
            const textInputs = document.querySelectorAll('input, textarea');
            textInputs.forEach(el => {
                el.addEventListener('focus', () => {
                    this.cursor.setAttribute('data-state', 'text');
                });
                
                el.addEventListener('blur', () => {
                    this.cursor.removeAttribute('data-state');
                });
            });
            
            // Cursor leave/enter viewport
            document.addEventListener('mouseleave', () => {
                this.cursor.classList.add('hidden');
            });
            
            document.addEventListener('mouseenter', () => {
                this.cursor.classList.remove('hidden');
            });
            
            // Drag state (for future use)
            document.addEventListener('mousedown', () => {
                this.cursor.setAttribute('data-state', 'drag');
            });
            
            document.addEventListener('mouseup', () => {
                if (!this.cursor.classList.contains('hover')) {
                    this.cursor.removeAttribute('data-state');
                }
            });
        }
        
        animate() {
            // Smooth follow for dot
            this.dotX += (this.mouseX - this.dotX) * 0.2;
            this.dotY += (this.mouseY - this.dotY) * 0.2;
            
            // Slower follow for ring
            this.ringX += (this.mouseX - this.ringX) * 0.1;
            this.ringY += (this.mouseY - this.ringY) * 0.1;
            
            // Even slower follow for cross
            this.crossX += (this.mouseX - this.crossX) * 0.08;
            this.crossY += (this.mouseY - this.crossY) * 0.08;
            
            // Apply positions
            this.cursorDot.style.left = this.dotX + 'px';
            this.cursorDot.style.top = this.dotY + 'px';
            
            this.cursorRing.style.left = this.ringX + 'px';
            this.cursorRing.style.top = this.ringY + 'px';
            
            this.cursorCross.style.left = this.crossX + 'px';
            this.cursorCross.style.top = this.crossY + 'px';
            
            requestAnimationFrame(() => this.animate());
        }
        
        createTrailParticle(x, y) {
            if (!CURSOR_CONFIG.trail.enabled) return;
            
            const now = Date.now();
            if (now - this.lastTrailTime < CURSOR_CONFIG.trail.interval) return;
            
            this.lastTrailTime = now;
            
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random color from palette
            const color = CURSOR_CONFIG.trail.colors[Math.floor(Math.random() * CURSOR_CONFIG.trail.colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            
            this.cursorTrail.appendChild(particle);
            this.trailParticles.push(particle);
            
            // Remove old particles
            if (this.trailParticles.length > CURSOR_CONFIG.trail.length) {
                const oldParticle = this.trailParticles.shift();
                if (oldParticle.parentNode) {
                    oldParticle.remove();
                }
            }
            
            // Auto-remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
                const index = this.trailParticles.indexOf(particle);
                if (index > -1) {
                    this.trailParticles.splice(index, 1);
                }
            }, 500);
        }
        
        createClickBurst() {
            const burstCount = 8;
            const baseX = this.dotX;
            const baseY = this.dotY;
            
            for (let i = 0; i < burstCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'trail-particle';
                particle.style.left = baseX + 'px';
                particle.style.top = baseY + 'px';
                particle.style.width = '6px';
                particle.style.height = '6px';
                
                // Random direction
                const angle = (i / burstCount) * Math.PI * 2;
                const distance = 30 + Math.random() * 20;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                particle.style.animation = 'burstParticleFly 0.5s ease forwards';
                
                this.cursorTrail.appendChild(particle);
                
                setTimeout(() => particle.remove(), 500);
            }
        }
        
        hideCursor() {
            const cursor = document.getElementById('cursor');
            const trail = document.getElementById('cursorTrail');
            if (cursor) cursor.style.display = 'none';
            if (trail) trail.style.display = 'none';
        }
        
        // Set cursor state programmatically
        setState(state) {
            if (state) {
                this.cursor.setAttribute('data-state', state);
            } else {
                this.cursor.removeAttribute('data-state');
            }
        }
        
        // Reset cursor state
        reset() {
            this.cursor.removeAttribute('data-state');
            this.cursor.classList.remove('hover', 'click');
        }
        
        // Play click sound effect
        playClickSound() {
            try {
                this.clickSound.currentTime = 0;
                this.clickSound.play().catch(e => console.log('Click sound prevented:', e));
            } catch (e) {
                console.log('Click sound error:', e);
            }
        }
        
        // Play hover sound effect
        playHoverSound() {
            try {
                this.hoverSound.currentTime = 0;
                this.hoverSound.play().catch(e => console.log('Hover sound prevented:', e));
            } catch (e) {
                console.log('Hover sound error:', e);
            }
        }
    }
    
    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        window.monosCursor = new MonosCursor();
    });
})();
