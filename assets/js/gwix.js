(function() {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var _gwixCounted = new Set();

  /* Hero telemetry count-up */
  (function initTelemetryCounters() {
    var els = document.querySelectorAll('[data-gwix-count]');
    if (!els.length) return;

    function formatVal(el, value) {
      var decimals = parseInt(el.getAttribute('data-gwix-decimals') || '0', 10);
      var suffix = el.getAttribute('data-gwix-suffix') || '';
      var prefix = el.getAttribute('data-gwix-prefix') || '';
      if (decimals > 0) {
        return prefix + value.toFixed(decimals) + suffix;
      }
      return prefix + Math.round(value).toLocaleString() + suffix;
    }

    function animateCount(el) {
      if (_gwixCounted.has(el)) return;
      _gwixCounted.add(el);
      var target = parseFloat(el.getAttribute('data-gwix-count'));
      if (isNaN(target)) return;
      if (reduced) {
        el.textContent = formatVal(el, target);
        return;
      }
      var dur = 2000;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = formatVal(el, ease * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    els.forEach(function(el) { io.observe(el); });

    window.addEventListener('load', function() {
      var vh = window.innerHeight;
      els.forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          io.unobserve(el);
          animateCount(el);
        }
      });
    });
  })();

  /* Portfolio topology — architectural network visualization */
  (function initTopology() {
    var canvas = document.getElementById('gwix-topology-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var edges = [];
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 0;
    var h = 0;
    var dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGraph();
    }

    function buildGraph() {
      nodes = [];
      edges = [];
      var cx = w * 0.5;
      var cy = h * 0.52;
      var layers = [
        { r: 0, n: 1, label: 'Global' },
        { r: Math.min(w, h) * 0.14, n: 4, label: 'Markets' },
        { r: Math.min(w, h) * 0.28, n: 8, label: 'Sectors' },
        { r: Math.min(w, h) * 0.4, n: 14, label: 'Divisions' }
      ];

      nodes.push({ x: cx, y: cy, r: 6, layer: 0, pulse: 0 });

      var id = 1;
      layers.slice(1).forEach(function(layer, li) {
        for (var i = 0; i < layer.n; i++) {
          var angle = (Math.PI * 2 * i) / layer.n - Math.PI / 2;
          var jitter = (Math.random() - 0.5) * 12;
          nodes.push({
            x: cx + Math.cos(angle) * layer.r + jitter,
            y: cy + Math.sin(angle) * layer.r + jitter,
            r: li === 0 ? 4 : li === 1 ? 3 : 2.5,
            layer: li + 1,
            pulse: Math.random() * Math.PI * 2
          });
          edges.push({ from: 0, to: id });
          if (li > 0 && i % 2 === 0 && id > 1) {
            edges.push({ from: Math.max(1, id - 2), to: id });
          }
          id++;
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      edges.forEach(function(e) {
        var a = nodes[e.from];
        var b = nodes[e.to];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      var t = Date.now() * 0.001;
      nodes.forEach(function(node, i) {
        var pulse = reduced ? 0 : Math.sin(t * 1.5 + node.pulse) * 0.35 + 0.65;
        var radius = node.r * (i === 0 ? 1.15 : pulse);
        var grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
        if (i === 0) {
          grad.addColorStop(0, 'rgba(5, 74, 218, 0.9)');
          grad.addColorStop(1, 'rgba(5, 74, 218, 0)');
        } else if (node.layer === 1) {
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.75)');
          grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        } else {
          grad.addColorStop(0, 'rgba(148, 163, 184, 0.55)');
          grad.addColorStop(1, 'rgba(148, 163, 184, 0)');
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#054ada' : '#38bdf8';
        ctx.fill();
      });

      if (!reduced) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  })();

  /* Live performance indices — architecture baseline (no simulated drift) */
  (function initIndices() {
    var vals = document.querySelectorAll('[data-gwix-index]');
    vals.forEach(function (el) {
      var base = parseFloat(el.getAttribute('data-gwix-index'));
      if (!isNaN(base)) el.textContent = base.toFixed(1);
    });

    if (!window.db || !window.GWIXFeedLive) return;

    window.GWIXFeedLive.startListener(function (events) {
      if (!events.length) return;
      var liveCount = events.length;
      vals.forEach(function (el, i) {
        var base = parseFloat(el.getAttribute('data-gwix-index'));
        if (isNaN(base)) return;
        var bump = Math.min(4, liveCount * 0.05) * (i % 2 === 0 ? 1 : 0.7);
        el.textContent = Math.min(100, base + bump).toFixed(1);
      });
    });
  })();

  /* Match feed panel height to indices panel — content scrolls inside */
  (function syncFeedPanelHeight() {
    var indices = document.querySelector('.gwix-indices-panel');
    var feed = document.querySelector('.gwix-feed');
    if (!indices || !feed) return;

    function sync() {
      feed.style.height = indices.offsetHeight + 'px';
    }

    sync();
    window.addEventListener('load', sync);
    window.addEventListener('resize', sync);

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(sync).observe(indices);
    }

    window.gwixSyncFeedHeight = sync;
  })();

  /* Market activity feed — multi-view tabs (static architecture + live Firestore events) */
  (function initFeedViews() {
    var staticViews = window.GWIX_FEED_VIEWS;
    var tabsEl = document.getElementById('gwix-feed-tabs');
    var trackEl = document.getElementById('gwix-feed-panels');
    if (!staticViews || !tabsEl || !trackEl) return;

    var built = false;
    var currentViews = staticViews;

    function feedItemHtml(item) {
      var timeLabel = item.live ? 'LIVE' : 'ARCH';
      return '<div class="gwix-feed-item' + (item.live ? ' gwix-feed-item--live' : '') + '"><time>' + timeLabel + '</time><div class="gwix-feed-item__body"><strong>'
        + item.subject + '</strong> · ' + item.text
        + '</div><span class="gwix-feed-item__delta">' + item.delta + '</span></div>';
    }

    function buildScroll(items) {
      if (!items.length) {
        return '<div class="gwix-feed__scroll"><div class="gwix-empty" style="padding:1rem;color:#94a3b8;font-size:13px">No events in this view yet.</div></div>';
      }
      var html = items.map(feedItemHtml).join('');
      return '<div class="gwix-feed__scroll">' + html + html + '</div>';
    }

    function renderPanels(views) {
      if (!built) {
        views.forEach(function (view, i) {
          var tab = document.createElement('button');
          tab.type = 'button';
          tab.className = 'gwix-feed-tab' + (i === 0 ? ' is-active' : '');
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
          tab.setAttribute('data-feed-tab', view.id);
          tab.textContent = view.label + (view.liveCount ? ' · ' + view.liveCount : '');
          tabsEl.appendChild(tab);

          var panel = document.createElement('div');
          panel.className = 'gwix-feed-panel' + (i === 0 ? ' is-active' : '');
          panel.id = 'gwix-feed-panel-' + view.id;
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('data-feed-panel', view.id);
          panel.hidden = i !== 0;
          trackEl.appendChild(panel);
        });
        built = true;

        tabsEl.addEventListener('click', function (e) {
          var tab = e.target.closest('.gwix-feed-tab');
          if (!tab) return;
          activateTab(tab.getAttribute('data-feed-tab'));
        });
      }

      views.forEach(function (view) {
        var tab = tabsEl.querySelector('[data-feed-tab="' + view.id + '"]');
        if (tab) tab.textContent = view.label + (view.liveCount ? ' · ' + view.liveCount : '');
        var panel = trackEl.querySelector('[data-feed-panel="' + view.id + '"]');
        if (panel) {
          panel.innerHTML = '<p class="gwix-feed-panel__desc">' + view.desc +
            (view.liveCount ? ' · <strong>' + view.liveCount + ' live</strong>' : '') + '</p>' +
            '<div class="gwix-feed-panel__body">' + buildScroll(view.items) + '</div>';
        }
      });

      if (window.gwixSyncFeedHeight) window.gwixSyncFeedHeight();
    }

    function activateTab(id) {
      tabsEl.querySelectorAll('.gwix-feed-tab').forEach(function (tab) {
        var on = tab.getAttribute('data-feed-tab') === id;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      trackEl.querySelectorAll('.gwix-feed-panel').forEach(function (panel) {
        var on = panel.getAttribute('data-feed-panel') === id;
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
      });
      if (window.gwixSyncFeedHeight) window.gwixSyncFeedHeight();
    }

    function applyLiveEvents(events) {
      currentViews = window.GWIXFeedLive
        ? window.GWIXFeedLive.mergeViews(staticViews, events)
        : staticViews;
      renderPanels(currentViews);
    }

    applyLiveEvents([]);

    if (window.GWIXFeedLive) {
      window.GWIXFeedLive.startListener(applyLiveEvents);
    }

    window.GWIXFeed = { refresh: applyLiveEvents, activateTab: activateTab };
  })();
})();
