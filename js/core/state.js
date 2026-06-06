/* MONOS - Global State */
/* Centralized state management */

(function() {
    'use strict';

    const CONFIG = {
        loading: {
            duration: 2500,
            minDisplayTime: 1500
        },
        particles: {
            count: window.innerWidth < 768 ? 500 : 1500
        },
        cursor: {
            trailEnabled: true,
            trailLength: 12,
            trailInterval: 25
        },
        audio: {
            volume: 0.25,
            autoPlay: true
        },
        bloom: {
            startX: 0.5,
            startY: 0.5,
            endX: 0.5,
            endY: 0.5,
            duration: 1200
        }
    };

    const state = {
        loaded: false,
        currentPage: 0,
        scrollProgress: 0,
        mouseX: 0,
        mouseY: 0,
        isMobile: window.innerWidth < 768 || 'ontouchstart' in window,
        audioPlaying: false,
        audioMuted: false,
        cursorVisible: true,
        burstActive: false
    };

    const elements = {
        loadingScreen: null,
        loadingProgress: null,
        canvas: null,
        cursor: null,
        cursorDot: null,
        cursorRing: null,
        cursorCross: null,
        cursorTrail: null,
        nav: null,
        navLinks: null,
        audioControl: null,
        audioBtn: null,
        burstOverlay: null,
        burstParticles: null,
        scrollPrompt: null,
        thornsContainer: null,
        thornRing: null,
        pages: null,
        contactForm: null
    };

    function initElements() {
        elements.loadingScreen = document.getElementById('loadingScreen');
        elements.loadingProgress = document.querySelector('.loading-progress');
        elements.canvas = document.getElementById('canvasContainer');
        elements.cursor = document.getElementById('cursor');
        elements.cursorDot = document.querySelector('.cursor-dot');
        elements.cursorRing = document.querySelector('.cursor-ring');
        elements.cursorCross = document.querySelector('.cursor-cross');
        elements.cursorTrail = document.getElementById('cursorTrail');
        elements.nav = document.getElementById('nav');
        elements.navLinks = document.querySelectorAll('.nav-link');
        elements.audioControl = document.getElementById('audioControl');
        elements.audioBtn = document.getElementById('audioBtn');
        elements.burstOverlay = document.getElementById('burstOverlay');
        elements.burstParticles = document.getElementById('burstParticles');
        elements.scrollPrompt = document.getElementById('scrollPrompt');
        elements.thornsContainer = document.getElementById('thorns');
        elements.thornRing = document.getElementById('thornRing');
        elements.pages = document.querySelectorAll('.page');
        elements.contactForm = document.getElementById('contactForm');
    }

    window.monosState = { CONFIG, state, elements, initElements };

})();
