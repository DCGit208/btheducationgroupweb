/**
 * PECE Parent Discovery Experience — carousel (vanilla JS)
 */
(function (global) {
  'use strict';

  var GAP = 20;
  var AUTOPLAY_MS = 7000;
  var MANUAL_GRACE_MS = 12000;

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
    var autoplayTimer = null;
    var manualGrace = false;
    var sectionVisible = false;
    var userEngaged = false;
    var autoplayEnabled = true;
    var orbitMotionEnabled = true;
    var orbitRing = root.querySelector('.pd-orbit-ring');
    var orbitNodes = Array.prototype.slice.call(root.querySelectorAll('.pd-orbit-node'));
    var orbitAngle = 0;
    var orbitLastTs = 0;
    var orbitRunning = false;
    var ORBIT_DURATION_MS = 24000;

    if (!viewport || !track || !slides.length) return;

    function shouldRunOrbit() {
      return orbitMotionEnabled && index === 0 && sectionVisible;
    }

    function applyOrbitAngle(deg) {
      if (!orbitRing) return;
      orbitRing.style.transform = 'rotate(' + deg + 'deg)';
      orbitNodes.forEach(function (node) {
        node.style.transform = 'rotate(' + (-deg) + 'deg)';
      });
    }

    function orbitFrame(ts) {
      global.requestAnimationFrame(orbitFrame);
      if (!shouldRunOrbit()) {
        orbitRunning = false;
        orbitLastTs = 0;
        return;
      }
      if (!orbitLastTs) orbitLastTs = ts;
      orbitAngle = (orbitAngle + ((ts - orbitLastTs) / ORBIT_DURATION_MS) * 360) % 360;
      orbitLastTs = ts;
      applyOrbitAngle(orbitAngle);
      orbitRunning = true;
    }

    function syncOrbitSpin() {
      if (!orbitRing || !orbitNodes.length) return;
      if (shouldRunOrbit()) {
        if (!orbitRunning) orbitLastTs = 0;
      } else {
        orbitRunning = false;
        orbitLastTs = 0;
        applyOrbitAngle(orbitAngle);
      }
    }

    if (global.matchMedia) {
      var motionQuery = global.matchMedia('(prefers-reduced-motion: reduce)');
      autoplayEnabled = !motionQuery.matches;
      orbitMotionEnabled = !motionQuery.matches;
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', function (e) {
          autoplayEnabled = !e.matches;
          orbitMotionEnabled = !e.matches;
          if (!autoplayEnabled) clearAutoplayTimer();
          else scheduleAutoplay();
          syncOrbitSpin();
        });
      } else if (motionQuery.addListener) {
        motionQuery.addListener(function (e) {
          autoplayEnabled = !e.matches;
          orbitMotionEnabled = !e.matches;
          if (!autoplayEnabled) clearAutoplayTimer();
          else scheduleAutoplay();
          syncOrbitSpin();
        });
      }
    }

    function clamp(i) {
      return Math.max(0, Math.min(slides.length - 1, i));
    }

    function slideStep() {
      var slide = slides[0];
      return slide ? slide.offsetWidth + GAP : 0;
    }

    function syncViewportHeight() {
      var activeSlide = slides[index];
      if (!activeSlide || !viewport) return;
      global.requestAnimationFrame(function () {
        viewport.style.height = activeSlide.offsetHeight + 'px';
      });
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
      syncViewportHeight();
      syncOrbitSpin();
    }

    function applyIndex(i) {
      index = clamp(i);
      updatePosition();
    }

    function clearAutoplayTimer() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function canAutoplay() {
      return autoplayEnabled &&
        sectionVisible &&
        !userEngaged &&
        global.document.visibilityState !== 'hidden';
    }

    function scheduleAutoplay() {
      clearAutoplayTimer();
      if (!canAutoplay()) return;
      var delay = manualGrace ? MANUAL_GRACE_MS : AUTOPLAY_MS;
      autoplayTimer = setTimeout(function () {
        autoplayTimer = null;
        manualGrace = false;
        var nextIndex = index + 1 >= slides.length ? 0 : index + 1;
        applyIndex(nextIndex);
        scheduleAutoplay();
      }, delay);
    }

    function goToManual(i) {
      applyIndex(i);
      manualGrace = true;
      scheduleAutoplay();
    }

    function nextManual() {
      if (index < slides.length - 1) goToManual(index + 1);
      else scheduleAutoplay();
    }

    function prevManual() {
      if (index > 0) goToManual(index - 1);
      else scheduleAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevManual);
    if (nextBtn) nextBtn.addEventListener('click', nextManual);

    questions.forEach(function (btn, i) {
      btn.addEventListener('click', function () { goToManual(i); });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToManual(i); });
    });

    root.querySelectorAll('[data-advance]').forEach(function (btn) {
      btn.addEventListener('click', nextManual);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevManual(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextManual(); }
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
      if (touchDeltaX > 55) prevManual();
      else if (touchDeltaX < -55) nextManual();
      touchDeltaX = 0;
    });

    var engageTarget = root;

    engageTarget.addEventListener('mouseenter', function () {
      userEngaged = true;
      clearAutoplayTimer();
    });

    engageTarget.addEventListener('mouseleave', function () {
      userEngaged = false;
      scheduleAutoplay();
    });

    engageTarget.addEventListener('focusin', function () {
      userEngaged = true;
      clearAutoplayTimer();
    });

    engageTarget.addEventListener('focusout', function (e) {
      if (engageTarget.contains(e.relatedTarget)) return;
      userEngaged = false;
      scheduleAutoplay();
    });

    global.document.addEventListener('visibilitychange', function () {
      if (global.document.visibilityState === 'hidden') clearAutoplayTimer();
      else scheduleAutoplay();
    });

    if ('IntersectionObserver' in global) {
      var sectionObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          sectionVisible = entry.isIntersecting;
          if (sectionVisible) scheduleAutoplay();
          else clearAutoplayTimer();
          syncOrbitSpin();
        });
      }, { threshold: 0.2 });
      sectionObs.observe(root);
    } else {
      sectionVisible = true;
    }

    var resizeTimer;
    global.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updatePosition();
        scheduleAutoplay();
      }, 120);
    });

    if (global.document && global.document.fonts && global.document.fonts.ready) {
      global.document.fonts.ready.then(function () {
        updatePosition();
        scheduleAutoplay();
      });
    }

    applyIndex(0);
    scheduleAutoplay();
    global.requestAnimationFrame(orbitFrame);
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
