/**
 * Yusupov Dev Portfolio
 * JavaScript for animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initScrollAnimations();
    initSmoothScroll();
    initNavbar();
    initTypingEffect();
    initParallax();
    initMobileMenu();
});

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to sections and observe
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-content, .about-visual, .project-card, .contact-content, .contact-visual'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.classList.add(`stagger-${(index % 6) + 1}`);
        observer.observe(el);
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

/**
 * Animate counter numbers
 */
function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);

    if (!match) return;

    const target = parseInt(match[1]);
    const prefix = text.slice(0, text.indexOf(match[1]));
    const suffix = text.slice(text.indexOf(match[1]) + match[1].length);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.body.classList.remove('nav-open');
            }
        });
    });
}

/**
 * Navbar scroll effects
 */
function initNavbar() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                // Add/remove scrolled class for background
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll direction
                if (currentScroll > lastScroll && currentScroll > 500) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Typing effect for terminal
 */
function initTypingEffect() {
    const terminal = document.querySelector('.terminal-body code');
    if (!terminal) return;

    // The terminal content is pre-rendered, so we just add the cursor animation
    // This keeps the page functional even without JS
}

/**
 * Parallax effect for floating elements
 */
function initParallax() {
    const shapes = document.querySelectorAll('.clay-shape');
    const cards = document.querySelectorAll('.floating-card');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 50;
        mouseY = (e.clientY - window.innerHeight / 2) / 50;
    });

    function animate() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        shapes.forEach((shape, index) => {
            const depth = (index + 1) * 0.5;
            shape.style.transform = `translate(calc(-50% + ${currentX * depth}px), calc(-50% + ${currentY * depth}px))`;
        });

        cards.forEach((card, index) => {
            const depth = (index + 1) * 0.3;
            const baseTransform = card.style.transform || '';
            // Only apply mouse movement, keep original position
            card.style.marginLeft = `${currentX * depth}px`;
            card.style.marginTop = `${currentY * depth}px`;
        });

        requestAnimationFrame(animate);
    }

    // Only enable parallax on non-touch devices
    if (!('ontouchstart' in window)) {
        animate();
    }
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const nav = document.querySelector('.nav');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
        document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
            document.body.classList.remove('nav-open');
        }
    });
}

/**
 * Add subtle magnetic effect to buttons
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/**
 * Project card hover effects
 */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
        this.style.zIndex = '';
    });
});

/**
 * Add page load animation
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements sequentially
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-actions, .hero-stats');

    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';

        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

/**
 * Easter egg: Konami code
 */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear';

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Add rainbow animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
