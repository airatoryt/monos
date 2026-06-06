/* MONOS - Depth Parallax */
/* Mouse-driven depth parallax for hero layers (igloo.inc inspired) */

(function() {
    'use strict';

    class DepthParallax {
        constructor() {
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetX = 0;
            this.targetY = 0;

            this.layers = [];

            this.init();
        }

        init() {
            this.collectLayers();
            this.bindEvents();
            this.animate();
        }

        collectLayers() {
            const selectors = [
                { sel: '.crimson-moon', depth: 18 },
                { sel: '.hero-content', depth: 8 },
                { sel: '.hero-sigil', depth: 24 },
                { sel: '.title', depth: 14 },
                { sel: '.subtitle', depth: 6 },
                { sel: '.tagline', depth: 4 },
                { sel: '.thorn-container', depth: 30 },
                { sel: '.scroll-prompt', depth: 2 }
            ];

            selectors.forEach(({ sel, depth }) => {
                const el = document.querySelector(sel);
                if (el) {
                    this.layers.push({ el, depth });
                }
            });
        }

        bindEvents() {
            window.addEventListener('mousemove', (e) => {
                this.targetX = (e.clientX / window.innerWidth) * 2 - 1;
                this.targetY = -((e.clientY / window.innerHeight) * 2 - 1);
            });
        }

        animate() {
            this.mouseX += (this.targetX - this.mouseX) * 0.05;
            this.mouseY += (this.targetY - this.mouseY) * 0.05;

            this.layers.forEach(({ el, depth }) => {
                el.style.setProperty('--parallax-x', (this.mouseX * depth).toFixed(2));
                el.style.setProperty('--parallax-y', (this.mouseY * depth).toFixed(2));
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosParallax = new DepthParallax();
        });
    } else {
        window.monosParallax = new DepthParallax();
    }
})();
