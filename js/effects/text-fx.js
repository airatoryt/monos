/* MONOS - Text Scramble & Glitch */
/* Character scramble effect (igloo.inc WebGL UI inspired, JS version) */

(function() {
    'use strict';

    const CHARS = '!<>-_\\/[]{}—=+*^?#________';
    const SCRAMBLE_DURATION = 600;
    const FRAME_RATE = 35;

    function scramble(el, finalText, options = {}) {
        const duration = options.duration || SCRAMBLE_DURATION;
        const startTime = performance.now();
        const length = finalText.length;

        let frame = 0;
        const totalFrames = Math.round((duration / 1000) * FRAME_RATE);
        const queue = [];

        for (let i = 0; i < length; i++) {
            queue.push({
                from: '',
                to: finalText[i],
                start: Math.random() * duration * 0.6,
                end: duration * 0.4 + Math.random() * duration * 0.6
            });
        }

        function update() {
            const elapsed = performance.now() - startTime;
            let output = '';
            let done = 0;

            for (let i = 0; i < length; i++) {
                const q = queue[i];
                if (elapsed >= q.end) {
                    output += q.to;
                    done++;
                } else if (elapsed >= q.start) {
                    if (!q.from || Math.random() < 0.28) {
                        q.from = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                    output += q.from;
                } else {
                    output += '';
                }
            }

            el.textContent = output;

            if (done < length) {
                frame++;
                setTimeout(update, 1000 / FRAME_RATE);
            } else {
                el.textContent = finalText;
                if (options.onComplete) options.onComplete();
            }
        }

        update();
    }

    function glitchReveal(el, finalText) {
        el.classList.add('glitching');
        el.dataset.text = finalText;

        setTimeout(() => {
            el.classList.remove('glitching');
            el.classList.add('glitched');
            el.textContent = finalText;
        }, SCRAMBLE_DURATION + 200);
    }

    window.monosTextFx = { scramble, glitchReveal };

    document.addEventListener('DOMContentLoaded', () => {
        const monosTitle = document.querySelector('.title');
        if (!monosTitle) return;

        const finalHTML = monosTitle.innerHTML;
        const finalText = monosTitle.dataset.scramble || monosTitle.dataset.text || monosTitle.textContent.trim();

        const triggerReveal = () => {
            monosTitle.innerHTML = '';
            monosTitle.classList.add('glitching');
            monosTitle.dataset.text = finalText;

            setTimeout(() => {
                scramble(monosTitle, finalText, {
                    duration: 900,
                    onComplete: () => {
                        monosTitle.classList.remove('glitching');
                        monosTitle.classList.add('revealed');
                        monosTitle.innerHTML = finalHTML;
                    }
                });
            }, 250);
        };

        if (window.monosState && window.monosState.state) {
            const checkLoaded = setInterval(() => {
                if (window.monosState.state.loaded) {
                    clearInterval(checkLoaded);
                    triggerReveal();
                }
            }, 50);
            setTimeout(() => clearInterval(checkLoaded), 6000);
        } else {
            setTimeout(triggerReveal, 3000);
        }

        document.querySelectorAll('.nav-link, .morph-link').forEach(link => {
            const original = link.textContent;
            let hoverInterval = null;
            let isHovering = false;

            link.addEventListener('mouseenter', () => {
                isHovering = true;
                scramble(link, original, { duration: 350 });
            });

            link.addEventListener('mouseleave', () => {
                isHovering = false;
                link.textContent = original;
            });
        });
    });
})();
