/**
 * BTH portfolio currency — architecture values displayed in USD.
 * Source amounts in FCFA; conversion reference rate 600 FCFA = 1 USD.
 */
(function (global) {
  'use strict';

  var FCFA_PER_USD = 600;

  var ARCHITECTURE = {
    globalEngineUsd: 1898000000,
    sectorEngineUsd: 73000000,
    divisionEngineUsd: 14600000,
    cohortEngineUsd: 730000,
    cohortL1Usd: 7500,
    cohortL2Usd: 11167,
    cohortL3Usd: 15000,
    cohortL4Usd: 20833,
    cohortL5Usd: 25000,
    sectors: 26,
    divisions: 130,
    capacity: 130000,
    cohorts: 6500
  };

  var LABELS = {
    globalEngine: '$1.90B',
    sectorEngine: '$73M',
    divisionEngine: '$14.6M',
    cohortEngine: '$730K',
    globalEngineShort: '1.90B',
    sectorEngineShort: '73',
    divisionEngineShort: '14.6'
  };

  function fcfaToUsd(fcfa) {
    return Number(fcfa || 0) / FCFA_PER_USD;
  }

  function fmtUsd(n, opts) {
    opts = opts || {};
    n = Number(n || 0);
    if (opts.compact !== false) {
      if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
      if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    }
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function fmtUsdShort(n) {
    if (n >= 1e12) return '1.90B';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return String(n);
  }

  global.BTHPortfolio = {
    FCFA_PER_USD: FCFA_PER_USD,
    ARCHITECTURE: ARCHITECTURE,
    LABELS: LABELS,
    fcfaToUsd: fcfaToUsd,
    fmtUsd: fmtUsd,
    fmtUsdShort: fmtUsdShort
  };
})(typeof window !== 'undefined' ? window : global);
