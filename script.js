/**
 * ZOEY & WILL WEDDING WEBSITE
 * Main JavaScript File
 * Features: Language switching, envelope animation, navigation, audio control
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    isEnvelopeOpened: false,
    isMuted: false,
    currentLanguage: localStorage.getItem('selectedLanguage') || 'zh',
    currentPage: 'home-page',
    scrollEnabled: false,
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    body: document.body,
    envelopeContainer: document.getElementById('new-envelope-container'),
    envelope: document.getElementById('envelope'),
    invitationCard: document.getElementById('invitation-card'),
    nav: document.querySelector('nav'),
    navLinks: document.querySelectorAll('.nav-link'),
    muteBtn: document.getElementById('muteBtn'),
    langOptions: document.querySelectorAll('.lang-option'),
    pages: document.querySelectorAll('.content-page'),
    landingScene: document.getElementById('landing-scene'),
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    setupEventListeners();
    animateLandingScene();
    logInitialization();
});

function initializeLanguage() {
    if (state.currentLanguage === 'en') {
        elements.body.classList.add('english-mode');
    }
}

function setupEventListeners() {
    // Envelope interaction
    elements.envelope.addEventListener('click', openEnvelope);
    elements.envelope.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openEnvelope();
    });

    // Language switching
    elements.langOptions.forEach(option => {
        option.addEventListener('click', () => switchLanguage(option.dataset.lang));
    });

    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Mute button
    elements.muteBtn.addEventListener('click', toggleMute);

    // Scroll management
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchmove', handleScroll, { passive: false });
}

// ============================================
// ENVELOPE & INVITATION LOGIC
// ============================================

function openEnvelope() {
    if (state.isEnvelopeOpened) return;

    state.isEnvelopeOpened = true;
    state.scrollEnabled = true;

    // Animate envelope out
    elements.envelopeContainer.classList.add('dissolve');
    setTimeout(() => {
        elements.envelopeContainer.style.display = 'none';
    }, 1500);

    // Show invitation card
    elements.invitationCard.classList.add('fade-in');
    setTimeout(() => {
        showInvitationCard();
    }, 1000);

    // Show navigation and buttons
    elements.nav.classList.add('fade-in');
    elements.muteBtn.classList.add('fade-in');

    // Show landing scene elements
    elements.landingScene.classList.add('show-elements');

    // Allow scrolling
    elements.body.style.overflow = 'auto';
}

function showInvitationCard() {
    elements.invitationCard.classList.add('fade-in');
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        elements.invitationCard.classList.remove('fade-in');
    }, 4000);
}

// ============================================
// LANGUAGE SWITCHING
// ============================================

function switchLanguage(lang) {
    if (state.currentLanguage === lang) return;

    state.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    if (lang === 'en') {
        elements.body.classList.add('english-mode');
    } else {
        elements.body.classList.remove('english-mode');
    }

    updateActiveLanguageIndicator(lang);
}

function updateActiveLanguageIndicator(lang) {
    elements.langOptions.forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
}

// ============================================
// NAVIGATION LOGIC
// ============================================

function handleNavigation(e) {
    e.preventDefault();

    const link = e.target;
    const pageId = link.dataset.page;

    if (!pageId || state.currentPage === pageId) return;

    // Update active navigation link
    elements.navLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');

    // Hide all pages
    elements.pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        state.currentPage = pageId;

        // Smooth scroll to page
        setTimeout(() => {
            selectedPage.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

// ============================================
// AUDIO/MUTE CONTROL
// ============================================

function toggleMute() {
    state.isMuted = !state.isMuted;
    updateMuteButton();
    muteAllAudio();
}

function updateMuteButton() {
    const svg = elements.muteBtn.querySelector('svg');
    if (state.isMuted) {
        svg.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>';
        elements.muteBtn.setAttribute('aria-label', 'Unmute');
    } else {
        svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a7 7 0 0 1 0 9.9"></path>';
        elements.muteBtn.setAttribute('aria-label', 'Mute');
    }
}

function muteAllAudio() {
    const audioElements = document.querySelectorAll('audio, [role="presentation"] audio');
    audioElements.forEach(audio => {
        audio.muted = state.isMuted;
    });
}

// ============================================
// SCROLL MANAGEMENT
// ============================================

function handleScroll(e) {
    if (!state.scrollEnabled) {
        e.preventDefault();
        return;
    }
}

// ============================================
// LANDING SCENE ANIMATION
// ============================================

function animateLandingScene() {
    // Show landing scene after brief delay
    setTimeout(() => {
        elements.landingScene.classList.add('show-elements');
    }, 500);
}

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = this.track.querySelectorAll('.carousel-item');
        this.currentIndex = 0;
        this.setupControls();
    }

    setupControls() {
        const controls = this.container.querySelector('.carousel-controls');
        if (!controls) return;

        const prevBtn = controls.querySelector('[data-direction="prev"]');
        const nextBtn = controls.querySelector('[data-direction="next"]');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previous());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    }

    scrollToIndex(index) {
        if (index < 0) {
            this.currentIndex = this.items.length - 1;
        } else if (index >= this.items.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }

        const offset = this.currentIndex * 100;
        this.track.scrollLeft = (this.items[this.currentIndex].offsetWidth) * this.currentIndex;
    }

    next() {
        this.scrollToIndex(this.currentIndex + 1);
    }

    previous() {
        this.scrollToIndex(this.currentIndex - 1);
    }
}

// Initialize carousels
function initializeCarousels() {
    const carouselContainers = document.querySelectorAll('.carousel-content');
    carouselContainers.forEach(container => {
        new Carousel(container);
    });
}

// Initialize carousels after envelope is opened
Observer.prototype.observeOnce = function (selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => this.observeOnce(selector, callback), 100);
    }
};

let observerInstance = new (function () {})();
observerInstance.observeOnce = function (selector, callback) {
    const checkElement = setInterval(() => {
        const element = document.querySelector(selector);
        if (element && !element.classList.contains('hidden')) {
            clearInterval(checkElement);
            callback(element);
        }
    }, 500);
};

// ============================================
// UTILITY & DEBUGGING
// ============================================

function logInitialization() {
    console.log('Wedding Website Initialized', {
        language: state.currentLanguage,
        scrollEnabled: state.scrollEnabled,
        envelopeOpened: state.isEnvelopeOpened,
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'O' to open envelope (for testing)
    if (e.key === 'o' && !state.isEnvelopeOpened) {
        openEnvelope();
    }
    // Press 'M' to toggle mute
    if (e.key === 'm') {
        toggleMute();
    }
    // Press 'E' to switch language
    if (e.key === 'e') {
        const targetLang = state.currentLanguage === 'zh' ? 'en' : 'zh';
        switchLanguage(targetLang);
    }
});

// ============================================
// PAGE VISIBILITY - Resume when tab is active
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Tab hidden
        muteAllAudio();
    } else {
        // Tab visible
        if (!state.isMuted) {
            muteAllAudio();
        }
    }
});

// ============================================
// READY STATE
// ============================================

window.addEventListener('load', () => {
    initializeCarousels();
    console.log('All resources loaded');
});
