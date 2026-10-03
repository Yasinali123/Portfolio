

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

        // Fast direct cursor tracking
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.75;
        cursorY += dy * 0.75;

        // Rotation tilt based on velocity
        const speed = Math.sqrt(dx*dx + dy*dy);
        const tilt = Math.min(speed * 0.3, 20); // Max tilt 20deg
        
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
    const textArray = ["CS & Engineering Student", "Frontend Developer", "UI/UX Designer", "Startup Founder"];
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

// Initialize Lenis Smooth Scrolling if script is loaded
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('mobile-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking outside or link
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            navLinks.classList.remove('mobile-active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Floating Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth PDF Lightbox Modal Handler
const pdfOverlay = document.getElementById('pdf-modal-overlay');
const pdfFrame = document.getElementById('pdf-modal-frame');
const pdfTitle = document.getElementById('pdf-modal-title');
const pdfClose = document.getElementById('pdf-modal-close');

function openPdfModal(pdfUrl, titleText = "Document Preview") {
    if (pdfOverlay && pdfFrame) {
        pdfFrame.src = pdfUrl;
        if (pdfTitle) pdfTitle.textContent = titleText;
        pdfOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        window.open(pdfUrl, '_blank');
    }
}

if (pdfClose && pdfOverlay) {
    pdfClose.addEventListener('click', () => {
        pdfOverlay.classList.remove('show');
        if (pdfFrame) pdfFrame.src = '';
        document.body.style.overflow = '';
    });

    pdfOverlay.addEventListener('click', (e) => {
        if (e.target === pdfOverlay) {
            pdfOverlay.classList.remove('show');
            if (pdfFrame) pdfFrame.src = '';
            document.body.style.overflow = '';
        }
    });
}

// Global Close Modals on ESC Key Press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.project-modal, .pdf-modal-overlay').forEach(modal => {
            modal.classList.remove('show');
        });
        if (pdfFrame) pdfFrame.src = '';
        document.body.style.overflow = '';
    }
});

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

