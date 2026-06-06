/* MONOS - Contact Form */
/* Unique interactive contact form with character counter, validation, success state */

(function() {
    'use strict';

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const submitBtn = document.getElementById('submitBtn');
        const successEl = document.getElementById('formSuccess');
        const charCount = document.getElementById('charCount');
        const messageEl = document.getElementById('message');

        // Character counter for message
        if (messageEl && charCount) {
            const counter = messageEl.parentElement.querySelector('.form-counter');
            messageEl.addEventListener('input', () => {
                const len = messageEl.value.length;
                charCount.textContent = len;
                if (counter) {
                    counter.classList.toggle('warn', len > 400);
                }
            });
        }

        // Live validation: add 'valid' class on blur if field is filled
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                if (field.value.trim() !== '') {
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                }
            });

            field.addEventListener('input', () => {
                field.classList.remove('invalid');
            });
        });

        // Submit handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate
            let valid = true;
            fields.forEach(field => {
                if (!field.checkValidity()) {
                    field.classList.add('invalid');
                    valid = false;
                }
            });

            if (!valid) return;

            // Show loading
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate transmission (no real backend)
            await new Promise(r => setTimeout(r, 1500));

            // Hide form, show success
            Array.from(form.children).forEach(child => {
                if (!child.classList.contains('form-success')) {
                    child.style.transition = 'opacity 0.6s, transform 0.6s';
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(-20px)';
                }
            });

            setTimeout(() => {
                Array.from(form.children).forEach(child => {
                    if (!child.classList.contains('form-success')) {
                        child.style.display = 'none';
                    }
                });
                successEl.classList.add('visible');
            }, 700);

            // Optional: trigger burst on success
            if (window.monosBurst && window.monosBurst.triggerBurst) {
                setTimeout(() => {
                    window.monosBurst.triggerBurst({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2
                    });
                }, 500);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }
})();
