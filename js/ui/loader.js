/* MONOS - Loader */
/* Loading screen sequence with sigil animation */

(function() {
    'use strict';

    let progress = 0;
    let startTime = Date.now();

    function initLoader() {
        const { elements, state, CONFIG } = window.monosState;
        if (!elements.loadingScreen) return;

        animateProgress();
    }

    function animateProgress() {
        const { elements, CONFIG } = window.monosState;
        if (!elements.loadingProgress) return;

        const elapsed = Date.now() - startTime;
        const timeProgress = Math.min(elapsed / CONFIG.loading.duration, 1);
        const randomProgress = Math.random() * 0.15;

        progress = Math.min(timeProgress * 0.7 + randomProgress, 1);
        elements.loadingProgress.style.width = (progress * 100) + '%';

        if (progress < 1) {
            requestAnimationFrame(animateProgress);
        } else {
            setTimeout(hideLoader, CONFIG.loading.minDisplayTime - elapsed > 0 ? CONFIG.loading.minDisplayTime - elapsed : 200);
        }
    }

    function hideLoader() {
        const { elements, state } = window.monosState;
        if (!elements.loadingScreen) return;

        elements.loadingScreen.classList.add('hidden');
        state.loaded = true;

        // Trigger page animations
        document.body.classList.add('loaded');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('monos:loaded'));
    }

    document.addEventListener('DOMContentLoaded', initLoader);

})();
