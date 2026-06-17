/**
 * GOIS Cloud Functions client — approve operator with login provisioning.
 */
(function (global) {
  'use strict';

  function functions() {
    return typeof firebase !== 'undefined' && firebase.functions
      ? firebase.functions()
      : null;
  }

  async function approveWithLogin(operatorId, email, password) {
    var fn = functions();
    if (!fn) throw new Error('Firebase Functions not loaded.');
    var callable = fn.httpsCallable('goisApproveOperator');
    var result = await callable({ operatorId: operatorId, email: email, password: password || null });
    return result.data;
  }

  global.GOISProvision = { approveWithLogin: approveWithLogin };
})(typeof window !== 'undefined' ? window : global);
