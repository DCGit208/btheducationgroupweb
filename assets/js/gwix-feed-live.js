/**
 * GWIX live econometric feed — Firestore gwix_econometric_events → Market Activity Feed.
 */
(function (global) {
  'use strict';

  function eventToFeedItem(ev) {
    return {
      id: ev.id,
      subject: ev.subject || ev.scope || 'Registry',
      text: ev.summary || ev.text || '',
      delta: ev.delta || 'LIVE',
      live: true
    };
  }

  function mergeViews(staticViews, liveEvents) {
    if (!staticViews) return [];
    var byView = {};
    liveEvents.forEach(function (ev) {
      var view = ev.feedView || 'sectors';
      if (!byView[view]) byView[view] = [];
      byView[view].push(eventToFeedItem(ev));
    });

    return staticViews.map(function (view) {
      var liveItems = byView[view.id] || [];
      var items = liveItems.concat(view.items || []);
      return Object.assign({}, view, { items: items, liveCount: liveItems.length });
    });
  }

  function loadLiveEventsOnce() {
    if (!global.db) return Promise.resolve([]);
    return global.db.collection('gwix_econometric_events')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
      .then(function (snap) {
        return snap.docs.map(function (d) {
          return Object.assign({ id: d.id }, d.data());
        });
      })
      .catch(function (err) {
        console.warn('[GWIX] live feed load', err);
        return [];
      });
  }

  function startListener(onUpdate) {
    if (!global.db) {
      return loadLiveEventsOnce().then(function (events) {
        onUpdate(events);
        return null;
      });
    }
    return global.db.collection('gwix_econometric_events')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot(function (snap) {
        var events = snap.docs.map(function (d) {
          return Object.assign({ id: d.id }, d.data());
        });
        global.GWIX_LIVE_EVENTS = events;
        onUpdate(events);
      }, function (err) {
        console.warn('[GWIX] live feed listener', err);
        loadLiveEventsOnce().then(onUpdate);
      });
  }

  global.GWIXFeedLive = {
    mergeViews: mergeViews,
    loadLiveEventsOnce: loadLiveEventsOnce,
    startListener: startListener,
    eventToFeedItem: eventToFeedItem
  };
})(typeof window !== 'undefined' ? window : global);
