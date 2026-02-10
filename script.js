// ===================================
// Preloader with Orbit Animation
// ===================================
const preloader = document.getElementById('preloader');
if (preloader) {
    document.body.classList.add('preloader-active');

    const MIN_DISPLAY_MS = 2200;
    const startTime = Date.now();
    let preloaderAnimId = null;

    // Canvas orbit animation
    const pCanvas = document.getElementById('preloader-canvas');
    if (pCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const pCtx = pCanvas.getContext('2d');
        let pW, pH;

        function resizePreloaderCanvas() {
            pW = pCanvas.width = pCanvas.offsetWidth;
            pH = pCanvas.height = pCanvas.offsetHeight;
        }
        resizePreloaderCanvas();
        window.addEventListener('resize', resizePreloaderCanvas);

        const ORBIT_COUNT = 28;
        const orbitParticles = [];

        for (let i = 0; i < ORBIT_COUNT; i++) {
            orbitParticles.push({
                angle: Math.random() * Math.PI * 2,
                radius: 60 + Math.random() * 120,
                speed: (0.003 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
                size: 1 + Math.random() * 2.5,
                opacity: 0.15 + Math.random() * 0.5,
                hue: Math.random() > 0.5 ? 220 : 160, // blue or emerald
            });
        }

        function drawPreloaderAnimation() {
            pCtx.clearRect(0, 0, pW, pH);
            const cx = pW / 2;
            const cy = pH / 2;

            // Update and draw particles
            const positions = [];
            for (const p of orbitParticles) {
                p.angle += p.speed;
                const x = cx + Math.cos(p.angle) * p.radius;
                const y = cy + Math.sin(p.angle) * p.radius;
                positions.push({ x, y, opacity: p.opacity });

                pCtx.beginPath();
                pCtx.arc(x, y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
                pCtx.fill();
            }

            // Draw connecting lines between nearby particles
            pCtx.lineWidth = 0.5;
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const dx = positions[i].x - positions[j].x;
                    const dy = positions[i].y - positions[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const lineOpacity = (1 - dist / 100) * 0.2;
                        pCtx.beginPath();
                        pCtx.moveTo(positions[i].x, positions[i].y);
                        pCtx.lineTo(positions[j].x, positions[j].y);
                        pCtx.strokeStyle = `hsla(230, 70%, 65%, ${lineOpacity})`;
                        pCtx.stroke();
                    }
                }
            }

            // Subtle center glow
            const grd = pCtx.createRadialGradient(cx, cy, 0, cx, cy, 140);
            grd.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
            grd.addColorStop(1, 'transparent');
            pCtx.fillStyle = grd;
            pCtx.fillRect(cx - 140, cy - 140, 280, 280);

            preloaderAnimId = requestAnimationFrame(drawPreloaderAnimation);
        }
        drawPreloaderAnimation();
    }

    // Dismiss logic
    window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
            preloader.classList.add('is-hidden');
            document.body.classList.remove('preloader-active');

            preloader.addEventListener('transitionend', () => {
                if (preloaderAnimId) cancelAnimationFrame(preloaderAnimId);
                preloader.remove();
            }, { once: true });
        }, remaining);
    });
}

// ===================================
// Initialize Lucide Icons
// ===================================
lucide.createIcons();

// ===================================
// Theme Toggler
// ===================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ===================================
// Header Scroll Effect
// ===================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===================================
// Dynamic Footer Year
// ===================================
document.getElementById('year').textContent = new Date().getFullYear();

// ===================================
// Canvas Particle Animation (Hero)
// ===================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`; // Blue particles
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

// ===================================
// Cursor Glow Effect
// ===================================
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow) { // Guard in case element doesn't exist (e.g., mobile)
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth easing
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursorGlow.style.left = `${cursorX}px`;
        cursorGlow.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}
