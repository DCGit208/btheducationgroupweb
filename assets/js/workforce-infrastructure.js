
    /* ═══════════════════════════════════════════════════════════════
       ELITE INTERACTIVE ENGINE — BTH Workforce Infrastructure v2
       Neural Canvas · 3D Tilt · Typewriter · Magnetic · Parallax
       Donut SVG · Watermarks · Flip Reveals · Scroll Bar
    ═══════════════════════════════════════════════════════════════ */

    var PRM = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── SCROLL PROGRESS BAR ──────────────────────────────────── */
    (function() {
      const bar = document.getElementById('scrollProgress');
      if (!bar) return;
      window.addEventListener('scroll', function() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0) bar.style.width = ((window.scrollY / max) * 100) + '%';
      }, { passive: true });
    })();

    /* ── SECTION WATERMARKS ───────────────────────────────────── */
    (function() {
      var map = [
        ['.problem-section',   'CHALLENGE',      false],
        ['.solution-section',  'INFRASTRUCTURE', false],
        ['.bridge-outcome-section', 'OUTPUT',   false],
        ['.lifecycle-section', 'LIFECYCLE',       false],
        ['.sectors-section',   'SECTORS',         false],
        ['.value-section',     'VALUE',           false],
        ['.engagement-section','ENGAGE',          false],
        ['.cohort-section',    'COHORT',          true]
      ];
      map.forEach(function(item) {
        var el = document.querySelector(item[0]);
        if (!el) return;
        el.classList.add('wm');
        if (item[2]) el.classList.add('wm-dark');
        el.setAttribute('data-wm', item[1]);
      });
      var wmIO = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) e.target.classList.add('wm-show');
          else e.target.classList.remove('wm-show');
        });
      }, { threshold: 0.04 });
      document.querySelectorAll('.wm').forEach(function(el) { wmIO.observe(el); });
    })();

    /* ── CANVAS NEURAL NETWORK ────────────────────────────────── */
    (function() {
      var canvas = document.getElementById('neural-canvas');
      if (!canvas || PRM) return;
      var ctx = canvas.getContext('2d');
      var NODES = 52, MAX_D = 130, SPD = 0.34;
      var W = 0, H = 0, nodes = [], raf = null;

      function resize() {
        var p = canvas.parentElement;
        W = canvas.width  = p.offsetWidth;
        H = canvas.height = p.offsetHeight;
      }

      function spawn() {
        nodes = [];
        for (var i = 0; i < NODES; i++) {
          nodes.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * SPD,
            vy: (Math.random() - 0.5) * SPD,
            r: Math.random() * 1.8 + 1.1
          });
        }
      }

      function frame() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(14,165,233,0.75)';
          ctx.fill();
        }
        for (var i = 0; i < nodes.length; i++) {
          for (var j = i + 1; j < nodes.length; j++) {
            var dx = nodes[i].x - nodes[j].x;
            var dy = nodes[i].y - nodes[j].y;
            var d2 = dx * dx + dy * dy;
            if (d2 < MAX_D * MAX_D) {
              var alpha = (1 - Math.sqrt(d2) / MAX_D) * 0.4;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = 'rgba(14,165,233,' + alpha + ')';
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
        raf = requestAnimationFrame(frame);
      }

      function start() { if (!raf) frame(); }
      function stop()  { if (raf)  { cancelAnimationFrame(raf); raf = null; } }

      resize(); spawn(); start();

      new ResizeObserver(function() { resize(); spawn(); }).observe(canvas.parentElement);
      new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0 }).observe(canvas.parentElement);
    })();

    /* ── PARALLAX HERO PHOTO ──────────────────────────────────── */
    (function() {
      var layer = document.getElementById('heroPhotoLayer');
      if (!layer || PRM) return;
      window.addEventListener('scroll', function() {
        layer.style.transform = 'translateY(' + (window.scrollY * 0.28) + 'px)';
      }, { passive: true });
    })();

    /* ── TYPEWRITER ENGINE ────────────────────────────────────── */
    (function() {
      var el = document.getElementById('tw-text');
      if (!el) return;
      if (PRM) {
        el.textContent = 'WDDAM: Develop. Deploy. Acquire. Manage.';
        return;
      }
      var phrases = [
        'WDDAM: Develop. Deploy. Acquire. Manage.',
        'Build. Deploy. Acquire. Manage.',
        'From Certification to Deployment.',
        'Certified. Verified. Deployed.',
        'Enterprise Grade. Institutional Scale.',
        'Not Training. Workforce Infrastructure.'
      ];
      var pi = 0, ci = 0, del = false;
      function tick() {
        var ph = phrases[pi];
        if (!del) {
          el.textContent = ph.slice(0, ++ci);
          if (ci === ph.length) { del = true; return setTimeout(tick, 2300); }
          setTimeout(tick, 54);
        } else {
          el.textContent = ph.slice(0, --ci);
          if (ci === 0) {
            del = false;
            pi = (pi + 1) % phrases.length;
            return setTimeout(tick, 380);
          }
          setTimeout(tick, 25);
        }
      }
      setTimeout(tick, 1100);
    })();

    /* ── 3D PERSPECTIVE TILT CARDS ────────────────────────────── */
    (function() {
      if (PRM) return;
      var sel = '.solution-card, .value-card, .engagement-card:not(.featured), .lifecycle-card';
      document.querySelectorAll(sel).forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          var r = card.getBoundingClientRect();
          var rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8;
          var ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  8;
          card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px) scale(1.02)';
          card.style.boxShadow = (-ry * 1.3) + 'px ' + (rx * 1.3) + 'px 40px rgba(15,23,42,0.14)';
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
    })();

    /* ── MAGNETIC BUTTONS ─────────────────────────────────────── */
    (function() {
      if (PRM) return;
      document.querySelectorAll('.btn-gold, .btn-primary').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
          var r = btn.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
          var dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
          btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
      });
    })();

    /* ── FLIP CARD REVEAL CLASSES ─────────────────────────────── */
    document.querySelectorAll('.solution-card, .value-card, .engagement-card').forEach(function(card) {
      card.classList.add('flip-in');
    });

    /* ── SCROLL REVEAL ────────────────────────────────────────── */
    var revealIO = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal, .flip-in').forEach(function(el) { revealIO.observe(el); });

    /* ── COUNT-UP ANIMATION (easeOutExpo) ────────────────────── */
    var _counted = new Set();
    function animateCount(el) {
      if (_counted.has(el)) return;
      _counted.add(el);
      var target = parseInt(el.dataset.count.replace(/\D/g, ''), 10);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      if (PRM || isNaN(target)) {
        el.textContent = prefix + (isNaN(target) ? '0' : Math.round(target).toLocaleString()) + suffix;
        return;
      }
      var dur = 1800, t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = prefix + Math.round(ease * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    var countIO = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('[data-count]').forEach(function(el) { countIO.observe(el); });
    /* Safety: fire count-up for any element already in view at load */
    window.addEventListener('load', function() {
      var vh = window.innerHeight;
      document.querySelectorAll('[data-count]').forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) { countIO.unobserve(el); animateCount(el); }
      });
    });

    /* ── COHORT BAR CHART ANIMATION ───────────────────────────── */
    var barIO = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          if (PRM) {
            e.target.style.width = e.target.dataset.width;
          } else {
            setTimeout(function() { e.target.style.width = e.target.dataset.width; }, 260);
          }
          barIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.cohort-bar-fill[data-width]').forEach(function(el) { barIO.observe(el); });

    /* ── SECTOR DONUT CHART ───────────────────────────────────── */
    (function() {
      var arc = document.getElementById('donut-arc');
      if (!arc) return;
      var donutIO = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            if (PRM) {
              arc.style.transition = 'none';
            }
            arc.style.strokeDashoffset = '0';
            donutIO.unobserve(arc);
          }
        });
      }, { threshold: 0.15 });
      donutIO.observe(arc);
    })();

  /* ── SECTORS FILTER CHIPS (added: Phase 2) ─────────────────── */
  (function() {
    var chips = document.querySelectorAll('.sectors-filter .sec-chip');
    var tiles = document.querySelectorAll('.sectors-grid .sector-tile');
    if (!chips.length || !tiles.length) return;

    function applyFilter(filter) {
      tiles.forEach(function(tile) {
        var cats = (tile.getAttribute('data-categories') || '').split(/\s+/);
        var show = (filter === 'all') || cats.indexOf(filter) !== -1;
        tile.classList.toggle('is-hidden', !show);
      });
      chips.forEach(function(chip) {
        chip.setAttribute('aria-pressed', chip.dataset.filter === filter ? 'true' : 'false');
      });
    }

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        applyFilter(chip.dataset.filter || 'all');
      });
    });
  })();
