

// Premium Gaming Cursor
const customCursor = document.getElementById('custom-cursor');
const cursorHud = document.getElementById('cursor-hud');
const canvas = document.getElementById('cursor-canvas');

if (customCursor && cursorHud && canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let velX = 0;
    let velY = 0;
    
    // Particles for trail and sparks
    const particles = [];

    class Particle {
        constructor(x, y, isSpark = false) {
            this.x = x;
            this.y = y;
            this.isSpark = isSpark;
            this.size = isSpark ? Math.random() * 3 + 1 : Math.random() * 2 + 1;
            this.speedX = isSpark ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 2;
            this.speedY = isSpark ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 2;
            this.life = 1;
            this.decay = isSpark ? 0.02 : 0.05;
            this.color = isSpark ? `rgba(255, 255, 255, ${this.life})` : `rgba(0, 240, 255, ${this.life})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.color = this.isSpark ? `rgba(255, 255, 255, ${this.life})` : `rgba(0, 240, 255, ${this.life})`;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particle
        if(Math.random() > 0.5) {
            particles.push(new Particle(mouseX, mouseY));
        }
        
        cursorHud.style.left = `${mouseX}px`;
        cursorHud.style.top = `${mouseY}px`;
    });

    window.addEventListener('mousedown', () => {
        // Create spark particles on click
        for(let i = 0; i < 15; i++) {
            particles.push(new Particle(mouseX, mouseY, true));
        }
        customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(0.8)`;
    });

    window.addEventListener('mouseup', () => {
        customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
    });

    const interactables = document.querySelectorAll('a, button, .project-card, .tech-icon, .icon-box, .close-modal');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorHud.style.opacity = '1';
            cursorHud.style.transform = 'translate(-50%, -50%) scale(1)';
            customCursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorHud.style.opacity = '0';
            cursorHud.style.transform = 'translate(-50%, -50%) scale(0)';
            customCursor.classList.remove('hover');
        });
    });

    function renderLoop() {
        // Clear canvas with trail effect
        ctx.clearRect(0, 0, width, height); // Fully clear instead of fillRect so it's transparent over background

        // Inertia tracking
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        velX = dx * 0.2;
        velY = dy * 0.2;
        cursorX += velX;
        cursorY += velY;

        // Rotation tilt based on velocity
        const speed = Math.sqrt(dx*dx + dy*dy);
        const tilt = Math.min(speed * 0.5, 30); // Max tilt 30deg
        
        customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) rotate(${tilt * (dx > 0 ? 1 : -1)}deg)`;

        // Update and draw particles
        for(let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if(particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(renderLoop);
    }
    renderLoop();
}

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Custom Typing Effect
const typedTextSpan = document.querySelector(".typing-text");
if (typedTextSpan) {
    const textArray = ["Web Developer", "Startup Founder", "AI Enthusiast", "Creative Thinker"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; 
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    });
}

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// AI Widget Toggle
const aiWidget = document.getElementById('ai-widget');
const aiIcon = document.querySelector('.ai-icon');
if (aiWidget && aiIcon) {
    aiIcon.addEventListener('click', () => {
        aiWidget.classList.toggle('active');
    });
}

// Form Submission (Simulated)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending... <i class="fa-solid fa-spinner fa-spin"></i></span>';
        
        setTimeout(() => {
            btn.innerHTML = '<span>Sent Successfully <i class="fa-solid fa-check"></i></span>';
            btn.style.background = 'linear-gradient(45deg, #00ff88, #00aaff)';
            e.target.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }, 2000);
    });
}

// Shared hacker background
const hackerCanvas = document.getElementById('hacker-rain');

if (hackerCanvas) {
    const hackerCtx = hackerCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const matrixChars = '01<>[]{}=+*/#$%&:;ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let fontSize = 16;
    let columns = 0;
    let drops = [];
    let lastFrameTime = 0;

    function resizeHackerCanvas() {
        hackerCanvas.width = window.innerWidth;
        hackerCanvas.height = window.innerHeight;
        fontSize = window.innerWidth < 768 ? 14 : 16;
        columns = Math.ceil(hackerCanvas.width / fontSize);
        drops = Array.from({ length: columns }, () => (Math.random() * -40));
    }

    function drawMatrix(timestamp = 0) {
        if (!hackerCtx) {
            return;
        }

        if (timestamp - lastFrameTime < (reducedMotion ? 140 : 55)) {
            requestAnimationFrame(drawMatrix);
            return;
        }

        lastFrameTime = timestamp;
        hackerCtx.fillStyle = reducedMotion ? 'rgba(2, 8, 18, 0.34)' : 'rgba(2, 8, 18, 0.14)';
        hackerCtx.fillRect(0, 0, hackerCanvas.width, hackerCanvas.height);
        hackerCtx.font = `${fontSize}px "Space Grotesk", monospace`;
        hackerCtx.textBaseline = 'top';

        for (let i = 0; i < drops.length; i++) {
            const character = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const alpha = 0.3 + Math.random() * 0.5;
            const green = 206 + Math.floor(Math.random() * 20);
            const blue = 235 + Math.floor(Math.random() * 20);

            hackerCtx.fillStyle = `rgba(135, ${green}, ${blue}, ${alpha})`;
            hackerCtx.fillText(character, x, y);

            if (y > hackerCanvas.height && Math.random() > 0.975) {
                drops[i] = Math.random() * -18;
            } else {
                drops[i] += reducedMotion ? 0.45 : 0.9 + Math.random() * 0.35;
            }
        }

        requestAnimationFrame(drawMatrix);
    }

    resizeHackerCanvas();

    if (reducedMotion) {
        drawMatrix(200);
    } else {
        requestAnimationFrame(drawMatrix);
    }

    window.addEventListener('resize', resizeHackerCanvas);
}

// GSAP Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Stats Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    if (stats.length > 0) {
        stats.forEach(stat => {
            const val = parseInt(stat.getAttribute('data-val'));
            let hasPlus = stat.textContent.includes('+');
            let hasPercent = stat.textContent.includes('%');
            
            ScrollTrigger.create({
                trigger: ".hero-stats",
                start: "top 80%",
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: val,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            let currentVal = Math.round(this.targets()[0].innerHTML);
                            stat.innerHTML = currentVal + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                        }
                    });
                },
                once: true
            });
        });
    }

    // Section Title Reveal
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) {
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.7)"
            });
        });
    }

    // About Progress Bars
    const progresses = document.querySelectorAll('.progress');
    if (progresses.length > 0) {
        gsap.utils.toArray('.progress').forEach(progress => {
            ScrollTrigger.create({
                trigger: ".skills-container",
                start: "top 80%",
                onEnter: () => {
                    progress.style.width = progress.getAttribute('data-width');
                },
                once: true
            });
        });
    }

    // Glass Cards Fade Up
    const cards = document.querySelectorAll('.glass-card, .project-card');
    if (cards.length > 0) {
        gsap.utils.toArray(cards).forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%", // Trigger slightly earlier to ensure they appear
                },
                y: 50,
                autoAlpha: 0, // Using autoAlpha is more reliable than opacity for fading in
                duration: 0.8,
                ease: "power3.out"
            });
        });
    }

    // Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.2,
                ease: "power2.out"
            });
        });
    }
}

// Project Modal Logic
const closeBtns = document.querySelectorAll('.close-modal');

function setupModal(triggerId, modalId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    
    if (trigger && modal) {
        trigger.addEventListener('click', (e) => {
            // Prevent opening if clicked on any link (Live, Code, etc.)
            if (e.target.closest('a')) return;
            
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        });
    }
}

// Initialize all modals
setupModal('yasinova-trigger', 'yasinova-modal');
setupModal('gallery-trigger', 'gallery-modal');

// Global close logic
closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.project-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('project-modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});