// Interactive Male Avatar Eye Tracking System (Steady Character, Fast Pupil Tracking)
document.addEventListener('DOMContentLoaded', () => {
    const pupilLeft = document.getElementById('pupil-left');
    const pupilRight = document.getElementById('pupil-right');
    const eyeSocketLeft = document.getElementById('eye-socket-left');
    const eyeSocketRight = document.getElementById('eye-socket-right');
    const eyebrowLeft = document.getElementById('eyebrow-left');
    const eyebrowRight = document.getElementById('eyebrow-right');
    const eyelidLeft = document.getElementById('eyelid-left');
    const eyelidRight = document.getElementById('eyelid-right');
    const avatarCard = document.getElementById('hero-avatar-card');

    let currentMouseX = window.innerWidth / 2;
    let currentMouseY = window.innerHeight / 2;

    let targetPupilLX = 0, targetPupilLY = 0;
    let targetPupilRX = 0, targetPupilRY = 0;
    let curPupilLX = 0, curPupilLY = 0;
    let curPupilRX = 0, curPupilRY = 0;

    function calcEyeOffset(eyeEl, maxDist = 12) {
        if (!eyeEl) return { x: 0, y: 0 };
        const rect = eyeEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = currentMouseX - centerX;
        const deltaY = currentMouseY - centerY;
        const angle = Math.atan2(deltaY, deltaX);
        const dist = Math.min(Math.hypot(deltaX, deltaY) / 10, maxDist);

        return {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist
        };
    }

    window.addEventListener('mousemove', (e) => {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;

        if (eyeSocketLeft && eyeSocketRight) {
            const offL = calcEyeOffset(eyeSocketLeft, 12);
            const offR = calcEyeOffset(eyeSocketRight, 12);
            targetPupilLX = offL.x;
            targetPupilLY = offL.y;
            targetPupilRX = offR.x;
            targetPupilRY = offR.y;
        }

        if (eyebrowLeft && eyebrowRight) {
            const eyeYOffset = (currentMouseY - window.innerHeight / 2) / (window.innerHeight / 2);
            const browY = eyeYOffset * -2.5;
            eyebrowLeft.style.transform = `translateY(${browY}px)`;
            eyebrowRight.style.transform = `translateY(${browY}px)`;
        }
    });

    // Fast 60fps pupil tracking render loop
    function animateAvatar() {
        curPupilLX += (targetPupilLX - curPupilLX) * 0.55;
        curPupilLY += (targetPupilLY - curPupilLY) * 0.55;
        curPupilRX += (targetPupilRX - curPupilRX) * 0.55;
        curPupilRY += (targetPupilRY - curPupilRY) * 0.55;

        if (pupilLeft) pupilLeft.style.transform = `translate(${curPupilLX}px, ${curPupilLY}px)`;
        if (pupilRight) pupilRight.style.transform = `translate(${curPupilRX}px, ${curPupilRY}px)`;

        requestAnimationFrame(animateAvatar);
    }
    animateAvatar();

    // Natural Eye Blinking Logic
    function blink() {
        if (eyelidLeft && eyelidRight) {
            eyelidLeft.style.opacity = '1';
            eyelidRight.style.opacity = '1';
            setTimeout(() => {
                eyelidLeft.style.opacity = '0';
                eyelidRight.style.opacity = '0';
            }, 120);
        }
    }
    setInterval(blink, 4200);

    if (avatarCard) {
        avatarCard.addEventListener('click', () => {
            blink();
            setTimeout(blink, 200);
        });
    }

    // Character Voice & Text-To-Speech (TTS) System
    const speakIntroBtn = document.getElementById('speak-intro-btn');
    const mouth = document.getElementById('character-mouth');
    const speechBubbleText = document.getElementById('speech-bubble-text');
    const avatarCardElem = document.getElementById('hero-avatar-card');

    const heroSpeechText = "Hi! I'm MD Yasin. Computer Science and Engineering Student, Frontend Developer, UI UX Designer, and Founder of Yasinova and RentED. I build scalable web experiences, creative motion, and modern digital architecture. Welcome to my portfolio!";

    let synth = window.speechSynthesis;
    let isSpeaking = false;
    let currentUtterance = null;

    function stopSpeaking() {
        if (synth) {
            synth.cancel();
        }
        isSpeaking = false;
        if (mouth) mouth.classList.remove('talking-mouth');
        if (speakIntroBtn) {
            speakIntroBtn.classList.remove('speaking');
            speakIntroBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Listen Character Intro</span>';
        }
        if (speechBubbleText) {
            speechBubbleText.textContent = "Hi, I'm MD Yasin! Click to hear me speak.";
        }
    }

    function speakIntro() {
        if (!('speechSynthesis' in window)) {
            alert("Text-to-Speech is not supported in this browser.");
            return;
        }

        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        currentUtterance = new SpeechSynthesisUtterance(heroSpeechText);
        currentUtterance.lang = 'en-IN'; // Indian English
        currentUtterance.rate = 0.92;
        currentUtterance.pitch = 0.85; // Male pitch setting

        // Voice filter: Exclude female voices & prioritize Indian Male English voices
        const voices = synth.getVoices();
        const isFemale = (vName) => {
            const n = vName.toLowerCase();
            return n.includes('female') || n.includes('heera') || n.includes('neerja') || 
                   n.includes('swara') || n.includes('zira') || n.includes('hazel') || 
                   n.includes('susan') || n.includes('catherine') || n.includes('woman') || n.includes('girl');
        };

        const maleIndianVoice = voices.find(v => 
            (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) && 
            !isFemale(v.name) &&
            (v.name.toLowerCase().includes('prabhat') || v.name.toLowerCase().includes('rishi') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('male'))
        ) || voices.find(v => 
            (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) && !isFemale(v.name)
        ) || voices.find(v => 
            v.lang.toLowerCase().includes('en') && !isFemale(v.name) &&
            (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('guy'))
        ) || voices.find(v => !isFemale(v.name));

        if (maleIndianVoice) {
            currentUtterance.voice = maleIndianVoice;
        }

        currentUtterance.onstart = () => {
            isSpeaking = true;
            if (mouth) mouth.classList.add('talking-mouth');
            if (speakIntroBtn) {
                speakIntroBtn.classList.add('speaking');
                speakIntroBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Stop Speaking</span>';
            }
            if (speechBubbleText) {
                speechBubbleText.textContent = "🎙️ Speaking intro...";
            }
        };

        currentUtterance.onend = () => {
            stopSpeaking();
        };

        currentUtterance.onerror = () => {
            stopSpeaking();
        };

        synth.speak(currentUtterance);
    }

    // Ensure voices are loaded for Chrome/Edge
    if (synth && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
            synth.getVoices();
        };
    }

    if (speakIntroBtn) {
        speakIntroBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakIntro();
        });
    }

    if (avatarCardElem) {
        avatarCardElem.addEventListener('click', () => {
            if (!isSpeaking) {
                speakIntro();
            } else {
                stopSpeaking();
            }
        });
    }
});

