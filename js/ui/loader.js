/* MONOS - Loader */
/* Loading screen sequence with sigil animation */

(function() {
    'use strict';

    let progress = 0;
    let startTime = Date.now();
    let animationId = null;

    function initLoader() {
        // Wait for monosState to be available
        if (!window.monosState) {
            setTimeout(initLoader, 10);
            return;
        }

        // Initialize elements if not already done
        if (window.monosState.elements.loadingScreen === null) {
            window.monosState.initElements();
        }

        const elements = window.monosState.elements;

        if (!elements.loadingScreen) {
            console.warn('Loading screen element not found, skipping loader');
            document.body.classList.add('loaded');
            return;
        }

        startTime = Date.now();
        animateProgress();
    }

    function animateProgress() {
        if (!window.monosState) return;

        const elements = window.monosState.elements;
        const CONFIG = window.monosState.CONFIG;

        if (!elements.loadingProgress) {
            // Force complete if no progress bar
            setTimeout(hideLoader, CONFIG.loading.duration);
            return;
        }

        const elapsed = Date.now() - startTime;
        const timeProgress = Math.min(elapsed / CONFIG.loading.duration, 1);

        // Use easing for smooth progression
        const easedProgress = 1 - Math.pow(1 - timeProgress, 3);
        progress = Math.min(easedProgress, 1);

        elements.loadingProgress.style.width = (progress * 100) + '%';

        if (progress < 1) {
            animationId = requestAnimationFrame(animateProgress);
        } else {
            setTimeout(hideLoader, 300);
        }
    }

    function hideLoader() {
        if (!window.monosState) return;

        const elements = window.monosState.elements;
        const state = window.monosState.state;

        if (!elements.loadingScreen) return;

        elements.loadingScreen.classList.add('hidden');
        state.loaded = true;

        // Trigger page animations
        document.body.classList.add('loaded');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('monos:loaded'));
    }

    // Fallback: ensure loader doesn't stay forever
    function safetyTimeout() {
        setTimeout(() => {
            if (window.monosState && !window.monosState.state.loaded) {
                console.warn('Loader safety timeout triggered, forcing hide');
                hideLoader();
            }
        }, 5000);
    }

    // Start loader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLoader();
            safetyTimeout();
        });
    } else {
        initLoader();
        safetyTimeout();
    }

})();
