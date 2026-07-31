(function () {
  'use strict';

  var hero = document.querySelector('.pece-hero');
  if (!hero) return;

  /* Anchors measured from assets/pece/updatedhero2.png (1659×948) */
  var ART_W = 1659;
  var ART_H = 948;
  var ICON_RADIUS = 36; /* px on the artboard */
  var CARD_GAP = 10;

  var ANCHORS = {
    pentad: { x: 1266, y: 214 },
    tenner: { x: 1354, y: 345 },
    post: { x: 1417, y: 497 },
    org: { x: 1261, y: 685 }
  };

  requestAnimationFrame(function () {
    hero.classList.add('is-revealed');
  });

  hero.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    el.style.setProperty('--reveal-delay', Math.min(i * 50, 350) + 'ms');
  });

  var cards = hero.querySelectorAll('.pece-hero__journey-card');
  var nodes = hero.querySelector('.pece-hero__nodes');
  var desktopMq = window.matchMedia('(min-width: 1024px)');

  function placeCards() {
    if (!desktopMq.matches) {
      cards.forEach(function (card) {
        card.style.left = '';
        card.style.top = '';
        card.style.removeProperty('--card-w');
      });
      return;
    }

    cards.forEach(function (card) {
      var anchor = ANCHORS[card.dataset.stage];
      if (!anchor) return;

      var leftPx = anchor.x + ICON_RADIUS + CARD_GAP;
      var leftPct = (leftPx / ART_W) * 100;

      /* widest the card can be without spilling past the right edge */
      var availablePct = 100 - leftPct - 0.6;
      var cardWPct = Math.min(12, availablePct);

      card.style.left = leftPct + '%';
      card.style.top = (anchor.y / ART_H) * 100 + '%';
      card.style.setProperty('--card-w', cardWPct + '%');
    });
  }

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      card.classList.add('is-active');
    });
    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-active');
    });
    card.addEventListener('focusin', function () {
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      card.classList.add('is-active');
    });
    card.addEventListener('focusout', function () {
      card.classList.remove('is-active');
    });
  });

  placeCards();
  window.addEventListener('resize', placeCards);
  desktopMq.addEventListener('change', placeCards);

  if (typeof ResizeObserver !== 'undefined' && nodes) {
    new ResizeObserver(placeCards).observe(nodes);
  }
})();
