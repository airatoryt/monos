/* MONOS - Burst Effect */
/* Enhanced "Balemoon Rising" cinematic burst */

(function() {
    'use strict';

    const BASE = (() => {
        const path = window.location.pathname;
        const inSubpage = path.includes('/blog/') || path.includes('/admin/');
        return inSubpage ? '../' : '';
    })();

    let burstAudio = null;
    let whooshAudio = null;
    let rumbleAudio = null;

    function initBurstAudio() {
        burstAudio = new Audio(BASE + 'assets/audio/burst.mp3');
        burstAudio.volume = 0.4;
        burstAudio.preload = 'auto';

        whooshAudio = new Audio(BASE + 'assets/audio/whoosh.mp3');
        whooshAudio.volume = 0.3;
        whooshAudio.preload = 'auto';

        rumbleAudio = new Audio(BASE + 'assets/audio/rumble.mp3');
        rumbleAudio.volume = 0.3;
        rumbleAudio.preload = 'auto';
    }

    function playBurstSound() {
        if (!burstAudio) initBurstAudio();
        try {
            burstAudio.currentTime = 0;
            burstAudio.play().catch(() => {});
        } catch (e) {}
    }

    function playWhooshSound() {
        if (!whooshAudio) initBurstAudio();
        try {
            whooshAudio.currentTime = 0;
            whooshAudio.play().catch(() => {});
        } catch (e) {}
    }

    function playRumbleSound() {
        if (!rumbleAudio) initBurstAudio();
        try {
            rumbleAudio.currentTime = 0;
            rumbleAudio.play().catch(() => {});
        } catch (e) {}
    }

    function triggerBurst() {
        const { elements, state, CONFIG } = window.monosState;
        if (!elements.burstOverlay || state.burstActive) return;

        state.burstActive = true;
        elements.burstOverlay.classList.add('active');

        // Trigger chromatic aberration
        const ca = document.getElementById('chromaticOverlay');
        if (ca) {
            ca.classList.add('active');
            setTimeout(() => ca.classList.remove('active'), 800);
        }

        // Play sounds in sequence
        playRumbleSound();
        setTimeout(playWhooshSound, 100);
        setTimeout(playBurstSound, 300);

        // Create burst particles
        createBurstParticles();

        // Screen shake
        document.body.classList.add('animate-screen-shake');

        // Remove after animation
        setTimeout(() => {
            elements.burstOverlay.classList.remove('active');
            document.body.classList.remove('animate-screen-shake');
            state.burstActive = false;

            // Clear particles
            if (elements.burstParticles) {
                elements.burstParticles.innerHTML = '';
            }
        }, CONFIG.bloom.duration);
    }

    function createBurstParticles() {
        const { elements, state } = window.monosState;
        if (!elements.burstParticles) return;

        const particleCount = state.isMobile ? 40 : 80;
        elements.burstParticles.innerHTML = '';

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';

            const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.5);
            const distance = 150 + Math.random() * 300;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animation = `burstParticleFly 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
            particle.style.animationDelay = (Math.random() * 0.2) + 's';

            elements.burstParticles.appendChild(particle);
        }
    }

    // Initialize audio on user interaction
    document.addEventListener('click', initBurstAudio, { once: true });
    document.addEventListener('keydown', initBurstAudio, { once: true });

    window.monosBurst = { triggerBurst };

})();
