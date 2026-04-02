/* ============================================================
   UTILS / magnetic.js
   Magnetic button effect — elements with class "magnetic"
   get an elastic follow on mouse enter/leave
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  /**
   * initMagnetic
   * Attaches magnetic pull & release to every .magnetic element.
   * Uses gsap.to() for elastic animation.
   */
  function initMagnetic() {
    var magnets = document.querySelectorAll('.magnetic');

    magnets.forEach(function (magnet) {
      var inner = magnet.querySelector('.magnetic__inner') || magnet;
      var strength = parseFloat(magnet.dataset.magneticStrength) || 0.35;

      magnet.addEventListener('mousemove', function (e) {
        var rect = magnet.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * strength;
        var dy = (e.clientY - cy) * strength;

        gsap.to(inner, {
          x: dx,
          y: dy,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto'
        });

        // slight rotation for extra feel
        gsap.to(inner, {
          rotation: dx * 0.05,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto'
        });
      });

      magnet.addEventListener('mouseleave', function () {
        gsap.to(inner, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto'
        });
      });

      // On click: little squeeze
      magnet.addEventListener('mousedown', function () {
        gsap.to(inner, { scale: 0.92, duration: 0.15, ease: 'power2.out' });
      });

      magnet.addEventListener('mouseup', function () {
        gsap.to(inner, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  window.Portfolio.initMagnetic = initMagnetic;

})();
