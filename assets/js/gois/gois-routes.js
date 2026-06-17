/**
 * Role-based dashboard URLs for GWIX Operator Network login flows.
 */
(function (global) {
  'use strict';

  function normalizeType(role) {
    return (role || 'swi').toString().toLowerCase().replace(/-/g, '_');
  }

  function getDashboardPathForRole(role, preview) {
    var type = normalizeType(role);
    var base = preview ? '-test' : '';
    if (type === 'steward' || type === 'bth_steward' || type === 'admin') {
      return '/operator/steward/dashboard' + base + '.html';
    }
    if (type === 'swd_inv' || type === 'swd-inv') {
      return '/operator/swd-inv/dashboard' + base + '.html';
    }
    if (type === 'wds') {
      return '/operator/wds/dashboard' + base + '.html';
    }
    return '/operator/swi/dashboard' + base + '.html';
  }

  function isPreviewPage() {
    return /-test(?:\.html)?$/.test(global.location.pathname) ||
      global.location.pathname.indexOf('-test') !== -1;
  }

  function redirectToRoleDashboard(role, replace) {
    var path = getDashboardPathForRole(role, isPreviewPage());
    if (replace) {
      global.location.replace(path);
    } else {
      global.location.href = path;
    }
  }

  global.GOISRoutes = {
    getDashboardPathForRole: getDashboardPathForRole,
    redirectToRoleDashboard: redirectToRoleDashboard,
    isPreviewPage: isPreviewPage
  };
})(typeof window !== 'undefined' ? window : global);
