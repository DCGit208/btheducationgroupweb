(function(){
  const state = {
    sector: null,
    framework: 'standard',
    levels: new Set([1,2,3,4,5]),
    vendors: new Set(),
    focuses: new Set(),
    data: [],
    mapping: null
  };

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function getQuery(){
    const p = new URLSearchParams(location.search);
    return Object.fromEntries(p.entries());
  }
  function setQuery(updates){
    const p = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([k,v])=>{
      if(v===undefined||v===null||v==='') p.delete(k); else p.set(k, v);
    });
    history.replaceState(null, '', `${location.pathname}?${p.toString()}`);
  }

  async function loadData(){
    const [certRes, mapRes] = await Promise.all([
      fetch('assets/data/certifications.json'),
      fetch('assets/data/sector-mapping.json')
    ]);
    const [data, mapping] = await Promise.all([certRes.json(), mapRes.json()]);
    state.data = Array.isArray(data) ? data : (data.certifications||[]);
    state.mapping = mapping;
  }

  function getSectorConfig(){
    return state.mapping.sectors.find(s=>s.slug===state.sector);
  }

  function vendorize(name){ return (name||'').trim(); }
  function focusize(focus){ return (focus||'').trim(); }

  function matchesSector(item, cfg){
    if(!cfg || !cfg.includes) return true;
    const inc = cfg.includes;
    let ok = false;
    if(inc.categories && inc.categories.length){
      ok = ok || inc.categories.includes((item.category||'').trim());
    }
    if(inc.vendors && inc.vendors.length){
      ok = ok || inc.vendors.includes(vendorize(item.vendor));
    }
    if(inc.focusContains && inc.focusContains.length){
      ok = ok || inc.focusContains.some(key=> (item.focus||'').toLowerCase().includes(key.toLowerCase()));
    }
    return ok;
  }

  function matchesFramework(item, cfg){
    if(state.framework==='standard') return true;
    const rules = (cfg && cfg.hexadRules) || {};
    if(rules.minLevel && item.level>=rules.minLevel) return true;
    if(rules.vendors && rules.vendors.includes(vendorize(item.vendor))) return true;
    // fallback heuristic: treat premium=true as HEXAD-curated
    if(item.premium===true) return true;
    return false;
  }

  function matchesFilters(item){
    if(!state.levels.has(Number(item.level))) return false;
    if(state.vendors.size>0 && !state.vendors.has(vendorize(item.vendor))) return false;
    if(state.focuses.size>0){
      const f = focusize(item.focus);
      let any = false;
      state.focuses.forEach(x=>{ if(f.toLowerCase().includes(x.toLowerCase())) any=true; });
      if(!any) return false;
    }
    return true;
  }

  function deriveVendors(items){
    const set = new Set();
    items.forEach(i=>{ if(i.vendor) set.add(vendorize(i.vendor)); });
    return Array.from(set).sort();
  }

  function renderFilters(items){
    const vendorSel = $('#filterVendor');
    if(vendorSel){
      vendorSel.innerHTML = '<option value="">All Vendors</option>' + deriveVendors(items).map(v=>`<option value="${v}">${v}</option>`).join('');
      const q = getQuery();
      if(q.vendor) vendorSel.value = q.vendor;
      vendorSel.addEventListener('change', ()=>{
        const val = vendorSel.value;
        state.vendors.clear();
        if(val) state.vendors.add(val);
        setQuery({ vendor: val||null });
        render();
      });
    }

    const levelWrap = $('#filterLevels');
    if(levelWrap){
      levelWrap.innerHTML = [1,2,3,4,5].map(l=>{
        const q = getQuery();
        const active = q.levels ? q.levels.split(',').map(Number).includes(l) : true;
        return `<label><input type="checkbox" value="${l}" ${active?'checked':''}/> L${l}</label>`;
      }).join('');
      state.levels = new Set($all('input[type="checkbox"]', levelWrap).filter(i=>i.checked).map(i=>Number(i.value)));
      levelWrap.addEventListener('change', ()=>{
        state.levels = new Set($all('input[type="checkbox"]', levelWrap).filter(i=>i.checked).map(i=>Number(i.value)));
        const levelsStr = Array.from(state.levels).sort().join(',');
        setQuery({ levels: (state.levels.size===5? null : levelsStr) });
        render();
      });
    }

    const searchInput = $('#filterFocus');
    if(searchInput){
      const q = getQuery();
      if(q.focus){ state.focuses = new Set([q.focus]); searchInput.value = q.focus; }
      searchInput.addEventListener('input', ()=>{
        const val = searchInput.value.trim();
        state.focuses.clear();
        if(val) state.focuses.add(val);
        setQuery({ focus: val||null });
        render();
      });
    }

    const fwStandard = $('#fwStandard');
    const fwHexad = $('#fwHexad');
    if(fwStandard && fwHexad){
      const q = getQuery();
      state.framework = (q.framework==='hexad') ? 'hexad' : 'standard';
      fwStandard.checked = state.framework==='standard';
      fwHexad.checked = state.framework==='hexad';
      [fwStandard, fwHexad].forEach(el=>{
        el.addEventListener('change', ()=>{
          state.framework = fwHexad.checked ? 'hexad' : 'standard';
          setQuery({ framework: state.framework==='standard'? null : 'hexad' });
          if(window.dataLayer){ window.dataLayer.push({event:'framework_toggle', sector: state.sector, framework: state.framework}); }
          render();
        });
      });
    }
  }

  function render(){
    const cfg = getSectorConfig();
    const allSector = state.data.filter(i=>matchesSector(i, cfg));
    renderFilters(allSector);

    const filtered = allSector.filter(i=>matchesFramework(i, cfg)).filter(matchesFilters);

    const countEl = $('#resultsCount');
    if(countEl){ countEl.textContent = `${filtered.length} results`; }

    const grid = $('#results');
    if(!grid) return;
    if(filtered.length===0){
      grid.innerHTML = `<div class="empty">No results yet for this view. Try adjusting filters or check back soon.</div>`;
      return;
    }
    grid.innerHTML = filtered.map(item=>{
      const level = Number(item.level)||1;
      return `
        <article class="cert-card" data-level="${level}">
          <header>
            <h3>${item.name}</h3>
            <div class="meta">
              <span class="vendor">${item.vendor||''}</span>
              <span class="sep">•</span>
              <span class="focus">${item.focus||''}</span>
              <span class="sep">•</span>
              <span class="level">L${level}</span>
            </div>
          </header>
          <div class="actions">
            <a class="btn" href="#" aria-label="View details for ${item.name}">View</a>
          </div>
        </article>
      `;
    }).join('');
  }

  async function init(){
    const el = document.body;
    state.sector = el.getAttribute('data-sector');
    if(!state.sector){ console.warn('Missing data-sector on body'); return; }
    await loadData();
    // seed filters from query
    const q = getQuery();
    if(q.vendor){ state.vendors.add(q.vendor); }
    if(q.levels){ state.levels = new Set(q.levels.split(',').map(Number)); }
    if(q.focus){ state.focuses = new Set([q.focus]); }
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
