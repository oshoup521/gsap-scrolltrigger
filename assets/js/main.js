/* ============================================================
   MAIN.JS
   Bootstraps all modules after preloader completes.
   Handles: general scroll reveals, nav behaviour, about card.
   ============================================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ════════════════════════════════════════════════════════════
     GENERAL SCROLL REVEALS
     ══════════════════════════════════════════════════════════ */

  function initRevealText() {
    gsap.utils.toArray('.reveal-text').forEach(function (el) {
      gsap.to(el, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  function initRevealTitles() {
    gsap.utils.toArray('.reveal-title').forEach(function (title) {
      var lineInners = title.querySelectorAll('.line-inner');
      if (!lineInners.length) {
        /* Fallback: animate the title itself */
        gsap.from(title, {
          opacity: 0, y: 50,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: title, start: 'top 88%', once: true }
        });
        return;
      }
      gsap.from(lineInners, {
        y: '105%',
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: title, start: 'top 88%', once: true }
      });
    });
  }

  function initRevealParas() {
    gsap.utils.toArray('.reveal-para').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
      gsap.set(el, { y: 40 });
    });
  }

  function initRevealFades() {
    gsap.utils.toArray('.reveal-fade').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 4) * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
      gsap.set(el, { scale: 0.94 });
    });
  }

  /* ════════════════════════════════════════════════════════════
     NAV
     ══════════════════════════════════════════════════════════ */

  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    /* Fade in after preloader */
    gsap.to(nav, { opacity: 1, duration: 0.6, ease: 'power2.out' });

    /* Add .scrolled class + backdrop blur on scroll */
    ScrollTrigger.create({
      start: 'top -60',
      onEnter:     function () { nav.classList.add('scrolled'); },
      onLeaveBack: function () { nav.classList.remove('scrolled'); }
    });

    /* ── Hamburger toggle ── */
    var hamburger = document.getElementById('navHamburger');
    if (hamburger) {
      function closeMobileNav() {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      hamburger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('nav--open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      /* Close on nav link click */
      nav.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
      });

      /* Close on Escape key */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMobileNav();
      });
    }

    /* Active link highlight */
    var links = nav.querySelectorAll('.nav__link');
    var sections = ['about','skills','experience','projects','awards','education','contact'];
    sections.forEach(function (id) {
      ScrollTrigger.create({
        trigger: '#' + id,
        start: 'top center',
        end: 'bottom center',
        onEnter:     function () { setActive(id); },
        onEnterBack: function () { setActive(id); }
      });
    });

    function setActive(id) {
      links.forEach(function (l) {
        if (l.getAttribute('href') === '#' + id) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
    }
  }

  /* ════════════════════════════════════════════════════════════
     ABOUT CARD FLOAT + TILT
     ══════════════════════════════════════════════════════════ */

  function initAboutCard() {
    var card = document.querySelector('.about__card');
    if (!card) return;

    /* Infinite float */
    gsap.to(card, {
      y: -14,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    /* Mouse tilt */
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      var dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(card, {
        rotateX: -dy * 10,
        rotateY:  dx * 12,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 900
      });
    });

    card.addEventListener('mouseleave', function () {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.4)',
        transformPerspective: 900
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ABOUT CONTENT WORD REVEAL
     ══════════════════════════════════════════════════════════ */

  function initAboutWords() {
    var splitWords = window.Portfolio.splitWords;
    var about = document.getElementById('about');
    if (!about || !splitWords) return;

    var paras = about.querySelectorAll('.about__desc p');
    paras.forEach(function (p) {
      var words = splitWords(p, 'about__title-word');
      gsap.from(words, {
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: p, start: 'top 85%', once: true }
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     SCROLL INDICATOR BOUNCE
     ══════════════════════════════════════════════════════════ */

  function initScrollIndicator() {
    var ind = document.querySelector('.scroll-indicator');
    if (!ind) return;

    /* Animate the line inside */
    var line = ind.querySelector('.scroll-indicator__line');
    if (line) {
      gsap.fromTo(line,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          duration: 0.8,
          ease: 'power2.out',
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.4
        }
      );
    }

    /* Hide indicator when user scrolls past hero */
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 80%',
      onEnter:     function () { gsap.to(ind, { opacity: 0, y: 20, duration: 0.5 }); },
      onLeaveBack: function () { gsap.to(ind, { opacity: 1, y: 0,  duration: 0.5 }); }
    });
  }

  /* ════════════════════════════════════════════════════════════
     PARALLAX BACKGROUND SECTIONS
     ══════════════════════════════════════════════════════════ */

  function initParallax() {
    /* Subtle upward parallax on section backgrounds */
    gsap.utils.toArray('.section--dark-bg').forEach(function (el) {
      gsap.to(el, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     FOOTER REVEAL
     ══════════════════════════════════════════════════════════ */

  function initFooter() {
    var footer = document.querySelector('.footer');
    if (!footer) return;
    gsap.from(footer, {
      opacity: 0, y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 95%', once: true }
    });
  }

  /* ════════════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════════ */

  function boot() {
    /* 1. Start cursor immediately (before preloader) */
    if (window.Portfolio.initCursor)   window.Portfolio.initCursor();

    /* 2. Run preloader, then init everything else */
    window.Portfolio.initPreloader(function onPreloaderDone() {

      /* Refresh ScrollTrigger after DOM reflow */
      ScrollTrigger.refresh();

      /* Nav */
      initNav();

      /* Hero (particles + name anim + globs + stats) */
      if (window.Portfolio.initHero) window.Portfolio.initHero();

      /* Scroll reveals */
      initRevealText();
      initRevealTitles();
      initRevealParas();
      initRevealFades();

      /* Scroll indicator */
      initScrollIndicator();

      /* About */
      initAboutCard();
      initAboutWords();

      /* Skills */
      if (window.Portfolio.initSkills)     window.Portfolio.initSkills();

      /* Projects horizontal */
      if (window.Portfolio.initProjects)   window.Portfolio.initProjects();

      /* Experience timeline */
      if (window.Portfolio.initExperience) window.Portfolio.initExperience();

      /* Awards */
      if (window.Portfolio.initAwards)     window.Portfolio.initAwards();

      /* Contact */
      if (window.Portfolio.initContact)    window.Portfolio.initContact();

      /* Magnetic buttons */
      if (window.Portfolio.initMagnetic)   window.Portfolio.initMagnetic();

      /* Parallax */
      initParallax();

      /* Footer */
      initFooter();

      /* Final ScrollTrigger refresh after all inits */
      gsap.delayedCall(0.2, function () { ScrollTrigger.refresh(); });
    });
  }

  /* Wait for DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
