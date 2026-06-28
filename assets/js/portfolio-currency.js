/**
 * BTH portfolio currency — architecture values displayed in USD.
 * Source amounts in FCFA; USD = FCFA ÷ 555.56 (L1 anchor: 4,500,000 FCFA = $8,100).
 * Canonical cohort mix: L1×15 · L2×10 · L3×9 · L4×7 · L5×9 = 50 capacity → 438,000,000 FCFA.
 * Portfolio Development Engine roll-up: cohort × 20 per division (not × 50 cohort count).
 */
(function (global) {
  'use strict';

  var FCFA_PER_USD = 555.56;

  var COHORT_CAPACITY = {
    l1: 15,
    l2: 10,
    l3: 9,
    l4: 7,
    l5: 9,
    total: 50
  };

  var ARCHITECTURE = {
    globalEngineFcfa: 1138800000000,
    globalEngineUsd: 2049823601,
    sectorEngineFcfa: 43800000000,
    sectorEngineUsd: 78839369,
    divisionEngineFcfa: 8760000000,
    divisionEngineUsd: 15767874,
    cohortEngineFcfa: 438000000,
    cohortEngineUsd: 788394,
    cohortL1Fcfa: 4500000,
    cohortL2Fcfa: 6700000,
    cohortL3Fcfa: 9000000,
    cohortL4Fcfa: 12500000,
    cohortL5Fcfa: 15000000,
    cohortL1Usd: 8100,
    cohortL2Usd: 12060,
    cohortL3Usd: 16200,
    cohortL4Usd: 22500,
    cohortL5Usd: 27000,
    cohortL1Cap: 15,
    cohortL2Cap: 10,
    cohortL3Cap: 9,
    cohortL4Cap: 7,
    cohortL5Cap: 9,
    sectors: 26,
    divisions: 130,
    capacity: 130000,
    cohorts: 6500
  };

  var LABELS = {
    globalEngine: '$2.05B',
    sectorEngine: '$78.8M',
    divisionEngine: '$15.8M',
    cohortEngine: '$788K',
    globalEngineShort: '2.05B',
    sectorEngineShort: '78.8',
    divisionEngineShort: '15.8'
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
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return String(n);
  }

  global.BTHPortfolio = {
    FCFA_PER_USD: FCFA_PER_USD,
    COHORT_CAPACITY: COHORT_CAPACITY,
    ARCHITECTURE: ARCHITECTURE,
    LABELS: LABELS,
    fcfaToUsd: fcfaToUsd,
    fmtUsd: fmtUsd,
    fmtUsdShort: fmtUsdShort
  };
})(typeof window !== 'undefined' ? window : global);
