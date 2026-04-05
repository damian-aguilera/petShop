/* =============================================
   PAWLUX — main.js
   ============================================= */

// ─── LOADER ───────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
    // Trigger hero reveals after loader
    setTimeout(triggerHeroReveals, 300);
  }, 1600);
});

function triggerHeroReveals() {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

// ─── CUSTOM CURSOR ────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trailing for outer ring
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover effect
const hoverTargets = document.querySelectorAll('a, button, .service-card, .gallery-card, .tcard');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── NAV SCROLL ──────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── BURGER MENU ─────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  // Skip hero elements (handled by triggerHeroReveals)
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ─── TESTIMONIAL DOTS ────────────────────────
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('tDots');
const cards = track ? track.querySelectorAll('.tcard') : [];

if (cards.length && dotsContainer) {
  // Create dots
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Review ${i + 1}`);
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(btn);
  });

  function scrollToCard(index) {
    const card = cards[index];
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    updateDots(index);
  }

  function updateDots(index) {
    dotsContainer.querySelectorAll('button').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  // Update dots on scroll
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 20; // gap
      const index = Math.round(scrollLeft / cardWidth);
      updateDots(Math.min(index, cards.length - 1));
    }, 80);
  }, { passive: true });

  // Auto-scroll testimonials on mobile
  let autoIndex = 0;
  function autoScroll() {
    autoIndex = (autoIndex + 1) % cards.length;
    scrollToCard(autoIndex);
  }
  let autoTimer = setInterval(autoScroll, 4500);
  track.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
}

// ─── FLOATING CTA ─────────────────────────────
const floatCta = document.getElementById('floatCta');
const heroSection = document.querySelector('.hero');

const floatObserver = new IntersectionObserver((entries) => {
  floatCta.classList.toggle('visible', !entries[0].isIntersecting);
}, { threshold: 0.2 });

if (heroSection) floatObserver.observe(heroSection);

// ─── BOOKING FORM ─────────────────────────────
const form    = document.getElementById('bookingForm');
const success = document.getElementById('bookingSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.transition = 'opacity .4s ease, transform .4s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 400);
  });
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── PARALLAX BLOBS (subtle) ──────────────────
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const blob1 = document.querySelector('.blob-1');
      const blob2 = document.querySelector('.blob-2');
      if (blob1) blob1.style.transform = `translateY(${y * 0.12}px)`;
      if (blob2) blob2.style.transform = `translateY(${-y * 0.08}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ─── SERVICE CARD TILT (desktop) ──────────────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── GALLERY HOVER PULSE ──────────────────────
document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.g-emoji').style.transform = 'scale(1.2) rotate(-5deg)';
    card.querySelector('.g-emoji').style.transition = 'transform .3s cubic-bezier(0.34,1.56,0.64,1)';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.g-emoji').style.transform = '';
  });
});

// ─── NAV ACTIVE SECTION ──────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinksArr = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinksArr.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + entry.target.id) {
        link.style.color = 'var(--text)';
      }
    });
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
