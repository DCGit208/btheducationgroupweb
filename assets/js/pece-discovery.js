/**
 * PECE Parent Discovery Experience — carousel (vanilla JS)
 */
(function (global) {
  'use strict';

  var GAP = 20;

  function initSection(root) {
    var viewport = root.querySelector('.pece-discovery__viewport');
    var track = root.querySelector('.pece-discovery__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.pece-discovery__slide'));
    var questions = Array.prototype.slice.call(root.querySelectorAll('.pece-discovery__question'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.pece-discovery__dot'));
    var prevBtn = root.querySelector('.pece-discovery__arrow--prev');
    var nextBtn = root.querySelector('.pece-discovery__arrow--next');
    var index = 0;
    var touchStartX = 0;
    var touchDeltaX = 0;
    var dragging = false;

    if (!viewport || !track || !slides.length) return;

    function clamp(i) {
      return Math.max(0, Math.min(slides.length - 1, i));
    }

    function slideStep() {
      var slide = slides[0];
      return slide ? slide.offsetWidth + GAP : 0;
    }

    function updatePosition() {
      var step = slideStep();
      var viewportWidth = viewport.offsetWidth;
      var slideWidth = slides[0].offsetWidth;
      var offset = index * step - (viewportWidth - slideWidth) / 2;
      track.style.transform = 'translateX(' + (-offset) + 'px)';

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });

      questions.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === index);
        btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;

      root.setAttribute('data-active-slide', String(index + 1));
    }

    function goTo(i) {
      index = clamp(i);
      updatePosition();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    questions.forEach(function (btn, i) {
      btn.addEventListener('click', function () { goTo(i); });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    root.querySelectorAll('[data-advance]').forEach(function (btn) {
      btn.addEventListener('click', function () { next(); });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    viewport.addEventListener('touchstart', function (e) {
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      dragging = true;
    }, { passive: true });

    viewport.addEventListener('touchmove', function (e) {
      if (!dragging || !e.touches.length) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    viewport.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (touchDeltaX > 55) prev();
      else if (touchDeltaX < -55) next();
      touchDeltaX = 0;
    });

    var resizeTimer;
    global.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updatePosition, 120);
    });

    goTo(0);
  }

  function initVisibility(root) {
    if (!('IntersectionObserver' in global)) {
      root.classList.add('is-visible');
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          root.classList.add('is-visible');
          obs.unobserve(root);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(root);
  }

  function boot() {
    var root = document.getElementById('pece-discovery');
    if (!root) return;
    initVisibility(root);
    initSection(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : global);
