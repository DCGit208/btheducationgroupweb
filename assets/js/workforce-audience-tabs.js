/**
 * Optional enhancement: sync URL hash (#gov, #un, …) with mandate radios.
 * Tab switching works without this file (CSS radio + label).
 */
(function () {
  'use strict';

  var HASH_TO_RADIO = {
    un: 'mandate-un',
    gov: 'mandate-gov',
    ent: 'mandate-ent',
    cert: 'mandate-cert',
    inv: 'mandate-inv'
  };

  function applyHash() {
    var key = (window.location.hash || '').replace(/^#/, '');
    if (!key || key === 'audiences') return;
    var id = HASH_TO_RADIO[key];
    if (!id) return;
    var input = document.getElementById(id);
    if (input) input.checked = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHash);
  } else {
    applyHash();
  }
  window.addEventListener('hashchange', applyHash);
})();
