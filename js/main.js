/* MONOS - Main JavaScript */
/* Application initialization and orchestration */

(function() {
    'use strict';

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        window.monosState.initElements();
        initNavigation();
        generateThorns();
        generateRingThorns();
        initContactForm();
        initBurstTriggers();
        initKeyboardNav();
        initAudioPlayer();
    });

    // ========== NAVIGATION ==========
    function initNavigation() {
        const { elements } = window.monosState;
        if (!elements.navLinks) return;

        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', updateActiveNav);
    }

    function updateActiveNav() {
        const { elements } = window.monosState;
        if (!elements.navLinks || !elements.pages) return;

        const scrollPos = window.scrollY + window.innerHeight / 2;

        elements.pages.forEach((page, index) => {
            const top = page.offsetTop;
            const bottom = top + page.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                elements.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-page="${index}"]`);
                if (activeLink) activeLink.classList.add('active');
                window.monosState.state.currentPage = index;
            }
        });
    }

    // ========== THORN GENERATION ==========
    function generateThorns() {
        const { elements, state } = window.monosState;
        const container = elements.thornsContainer;
        if (!container) return;

        const count = 32;

        for (let i = 0; i < count; i++) {
            const thorn = document.createElement('div');
            thorn.className = 'thorn';
            const angle = (i / count) * 360;
            const distance = 280 + Math.random() * 60;
            thorn.style.transform = `rotate(${angle}deg) translateY(-${distance}px)`;
            thorn.style.setProperty('--height', (50 + Math.random() * 50) + 'px');
            container.appendChild(thorn);
        }
    }

    function generateRingThorns() {
        const { elements, state } = window.monosState;
        const container = elements.thornRing;
        if (!container) return;

        const count = 24;

        for (let i = 0; i < count; i++) {
            const thorn = document.createElement('div');
            thorn.className = 'ring-thorn';
            const angle = (i / count) * 360;
            thorn.style.transform = `rotate(${angle}deg) translateY(-180px)`;
            container.appendChild(thorn);
        }
    }

    // ========== CONTACT FORM ==========
    function initContactForm() {
        const { elements } = window.monosState;
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (window.monosBurst) {
                window.monosBurst.triggerBurst();
            }

            setTimeout(() => {
                alert('Message received. The void acknowledges your presence.');
                elements.contactForm.reset();
            }, 1500);
        });
    }

    // ========== BURST TRIGGERS ==========
    function initBurstTriggers() {
        const burstTrigger = document.getElementById('burstTrigger');
        if (!burstTrigger) return;

        let triggered = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !triggered) {
                    triggered = true;
                    if (window.monosBurst) {
                        window.monosBurst.triggerBurst();
                    }
                }
            });
        }, { threshold: 0.5 });

        observer.observe(burstTrigger);
    }

    // ========== KEYBOARD NAVIGATION ==========
    function initKeyboardNav() {
        const { elements, state } = window.monosState;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                if (elements.pages && elements.pages.length > 0) {
                    e.preventDefault();
                    const nextPage = Math.min(state.currentPage + 1, elements.pages.length - 1);
                    elements.pages[nextPage]?.scrollIntoView({ behavior: 'smooth' });
                }
            }

            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                if (elements.pages && elements.pages.length > 0) {
                    e.preventDefault();
                    const prevPage = Math.max(state.currentPage - 1, 0);
                    elements.pages[prevPage]?.scrollIntoView({ behavior: 'smooth' });
                }
            }

            if (e.key === 'b' || e.key === 'B') {
                if (window.monosBurst) {
                    window.monosBurst.triggerBurst();
                }
            }

            if (e.key === 'm' || e.key === 'M') {
                if (elements.audioBtn) {
                    elements.audioBtn.click();
                }
            }
        });
    }

    // ========== AUDIO PLAYER ==========
    function initAudioPlayer() {
        const { elements, state } = window.monosState;
        const audio = document.getElementById('ambientAudio');
        if (!audio || !elements.audioBtn) return;

        audio.volume = 0.35;

        // Try immediate autoplay (may be blocked until first user interaction)
        const tryAutoplay = () => {
            audio.play().then(() => {
                elements.audioBtn.classList.remove('muted');
                state.audioPlaying = true;
            }).catch(() => {
                // Autoplay blocked — wait for first user interaction
                state.audioPlaying = false;
                elements.audioBtn.classList.add('muted');
                showAudioPrompt();
            });
        };

        // Show a small prompt that disappears once user clicks anywhere
        const showAudioPrompt = () => {
            const prompt = document.getElementById('audioPrompt');
            if (!prompt) return;
            prompt.classList.add('visible');
            const startOnClick = () => {
                audio.play().then(() => {
                    elements.audioBtn.classList.remove('muted');
                    state.audioPlaying = true;
                    prompt.classList.remove('visible');
                }).catch(() => {});
                document.removeEventListener('click', startOnClick);
                document.removeEventListener('keydown', startOnClick);
            };
            document.addEventListener('click', startOnClick, { once: true });
            document.addEventListener('keydown', startOnClick, { once: true });
        };

        // Attempt after page loads
        if (document.readyState === 'complete') {
            tryAutoplay();
        } else {
            window.addEventListener('load', tryAutoplay);
        }

        // Manual toggle button
        elements.audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.audioPlaying) {
                audio.pause();
                elements.audioBtn.classList.add('muted');
                state.audioPlaying = false;
            } else {
                audio.play().then(() => {
                    elements.audioBtn.classList.remove('muted');
                    state.audioPlaying = true;
                }).catch(() => {});
            }
        });
    }

})();
