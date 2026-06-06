/* MONOS - Custom Cursor */
/* "The Scribe's Mark" - cross/X cursor with trail */

(function() {
    'use strict';

    const BASE = (() => {
        const path = window.location.pathname;
        const inSubpage = path.includes('/blog/') || path.includes('/admin/');
        return inSubpage ? '../' : '';
    })();

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

            this.clickSound = new Audio(BASE + 'assets/audio/click.mp3');
            this.hoverSound = new Audio(BASE + 'assets/audio/hover.mp3');
            this.clickSound.volume = 0.3;
            this.hoverSound.volume = 0.15;
            this.lastHoverTime = 0;

            this.init();
        }

        init() {
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.createTrailParticle(e.clientX, e.clientY);
            });

            document.addEventListener('mousedown', () => {
                this.cursor.classList.add('click');
                this.createClickBurst();
                this.playClickSound();
            });

            document.addEventListener('mouseup', () => {
                this.cursor.classList.remove('click');
            });

            const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"], .nav-link, .footer-link, .blog-card, .submit-btn');
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

            const textInputs = document.querySelectorAll('input, textarea');
            textInputs.forEach(el => {
                el.addEventListener('focus', () => this.cursor.setAttribute('data-state', 'text'));
                el.addEventListener('blur', () => this.cursor.removeAttribute('data-state'));
            });

            document.addEventListener('mouseleave', () => this.cursor.classList.add('hidden'));
            document.addEventListener('mouseenter', () => this.cursor.classList.remove('hidden'));
        }

        animate() {
            this.dotX += (this.mouseX - this.dotX) * 0.2;
            this.dotY += (this.mouseY - this.dotY) * 0.2;

            this.ringX += (this.mouseX - this.ringX) * 0.1;
            this.ringY += (this.mouseY - this.ringY) * 0.1;

            this.crossX += (this.mouseX - this.crossX) * 0.08;
            this.crossY += (this.mouseY - this.crossY) * 0.08;

            if (this.cursorDot) {
                this.cursorDot.style.left = this.dotX + 'px';
                this.cursorDot.style.top = this.dotY + 'px';
            }
            if (this.cursorRing) {
                this.cursorRing.style.left = this.ringX + 'px';
                this.cursorRing.style.top = this.ringY + 'px';
            }
            if (this.cursorCross) {
                this.cursorCross.style.left = this.crossX + 'px';
                this.cursorCross.style.top = this.crossY + 'px';
            }

            requestAnimationFrame(() => this.animate());
        }

        createTrailParticle(x, y) {
            const now = Date.now();
            if (now - this.lastTrailTime < 25) return;
            this.lastTrailTime = now;

            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            this.cursorTrail.appendChild(particle);
            this.trailParticles.push(particle);

            if (this.trailParticles.length > 12) {
                const old = this.trailParticles.shift();
                if (old.parentNode) old.remove();
            }

            setTimeout(() => {
                if (particle.parentNode) particle.remove();
                const idx = this.trailParticles.indexOf(particle);
                if (idx > -1) this.trailParticles.splice(idx, 1);
            }, 600);
        }

        createClickBurst() {
            const burstCount = 8;
            for (let i = 0; i < burstCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'trail-particle';
                particle.style.left = this.dotX + 'px';
                particle.style.top = this.dotY + 'px';
                particle.style.width = '6px';
                particle.style.height = '6px';

                const angle = (i / burstCount) * Math.PI * 2;
                const distance = 30 + Math.random() * 20;
                particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
                particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
                particle.style.animation = 'burstParticleFly 0.5s ease forwards';

                this.cursorTrail.appendChild(particle);
                setTimeout(() => particle.remove(), 500);
            }
        }

        playClickSound() {
            try {
                this.clickSound.currentTime = 0;
                this.clickSound.play().catch(() => {});
            } catch (e) {}
        }

        playHoverSound() {
            const now = Date.now();
            if (now - this.lastHoverTime < 100) return;
            this.lastHoverTime = now;

            try {
                this.hoverSound.currentTime = 0;
                this.hoverSound.play().catch(() => {});
            } catch (e) {}
        }

        hideCursor() {
            const cursor = document.getElementById('cursor');
            const trail = document.getElementById('cursorTrail');
            if (cursor) cursor.style.display = 'none';
            if (trail) trail.style.display = 'none';
            document.body.style.cursor = 'auto';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.monosCursor = new MonosCursor();
    });

})();
