/* ============================================================
   MODULES / cursor.js
   Custom dual-cursor: dot + ring with lerp, blend-mode, velocity stretch
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initCursor() {
    // Don't init on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    var dot   = document.getElementById('cursorDot');
    var ring  = document.getElementById('cursorRing');
    var label = ring ? ring.querySelector('.cursor-ring__label') : null;

    if (!dot || !ring) return;

    var mouse = { x: -200, y: -200 };
    var ringPos = { x: -200, y: -200 };
    var prevMouse = { x: -200, y: -200 };
    var lerpFactor = 0.12;
    var ringScale = 1;

    // ── Mouse move ──────────────────────────────────────────
    window.addEventListener('mousemove', function (e) {
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Move dot directly
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    });

    // ── GSAP ticker for ring lerp ────────────────────────────
    gsap.ticker.add(function () {
      // Lerp ring toward mouse
      ringPos.x += (mouse.x - ringPos.x) * lerpFactor;
      ringPos.y += (mouse.y - ringPos.y) * lerpFactor;

      // Velocity-based scaleX stretch
      var vx = mouse.x - prevMouse.x;
      var vy = mouse.y - prevMouse.y;
      var speed = Math.sqrt(vx * vx + vy * vy);
      var stretch = Math.min(1 + speed * 0.018, 1.8);
      var angle = Math.atan2(vy, vx) * (180 / Math.PI);

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
        scaleX: ringScale * stretch,
        scaleY: ringScale / Math.sqrt(stretch),
        rotation: angle
      });
    });

    // ── Hover states ─────────────────────────────────────────
    function onEnterHover() {
      ringScale = 2.5;
      gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.out' });
    }

    function onLeaveHover() {
      ringScale = 1;
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
      if (label) {
        label.style.opacity = '0';
        label.textContent = '';
      }
    }

    function addHoverListeners(selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          onEnterHover();

          // Check for cursor label
          var cursorData = el.dataset.cursor;
          if (cursorData && label) {
            label.textContent = cursorData;
            label.style.opacity = '1';
          }
        });
        el.addEventListener('mouseleave', onLeaveHover);
      });
    }

    // Attach to interactive elements
    addHoverListeners('a');
    addHoverListeners('button');
    addHoverListeners('.magnetic');
    addHoverListeners('[data-cursor]');

    // Also watch for newly added elements via MutationObserver
    var observer = new MutationObserver(function () {
      addHoverListeners('a');
      addHoverListeners('button');
      addHoverListeners('.magnetic');
      addHoverListeners('[data-cursor]');
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ── Click effect ─────────────────────────────────────────
    window.addEventListener('mousedown', function () {
      gsap.to(ring, { scale: ringScale * 0.8, duration: 0.15, ease: 'power2.out' });
    });
    window.addEventListener('mouseup', function () {
      gsap.to(ring, { scale: ringScale, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });

    // ── Hide/show on window leave ────────────────────────────
    document.addEventListener('mouseleave', function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    });
  }

  window.Portfolio.initCursor = initCursor;

})();
