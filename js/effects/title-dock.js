/* MONOS - Title Repositioning */
/* Scroll-driven morph: large centered → small vertical right rail */

(function() {
    'use strict';

    class TitleDocking {
        constructor() {
            this.title = document.querySelector('.title');
            this.hero = document.querySelector('.page-home');
            this.heroContent = document.querySelector('.hero-content');
            if (!this.title || !this.hero) return;

            this.docked = false;
            this.dockProgress = 0;
            this.targetProgress = 0;

            this.init();
        }

        init() {
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.updateDockState(), { passive: true });
            window.addEventListener('resize', () => this.updateDockState());

            // Click docked title to scroll to top
            this.title.addEventListener('click', () => {
                if (this.docked) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        updateDockState() {
            // Get hero section height
            const heroRect = this.hero.getBoundingClientRect();
            const heroBottom = heroRect.bottom;
            const heroTop = heroRect.top;

            // When the hero bottom is within 50vh of the top, start docking
            // When hero bottom is fully off-screen, fully docked
            const viewportHeight = window.innerHeight;
            const dockStart = viewportHeight * 0.5;
            const dockEnd = -100; // hero is fully scrolled past

            let progress = 0;
            if (heroBottom < dockStart) {
                progress = (dockStart - heroBottom) / (dockStart - dockEnd);
                progress = Math.max(0, Math.min(1, progress));
            }

            this.targetProgress = progress;
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            this.dockProgress += (this.targetProgress - this.dockProgress) * 0.08;

            if (this.dockProgress > 0.05 && !this.docked) {
                this.docked = true;
                this.title.classList.add('docked');
            } else if (this.dockProgress <= 0.05 && this.docked) {
                this.docked = false;
                this.title.classList.remove('docked');
                this.title.style.fontSize = '';
            }

            if (this.docked) {
                this.applyDockTransform(this.dockProgress);
            }
        }

        applyDockTransform(t) {
            // Smooth easing
            const eased = t * t * (3 - 2 * t);

            // Compute target right offset and font size interpolation
            const baseSize = 10; // rem
            const dockedSize = 2.2; // rem

            // Font-size interpolation
            const sizeInterp = baseSize + (dockedSize - baseSize) * eased;
            this.title.style.fontSize = `clamp(${dockedSize}rem, ${sizeInterp}vw, ${baseSize}rem)`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosTitleDock = new TitleDocking();
        });
    } else {
        window.monosTitleDock = new TitleDocking();
    }
})();
