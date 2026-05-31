/* ─── js/main.js — Init, cursor, nav, loading ─── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loading Screen ── */
  const overlay = document.getElementById('loading-overlay');
  const pct = document.getElementById('loading-pct');
  let count = 0;
  const counter = setInterval(() => {
    count = Math.min(count + Utils.randomInt(1, 8), 100);
    if (pct) pct.textContent = count + '%';
    if (count >= 100) {
      clearInterval(counter);
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        // Trigger scroll animations after load
        ScrollAnimations.init();
      }, 400);
    }
  }, 40);

  /* ── Custom Cursor ── */
  const cursor = document.getElementById('custom-cursor');
  const ring   = document.getElementById('cursor-ring');
  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  function animateCursor() {
    rx = Utils.lerp(rx, cx, 0.12);
    ry = Utils.lerp(ry, cy, 0.12);
    if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
    if (ring)   { ring.style.left = rx + 'px';   ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn-luxury, .project-panel, .inscription, .service-chapter, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', Utils.throttle(() => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, 100));

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navLinks.style.cssText = open
        ? 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:rgba(5,8,20,0.97);padding:2rem;gap:1.5rem;z-index:999;backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,175,55,0.1);'
        : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navLinks.style.cssText = '';
    }));
  }

  /* ── Smooth scroll links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* Page transition for standalone offering experiences */
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const href = a.getAttribute('href');
      if (!href || href === window.location.pathname.split('/').pop()) return;
      e.preventDefault();
      let veil = document.querySelector('.page-transition-veil');
      if (!veil) {
        veil = document.createElement('div');
        veil.className = 'page-transition-veil';
        document.body.appendChild(veil);
      }
      requestAnimationFrame(() => veil.classList.add('active'));
      setTimeout(() => { window.location.href = href; }, 430);
    });
  });

  /* ── Hero init ── */
  Hero.init();

  /* ── WhatsApp ── */
  document.querySelectorAll('.whatsapp-link').forEach(el => {
    el.href = 'https://wa.me/918639060862';
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  /* ── Stats counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      let current = 0;
      const step = target / 60;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        if (current < target) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }, { threshold: 0.5 });
    obs.observe(el);
  });
});
