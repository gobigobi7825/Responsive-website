/* ══════════════════════════════════════════════════════════
   main.js — Portfolio interactivity
   • Theme toggle (light / dark) with localStorage persistence
   • Mobile navigation toggle
   • Scroll-based reveal animations (IntersectionObserver)
   • Active nav link highlighting on scroll
══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── THEME TOGGLE ──────────────────────────────────────────
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('themeToggle');
  const STORAGE_KEY  = 'portfolio-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  // On load: honour saved preference or OS setting
  (function initTheme() {
    let saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
    applyTheme(saved || preferred);
  })();

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ── MOBILE NAV ────────────────────────────────────────────
  const menuToggle = document.querySelector('.nav__menu-toggle');
  const navLinks   = document.getElementById('nav-links');

  function closeNav() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNav();
    } else {
      menuToggle.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close nav on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // Close nav when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeNav();
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealTargets = [
    '.hero__text',
    '.hero__visual',
    '.hero__stat',
    '.card',
    '.about__portrait',
    '.about__content',
    '.process__step',
    '.contact__inner',
  ];

  function addRevealClass() {
    revealTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal');
      });
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  addRevealClass();
  // Slight defer so CSS transitions fire correctly after paint
  requestAnimationFrame(() => requestAnimationFrame(initReveal));

  // ── ACTIVE NAV ON SCROLL ──────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach(s => navIO.observe(s));

  // ── HEADER SHADOW ON SCROLL ───────────────────────────────
  const header = document.querySelector('.site-header');
  let ticking  = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('site-header--scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();
