/**
 * Section router for GOIS operator dashboards (hash: #overview, #network, …).
 */
(function (global) {
  'use strict';

  var currentSection = 'overview';

  function getRank() {
    return document.body.getAttribute('data-gois-rank') || 'swi';
  }

  function setSection(id) {
    if (!id) id = 'overview';
    currentSection = id;

    document.querySelectorAll('.gois-section').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-section') === id);
    });

    document.querySelectorAll('[data-gois-nav]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-gois-nav') === id);
    });

    var titleEl = document.getElementById('goisPageTitle');
    if (titleEl && global.GOISConfig) {
      titleEl.textContent = global.GOISConfig.getSectionTitle(id, getRank());
    }

    if (location.hash !== '#' + id) {
      history.replaceState(null, '', '#' + id);
    }

    global.dispatchEvent(new CustomEvent('gois-section-change', { detail: { section: id } }));
  }

  function initFromHash() {
    var hash = (location.hash || '#overview').replace('#', '');
    if (!document.querySelector('[data-section="' + hash + '"]')) hash = 'overview';
    setSection(hash);
  }

  function buildSidebarNav() {
    if (!global.GOISConfig) return;
    var sidebar = document.getElementById('goisSidebarNav');
    if (!sidebar || sidebar.getAttribute('data-built') === '1') return;

    var nav = global.GOISConfig.getNavForRank(getRank()).filter(function (item) {
      return !!document.querySelector('[data-section="' + item.id + '"]');
    });

    nav.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-gois-nav', item.id);
      btn.innerHTML = '<i class="' + item.icon + ' gois-nav-ico" aria-hidden="true"></i><span>' + item.label + '</span>';
      sidebar.appendChild(btn);
    });

    sidebar.setAttribute('data-built', '1');
    bindNav();
  }

  function bindNav() {
    document.querySelectorAll('[data-gois-nav]').forEach(function (btn) {
      if (btn.getAttribute('data-gois-bound') === '1') return;
      btn.setAttribute('data-gois-bound', '1');
      btn.addEventListener('click', function () {
        setSection(btn.getAttribute('data-gois-nav'));
      });
    });
    window.addEventListener('hashchange', initFromHash);
  }

  global.GOISRouter = {
    setSection: setSection,
    getSection: function () { return currentSection; },
    init: function () {
      buildSidebarNav();
      bindNav();
      initFromHash();
    }
  };
})(typeof window !== 'undefined' ? window : global);
