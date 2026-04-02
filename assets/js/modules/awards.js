/* ============================================================
   MODULES / awards.js
   3D flip-in reveal + persistent hover tilt on award cards
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initAwards() {
    var section = document.getElementById('awards');
    if (!section) return;

    var cards = section.querySelectorAll('.award-card');
    if (!cards.length) return;

    /* ── Initial 3D flip-in reveal ───────────────────────────── */
    gsap.set(cards, {
      rotateY: -90,
      opacity: 0,
      transformOrigin: 'left center',
      transformPerspective: 800
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: function () {
        gsap.to(cards, {
          rotateY: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'back.out(1.5)',
          stagger: 0.18,
          transformOrigin: 'center center'
        });

        /* After flip completes, add hover tilt ── */
        gsap.delayedCall(0.9 + cards.length * 0.18, function () {
          addHoverTilt(cards);
        });
      }
    });

    /* ── Icon bounce ─────────────────────────────────────────── */
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: function () {
        var icons = section.querySelectorAll('.award-card__icon');
        gsap.from(icons, {
          y: -20,
          opacity: 0,
          stagger: 0.18,
          duration: 0.6,
          ease: 'bounce.out',
          delay: 0.5
        });
      }
    });
  }

  /* ── Hover tilt (added after entrance anim) ──────────────── */
  function addHoverTilt(cards) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width  / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width  / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);

        gsap.to(card, {
          rotateX: -dy * 8,
          rotateY:  dx * 10,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center'
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
          transformPerspective: 800
        });
      });
    });
  }

  window.Portfolio.initAwards = initAwards;

})();
