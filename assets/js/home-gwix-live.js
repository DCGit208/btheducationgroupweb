/**
 * Homepage — mini GWIX live econometric feed (Firestore).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderFeed(mount, events) {
    if (!mount) return;
    events = (events || []).slice(0, 3);
    if (!events.length) {
      mount.innerHTML =
        '<li class="wf-home-live__item wf-home-live__item--arch">' +
        '<span class="wf-home-live__subject">Architecture</span>' +
        '<span class="wf-home-live__text">Global Development Engine · $1.90B · 26 sectors · 130 divisions</span>' +
        '<span class="wf-home-live__badge wf-home-live__badge--arch">Architecture</span></li>' +
        '<li class="wf-home-live__item wf-home-live__item--arch">' +
        '<span class="wf-home-live__subject">WDDAM</span>' +
        '<span class="wf-home-live__text">Four markets active · Develop · Deploy · Acquire · Govern</span>' +
        '<span class="wf-home-live__badge wf-home-live__badge--arch">Framework</span></li>';
      return;
    }
    mount.innerHTML = events.map(function (ev) {
      return '<li class="wf-home-live__item wf-home-live__item--live">' +
        '<span class="wf-home-live__subject">' + esc(ev.subject || ev.scope || 'Registry') + '</span>' +
        '<span class="wf-home-live__text">' + esc(ev.summary || ev.text || '') + '</span>' +
        '<span class="wf-home-live__badge wf-home-live__badge--live">Live</span></li>';
    }).join('');
  }

  function init() {
    var mount = document.getElementById('homeGwixLiveFeed');
    if (!mount) return;

    if (global.GWIXFeedLive && global.GWIXFeedLive.startListener) {
      global.GWIXFeedLive.startListener(function (events) {
        renderFeed(mount, events);
      });
    } else if (global.GWIXFeedLive && global.GWIXFeedLive.loadLiveEventsOnce) {
      global.GWIXFeedLive.loadLiveEventsOnce().then(function (events) {
        renderFeed(mount, events);
      });
    } else {
      renderFeed(mount, []);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : global);
