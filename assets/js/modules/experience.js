/* ============================================================
   MODULES / experience.js
   SVG line draw on scroll + alternating timeline reveals
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initExperience() {
    var section  = document.getElementById('experience');
    if (!section) return;

    /* ── SVG line draw via scrub ─────────────────────────────── */
    var svgFill = section.querySelector('.experience__fill');
    if (svgFill) {
      var lineLength = 600;
      svgFill.style.strokeDasharray  = lineLength;
      svgFill.style.strokeDashoffset = lineLength;

      gsap.to(svgFill, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.experience__layout',
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: 1.5
        }
      });
    }

    /* ── Timeline dots pop in ─────────────────────────────────── */
    var dots = section.querySelectorAll('.exp-item__dot');
    dots.forEach(function (dot, i) {
      ScrollTrigger.create({
        trigger: dot,
        start: 'top 75%',
        once: true,
        onEnter: function () {
          gsap.to(dot, {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(3)',
            delay: i * 0.15
          });
        }
      });
    });

    /* ── Left items slide from left ──────────────────────────── */
    var leftItems = section.querySelectorAll('.exp-item--left');
    leftItems.forEach(function (item) {
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          once: true
        }
      });
      gsap.set(item, { x: -80 });
    });

    /* ── Right items slide from right ────────────────────────── */
    var rightItems = section.querySelectorAll('.exp-item--right');
    rightItems.forEach(function (item) {
      gsap.set(item, { x: 80 });
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          once: true
        }
      });
    });

    /* ── Tech chips stagger in after card ────────────────────── */
    var chipGroups = section.querySelectorAll('.exp-item__chips');
    chipGroups.forEach(function (group) {
      var chips = group.querySelectorAll('.exp-item__chip');
      ScrollTrigger.create({
        trigger: group,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(chips, {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.2
          });
        }
      });
    });

    /* ── Education cards stagger ─────────────────────────────── */
    var eduCards = section.querySelectorAll('.edu-card');
    if (eduCards.length) {
      gsap.from(eduCards, {
        opacity: 0,
        y: 50,
        scale: 0.94,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.education__grid',
          start: 'top 80%',
          once: true
        }
      });
    }
  }

  window.Portfolio.initExperience = initExperience;

})();
