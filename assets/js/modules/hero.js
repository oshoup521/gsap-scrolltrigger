/* ============================================================
   MODULES / hero.js
   Canvas particle system + hero text animations + globs + stats
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  /* ── Particle System ─────────────────────────────────────── */
  function initParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var particles = [];
    var PARTICLE_COUNT = 150;
    var CONNECTION_DIST = 120;
    var MOUSE_DIST = 200;
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      hero.addEventListener('mouseleave', function () {
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    // Create particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * (W || window.innerWidth),
        y: Math.random() * (H || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        isPurple: i % 2 === 0
      });
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.isPurple) {
        ctx.fillStyle = 'rgba(124,58,237,' + p.opacity + ')';
      } else {
        ctx.fillStyle = 'rgba(6,182,212,' + p.opacity + ')';
      }
      ctx.fill();
    }

    function drawConnection(a, b, dist) {
      var alpha = (1 - dist / CONNECTION_DIST) * 0.25;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      if (a.isPurple || b.isPurple) {
        ctx.strokeStyle = 'rgba(124,58,237,' + alpha + ')';
      } else {
        ctx.strokeStyle = 'rgba(6,182,212,' + alpha + ')';
      }
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // Update
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse interaction
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_DIST && mdist > 0) {
          var force = (MOUSE_DIST - mdist) / MOUSE_DIST;
          // alternating: attract/repel based on index
          var direction = (i % 3 === 0) ? -1 : 1;
          p.vx += direction * force * (mdx / mdist) * 0.08;
          p.vy += direction * force * (mdy / mdist) * 0.08;
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }

        drawParticle(p);
      }

      // Draw connections
      for (var i = 0; i < particles.length - 1; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            drawConnection(particles[i], particles[j], dist);
          }
        }
      }

      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── Glob Mouse Follow ───────────────────────────────────── */
  function initGlobs() {
    var glob1 = document.querySelector('.hero__glob--1');
    var glob2 = document.querySelector('.hero__glob--2');
    if (!glob1 || !glob2) return;

    var pos1 = { x: 0, y: 0 };
    var pos2 = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };

    window.addEventListener('mousemove', function (e) {
      target.x = e.clientX;
      target.y = e.clientY;
    });

    gsap.ticker.add(function () {
      pos1.x += (target.x - pos1.x) * 0.06;
      pos1.y += (target.y - pos1.y) * 0.06;
      pos2.x += (target.x - pos2.x) * 0.03;
      pos2.y += (target.y - pos2.y) * 0.03;

      gsap.set(glob1, {
        x: (pos1.x / window.innerWidth - 0.5) * 80,
        y: (pos1.y / window.innerHeight - 0.5) * 80
      });
      gsap.set(glob2, {
        x: (pos2.x / window.innerWidth - 0.5) * -60,
        y: (pos2.y / window.innerHeight - 0.5) * -60
      });
    });
  }

  /* ── Hero Animations ────────────────────────────────────── */
  function initHeroAnimations() {
    var splitChars = window.Portfolio.splitChars;
    var ctx = gsap.context(function () {

      /* ── Split name into chars ── */
      var oshoRow = document.getElementById('heroNameOsho');
      var upaRow  = document.getElementById('heroNameUpadhyay');
      var oshoChars = oshoRow  ? splitChars(oshoRow,  'hero__name-char') : [];
      var upaChars  = upaRow   ? splitChars(upaRow,   'hero__name-char hero__name-char--gradient') : [];

      // Apply gradient class to Upadhyay chars
      upaChars.forEach(function (c) {
        c.classList.add('hero__name-char--gradient');
        c.style.background = 'linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)';
        c.style.webkitBackgroundClip = 'text';
        c.style.webkitTextFillColor = 'transparent';
        c.style.backgroundClip = 'text';
      });

      var tl = gsap.timeline({ delay: 0.1 });

      /* ── Name chars animate in ── */
      tl.fromTo(oshoChars,
        {
          y: -120,
          rotation: function (i) { return gsap.utils.random(-25, 25); },
          opacity: 0
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(2)',
          stagger: 0.04
        },
        0
      );

      tl.fromTo(upaChars,
        {
          y: -120,
          rotation: function (i) { return gsap.utils.random(-25, 25); },
          opacity: 0
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(2)',
          stagger: 0.035
        },
        0.1
      );

      /* ── Role slide up with clip-path ── */
      var roleEl = document.querySelector('.hero__role');
      if (roleEl) {
        tl.fromTo(roleEl,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.8, ease: 'power4.out' },
          0.5
        );
      }

      /* ── Badge, bio, buttons stagger ── */
      var badge  = document.querySelector('.hero__badge');
      var meta   = document.querySelector('.hero__meta');
      var scroll = document.querySelector('.scroll-indicator');

      if (badge) {
        tl.fromTo(badge,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' },
          0.6
        );
      }

      if (meta) {
        tl.fromTo(meta,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.75
        );
      }

      /* ── Stats count up ── */
      var stats = document.querySelectorAll('.hero__stat-value[data-count]');
      var statsWrap = document.querySelector('.hero__stats');
      if (statsWrap) {
        tl.fromTo(statsWrap,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          1.0
        );

        stats.forEach(function (el) {
          var target = parseInt(el.dataset.count, 10);
          var obj = { val: 0 };
          var suffix = el.dataset.suffix || '';
          tl.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(obj.val) + suffix;
            }
          }, 1.0);
        });
      }

      if (scroll) {
        tl.fromTo(scroll,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          1.5
        );
      }

    }, '#hero');

    return ctx;
  }

  /* ── Public init ─────────────────────────────────────────── */
  function initHero() {
    initParticles();
    initGlobs();
    initHeroAnimations();
  }

  window.Portfolio.initHero = initHero;

})();
