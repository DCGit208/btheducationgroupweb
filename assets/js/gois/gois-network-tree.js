/**
 * SWI division network genealogy — hierarchical operator tree.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function normRole(role) {
    return (role || '').toLowerCase().replace(/-/g, '_');
  }

  function parentOf(op, rootCode) {
    return op.parentCode || op.uplineCode || (normRole(op.role) === 'swd_inv' ? rootCode : '');
  }

  function buildTree(rootCode, operators) {
    var byCode = {};
    operators.forEach(function (op) {
      if (op.code) byCode[op.code] = Object.assign({ children: [] }, op);
    });

    var root = byCode[rootCode] || {
      code: rootCode,
      name: rootCode,
      role: 'swi',
      children: []
    };

    operators.forEach(function (op) {
      if (!op.code || op.code === rootCode) return;
      var node = byCode[op.code];
      if (!node) return;
      var parentCode = parentOf(op, rootCode);
      var parent = parentCode && byCode[parentCode] ? byCode[parentCode] : root;
      if (parent.children.indexOf(node) === -1) parent.children.push(node);
    });

    root.children.sort(sortNodes);
    root.children.forEach(sortSubtree);
    return root;
  }

  function sortNodes(a, b) {
    var order = { swd_inv: 0, wds: 1 };
    var ra = order[normRole(a.role)] != null ? order[normRole(a.role)] : 9;
    var rb = order[normRole(b.role)] != null ? order[normRole(b.role)] : 9;
    if (ra !== rb) return ra - rb;
    return String(a.code || '').localeCompare(b.code || '');
  }

  function sortSubtree(node) {
    node.children.sort(sortNodes);
    node.children.forEach(sortSubtree);
  }

  function roleBadge(role) {
    var r = normRole(role);
    var cls = r === 'swd_inv' ? 'gois-badge--arch' : r === 'wds' ? 'gois-badge--live' : 'gois-badge--steward';
    return '<span class="gois-badge ' + cls + '">' + esc((role || '').toUpperCase()) + '</span>';
  }

  function renderNode(node, depth) {
    depth = depth || 0;
    var hasKids = node.children && node.children.length;
    var kids = hasKids
      ? '<ul class="gois-tree-children">' + node.children.map(function (c) {
        return renderNode(c, depth + 1);
      }).join('') + '</ul>'
      : '';

    return '<li class="gois-tree-node" data-depth="' + depth + '">' +
      '<div class="gois-tree-row">' +
      (hasKids ? '<button type="button" class="gois-tree-toggle" aria-expanded="true">−</button>' : '<span class="gois-tree-spacer"></span>') +
      roleBadge(node.role) +
      ' <strong>' + esc(node.name || node.code) + '</strong> ' +
      '<code class="gois-tree-code">' + esc(node.code) + '</code>' +
      (node.sectorId ? '<span class="gois-tree-meta">' + esc(node.sectorId) + ' · Div ' + esc(node.divisionId || '—') + '</span>' : '') +
      '</div>' + kids + '</li>';
  }

  function render(mountEl, rootCode, operators) {
    if (!mountEl) return;
    if (!operators || !operators.length) {
      mountEl.innerHTML = '<div class="gois-empty">No downline operators registered in this division yet.</div>';
      return;
    }

    var tree = buildTree(rootCode, operators);
    mountEl.innerHTML =
      '<div class="gois-card gois-network-tree-card">' +
      '<h3><i class="fa-solid fa-diagram-project"></i> Division genealogy</h3>' +
      '<p class="gois-tree-intro">Live operator registry — SWI → SWD-INV → WDS hierarchy for your division.</p>' +
      '<ul class="gois-tree-root">' + renderNode(tree, 0) + '</ul></div>';

    mountEl.querySelectorAll('.gois-tree-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.gois-tree-node');
        var kids = li && li.querySelector(':scope > .gois-tree-children');
        if (!kids) return;
        var open = kids.classList.toggle('gois-tree-children--collapsed');
        btn.textContent = open ? '+' : '−';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
  }

  global.GOISNetworkTree = { buildTree: buildTree, render: render };
})(typeof window !== 'undefined' ? window : global);
