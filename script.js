/* ==========================================
   HAZEM EKRAMY - PORTFOLIO JAVASCRIPT
   Advanced Animations & Interactions
   ========================================== */

// ---- CONFIG ----
const CONFIG = {
  cursor: true,
  lenisSmooth: true,
  scrollReveal: true,
  parallax: true,
  mouseEffects: true,
  loading: true
};

// ---- LOADING SCREEN ----
function initLoader() {
  const loader = document.querySelector('.loader-overlay');
  if (!loader) return;

  // Check if this is a fresh page load (not a back/forward navigation)
  const navigationType = performance.navigation ? performance.navigation.type : 0;
  const isFirstLoad = !sessionStorage.getItem('hasVisited') && navigationType !== 2;

  if (!isFirstLoad) {
    loader.classList.add('hidden');
    // Also trigger hero animations immediately since loader is skipped
    initHeroAnimations();
    return;
  }

  sessionStorage.setItem('hasVisited', 'true');

  const bar = loader.querySelector('.loader-bar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        initHeroAnimations();
      }, 500);
    }
    if (bar) bar.style.width = progress + '%';
  }, 150);
}

// ---- CUSTOM CURSOR ----
let cursorAnimationId = null;

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let isActive = true;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    if (!isActive) return;

    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    cursorAnimationId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      if (cursorAnimationId) cancelAnimationFrame(cursorAnimationId);
    } else {
      isActive = true;
      animateCursor();
    }
  });

  const hoverElements = document.querySelectorAll('a, button, .glass-card, .service-card, .project-card, .filter-btn, .social-link');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ---- LENIS SMOOTH SCROLL ----
let lenis;
function initLenis() {
  if (!CONFIG.lenisSmooth) return;

  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded, falling back to native scroll');
    return;
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ---- NAVIGATION ----
function initNavigation() {
  const nav = document.querySelector('.nav-main');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- HERO ANIMATIONS ----
function initHeroAnimations() {
  const greeting = document.querySelector('.hero-greeting');
  const name = document.querySelector('.hero-name');
  const title = document.querySelector('.hero-title');
  const cta = document.querySelector('.hero-cta');

  // Check if this is the first time animating on this page load
  // If elements are already visible (opacity: 1), don't hide them again
  const isFirstLoad = !sessionStorage.getItem('heroAnimated');

  if (isFirstLoad) {
    sessionStorage.setItem('heroAnimated', 'true');

    // Add animate-in class to set initial hidden state, then animate
    if (greeting) greeting.classList.add('animate-in');
    if (name) name.classList.add('animate-in');
    if (title) title.classList.add('animate-in');
    if (cta) cta.classList.add('animate-in');

    // Force reflow
    document.body.offsetHeight;

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (greeting) tl.to(greeting, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      if (name) tl.to(name, { opacity: 1, y: 0, duration: 1 }, 0.4);
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.7);
      if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
    } else {
      [greeting, name, title, cta].forEach((el, i) => {
        if (el) {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 200 + i * 200);
        }
      });
    }
  }
  // If not first load, elements stay at their default visible state (opacity: 1)
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  if (!CONFIG.scrollReveal) return;

  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ---- PARALLAX EFFECTS ----
function initParallax() {
  if (!CONFIG.parallax) return;

  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// ---- MOUSE MOVEMENT EFFECTS ----
function initMouseEffects() {
  if (!CONFIG.mouseEffects || window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.glass-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ---- PROJECTS CAROUSEL ----
function initProjectsCarousel() {
  const carousel = document.querySelector('.projects-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  }, { passive: true });
}

// ---- PROJECT FILTERS ----
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
          } else {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ---- EMAILJS CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // IMPORTANT: Replace these with your actual EmailJS credentials from https://dashboard.emailjs.com/
  // 1. Sign up at https://www.emailjs.com/
  // 2. Add an Email Service (Gmail, Outlook, etc.)
  // 3. Create an Email Template
  // 4. Go to Account > API Keys and copy your Public Key
  // 5. Replace the values below with your actual credentials

  const EMAILJS_CONFIG = {
    publicKey: 'eYKXtsYP5vAQpKmnt',     // Replace with your Public Key from EmailJS Account > API Keys
    serviceId: 'service_4btme5c',     // Replace with your Service ID from Email Services
    templateId: 'template_ad5aie9'   // Replace with your Template ID from Email Templates
  };

  // Check if credentials are still placeholders
  if (EMAILJS_CONFIG.publicKey === 'eYKXtsYP5vAQpKmnt' ||
      EMAILJS_CONFIG.serviceId === 'service_4btme5c' ||
      EMAILJS_CONFIG.templateId === 'template_ad5aie9') {
    console.warn('EmailJS: Please configure your credentials in script.js before using the contact form.');
    // Still attach the form handler but show a helpful message
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showFormMessage('Contact form is not configured yet. Please set up your EmailJS credentials in script.js or email me directly at hazemekramy2006@gmail.com', 'error');
    });
    return;
  }

  // Initialize EmailJS with the public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  } else {
    console.error('EmailJS SDK not loaded. Make sure the script tag is included in your HTML.');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    const templateParams = {
      from_name: form.querySelector('[name="name"]').value,
      from_email: form.querySelector('[name="email"]').value,
      message: form.querySelector('[name="message"]').value
    };

    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      .then(() => {
        showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        showFormMessage('Failed to send message. Please try again or contact me directly.', 'error');
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });
}

function showFormMessage(message, type) {
  const msgEl = document.querySelector('.form-message');
  if (!msgEl) return;

  msgEl.textContent = message;
  msgEl.className = 'form-message ' + type;

  setTimeout(() => {
    msgEl.className = 'form-message';
  }, 5000);
}

// ---- ANIMATED COUNTERS ----
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ---- THREE.JS BACKGROUND ----
function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xD4A853,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const orbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const orbMaterial1 = new THREE.MeshBasicMaterial({ color: 0xD4A853, transparent: true, opacity: 0.3 });
  const orbMaterial2 = new THREE.MeshBasicMaterial({ color: 0x8B2635, transparent: true, opacity: 0.3 });
  const orbMaterial3 = new THREE.MeshBasicMaterial({ color: 0x2D5A4A, transparent: true, opacity: 0.3 });

  const orb1 = new THREE.Mesh(orbGeometry, orbMaterial1);
  const orb2 = new THREE.Mesh(orbGeometry, orbMaterial2);
  const orb3 = new THREE.Mesh(orbGeometry, orbMaterial3);

  orb1.position.set(2, 1, -3);
  orb2.position.set(-2, -1, -4);
  orb3.position.set(0, 2, -5);

  scene.add(orb1, orb2, orb3);

  camera.position.z = 3;

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;

    orb1.position.y += Math.sin(Date.now() * 0.001) * 0.002;
    orb2.position.x += Math.cos(Date.now() * 0.0015) * 0.002;
    orb3.position.z += Math.sin(Date.now() * 0.0008) * 0.001;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ---- PAGE TRANSITIONS ----
function initPageTransitions() {
  const transition = document.querySelector('.page-transition');
  if (!transition) return;

  transition.classList.add('active');
  setTimeout(() => {
    transition.classList.remove('active');
  }, 800);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        transition.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      });
    }
  });
}

