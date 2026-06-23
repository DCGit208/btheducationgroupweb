/**
 * Homepage — Architecture telemetry & audience entry modals (Workforce Infrastructure Economy).
 */
(function (global) {
  'use strict';

  var openModal = null;

  function getFocusable(container) {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('wf-modal-open');
    if (openModal === modal) openModal = null;
    var trigger = modal._trigger;
    if (trigger) trigger.focus();
  }

  function showModal(id, trigger) {
    var modal = document.getElementById(id);
    if (!modal) return;
    if (openModal && openModal !== modal) closeModal(openModal);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal._trigger = trigger;
    document.body.classList.add('wf-modal-open');
    openModal = modal;
    var focusables = getFocusable(modal);
    if (focusables.length) focusables[0].focus();
  }

  function init() {
    document.querySelectorAll('[data-wf-modal-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showModal(btn.getAttribute('data-wf-modal-open'), btn);
      });
    });

    document.querySelectorAll('[data-wf-modal-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        var modal = el.closest('.wf-home-modal');
        closeModal(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openModal) closeModal(openModal);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.WFHomeModals = { close: closeModal, open: showModal };
})(typeof window !== 'undefined' ? window : global);
