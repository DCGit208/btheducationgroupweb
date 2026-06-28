(function () {
  'use strict';

  var hero = document.querySelector('.pece-hero');
  if (!hero) return;

  requestAnimationFrame(function () {
    hero.classList.add('is-revealed');
  });

  hero.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    el.style.setProperty('--reveal-delay', Math.min(i * 60, 420) + 'ms');
  });

  var cards = hero.querySelectorAll('.pece-hero__journey-card');

  function setActive(stage, on) {
    var card = hero.querySelector('.pece-hero__journey-card[data-stage="' + stage + '"]');
    var connector = hero.querySelector('.pece-hero__connector[data-stage="' + stage + '"]');
    var node = hero.querySelector('.pece-hero__node[data-stage="' + stage + '"]');
    if (card) card.classList.toggle('is-active', on);
    if (connector) connector.classList.toggle('is-active', on);
    if (node) node.classList.toggle('is-active', on);
  }

  cards.forEach(function (card) {
    var stage = card.dataset.stage;
    card.addEventListener('mouseenter', function () { setActive(stage, true); });
    card.addEventListener('mouseleave', function () { setActive(stage, false); });
    card.addEventListener('focusin', function () { setActive(stage, true); });
    card.addEventListener('focusout', function () { setActive(stage, false); });
  });

  /* hovering a node lights its card too */
  hero.querySelectorAll('.pece-hero__node').forEach(function (node) {
    var stage = node.dataset.stage;
    node.addEventListener('mouseenter', function () { setActive(stage, true); });
    node.addEventListener('mouseleave', function () { setActive(stage, false); });
  });
})();
