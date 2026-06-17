/**
 * GOIS authentication — Firebase Auth + Firestore users/{uid}.role gate.
 */
(function (global) {
  'use strict';

  var SESSION_KEY = 'gois_operator_session';

  function getRank() {
    return document.body.getAttribute('data-gois-rank') || 'swi';
  }

  function requiredRoleForPage() {
    return getRank();
  }

  function db() {
    return global.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
  }

  function auth() {
    return global.auth || (typeof firebase !== 'undefined' && firebase.auth ? firebase.auth() : null);
  }

  function saveSession(user, profile) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: profile.role,
        operatorCode: profile.operatorCode || '',
        name: profile.name || user.displayName || '',
        sectorId: profile.sectorId || null,
        divisionId: profile.divisionId || null,
        savedAt: Date.now()
      }));
    } catch (e) { /* ignore */ }
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    var a = auth();
    if (a) return a.signOut();
    return Promise.resolve();
  }

  function roleMatchesPage(profileRole) {
    var required = requiredRoleForPage();
    var role = (profileRole || '').toString().toLowerCase().replace(/-/g, '_');
    if (required === 'steward') {
      return role === 'steward' || role === 'bth_steward' || role === 'admin';
    }
    return role === required;
  }

  async function fetchUserProfile(uid) {
    var firestore = db();
    if (!firestore) return null;
    var snap = await firestore.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    return snap.data();
  }

  async function resolveOperatorDoc(profile) {
    var firestore = db();
    if (!firestore || !profile || !profile.operatorCode) return null;
    var snap = await firestore.collection('operators')
      .where('code', '==', profile.operatorCode)
      .limit(1)
      .get();
    if (snap.empty) return null;
    var doc = snap.docs[0];
    return { id: doc.id, data: doc.data() };
  }

  function showLogin(show) {
    var overlay = document.getElementById('goisLoginOverlay');
    var app = document.getElementById('goisApp');
    if (overlay) overlay.classList.toggle('gois-hidden', !show);
    if (app) app.classList.toggle('gois-hidden', show);
  }

  function showLoginError(msg) {
    var el = document.getElementById('goisLoginError');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function bindLoginForm() {
    var form = document.getElementById('goisLoginForm');
    if (!form || form.getAttribute('data-bound') === '1') return;
    form.setAttribute('data-bound', '1');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = document.getElementById('goisLoginEmail').value.trim();
      var password = document.getElementById('goisLoginPassword').value;
      var a = auth();
      if (!a) {
        showLoginError('Firebase is not configured. Set assets/js/firebase-config.js first.');
        return;
      }
      try {
        var cred = await a.signInWithEmailAndPassword(email, password);
        var profile = await fetchUserProfile(cred.user.uid);
        if (!profile || !roleMatchesPage(profile.role)) {
          await a.signOut();
          showLoginError('Access denied. This dashboard requires ' + requiredRoleForPage() + ' role.');
          return;
        }
        saveSession(cred.user, profile);
        showLogin(false);
        global.dispatchEvent(new CustomEvent('gois-auth-ready', { detail: { user: cred.user, profile: profile } }));
      } catch (err) {
        showLoginError(err.message || 'Login failed.');
      }
    });
  }

  function bindLogout() {
    var btn = document.getElementById('goisLogout');
    if (!btn || btn.getAttribute('data-bound') === '1') return;
    btn.setAttribute('data-bound', '1');
    btn.addEventListener('click', function () {
      clearSession().then(function () {
        global.location.replace('../login-test.html?logged_out=1&rank=' + encodeURIComponent(getRank()));
      });
    });
  }

  function isPreviewBypass() {
    var params = new URLSearchParams(window.location.search);
    return params.get('preview') === '1' || params.get('preview') === 'ui';
  }

  function initPreviewBypass() {
    showLogin(false);
    global.dispatchEvent(new CustomEvent('gois-auth-ready', {
      detail: {
        user: null,
        profile: {
          role: requiredRoleForPage(),
          name: 'Preview Operator',
          operatorCode: 'PREVIEW-' + requiredRoleForPage().toUpperCase(),
          sectorId: 'EdTech',
          divisionId: 'IV'
        }
      }
    }));
  }

  function init() {
    bindLoginForm();
    bindLogout();
    if (isPreviewBypass()) {
      initPreviewBypass();
      return;
    }
    var a = auth();
    if (!a || !global.GOISFirebaseConfigured) {
      showLogin(true);
      showLoginError('Firebase not configured. Add credentials to assets/js/firebase-config.js — or append ?preview=1 to review the UI.');
      return;
    }
    a.onAuthStateChanged(async function (user) {
      if (!user) {
        showLogin(true);
        return;
      }
      try {
        var profile = await fetchUserProfile(user.uid);
        if (!profile || !roleMatchesPage(profile.role)) {
          await a.signOut();
          clearSession();
          showLogin(true);
          showLoginError('Access denied for this operator role.');
          return;
        }
        saveSession(user, profile);
        showLogin(false);
        global.dispatchEvent(new CustomEvent('gois-auth-ready', { detail: { user: user, profile: profile } }));
      } catch (err) {
        showLogin(true);
        showLoginError(err.message || 'Could not verify operator profile.');
      }
    });
  }

  global.GOISAuth = {
    init: init,
    getSession: getSession,
    clearSession: clearSession,
    fetchUserProfile: fetchUserProfile,
    resolveOperatorDoc: resolveOperatorDoc,
    roleMatchesPage: roleMatchesPage
  };
})(typeof window !== 'undefined' ? window : global);
