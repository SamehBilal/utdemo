        (function () {
            'use strict';

            // ===== CONFIGURATION =====
            const CONFIG = {
                ANIMATION_DELAYS: {
                    INITIAL: 300,
                    NAVBAR_EXPAND: 1100,
                    TITLE_ROTATION: 2000,
                    SUBTITLE_ANIMATION: 1500
                },
                TITLE_ROTATION_INTERVAL: 300,
                LETTER_ANIMATION_DELAY: 0.02,
                SCROLL_THROTTLE: 16,
                SWIPE_THRESHOLD: 50
            };

            // ===== STATE MANAGEMENT =====
            const state = {
                currentTitleIndex: 0,
                subtitleAnimationStarted: false,
                titleInterval: null,
                autoplayInterval: null,
                isAnimating: false,
                currentIndex: 2,
                startX: 0,
                endX: 0
            };

            // ===== DOM ELEMENTS =====
            const elements = {
                navbarContainer: document.getElementById('navbarContainer'),
                navbar: document.getElementById('navbar'),
                progressBg: document.getElementById('progressBg'),
                navLinks: document.querySelectorAll('.nav-custom-links a'),
                sections: document.querySelectorAll('.section')
            };

            // ===== CONSTANTS =====
            const SUBTITLE_TEXT = "Next Level Video Production & Digital Marketing.";

            // ===== INITIALIZATION =====
            function init() {
                window.addEventListener('load', handlePageLoad);
                window.addEventListener('beforeunload', cleanup);
                initSmoothScrolling();
            }

            function handlePageLoad() {
                setTimeout(() => {
                    elements.navbarContainer.classList.add('animate-in');

                    setTimeout(() => {
                        elements.navbar.classList.add('expanded');
                        initScrollProgress();
                        initTextAnimations();

                        //setTimeout(() => startTitleRotation(), CONFIG.ANIMATION_DELAYS.TITLE_ROTATION);
                        //setTimeout(() => animateSubtitle(), CONFIG.ANIMATION_DELAYS.SUBTITLE_ANIMATION);
                    }, CONFIG.ANIMATION_DELAYS.NAVBAR_EXPAND);
                }, CONFIG.ANIMATION_DELAYS.INITIAL);
            }

            // ===== ANIMATION FUNCTIONS =====
        

            // ===== TEXT ANIMATION FUNCTIONS =====
            function initTextAnimations() {
                elements.navLinks.forEach(createTextAnimation);
                const button = document.querySelector('.cta-button');
                if (button) createTextAnimation(button);
            }

            function createTextAnimation(element) {
                const text = element.getAttribute('data-text');
                if (!text) return;

                element.innerHTML = '';

                const originalSpan = createSpan('relative', 'inline-block');
                const cloneSpan = createSpan('absolute', 'inline-block');

                cloneSpan.style.top = '100%';
                if (text == 'Contact') {
                    cloneSpan.style.left = '25px';
                } else {
                    cloneSpan.style.left = '0';
                }

                cloneSpan.style.whiteSpace = 'nowrap';

                text.split('').forEach((char, index) => {
                    const originalChar = createCharSpan('char', char, index);
                    const cloneChar = createCharSpan('char-clone', char, index);

                    originalSpan.appendChild(originalChar);
                    cloneSpan.appendChild(cloneChar);
                });

                element.appendChild(originalSpan);
                element.appendChild(cloneSpan);
            }

            function createSpan(position, display) {
                const span = document.createElement('span');
                span.style.position = position;
                span.style.display = display;
                return span;
            }

            function createCharSpan(className, char, index) {
                const span = document.createElement('span');
                span.className = className;
                span.style.setProperty('--i', index);
                span.textContent = char === ' ' ? '\u00A0' : char;
                return span;
            }

            // ===== SCROLL PROGRESS FUNCTIONS =====
            function initScrollProgress() {
                let ticking = false;

                function updateProgress() {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    const currentSection = getCurrentSection(scrollTop);

                    elements.progressBg.style.width = `${progress}%`;
                    updateActiveNavLink(currentSection);
                }

                function requestTick() {
                    if (!ticking) {
                        requestAnimationFrame(updateProgress);
                        ticking = true;
                        setTimeout(() => ticking = false, CONFIG.SCROLL_THROTTLE);
                    }
                }

                window.addEventListener('scroll', requestTick);
                updateProgress();
            }

            function getCurrentSection(scrollTop) {
                let currentSection = '';
                elements.sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollTop >= sectionTop - window.innerHeight * 0.3) {
                        currentSection = section.id;
                    }
                });
                return currentSection;
            }

            function updateActiveNavLink(currentSection) {
                elements.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
                });
            }

            // ===== UTILITY FUNCTIONS =====
            function initSmoothScrolling() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', handleSmoothScroll);
                });
            }

            function handleSmoothScroll(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            function cleanup() {
                if (state.titleInterval) {
                    clearInterval(state.titleInterval);
                }
                if (state.autoplayInterval) {
                    clearInterval(state.autoplayInterval);
                }
            }

            // ===== START APPLICATION =====
            init();
        })();