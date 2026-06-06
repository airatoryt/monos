/* MONOS - Blog Pages Audio Init */
/* Auto-play ambient music on blog pages with first-click fallback */

(function() {
    'use strict';

    function initBlogAudio() {
        if (!window.monosState) {
            setTimeout(initBlogAudio, 10);
            return;
        }
        window.monosState.initElements();

        const { elements, state } = window.monosState;
        const audio = document.getElementById('ambientAudio');
        if (!audio || !elements.audioBtn) return;

        audio.volume = 0.35;

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

        const tryAutoplay = () => {
            audio.play().then(() => {
                elements.audioBtn.classList.remove('muted');
                state.audioPlaying = true;
            }).catch(() => {
                state.audioPlaying = false;
                elements.audioBtn.classList.add('muted');
                showAudioPrompt();
            });
        };

        if (document.readyState === 'complete') {
            tryAutoplay();
        } else {
            window.addEventListener('load', tryAutoplay);
        }

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogAudio);
    } else {
        initBlogAudio();
    }
})();
