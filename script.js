// script.js (finalized)
// - Handles initial reveal animation trigger
// - Smooth scrolling behavior (anchor links)
// - Mobile nav toggle with overlay and accessible aria-expanded toggling
// - Scroll reveal (Intersection Observer) for .scroll-reveal elements
// - Ensures mobile nav closes when link clicked or overlay clicked

document.addEventListener('DOMContentLoaded', function () {
  // 1) Trigger initial entrance animations
  window.requestAnimationFrame(function () {
    document.body.classList.add('is-loaded');
  });

  // 2) Smooth scrolling for internal anchor links (#...)
  //    We also close the mobile nav when a nav link is clicked.
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      var targetId = href.slice(1);
      if (!targetId) return;

      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close mobile nav if open
        closeMobileNav();

        // Smooth scroll with header offset
        var headerOffset = Math.min(80, Math.round(window.innerHeight * 0.06));
        var elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3) Mobile nav toggle + overlay
  var navToggle = document.querySelector('.nav-toggle');
  var siteHeader = document.querySelector('.site-header');
  var navList = document.querySelector('.nav-list');
  var navOverlay = document.querySelector('.nav-overlay');

  function openMobileNav() {
    siteHeader.classList.add('nav-open');
    navList.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    siteHeader.classList.remove('nav-open');
    navList.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }
  function toggleMobileNav() {
    if (!siteHeader.classList.contains('nav-open')) openMobileNav();
    else closeMobileNav();
  }

  if (navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileNav();
    });
  }

  // Clicking overlay closes nav
  if (navOverlay) {
    navOverlay.addEventListener('click', function () {
      closeMobileNav();
    });
  }

  // Close menu when any nav-link is clicked (covers internal & external)
  document.querySelectorAll('.nav-list .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      // small delay so link navigation can proceed smoothly
      closeMobileNav();
    });
  });

  // Close mobile menu on resize if desktop layout is active
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) {
      closeMobileNav();
    }
  });

  // Close mobile menu when clicking outside the nav (optional)
  document.addEventListener('click', function (e) {
    if (!siteHeader.contains(e.target) && siteHeader.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });

  // 4) Scroll Reveal using Intersection Observer
  (function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.scroll-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var srElements = document.querySelectorAll('.scroll-reveal');
    if (!srElements.length) return;

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    };

    var srObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;

          // Optional per-element delay (data-sr-delay in ms)
          var delay = el.getAttribute('data-sr-delay');
          if (delay) {
            el.style.animationDelay = (parseInt(delay, 10) / 1000) + 's';
          }

          el.classList.add('is-visible');
          observer.unobserve(el); // reveal only once
        }
      });
    }, observerOptions);

    srElements.forEach(function (el) {
      srObserver.observe(el);
    });
  })();
});