// ---- MARQUEE SPEED ON SCROLL ----
function initMarqueeScroll() {
  const marquee = document.querySelector('.marquee-track');
  if (!marquee) return;

  let scrollSpeed = 1;
  window.addEventListener('scroll', () => {
    const velocity = Math.abs(window.scrollY - (window.lastScrollY || 0));
    scrollSpeed = 1 + velocity * 0.01;
    marquee.style.animationDuration = (30 / scrollSpeed) + 's';
    window.lastScrollY = window.scrollY;
  }, { passive: true });
}

// ---- STATS ANIMATION ----
function initStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateValue(el, 0, target, 2000, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateValue(el, start, end, duration, suffix) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(start + (end - start) * eased) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---- TILT EFFECT FOR SERVICE CARDS ----
function initServiceTilt() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    const inner = card.querySelector('.service-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      inner.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// ---- MAGNETIC BUTTONS ----
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ---- TEXT SCRAMBLE EFFECT ----
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#________';
    this.originalText = el.textContent;
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end } = this.queue[i];
      let char = this.queue[i].char;

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }

    this.el.textContent = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

function initTextScramble() {
  const elements = document.querySelectorAll('[data-scramble]');
  elements.forEach(el => {
    const fx = new TextScramble(el);
    const phrases = el.dataset.scramble.split('|');
    let counter = 0;

    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 2500);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();
  });
}

// ---- THEME TOGGLE ----
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const html = document.documentElement;
  const icon = themeToggle.querySelector('.theme-icon');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    html.classList.add('light-mode');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
    themeToggle.classList.add('sun-mode');
  }

  themeToggle.addEventListener('click', () => {
    html.classList.toggle('light-mode');
    const isLightMode = html.classList.contains('light-mode');

    if (isLightMode) {
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
      themeToggle.classList.remove('moon-mode');
      themeToggle.classList.add('sun-mode');
      localStorage.setItem('theme', 'light');
    } else {
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      themeToggle.classList.remove('sun-mode');
      themeToggle.classList.add('moon-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ---- GLITCH EFFECT ----
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll('.glitch');
  glitchElements.forEach(el => {
    const originalText = el.textContent;
    el.setAttribute('data-text', originalText);
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initLenis();
  initNavigation();
  initThemeToggle();
  initScrollReveal();
  initParallax();
  initMouseEffects();
  initProjectsCarousel();
  initProjectFilters();
  initContactForm();
  initCounters();
  initThreeBackground();
  initPageTransitions();
  initMarqueeScroll();
  initStats();
  initServiceTilt();
  initMagneticButtons();
  initTextScramble();
  initGlitchEffect();
  // initHeroAnimations is called from initLoader when loader finishes or is skipped
});

// Preload fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Cleanup function for page transitions
window.addEventListener('beforeunload', () => {
  if (cursorAnimationId) cancelAnimationFrame(cursorAnimationId);
});
