/* MONOS - Audio System */
/* Ambient music controls and management */

(function() {
    'use strict';
    
    // ========== AUDIO CONFIGURATION ==========
    const AUDIO_CONFIG = {
        src: 'assets/audio/ambient-cosmic.mp3',
        volume: 0.25,
        fadeInDuration: 2000,
        fadeOutDuration: 1000,
        autoPlay: true
    };
    
    // ========== AUDIO CLASS ==========
    class MonosAudio {
        constructor() {
            this.audio = null;
            this.isPlaying = false;
            this.isMuted = false;
            this.initialized = false;
            
            this.audioControl = document.getElementById('audioControl');
            this.audioBtn = document.getElementById('audioBtn');
            
            this.init();
        }
        
        init() {
            // Create audio element
            this.audio = new Audio();
            this.audio.src = AUDIO_CONFIG.src;
            this.audio.loop = true;
            this.audio.volume = 0;
            this.audio.preload = 'auto';
            
            // Audio events
            this.audio.addEventListener('canplaythrough', () => {
                console.log('Audio ready to play');
            });
            
            this.audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
                this.handleAudioError();
            });
            
            // Button click handler
            this.audioBtn.addEventListener('click', () => this.toggle());
            
            // Auto-play on first interaction
            if (AUDIO_CONFIG.autoPlay) {
                this.initAutoPlay();
            }
        }
        
        initAutoPlay() {
            const autoPlayHandler = () => {
                if (!this.initialized) {
                    this.play();
                    this.initialized = true;
                }
                document.removeEventListener('click', autoPlayHandler);
                document.removeEventListener('keydown', autoPlayHandler);
            };
            
            document.addEventListener('click', autoPlayHandler);
            document.addEventListener('keydown', autoPlayHandler);
        }
        
        play() {
            if (!this.audio) return;
            
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.isMuted = false;
                this.updateUI();
                this.fadeIn();
            }).catch(e => {
                console.log('Play prevented:', e);
                this.isPlaying = false;
                this.updateUI();
            });
        }
        
        pause() {
            if (!this.audio) return;
            
            this.fadeOut().then(() => {
                this.audio.pause();
                this.isPlaying = false;
                this.updateUI();
            });
        }
        
        toggle() {
            if (this.isMuted || !this.isPlaying) {
                this.play();
            } else {
                this.pause();
            }
        }
        
        fadeIn() {
            return new Promise((resolve) => {
                const startVolume = 0;
                const endVolume = AUDIO_CONFIG.volume;
                const duration = AUDIO_CONFIG.fadeInDuration;
                const startTime = Date.now();
                
                const fade = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const eased = 1 - Math.pow(1 - progress, 3);
                    
                    this.audio.volume = startVolume + (endVolume - startVolume) * eased;
                    
                    if (progress < 1) {
                        requestAnimationFrame(fade);
                    } else {
                        resolve();
                    }
                };
                
                fade();
            });
        }
        
        fadeOut() {
            return new Promise((resolve) => {
                const startVolume = this.audio.volume;
                const endVolume = 0;
                const duration = AUDIO_CONFIG.fadeOutDuration;
                const startTime = Date.now();
                
                const fade = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const eased = Math.pow(1 - progress, 3);
                    
                    this.audio.volume = startVolume * eased;
                    
                    if (progress < 1) {
                        requestAnimationFrame(fade);
                    } else {
                        resolve();
                    }
                };
                
                fade();
            });
        }
        
        setVolume(volume) {
            if (volume < 0 || volume > 1) return;
            AUDIO_CONFIG.volume = volume;
            if (this.isPlaying) {
                this.audio.volume = volume;
            }
        }
        
        updateUI() {
            if (this.isPlaying && !this.isMuted) {
                this.audioBtn.classList.remove('muted');
                this.audioControl.classList.remove('muted');
            } else {
                this.audioBtn.classList.add('muted');
                this.audioControl.classList.add('muted');
            }
        }
        
        handleAudioError() {
            // Create a silent audio fallback
            console.log('Audio file not found, creating silent fallback');
            this.audio = null;
            this.audioControl.style.display = 'none';
        }
        
        // Public API
        getVolume() {
            return AUDIO_CONFIG.volume;
        }
        
        getState() {
            return {
                isPlaying: this.isPlaying,
                isMuted: this.isMuted,
                volume: AUDIO_CONFIG.volume
            };
        }
    }
    
    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        window.monosAudio = new MonosAudio();
    });
})();
