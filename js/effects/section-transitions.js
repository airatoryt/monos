/* MONOS - Section Color Transitions */
/* Subtle color crossfades as you scroll between sections */

(function() {
    'use strict';

    class SectionTransitions {
        constructor() {
            this.sections = [
                { el: document.querySelector('.page-home'), progress: 0.0 },
                { el: document.querySelector('.page-multiverse'), progress: 0.27 },
                { el: document.querySelector('.page-collapse'), progress: 0.55 },
                { el: document.querySelector('.page-point'), progress: 0.82 }
            ].filter(s => s.el);

            if (this.sections.length < 2) return;

            this.scrollProgress = 0;
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
            this.updateProgress();
        }

        updateProgress() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        }

        getActiveSection() {
            let active = 0;
            for (let i = 0; i < this.sections.length; i++) {
                if (this.scrollProgress >= this.sections[i].progress) {
                    active = i;
                } else {
                    break;
                }
            }
            return active;
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const activeIdx = this.getActiveSection();

            // Apply blend mode only between active and next section
            for (let i = 0; i < this.sections.length; i++) {
                const section = this.sections[i];
                if (!section.el) continue;

                if (i === activeIdx) {
                    section.el.style.opacity = '1';
                    section.el.style.filter = 'none';
                } else if (i === activeIdx + 1) {
                    // Next section fading in
                    const nextProgress = this.sections[i].progress;
                    const localT = (this.scrollProgress - this.sections[activeIdx].progress) /
                                   (nextProgress - this.sections[activeIdx].progress);
                    const opacity = Math.max(0, Math.min(1, (localT - 0.7) / 0.3));
                    section.el.style.opacity = opacity.toFixed(3);
                    section.el.style.filter = `blur(${(1 - opacity) * 4}px)`;
                } else {
                    section.el.style.opacity = '0';
                    section.el.style.filter = 'none';
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosSectionTransitions = new SectionTransitions();
        });
    } else {
        window.monosSectionTransitions = new SectionTransitions();
    }
})();
