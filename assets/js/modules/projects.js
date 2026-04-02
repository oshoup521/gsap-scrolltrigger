/* ============================================================
   MODULES / projects.js
   Horizontal pinned scrolling + 3D card tilt + progress bar
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initProjects() {
    var section  = document.getElementById('projects');
    var track    = document.getElementById('projectsTrack');
    var cards    = document.querySelectorAll('.project-card');
    var progFill = document.getElementById('projectsProgressFill');

    if (!section || !track || !cards.length) return;

    /* ── Pre-reveal cards before horizontal scroll starts ─── */
    gsap.fromTo(cards,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true
        }
      }
    );

    /* ── Set track width ─────────────────────────────────── */
    function setupHorizontalScroll() {
      // Get total scroll width minus one viewport
      var trackWidth  = track.scrollWidth;
      var viewportW   = window.innerWidth;
      var scrollDist  = trackWidth - viewportW;

      if (scrollDist <= 0) return;

      /* ── Horizontal pin ──────────────────────────────────── */
      var horizontalST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=' + scrollDist,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: function (self) {
          // Move track
          gsap.set(track, { x: -self.progress * scrollDist });

          // Progress bar
          if (progFill) {
            progFill.style.width = (self.progress * 100) + '%';
          }

          /* ── Scale side cards vs center card ─────────────── */
          cards.forEach(function (card) {
            var rect = card.getBoundingClientRect();
            var cardCX = rect.left + rect.width / 2;
            var screenCX = viewportW / 2;
            var dist = Math.abs(cardCX - screenCX);
            var maxDist = viewportW * 0.5;
            var scaleFactor = gsap.utils.clamp(0.88, 1.0, 1.0 - (dist / maxDist) * 0.12);
            gsap.set(card, { scale: scaleFactor, transformOrigin: 'center center' });
          });
        }
      });
    }

    setupHorizontalScroll();

    /* ── 3D tilt on each card ────────────────────────────── */
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);

        gsap.to(card, {
          rotateY: dx * 12,
          rotateX: -dy * 10,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center'
        });

        // Move glow with mouse
        var glow = card.querySelector('.project-card__glow');
        if (glow) {
          var xPct = ((e.clientX - rect.left) / rect.width) * 100;
          var yPct = ((e.clientY - rect.top) / rect.height) * 100;
          glow.style.background = 'radial-gradient(circle at ' + xPct + '% ' + yPct + '%, ' + (card.dataset.color || 'rgba(124,58,237,0.25)') + ' 0%, transparent 65%)';
        }
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
          transformPerspective: 800
        });
      });
    });
  }

  window.Portfolio.initProjects = initProjects;

})();
