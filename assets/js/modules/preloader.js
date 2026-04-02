/* ============================================================
   MODULES / preloader.js
   Full-screen curtain preloader with "OU" initials & counter
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initPreloader(onComplete) {
    var preloader = document.getElementById('preloader');
    if (!preloader) {
      onComplete && onComplete();
      return;
    }

    var panelTop    = preloader.querySelector('.preloader__panel--top');
    var panelBot    = preloader.querySelector('.preloader__panel--bottom');
    var initials    = preloader.querySelector('.preloader__initials');
    var counterEl   = preloader.querySelector('.preloader__counter');
    var barFill     = preloader.querySelector('.preloader__bar-fill');

    // ensure body blocks scroll during load
    document.body.classList.add('loading');

    var tl = gsap.timeline({
      onComplete: function () {
        // Remove preloader from DOM
        gsap.delayedCall(0.1, function () {
          preloader.remove();
          document.body.classList.remove('loading');
          onComplete && onComplete();
        });
      }
    });

    // ── Phase 1: initials scale up ───────────────────────────
    tl.fromTo(initials,
      { scale: 0.5, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: 0.6, ease: 'power3.out' },
      0
    );

    // ── Phase 2: counter 0 → 100 + bar fill ─────────────────
    var counterObj = { val: 0 };

    tl.to(counterObj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: function () {
        var v = Math.round(counterObj.val);
        counterEl.textContent = v + '%';
        barFill.style.width = v + '%';
      }
    }, 0.15);

    // ── Phase 3: initials scale out & fade ──────────────────
    tl.to(initials,
      { scale: 5, opacity: 0, duration: 0.7, ease: 'power2.in' },
      1.5
    );

    // ── Phase 4: curtain reveal — panels slide away ──────────
    tl.to(panelTop,
      { yPercent: -100, duration: 0.7, ease: 'power4.inOut' },
      1.8
    );
    tl.to(panelBot,
      { yPercent: 100, duration: 0.7, ease: 'power4.inOut' },
      1.8
    );

    // Counter fades with panels
    tl.to([counterEl, barFill.parentElement],
      { opacity: 0, duration: 0.3, ease: 'power2.out' },
      1.7
    );
  }

  window.Portfolio.initPreloader = initPreloader;

})();
