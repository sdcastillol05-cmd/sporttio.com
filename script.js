/* ─────────────────────────────────────────
   SPORTTIO — script.js
───────────────────────────────────────── */

(function () {
  'use strict';

  /* === NAVBAR: transparente → sólida al scroll === */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // estado inicial

  /* === NAVBAR MOBILE TOGGLE === */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animar hamburguesa → X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Cerrar menú al hacer clic en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* === REVEAL ON SCROLL (IntersectionObserver) === */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.diff-card, .prod-card, .step, .testi-card, .ben-stat, .section-title, .hero-text, .hero-grid'
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger ligero entre elementos del mismo grid
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  }

  initReveal();

  /* === SMOOTH SCROLL para links internos === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* === PRODUCT CARD: cursor y micro hover sound (sin sonido, solo visual) === */
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });

  /* === WHATSAPP FLOAT: ocultar en hero visible, mostrar al bajar === */
  const waFloat = document.querySelector('.wa-float');
  const heroSection = document.querySelector('.hero');

  function toggleWaFloat() {
    if (!heroSection || !waFloat) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom > 0) {
      waFloat.style.opacity = '0.3';
      waFloat.style.transform = 'scale(0.85)';
    } else {
      waFloat.style.opacity = '1';
      waFloat.style.transform = 'scale(1)';
    }
  }

  waFloat.style.transition = 'opacity .3s, transform .3s, box-shadow .2s';
  window.addEventListener('scroll', toggleWaFloat, { passive: true });
  toggleWaFloat();

  /* === NÚMEROS: contador animado === */
  function animateCounter(el, target, suffix = '', duration = 1400) {
    let start = 0;
    const startTime = performance.now();
    const isPlus = target.toString().includes('+') || suffix.includes('+');
    const numericTarget = parseInt(target.toString().replace(/\D/g, ''));

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * numericTarget);
      el.textContent = (isPlus ? '+' : '') + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target; // asegurar el valor final exacto
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.ben-num, .stat-num, .hg-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          const raw = entry.target.textContent.trim();
          animateCounter(entry.target, raw);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  initCounters();

  /* === CATALOG: lazy-load fallback placeholder === */
  document.querySelectorAll('.prod-img img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = '0';
      img.closest('.prod-img').style.background = '#f0f0ee';
    });
    img.addEventListener('load', () => {
      img.style.transition = 'opacity .3s';
      img.style.opacity = '1';
    });
    img.style.opacity = '0';
    if (img.complete) img.dispatchEvent(new Event('load'));
  });

  /* === HERO GRID: lazy-load fallback === */
  document.querySelectorAll('.hg-item img, .hg-main img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  /* === STICKY HEADER SHADE: sombra progresiva === */
  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / 200, 1);
    navbar.style.setProperty('--nav-shadow-opacity', p * 0.08);
  }, { passive: true });

})();
