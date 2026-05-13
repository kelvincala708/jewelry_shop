// ================================================
// LUMIÈRE — Fine Jewelry  |  main.js
// ================================================

// --- Navbar: transparent → dark on scroll ---
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Mobile menu toggle ---
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// --- Smooth anchor scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// --- Hero video: fade in only when playback is ready (no flash of still image) ---
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const showVideo = () => heroVideo.classList.add('ready');
  heroVideo.addEventListener('canplay', showVideo);
  // Fallback: if video never fires canplay (e.g. unsupported), keep dark background
  setTimeout(() => heroVideo.classList.add('ready'), 4000);
}

// --- Gold particle generator for hero ---
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size     = Math.random() * 2.5 + 0.8;
    const duration = Math.random() * 16 + 12;
    const delay    = Math.random() * 18;

    Object.assign(p.style, {
      width:            `${size}px`,
      height:           `${size}px`,
      left:             `${Math.random() * 100}%`,
      bottom:           `${Math.random() * 15}%`,
      animationDuration:`${duration}s`,
      animationDelay:   `${delay}s`,
    });
    container.appendChild(p);
  }
}
spawnParticles();

// --- Scroll reveal with staggered delay ---
const revealTargets = [
  '.section-header',
  '.collection-card',
  '.product-card',
  '.promise-item',
  '.testimonial-card',
  '.gallery-item',
  '.about-content',
  '.about-image',
  '.newsletter-inner',
];

document.querySelectorAll(revealTargets.join(',')).forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    // Stagger siblings by 80ms each
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => {
      entry.target.classList.add('visible');
    }, Math.max(idx, 0) * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- Wishlist heart toggle ---
document.querySelectorAll('.btn-wishlist').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const on = btn.classList.toggle('active');
    btn.textContent    = on ? '♥' : '♡';
    btn.style.color    = on ? 'var(--gold)' : '';
  });
});

// --- Newsletter form ---
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn   = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');
    const orig  = btn.textContent;
    btn.textContent    = '✦ Thank you!';
    btn.style.background = '#2a5c24';
    input.value = '';
    setTimeout(() => {
      btn.textContent    = orig;
      btn.style.background = '';
    }, 3500);
  });
}

// --- Auto-hide image placeholders once the real image loads ---
document.querySelectorAll('[style*="background-image"]').forEach(el => {
  const match = (el.getAttribute('style') || '').match(/url\(['"]?([^'")\s]+)['"]?\)/);
  if (!match) return;
  const img = new Image();
  img.onload = () => {
    const ph = el.querySelector(
      '.card-placeholder, .product-placeholder, .about-placeholder, .gallery-placeholder'
    );
    if (ph) ph.style.opacity = '0';
  };
  img.src = match[1];
});

// --- Parallax on hero text (subtle) ---
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.18}px)`;
    hero.style.opacity   = `${1 - scrolled / (window.innerHeight * 0.75)}`;
  }
}, { passive: true });
