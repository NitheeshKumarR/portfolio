// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }
    });
};

window.addEventListener('scroll', animateSkillBars);



// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// Initialize skill bars on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if skills section is in view on page load
    animateSkillBars();

    const revealElements = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    const heroFigure = document.querySelector('.hero-figure');
    const finePointer = window.matchMedia('(pointer: fine)');

    if (heroFigure && !prefersReducedMotion.matches && finePointer.matches) {
        const heroPhoto = heroFigure.querySelector('.hero-photo');
        const heroGlow = heroFigure.querySelector('.hero-glow');
        const heroBadges = heroFigure.querySelectorAll('.hero-badge');

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        const maxTranslate = 24;

        const animateParallax = () => {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            if (heroPhoto) {
                heroPhoto.style.setProperty('--tx', `${currentX}px`);
                heroPhoto.style.setProperty('--ty', `${currentY}px`);
            }

            if (heroGlow) {
                heroGlow.style.setProperty('--tx', `${currentX * -0.6}px`);
                heroGlow.style.setProperty('--ty', `${currentY * -0.6}px`);
            }

            heroBadges.forEach((badge, index) => {
                const depth = index === 0 ? -1.2 : -1.4;
                badge.style.setProperty('--tx', `${currentX * depth}px`);
                badge.style.setProperty('--ty', `${currentY * depth}px`);
            });

            requestAnimationFrame(animateParallax);
        };

        const updateTarget = (event) => {
            const rect = heroFigure.getBoundingClientRect();
            const offsetX = event.clientX - (rect.left + rect.width / 2);
            const offsetY = event.clientY - (rect.top + rect.height / 2);
            const relX = Math.max(-1, Math.min(1, offsetX / (rect.width / 2)));
            const relY = Math.max(-1, Math.min(1, offsetY / (rect.height / 2)));

            targetX = -relX * maxTranslate;
            targetY = -relY * maxTranslate * 0.8;
        };

        heroFigure.addEventListener('mousemove', updateTarget);
        heroFigure.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        animateParallax();
    }

    const typedNameEl = document.getElementById('typed-name');
    const cursorEl = document.querySelector('.typing-cursor');

    if (typedNameEl) {
        const fullText = typedNameEl.dataset.text || typedNameEl.textContent.trim();
        const prefersReducedMotionTyping = prefersReducedMotion.matches;
        const typeSpeed = 90;
        let index = 0;

        const typeNext = () => {
            if (index <= fullText.length) {
                typedNameEl.textContent = fullText.slice(0, index);
                index += 1;
                if (index <= fullText.length) {
                    setTimeout(typeNext, typeSpeed);
                } else if (cursorEl) {
                    cursorEl.classList.add('typing-complete');
                }
            }
        };

        if (prefersReducedMotionTyping) {
            typedNameEl.textContent = fullText;
            if (cursorEl) {
                cursorEl.style.display = 'none';
            }
        } else {
            typedNameEl.textContent = '';
            setTimeout(typeNext, 300);
        }
    }
});