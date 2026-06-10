/* ============================================
   VALIDACIÓN DE DOCUMENTOS — SENA
   main.js
   ============================================ */

// ── Utilities ───────────────────────────────

/**
 * Query helper — returns first match or null
 * @param {string} selector
 * @param {Element} [ctx=document]
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Query-all helper — returns NodeList
 * @param {string} selector
 * @param {Element} [ctx=document]
 */
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

// ── DOM Ready ────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initAccordions();
  initScrollReveal();
  initBackToTop();
  initActiveNavLinks();
  initPillHighlight();
});

// ── Navbar scroll shadow ─────────────────────

function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Mobile hamburger ─────────────────────────

function initHamburger() {
  const btn   = $('#hamburger');
  const links = $('#navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));

    // Animate hamburger lines → X
    const spans = $$('span', btn);
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on nav-link click (mobile)
  $$('.nav-link', links).forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      const spans = $$('span', btn);
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── Accordions ───────────────────────────────

function initAccordions() {
  $$('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const body = btn.nextElementSibling;

      // Collapse all others
      $$('.accordion-btn').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherBody = other.nextElementSibling;
          if (otherBody) otherBody.classList.remove('open');
        }
      });

      // Toggle this one
      btn.setAttribute('aria-expanded', String(!expanded));
      if (body) body.classList.toggle('open', !expanded);
    });
  });
}

// ── Scroll reveal ────────────────────────────

function initScrollReveal() {
  // Add .reveal to major content blocks
  const targets = [
    '.section-header',
    '.quote-block',
    '.highlight-box',
    '.two-col',
    '.table-scroll',
    '.intro-cards',
    '.quality-grid',
    '.activity-card',
    '.ov-card',
    '.hero-card',
    '.accordion',
    '.instrument-pills',
  ];

  targets.forEach(selector => {
    $$(selector).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach(el => observer.observe(el));
}

// ── Back-to-top button ───────────────────────

function initBackToTop() {
  const btn = $('#backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Active nav links on scroll ───────────────

function initActiveNavLinks() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link[href^="#"]');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(section => observer.observe(section));
}

// ── Pill highlight (instrument pills) ────────

function initPillHighlight() {
  $$('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active within its parent
      const siblings = $$('.pill', pill.parentElement);
      siblings.forEach(p => p.classList.remove('pill-active'));
      pill.classList.add('pill-active');
    });
  });
}
