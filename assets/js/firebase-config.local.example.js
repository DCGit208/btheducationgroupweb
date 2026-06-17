/**
 * Copy this file to firebase-config.local.js and paste your Firebase web app credentials.
 * firebase-config.local.js is gitignored — never commit real keys to the repo.
 *
 * Firebase Console → Project settings → Your apps → Web app → Config object
 */
(function (global) {
  'use strict';

  global.GOIS_FIREBASE_CONFIG = {
    apiKey: 'PASTE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'PASTE_SENDER_ID',
    appId: 'PASTE_APP_ID'
  };
})(typeof window !== 'undefined' ? window : global);
