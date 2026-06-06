/* MONOS - Passage Controller */
/* Wires scroll progress to the passage shader and three.js scene */

(function() {
    'use strict';

    class PassageController {
        constructor() {
            this.progress = 0;
            this.smoothedProgress = 0;
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
            this.updateProgress();
        }

        updateProgress() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            this.smoothedProgress += (this.progress - this.smoothedProgress) * 0.08;

            if (window.monosPassage) {
                window.monosPassage.setPassage(this.smoothedProgress);
            }

            if (window.monosScene) {
                window.monosScene.setPassage(this.smoothedProgress);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosPassageController = new PassageController();
        });
    } else {
        window.monosPassageController = new PassageController();
    }
})();
