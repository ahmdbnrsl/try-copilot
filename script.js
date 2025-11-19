// script.js
// Fungsi: toggle mobile nav, otomatis tutup menu saat link diklik,
// animasi entrance hero, dan IntersectionObserver untuk reveal sections.

// ----- Helper: DOM ready -----
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const hero = document.querySelector('.reveal-hero');

  // ----- Mobile nav toggle -----
  function toggleMobileMenu() {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Tutup menu jika user klik salah satu link mobile
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Untuk desktop nav (jika ingin responsive close untuk mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // nothing required, anchor akan scroll ke section
    });
  });

  // ----- Hero entrance animation -----
  // Tambah kelas 'entered' setelah DOM load untuk memicu transition
  // gunakan setTimeout kecil untuk efek entrance yang halus
  setTimeout(() => {
    if (hero) hero.classList.add('entered');
  }, 120);

  // ----- IntersectionObserver: reveal on scroll -----
  // Target semua elemen dengan class .reveal (kecuali hero yang memiliki .reveal-hero)
  const revealElems = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // sedikit offset sebelum elemen penuh terlihat
    threshold: 0.12 // trigger saat 12% terlihat
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // Jika ingin satu kali reveal saja, unobserve elemen
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElems.forEach(elem => {
    revealObserver.observe(elem);
  });

  // ----- Accessibility: close mobile menu with Escape key -----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // ----- Auto-close mobile menu if window resizes to desktop -----
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      // Pastikan mobile menu tertutup
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });
});
