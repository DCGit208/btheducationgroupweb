/**
 * Firebase — GWIX Operator Network (bth-gwix-operator-network)
 * Web config from Firebase Console. measurementId used only if Analytics is loaded.
 */
(function (global) {
  'use strict';

  var firebaseConfig = {
    apiKey: 'AIzaSyBILoK6tV9kFK7_6p2v2xRaEsgRTQgNHFg',
    authDomain: 'bth-gwix-operator-network.firebaseapp.com',
    projectId: 'bth-gwix-operator-network',
    storageBucket: 'bth-gwix-operator-network.firebasestorage.app',
    messagingSenderId: '279857746150',
    appId: '1:279857746150:web:3e5102056f09e4bdbfeb27',
    measurementId: 'G-WRFKZV9B41'
  };

  if (global.GOIS_FIREBASE_CONFIG && global.GOIS_FIREBASE_CONFIG.projectId) {
    firebaseConfig = global.GOIS_FIREBASE_CONFIG;
  }

  var configured = !!(firebaseConfig.projectId && firebaseConfig.apiKey);

  if (configured && typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var db = null;
  var auth = null;

  if (configured && typeof firebase !== 'undefined') {
    if (typeof firebase.firestore === 'function') db = firebase.firestore();
    if (typeof firebase.auth === 'function') auth = firebase.auth();
  }

  global.db = db;
  global.auth = auth;
  global.GOISFirebaseConfigured = configured;
})(typeof window !== 'undefined' ? window : global);
