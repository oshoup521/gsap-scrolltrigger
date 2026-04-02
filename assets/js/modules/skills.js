/* ============================================================
   MODULES / skills.js
   SVG ring progress animation + number counter on scroll
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initSkills() {
    var cards = document.querySelectorAll('.skill-card');
    if (!cards.length) return;

    var CIRCUMFERENCE = 2 * Math.PI * 50; // 314.159

    // ── Cards stagger in ─────────────────────────────────────
    gsap.fromTo(cards,
      { scale: 0, rotateY: 45, opacity: 0 },
      {
        scale: 1,
        rotateY: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.8)',
        stagger: {
          each: 0.1,
          from: 'start'
        },
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 75%',
          once: true
        }
      }
    );

    // ── Per-card ring + counter ───────────────────────────────
    cards.forEach(function (card) {
      var ringFill   = card.querySelector('.skill-card__ring-fill');
      var valueEl    = card.querySelector('.skill-card__ring-value');
      var percent    = parseInt(card.dataset.percent, 10) || 0;
      var color      = card.dataset.color || '#7c3aed';

      if (!ringFill || !valueEl) return;

      // Apply color
      ringFill.style.stroke = color;
      card.style.setProperty('--skill-color', color);

      // Initial state
      ringFill.style.strokeDasharray  = CIRCUMFERENCE;
      ringFill.style.strokeDashoffset = CIRCUMFERENCE;

      var obj = { val: 0, offset: CIRCUMFERENCE };

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          var targetOffset = CIRCUMFERENCE * (1 - percent / 100);

          gsap.to(obj, {
            val: percent,
            offset: targetOffset,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.1,
            onUpdate: function () {
              ringFill.style.strokeDashoffset = obj.offset;
              valueEl.textContent = Math.round(obj.val) + '%';
            }
          });
        }
      });
    });
  }

  window.Portfolio.initSkills = initSkills;

})();
