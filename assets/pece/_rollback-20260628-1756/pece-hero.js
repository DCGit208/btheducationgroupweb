(function () {
  'use strict';

  var hero = document.querySelector('.pece-hero');
  if (!hero) return;

  var SVGNS = 'http://www.w3.org/2000/svg';

  /* Artboard = natural pixels of assets/pece/updatedhero2.png */
  var ART_W = 1659;
  var ART_H = 948;
  var ICON_R = 42;          /* icon ring radius in artboard units */
  var CARD_LEFT_X = 1460;   /* left edge of the card column (≈88%) */
  var CARD_WIDTH_PCT = 11.2;

  /* Icon disc centers (measured) + the y where each card is centered.
     Card centers are evenly distributed so the column reads clean while the
     connectors absorb the arc's curvature. */
  var STAGES = {
    pentad: { cx: 1261, cy: 235, cardY: 235, color: '#16a34a' },
    tenner: { cx: 1408, cy: 369, cardY: 369, color: '#2563eb' },
    post:   { cx: 1409, cy: 570, cardY: 570, color: '#d97706' },
    org:    { cx: 1294, cy: 738, cardY: 738, color: '#9333ea' }
  };

  requestAnimationFrame(function () {
    hero.classList.add('is-revealed');
  });

  hero.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    el.style.setProperty('--reveal-delay', Math.min(i * 50, 350) + 'ms');
  });

  var cards = hero.querySelectorAll('.pece-hero__journey-card');
  var nodes = hero.querySelector('.pece-hero__nodes');
  var svg = hero.querySelector('.pece-hero__links');
  var desktopMq = window.matchMedia('(min-width: 1024px)');

  /* connector elements keyed by stage */
  var connectors = {};

  function buildConnectors() {
    if (!svg) return;
    svg.innerHTML = '';
    connectors = {};

    Object.keys(STAGES).forEach(function (key) {
      var s = STAGES[key];
      var ex = CARD_LEFT_X;
      var ey = s.cardY;
      var dx = ex - s.cx;
      var dy = ey - s.cy;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var sx = s.cx + (dx / len) * ICON_R;
      var sy = s.cy + (dy / len) * ICON_R;
      var midx = (sx + ex) / 2;

      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('class', 'pece-hero__connector');
      path.setAttribute('d', 'M' + sx + ' ' + sy + ' C' + midx + ' ' + sy + ' ' + midx + ' ' + ey + ' ' + ex + ' ' + ey);
      path.setAttribute('stroke', s.color);

      var dotStart = document.createElementNS(SVGNS, 'circle');
      dotStart.setAttribute('class', 'pece-hero__connector-dot');
      dotStart.setAttribute('cx', sx);
      dotStart.setAttribute('cy', sy);
      dotStart.setAttribute('r', 3.5);
      dotStart.setAttribute('fill', s.color);

      var dotEnd = document.createElementNS(SVGNS, 'circle');
      dotEnd.setAttribute('class', 'pece-hero__connector-dot');
      dotEnd.setAttribute('cx', ex);
      dotEnd.setAttribute('cy', ey);
      dotEnd.setAttribute('r', 4);
      dotEnd.setAttribute('fill', s.color);

      svg.appendChild(path);
      svg.appendChild(dotStart);
      svg.appendChild(dotEnd);

      connectors[key] = path;
    });
  }

  function placeCards() {
    if (!desktopMq.matches) {
      cards.forEach(function (card) {
        card.style.left = '';
        card.style.top = '';
        card.style.width = '';
      });
      if (svg) svg.innerHTML = '';
      connectors = {};
      return;
    }

    if (!Object.keys(connectors).length) buildConnectors();

    cards.forEach(function (card) {
      var s = STAGES[card.dataset.stage];
      if (!s) return;
      card.style.left = (CARD_LEFT_X / ART_W) * 100 + '%';
      card.style.width = CARD_WIDTH_PCT + '%';
      card.style.top = (s.cardY / ART_H) * 100 + '%';
    });
  }

  function setActive(key, on) {
    var card = hero.querySelector('.pece-hero__journey-card[data-stage="' + key + '"]');
    if (card) card.classList.toggle('is-active', on);
    if (connectors[key]) connectors[key].classList.toggle('is-active', on);
  }

  cards.forEach(function (card) {
    var key = card.dataset.stage;
    card.addEventListener('mouseenter', function () { setActive(key, true); });
    card.addEventListener('mouseleave', function () { setActive(key, false); });
    card.addEventListener('focusin', function () { setActive(key, true); });
    card.addEventListener('focusout', function () { setActive(key, false); });
  });

  placeCards();
  window.addEventListener('resize', placeCards);
  desktopMq.addEventListener('change', placeCards);

  if (typeof ResizeObserver !== 'undefined' && nodes) {
    new ResizeObserver(placeCards).observe(nodes);
  }
})();
