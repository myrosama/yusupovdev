/**
 * Boboxon Yusupov Portfolio
 * Minimal interactions with explode animation
 */

document.addEventListener('DOMContentLoaded', () => {
    initProjectOverlay();
    initSmoothScroll();
    initActiveNavLink();
    initFadeInAnimations();
});

// Project data
const projectsData = {
    'shoxa': {
        title: 'SHOXA',
        desc: 'My startup — a full-scale platform built with TypeScript and React Native. Designed for scalability, performance, and reliability in production environments. This is my flagship project that solves real problems for real users.',
        github: 'https://github.com/myrosama/shoxa',
        live: null
    },
    'telegram-cloud': {
        title: 'Telegram Cloud Backup',
        desc: 'An innovative solution that uses Telegram as an unlimited cloud storage backend. Store and retrieve large files using a distributed architecture that leverages Telegram\'s infrastructure. Perfect for low-resource environments.',
        github: 'https://github.com/myrosama/telegram-cloud-backup',
        live: null
    },
    'alfa-sat': {
        title: 'ALFA_SAT',
        desc: 'A satellite communication and monitoring system built with JavaScript. Designed for reliable data transmission in challenging conditions. Part of the ALFA ecosystem.',
        github: 'https://github.com/myrosama/ALFA_SAT',
        live: null
    },
    'daemon': {
        title: 'DaemonClient',
        desc: 'A web-based client interface for daemon process management and monitoring. Clean UI for managing background processes with real-time updates.',
        github: 'https://github.com/myrosama/DaemonClient',
        live: null
    },
    'alfa-consulting': {
        title: 'ALFA Consulting',
        desc: 'A professional consulting platform designed for enterprise clients. Clean, professional design that builds trust and converts visitors.',
        github: 'https://github.com/myrosama/ALFACONSULTING',
        live: null
    },
    'uzb-economy': {
        title: 'UZB Economy Portal',
        desc: 'Uzbekistan economy data visualization and information portal. A public service project providing accessible economic data for citizens and researchers.',
        github: 'https://github.com/myrosama/uzb-economy-portal',
        live: null
    }
};

/**
 * Project overlay with explode animation (sachrab ketishi)
 */
function initProjectOverlay() {
    const overlay = document.getElementById('projectOverlay');
    const closeBtn = document.getElementById('overlayClose');
    const projectItems = document.querySelectorAll('.project-item');

    // Open overlay when project is clicked
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.project;
            const project = projectsData[projectId];

            if (project) {
                // Update overlay content
                document.getElementById('overlayTitle').textContent = project.title;
                document.getElementById('overlayDesc').textContent = project.desc;

                const githubLink = document.getElementById('overlayGithub');
                const liveLink = document.getElementById('overlayLive');

                if (project.github) {
                    githubLink.href = project.github;
                    githubLink.style.display = 'inline-block';
                } else {
                    githubLink.style.display = 'none';
                }

                if (project.live) {
                    liveLink.href = project.live;
                    liveLink.style.display = 'inline-block';
                } else {
                    liveLink.style.display = 'none';
                }

                // Store click position for animation origin
                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Set custom properties for animation origin
                overlay.style.setProperty('--origin-x', `${centerX}px`);
                overlay.style.setProperty('--origin-y', `${centerY}px`);

                // Open overlay
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Add subtle randomization to explode pieces
                randomizeExplodePieces();
            }
        });
    });

    // Close overlay
    closeBtn.addEventListener('click', closeOverlay);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });

    // Close when clicking outside the main content
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Randomize explode pieces for variety
 */
function randomizeExplodePieces() {
    const pieces = document.querySelectorAll('.explode-piece');

    pieces.forEach(piece => {
        // Random rotation offset
        const rotateOffset = (Math.random() - 0.5) * 10;
        // Random position offset
        const xOffset = (Math.random() - 0.5) * 20;
        const yOffset = (Math.random() - 0.5) * 20;

        piece.style.setProperty('--rotate-offset', `${rotateOffset}deg`);
        piece.style.setProperty('--x-offset', `${xOffset}px`);
        piece.style.setProperty('--y-offset', `${yOffset}px`);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip empty anchors

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });
}

/**
 * Track active section on scroll
 */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                updateActiveNavLink(`#${id}`);
            }
        });
    }, {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

function updateActiveNavLink(href) {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

/**
 * Fade in animations on scroll
 */
function initFadeInAnimations() {
    const elements = document.querySelectorAll('.project-item, .about-content, .contact-links');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                entry.target.style.transitionDelay = `${index * 0.05}s`;
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
}

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

/**
 * Handle hero section links with external indicator
 */
document.querySelectorAll('.hero-links .link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(4px)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
    });
});

/**
 * Project item keyboard accessibility
 */
document.querySelectorAll('.project-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

/**
 * Console easter egg
 */
console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║   👋 Hey, thanks for checking the        ║
║      console! I'm Boboxon Yusupov.       ║
║                                          ║
║   📧 Let's connect:                      ║
║      github.com/myrosama                 ║
║                                          ║
╚══════════════════════════════════════════╝
`);
