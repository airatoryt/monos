/* MONOS - Main JavaScript */
/* Application initialization and core logic */

(function() {
    'use strict';
    
    // ========== CONFIGURATION ==========
    const CONFIG = {
        loading: {
            duration: 2500
        },
        particles: {
            count: window.innerWidth < 768 ? 500 : 1500,
            colors: [0xFF0000, 0x511720, 0xDDD3E3, 0x8B0000]
        },
        cursor: {
            trailEnabled: true,
            trailLength: 8
        },
        audio: {
            volume: 0.25,
            autoPlay: true
        }
    };
    
    // ========== STATE ==========
    const state = {
        loaded: false,
        currentPage: 0,
        scrollProgress: 0,
        mouseX: 0,
        mouseY: 0,
        isMobile: window.innerWidth < 768,
        audioPlaying: false
    };
    
    // ========== DOM ELEMENTS ==========
    const elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        loadingProgress: document.querySelector('.loading-progress'),
        canvas: document.getElementById('canvasContainer'),
        cursor: document.getElementById('cursor'),
        cursorDot: document.querySelector('.cursor-dot'),
        cursorRing: document.querySelector('.cursor-ring'),
        cursorCross: document.querySelector('.cursor-cross'),
        cursorTrail: document.getElementById('cursorTrail'),
        nav: document.getElementById('nav'),
        navLinks: document.querySelectorAll('.nav-link'),
        audioControl: document.getElementById('audioControl'),
        audioBtn: document.getElementById('audioBtn'),
        burstOverlay: document.getElementById('burstOverlay'),
        burstParticles: document.getElementById('burstParticles'),
        scrollPrompt: document.getElementById('scrollPrompt'),
        thornsContainer: document.getElementById('thorns'),
        thornRing: document.getElementById('thornRing'),
        pages: document.querySelectorAll('.page'),
        contactForm: document.getElementById('contactForm')
    };
    
    // ========== LOADING SCREEN ==========
    function initLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(hideLoading, 500);
            }
            elements.loadingProgress.style.width = progress + '%';
        }, CONFIG.loading.duration / 10);
    }
    
    function hideLoading() {
        elements.loadingScreen.classList.add('hidden');
        state.loaded = true;
        initAnimations();
    }
    
    // ========== CUSTOM CURSOR ==========
    function initCursor() {
        if (state.isMobile) return;
        
        let trailIndex = 0;
        
        document.addEventListener('mousemove', (e) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
            
            // Update cursor position
            elements.cursorDot.style.left = e.clientX + 'px';
            elements.cursorDot.style.top = e.clientY + 'px';
            elements.cursorRing.style.left = e.clientX + 'px';
            elements.cursorRing.style.top = e.clientY + 'px';
            elements.cursorCross.style.left = e.clientX + 'px';
            elements.cursorCross.style.top = e.clientY + 'px';
            
            // Create trail particle
            if (CONFIG.cursor.trailEnabled && state.loaded) {
                createTrailParticle(e.clientX, e.clientY);
            }
        });
        
        // Cursor hover states
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => elements.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => elements.cursor.classList.remove('hover'));
        });
        
        // Cursor click state
        document.addEventListener('mousedown', () => elements.cursor.classList.add('click'));
        document.addEventListener('mouseup', () => elements.cursor.classList.remove('click'));
        
        // Cursor leave/enter window
        document.addEventListener('mouseleave', () => elements.cursor.classList.add('hidden'));
        document.addEventListener('mouseenter', () => elements.cursor.classList.remove('hidden'));
    }
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        elements.cursorTrail.appendChild(particle);
        
        setTimeout(() => particle.remove(), 500);
    }
    
    // ========== THORN GENERATION ==========
    function generateThorns() {
        const container = elements.thornsContainer;
        const count = state.isMobile ? 12 : 24;
        
        for (let i = 0; i < count; i++) {
            const thorn = document.createElement('div');
            thorn.className = 'thorn';
            const angle = (i / count) * 360;
            const distance = 250 + Math.random() * 50;
            thorn.style.transform = `rotate(${angle}deg) translateY(-${distance}px)`;
            thorn.style.setProperty('--height', (40 + Math.random() * 40) + 'px');
            container.appendChild(thorn);
        }
    }
    
    function generateRingThorns() {
        const container = elements.thornRing;
        const count = state.isMobile ? 8 : 16;
        
        for (let i = 0; i < count; i++) {
            const thorn = document.createElement('div');
            thorn.className = 'ring-thorn';
            const angle = (i / count) * 360;
            thorn.style.transform = `rotate(${angle}deg) translateY(-160px)`;
            container.appendChild(thorn);
        }
    }
    
    // ========== NAVIGATION ==========
    function initNavigation() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                const target = elements.pages[page];
                target.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', updateActiveNav);
    }
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        elements.pages.forEach((page, index) => {
            const top = page.offsetTop;
            const bottom = top + page.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                elements.navLinks.forEach(link => link.classList.remove('active'));
                elements.navLinks[index].classList.add('active');
                state.currentPage = index;
            }
        });
    }
    
    // ========== AUDIO ==========
    function initAudio() {
        // Create audio element
        const audio = new Audio('assets/audio/ambient-cosmic.mp3');
        audio.loop = true;
        audio.volume = CONFIG.audio.volume;
        
        let audioInitialized = false;
        
        elements.audioBtn.addEventListener('click', () => {
            if (!audioInitialized) {
                audio.play().then(() => {
                    state.audioPlaying = true;
                    audioInitialized = true;
                }).catch(e => console.log('Audio play prevented:', e));
            } else {
                if (state.audioPlaying) {
                    audio.pause();
                    state.audioPlaying = false;
                    elements.audioBtn.classList.add('muted');
                    elements.audioControl.classList.add('muted');
                } else {
                    audio.play();
                    state.audioPlaying = true;
                    elements.audioBtn.classList.remove('muted');
                    elements.audioControl.classList.remove('muted');
                }
            }
        });
        
        // Auto-play on first interaction
        document.addEventListener('click', function autoPlay() {
            if (CONFIG.audio.autoPlay && !audioInitialized) {
                audio.play().then(() => {
                    state.audioPlaying = true;
                    audioInitialized = true;
                }).catch(e => console.log('Auto-play prevented:', e));
            }
            document.removeEventListener('click', autoPlay);
        }, { once: true });
    }
    
    // ========== BURST EFFECT ==========
    function triggerBurst() {
        elements.burstOverlay.classList.add('active');
        
        // Create burst particles
        const particleCount = state.isMobile ? 30 : 60;
        elements.burstParticles.innerHTML = '';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.animationDelay = Math.random() * 0.2 + 's';
            
            elements.burstParticles.appendChild(particle);
        }
        
        // Animate wings
        const wings = elements.burstOverlay.querySelectorAll('.burst-wing');
        wings.forEach(wing => {
            wing.style.animation = 'burstWingSpread 1s ease forwards';
        });
        
        // Flash
        const flash = elements.burstOverlay.querySelector('.burst-flash');
        flash.style.animation = 'burstFlash 0.8s ease forwards';
        
        // Hide after animation
        setTimeout(() => {
            elements.burstOverlay.classList.remove('active');
            wings.forEach(wing => wing.style.animation = '');
            flash.style.animation = '';
        }, 1200);
    }
    
    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        // Hide scroll prompt after scrolling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                elements.scrollPrompt.style.opacity = '0';
            } else {
                elements.scrollPrompt.style.opacity = '1';
            }
        });
        
        // Parallax for crimson moon
        window.addEventListener('scroll', () => {
            const moon = document.querySelector('.crimson-moon');
            if (moon) {
                const scrolled = window.scrollY;
                moon.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
                moon.style.opacity = Math.max(0.1, 0.4 - scrolled * 0.001);
            }
        });
        
        // Thorn animation on scroll
        const thorns = document.querySelectorAll('.thorn');
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            thorns.forEach((thorn, i) => {
                const delay = i * 0.05;
                const progress = Math.min(1, Math.max(0, (scrolled - 200) / 500));
                thorn.style.opacity = progress * 0.8;
                thorn.style.height = progress * parseInt(thorn.style.getPropertyValue('--height')) + 'px';
            });
        });
    }
    
    // ========== INITIALIZATION ANIMATIONS ==========
    function initAnimations() {
        // Animate title
        const title = document.querySelector('.title');
        if (title) {
            title.style.animation = 'titleGlitch 0.5s ease, titlePulse 3s ease-in-out infinite 0.5s';
        }
        
        // Animate subtitle
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.animation = 'fadeInUp 1s ease forwards';
            }, 800);
        }
        
        // Animate tagline
        const tagline = document.querySelector('.tagline');
        if (tagline) {
            setTimeout(() => {
                tagline.style.opacity = '1';
                tagline.style.animation = 'fadeInUp 1s ease forwards';
            }, 1200);
        }
        
        // Animate scroll prompt
        if (elements.scrollPrompt) {
            setTimeout(() => {
                elements.scrollPrompt.style.opacity = '1';
                elements.scrollPrompt.style.animation = 'scrollBounce 2s ease-in-out infinite';
            }, 1800);
        }
    }
    
    // ========== CONTACT FORM ==========
    function initContactForm() {
        if (!elements.contactForm) return;
        
        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Trigger burst effect on submit
            triggerBurst();
            
            // Show success (in real implementation, this would send to a server)
            setTimeout(() => {
                alert('Message received. The void acknowledges your presence.');
                elements.contactForm.reset();
            }, 1500);
        });
    }
    
    // ========== BURST TRIGGER ON SCROLL ==========
    function initBurstTrigger() {
        const burstTrigger = document.getElementById('burstTrigger');
        if (!burstTrigger) return;
        
        let burstTriggered = false;
        
        window.addEventListener('scroll', () => {
            const rect = burstTrigger.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.5 && rect.bottom > 0 && !burstTriggered) {
                burstTriggered = true;
                triggerBurst();
            }
        });
    }
    
    // ========== RESIZE HANDLER ==========
    function initResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                state.isMobile = window.innerWidth < 768;
                // Reinitialize three.js scene if needed
                if (window.monosScene) {
                    window.monosScene.resize();
                }
            }, 250);
        });
    }
    
    // ========== KEYBOARD NAVIGATION ==========
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Navigate with arrow keys
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextPage = Math.min(state.currentPage + 1, elements.pages.length - 1);
                elements.pages[nextPage].scrollIntoView({ behavior: 'smooth' });
            }
            
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevPage = Math.max(state.currentPage - 1, 0);
                elements.pages[prevPage].scrollIntoView({ behavior: 'smooth' });
            }
            
            // Toggle audio with 'M' key
            if (e.key === 'm' || e.key === 'M') {
                elements.audioBtn.click();
            }
        });
    }
    
    // ========== PUBLIC API ==========
    window.monosApp = {
        triggerBurst,
        getState: () => state,
        getElements: () => elements,
        getConfig: () => CONFIG
    };
    
    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        initLoading();
        initCursor();
        generateThorns();
        generateRingThorns();
        initNavigation();
        initAudio();
        initScrollAnimations();
        initContactForm();
        initBurstTrigger();
        initResizeHandler();
        initKeyboardNav();
    });
})();
