/* ============================================================
   MEBRAN — Shop / Collection page
   Depends on mebran.js (window.MEBRAN)
   ============================================================ */
(function(){
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const M  = window.MEBRAN || {};
  const PRODUCTS = M.PRODUCTS || [];
  const card = M.productCard;

  /* ---------- Detail page mapping ----------
     Only the Ajwa PDP exists; others use it as the template for now. */
  const DETAIL = { ajwa: 'Ajwa Dates.html' };
  const detailURL = id => DETAIL[id] || 'Ajwa Dates.html';

  /* ---------- Filter definitions ---------- */
  const CATS = [
    { key:'all',        label:'All Products' },
    { key:'Dates',      label:'Dates' },
    { key:'Dry Fruits', label:'Dry Fruits' },
    { key:'Nuts',       label:'Nuts' }
  ];
  const PRICE = [
    { key:'under600', label:'Under ₹600',  test:p => p.price < 600 },
    { key:'mid',      label:'₹600 – ₹900', test:p => p.price >= 600 && p.price <= 900 },
    { key:'over900',  label:'₹900 & above', test:p => p.price > 900 }
  ];
  const TAGS = [
    { key:'Best Seller', label:'Best Sellers', test:p => p.tag === 'Best Seller' },
    { key:'New',         label:'New Arrivals', test:p => p.tag === 'New' },
    { key:'sale',        label:'On Offer',     test:p => !!p.was }
  ];

  /* ---------- State ---------- */
  const state = {
    cat: 'all',
    price: new Set(),
    tags: new Set(),
    minRating: 0,
    sort: 'featured'
  };

  // deep-link ?cat=
  const params = new URLSearchParams(location.search);
  const qcat = params.get('cat');
  if(qcat && CATS.some(c => c.key === qcat)) state.cat = qcat;

  /* ---------- Filtering / sorting ---------- */
  function filtered(){
    let list = PRODUCTS.slice();
    if(state.cat !== 'all') list = list.filter(p => p.cat === state.cat);
    if(state.price.size){ list = list.filter(p => [...state.price].some(k => PRICE.find(x=>x.key===k).test(p))); }
    if(state.tags.size){ list = list.filter(p => [...state.tags].some(k => TAGS.find(x=>x.key===k).test(p))); }
    if(state.minRating) list = list.filter(p => p.rating >= state.minRating);
    switch(state.sort){
      case 'price-asc':  list.sort((a,b)=> a.price - b.price); break;
      case 'price-desc': list.sort((a,b)=> b.price - a.price); break;
      case 'rating':     list.sort((a,b)=> b.rating - a.rating); break;
      case 'reviews':    list.sort((a,b)=> b.reviews - a.reviews); break;
      default: break; // featured = catalogue order
    }
    return list;
  }

  /* ---------- Render grid ---------- */
  const grid = $('#shopGrid');
  function renderGrid(){
    const list = filtered();
    $('#shopCount').innerHTML = `Showing <b>${list.length}</b> of ${PRODUCTS.length} products`;
    if(!list.length){
      grid.innerHTML = `<div class="shop-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M8 11h6"/></svg>
        <h3>No products match your filters</h3>
        <p>Try removing a filter or browsing all products.</p>
        <button class="btn btn--primary" id="emptyClear">Clear Filters</button>
      </div>`;
      $('#emptyClear').onclick = clearAll;
      return;
    }
    grid.innerHTML = list.map(p => {
      const html = card(p, true);
      const link = `<a class="pc-cardlink" href="${detailURL(p.id)}" aria-label="${p.name}"></a>`;
      return html.replace('>', '>' + link); // inject right after opening <article ...>
    }).join('');
  }

  /* ---------- Category tabs ---------- */
  function renderTabs(){
    const wrap = $('#catTabs');
    wrap.innerHTML = CATS.map(c => {
      const n = c.key === 'all' ? PRODUCTS.length : PRODUCTS.filter(p=>p.cat===c.key).length;
      return `<button class="cat-tab ${c.key===state.cat?'active':''}" data-cat="${c.key}">${c.label}<span>${n}</span></button>`;
    }).join('');
    $$('#catTabs .cat-tab').forEach(b => b.onclick = ()=>{ state.cat = b.dataset.cat; syncAll(); });
  }

  /* ---------- Sidebar filters ---------- */
  function buildFilters(){
    const host = $('#filterGroups');
    const priceHtml = PRICE.map(o => fopt('price', o.key, o.label, PRODUCTS.filter(o.test).length)).join('');
    const tagHtml   = TAGS.map(o => fopt('tags', o.key, o.label, PRODUCTS.filter(o.test).length)).join('');
    const rateHtml  = [4.9,4.8,4.7].map(r => `
      <label class="fopt"><input type="radio" name="rating" value="${r}"><span class="fbox">${tick()}</span>${r}★ &amp; up</label>`).join('');
    host.innerHTML = `
      <div class="filter-group"><h4>Price</h4>${priceHtml}</div>
      <div class="filter-group"><h4>Collection</h4>${tagHtml}</div>
      <div class="filter-group"><h4>Rating</h4>${rateHtml}
        <button class="filter-clear" id="clearAll">Clear all filters</button>
      </div>`;

    $$('#filterGroups input[data-set="price"]').forEach(cb => cb.onchange = ()=> toggleSet(state.price, cb.value, cb.checked));
    $$('#filterGroups input[data-set="tags"]').forEach(cb => cb.onchange = ()=> toggleSet(state.tags, cb.value, cb.checked));
    $$('#filterGroups input[name="rating"]').forEach(rb => rb.onchange = ()=>{ state.minRating = +rb.value; syncAll(); });
    $('#clearAll').onclick = clearAll;
  }
  function fopt(set, val, label, count){
    return `<label class="fopt"><input type="checkbox" data-set="${set}" value="${val}"><span class="fbox">${tick()}</span>${label}<span class="fcount">${count}</span></label>`;
  }
  function tick(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`; }
  function toggleSet(set, val, on){ on ? set.add(val) : set.delete(val); syncAll(); }

  /* ---------- Active chips ---------- */
  function renderChips(){
    const wrap = $('#activeChips');
    const chips = [];
    if(state.cat !== 'all') chips.push({ label: CATS.find(c=>c.key===state.cat).label, clear:()=> state.cat='all' });
    state.price.forEach(k => chips.push({ label: PRICE.find(x=>x.key===k).label, clear:()=> state.price.delete(k) }));
    state.tags.forEach(k => chips.push({ label: TAGS.find(x=>x.key===k).label, clear:()=> state.tags.delete(k) }));
    if(state.minRating) chips.push({ label:`${state.minRating}★ & up`, clear:()=> state.minRating=0 });
    wrap.innerHTML = chips.map((c,i)=>`<span class="chip">${c.label}<button data-chip="${i}" aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>`).join('');
    $$('#activeChips [data-chip]').forEach((b,i)=> b.onclick = ()=>{ chips[i].clear(); syncAll(); });
  }

  function clearAll(){
    state.cat='all'; state.price.clear(); state.tags.clear(); state.minRating=0;
    syncAll();
  }

  /* ---------- Sync controls -> re-render ---------- */
  function syncAll(){
    // reflect state back into inputs
    $$('#filterGroups input[data-set="price"]').forEach(cb => cb.checked = state.price.has(cb.value));
    $$('#filterGroups input[data-set="tags"]').forEach(cb => cb.checked = state.tags.has(cb.value));
    $$('#filterGroups input[name="rating"]').forEach(rb => rb.checked = (+rb.value === state.minRating));
    $$('#catTabs .cat-tab').forEach(b => b.classList.toggle('active', b.dataset.cat===state.cat));
    renderChips();
    renderGrid();
  }

  /* ---------- Sort ---------- */
  $('#sortSelect') && ($('#sortSelect').onchange = e => { state.sort = e.target.value; renderGrid(); });

  /* ---------- Mobile filter drawer ---------- */
  const filters = $('#filters');
  const fbd = $('#filtersBackdrop');
  $('#filterToggle') && ($('#filterToggle').onclick = ()=>{ filters.classList.add('open'); fbd.classList.add('show'); document.body.classList.add('no-scroll'); });
  const closeF = ()=>{ filters.classList.remove('open'); fbd.classList.remove('show'); document.body.classList.remove('no-scroll'); };
  $('#filtersClose') && ($('#filtersClose').onclick = closeF);
  fbd && (fbd.onclick = closeF);

  /* ---------- Init ---------- */
  renderTabs();
  buildFilters();
  syncAll();

})();
