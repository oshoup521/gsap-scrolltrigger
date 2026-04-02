/* ============================================================
   MODULES / contact.js
   Contact links slide-in + underline expand + CTA magnetic
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  function initContact() {
    var section = document.getElementById('contact');
    if (!section) return;

    var links = section.querySelectorAll('.contact__link');

    /* ── Slide links in from right ───────────────────────────── */
    if (links.length) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: function () {
          gsap.to(links, {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
          });
        }
      });
    }

    /* ── Underline expand on hover (via GSAP, not CSS only) ──── */
    links.forEach(function (link) {
      var underline = link.querySelector('.contact__link-underline');
      if (!underline) return;

      link.addEventListener('mouseenter', function () {
        gsap.to(underline, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power3.out',
          transformOrigin: 'left center'
        });
      });
      link.addEventListener('mouseleave', function () {
        gsap.to(underline, {
          scaleX: 0,
          duration: 0.3,
          ease: 'power2.in',
          transformOrigin: 'right center'
        });
      });
    });

    /* ── Contact left copy reveal ────────────────────────────── */
    var heading = section.querySelector('.contact__heading');
    var subtext = section.querySelector('.contact__sub');
    var cta     = section.querySelector('.contact__cta');

    if (heading) {
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(heading, {
            opacity: 0, y: 50,
            duration: 0.9,
            ease: 'power3.out'
          });
        }
      });
    }

    if (subtext) {
      ScrollTrigger.create({
        trigger: subtext,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.from(subtext, {
            opacity: 0, y: 30,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.1
          });
        }
      });
    }

    if (cta) {
      ScrollTrigger.create({
        trigger: cta,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.from(cta, {
            opacity: 0,
            scale: 0.85,
            duration: 0.7,
            ease: 'back.out(2)',
            delay: 0.2
          });
        }
      });
    }

    /* ── Floating glow orb follows cursor in contact section ─── */
    var orb = section.querySelector('.contact__orb');
    if (orb) {
      section.addEventListener('mousemove', function (e) {
        var rect = section.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        gsap.to(orb, {
          x: x - orb.offsetWidth  / 2,
          y: y - orb.offsetHeight / 2,
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    }
  }

  window.Portfolio.initContact = initContact;

})();
