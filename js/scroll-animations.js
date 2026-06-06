/* MONOS - Scroll Animations */
/* GSAP ScrollTrigger powered scroll animations */

(function() {
    'use strict';
    
    // ========== SCROLL CONFIGURATION ==========
    const SCROLL_CONFIG = {
        reveal: {
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
        },
        parallax: {
            speed: 0.5
        },
        stagger: {
            amount: 0.5
        }
    };
    
    // ========== SCROLL ANIMATIONS CLASS ==========
    class ScrollAnimations {
        constructor() {
            this.init();
        }
        
        init() {
            // Register GSAP plugins
            gsap.registerPlugin(ScrollTrigger);
            
            // Initialize all scroll animations
            this.initPageAnimations();
            this.initTextReveal();
            this.initParallax();
            this.initBurstTrigger();
            this.initThornAnimations();
            this.initBlackHoleScroll();
            this.initSingularityScroll();
            this.initContactReveal();
        }
        
        initPageAnimations() {
            // Page 1: Home - Title animation
            gsap.from('.title', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100,
                opacity: 0,
                scale: 0.8
            });
            
            gsap.from('.subtitle', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: 'top top',
                    end: '50% top',
                    scrub: true
                },
                y: 50,
                opacity: 0
            });
            
            gsap.from('.tagline', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: '20% top',
                    end: '60% top',
                    scrub: true
                },
                opacity: 0,
                scaleX: 0
            });
            
            // Scroll prompt fade out
            gsap.to('.scroll-prompt', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: '10% top',
                    end: '30% top',
                    scrub: true
                },
                opacity: 0,
                y: -50
            });
        }
        
        initTextReveal() {
            // Reveal text animations for multiverse and collapse sections
            const revealTexts = document.querySelectorAll('.reveal-text');
            
            revealTexts.forEach((text, index) => {
                gsap.fromTo(text, 
                    {
                        opacity: 0,
                        y: 50,
                        skewY: 3
                    },
                    {
                        scrollTrigger: {
                            trigger: text,
                            start: SCROLL_CONFIG.reveal.start,
                            end: SCROLL_CONFIG.reveal.end,
                            scrub: SCROLL_CONFIG.reveal.scrub
                        },
                        opacity: 1,
                        y: 0,
                        skewY: 0,
                        duration: 1
                    }
                );
            });
            
            // Section headers
            document.querySelectorAll('.section-header').forEach(header => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 80%',
                        end: 'top 40%',
                        scrub: true
                    }
                });
                
                tl.from(header.querySelector('.section-number'), {
                    opacity: 0,
                    scale: 2,
                    duration: 0.5
                })
                .from(header.querySelector('.section-title'), {
                    opacity: 0,
                    y: 30,
                    letterSpacing: '0.5em',
                    duration: 0.5
                }, '-=0.3')
                .from(header.querySelector('.section-line'), {
                    scaleX: 0,
                    duration: 0.5
                }, '-=0.2');
            });
        }
        
        initParallax() {
            // Crimson moon parallax
            gsap.to('.crimson-moon', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 300,
                scale: 0.5,
                opacity: 0.1
            });
            
            // Nebula overlay
            gsap.to('.nebula-overlay', {
                scrollTrigger: {
                    trigger: '.page-multiverse',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                backgroundPosition: '100% 50%',
                opacity: 0.4
            });
            
            // Thorn container rotation
            gsap.to('.thorn-container', {
                scrollTrigger: {
                    trigger: '.page-home',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                rotation: 90,
                scale: 1.5
            });
        }
        
        initBurstTrigger() {
            // Burst effect on scroll into collapse section
            ScrollTrigger.create({
                trigger: '.page-collapse',
                start: 'top 50%',
                onEnter: () => {
                    if (window.monosBurst) {
                        window.monosBurst.triggerBurst();
                    }
                },
                once: true
            });

            // Secondary burst trigger for the burst-trigger div
            ScrollTrigger.create({
                trigger: '#burstTrigger',
                start: 'top 70%',
                onEnter: () => {
                    if (window.monosBurst) {
                        window.monosBurst.triggerBurst();
                    }
                },
                once: true
            });
        }
        
        initThornAnimations() {
            // Animate thorns in ring
            const ringThorns = document.querySelectorAll('.ring-thorn');
            
            ringThorns.forEach((thorn, index) => {
                gsap.from(thorn, {
                    scrollTrigger: {
                        trigger: '.page-collapse',
                        start: 'top 70%',
                        end: 'top 30%',
                        scrub: true
                    },
                    height: 0,
                    opacity: 0,
                    delay: index * 0.02
                });
            });
            
            // Thorn pulse on scroll
            gsap.to('.ring-thorn', {
                scrollTrigger: {
                    trigger: '.page-collapse',
                    start: 'top 50%',
                    end: 'bottom top',
                    scrub: true
                },
                filter: 'drop-shadow(0 0 15px #FF0000)',
                stagger: 0.05
            });
        }
        
        initBlackHoleScroll() {
            // Black hole container animations
            const blackHoleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.page-collapse',
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: true
                }
            });
            
            blackHoleTl
                .from('.black-hole-container', {
                    scale: 0.3,
                    opacity: 0,
                    rotation: -180
                })
                .to('.event-horizon', {
                    boxShadow: '0 0 120px #FF0000, 0 0 200px #511720, inset 0 0 60px rgba(255, 0, 0, 0.8)',
                    duration: 1
                }, '-=0.5')
                .to('.disk-layer', {
                    borderWidth: 5,
                    stagger: 0.1
                }, '-=0.8');
        }
        
        initSingularityScroll() {
            // Singularity point animations
            const singularityTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.page-point',
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: true
                }
            });
            
            singularityTl
                .from('.singularity-point', {
                    scale: 0,
                    opacity: 0,
                    rotation: 360
                })
                .to('.point-glow', {
                    scale: 1.5,
                    opacity: 0.8,
                    duration: 0.5
                }, '-=0.3')
                .to('.point-core', {
                    boxShadow: '0 0 40px #FF0000, 0 0 80px #FF0000, 0 0 160px #511720',
                    duration: 0.5
                }, '-=0.3')
                .from('.point-cross', {
                    scale: 0,
                    rotation: -180,
                    duration: 0.5
                }, '-=0.3');
            
            // Philosophy text typewriter effect
            gsap.to('.philosophy-text', {
                scrollTrigger: {
                    trigger: '.philosophy-content',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                width: '100%',
                duration: 3,
                ease: 'steps(40)'
            });
            
            // Throne silhouette
            gsap.from('.throne-silhouette', {
                scrollTrigger: {
                    trigger: '.philosophy-content',
                    start: 'top 60%',
                    end: 'top 30%',
                    scrub: true
                },
                opacity: 0,
                scale: 0.5,
                y: 100
            });
        }
        
        initContactReveal() {
            // Contact section reveal
            const contactTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.contact-section',
                    start: 'top 80%',
                    end: 'top 40%',
                    scrub: true
                }
            });
            
            contactTl
                .from('.contact-title', {
                    opacity: 0,
                    y: 30,
                    letterSpacing: '0.5em'
                })
                .from('.form-group', {
                    opacity: 0,
                    y: 20,
                    stagger: 0.15
                }, '-=0.2')
                .from('.submit-btn', {
                    opacity: 0,
                    scaleX: 0.8
                }, '-=0.1');
            
            // Footer reveal
            gsap.from('.footer', {
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1
            });
            
            gsap.from('.footer-cross', {
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 180,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        }
        
        // Refresh all ScrollTriggers
        refresh() {
            ScrollTrigger.refresh();
        }
        
        // Kill all ScrollTriggers
        dispose() {
            ScrollTrigger.getAll().forEach(st => st.kill());
        }
    }
    
    // ========== INITIALIZATION ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosScrollAnimations = new ScrollAnimations();
        });
    } else {
        window.monosScrollAnimations = new ScrollAnimations();
    }
})();
