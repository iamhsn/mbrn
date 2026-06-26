/* ============================================================
   MEBRAN — interactions
   ============================================================ */
(function(){
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Product catalogue ---------- */
  const PRODUCTS = [
    { id:'ajwa',    name:'Ajwa Dates',     variant:'Premium · 500g', price:899, was:1049, rating:4.9, reviews:842, cat:'Dates', tag:'Best Seller', desc:'Soft, dark & rich — Madinah origin.' },
    { id:'mabroom', name:'Mabroom Dates',  variant:'Premium · 500g', price:749, was:null, rating:4.8, reviews:531, cat:'Dates', tag:'Best Seller', desc:'Slender, chewy & caramel-sweet.' },
    { id:'medjool', name:'Medjool Dates',  variant:'Jumbo · 500g',   price:999, was:1199, rating:4.9, reviews:1203, cat:'Dates', tag:'Best Seller', desc:'Large, plump & luxuriously soft.' },
    { id:'safawi',  name:'Safawi Dates',   variant:'Premium · 500g', price:699, was:null, rating:4.7, reviews:398, cat:'Dates', tag:null, desc:'Dark, semi-dry & mildly sweet.' },
    { id:'figs',    name:'Premium Figs',   variant:'Anjeer · 250g',  price:649, was:799, rating:4.8, reviews:467, cat:'Dry Fruits', tag:'New', desc:'Sun-dried Afghan anjeer.' },
    { id:'almonds', name:'Mamra Almonds',  variant:'Premium · 250g', price:849, was:null, rating:4.9, reviews:612, cat:'Nuts', tag:null, desc:'Rich, dense California-grade.' },
    { id:'pista',   name:'Iranian Pistachios', variant:'Roasted · 250g', price:1099, was:1299, rating:4.8, reviews:389, cat:'Nuts', tag:'Best Seller', desc:'Lightly salted, jumbo grade.' },
    { id:'apricot', name:'Turkish Apricots', variant:'Jumbo · 250g',  price:599, was:null, rating:4.7, reviews:276, cat:'Dry Fruits', tag:null, desc:'Soft, tangy & naturally sweet.' }
  ];
  const PMAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const inr = n => '₹' + n.toLocaleString('en-IN');
  const FREE_SHIP = 999;

  /* ---------- SVG icon set ---------- */
  const I = {
    star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>'
  };
  const starsHtml = (r) => {
    let s='';
    for(let i=1;i<=5;i++){ s += `<svg viewBox="0 0 24 24" fill="${i<=Math.round(r)?'currentColor':'none'}" stroke="currentColor" stroke-width="1.4"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z"/></svg>`; }
    return `<span class="stars">${s}</span>`;
  };
  const phLabel = (txt, sub) => `<div class="ph-label">${txt}${sub?`<span>${sub}</span>`:''}</div>`;

  /* ---------- State ---------- */
  let cart = [];      // {id, qty}
  let wishlist = new Set();
  try{
    const saved = JSON.parse(localStorage.getItem('mebran_cart')||'[]'); if(Array.isArray(saved)) cart = saved;
    const w = JSON.parse(localStorage.getItem('mebran_wish')||'[]'); if(Array.isArray(w)) wishlist = new Set(w);
  }catch(e){}
  const persist = () => {
    try{ localStorage.setItem('mebran_cart', JSON.stringify(cart)); localStorage.setItem('mebran_wish', JSON.stringify([...wishlist])); }catch(e){}
  };
  const cartListeners = [];
  const notifyCart = () => { cartListeners.forEach(fn => { try{ fn(); }catch(e){} }); };

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ============================================================
     ANNOUNCEMENT BAR rotation
     ============================================================ */
  const annItems = $$('.announce-item');
  if(annItems.length){
    let ai = 0;
    setInterval(()=>{
      annItems[ai].classList.remove('active');
      ai = (ai+1) % annItems.length;
      annItems[ai].classList.add('active');
    }, 3800);
  }

  /* ============================================================
     STICKY HEADER
     ============================================================ */
  const header = $('.header');
  let lastY = 0;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    lastY = y;
  }, {passive:true});

  /* ============================================================
     MEGA MENU
     ============================================================ */
  const shopItem = $('#shopNav');
  const mega = $('#mega');
  if(shopItem && mega){
    let megaT;
    const openMega = ()=>{ clearTimeout(megaT); mega.classList.add('open'); };
    const closeMega = ()=>{ megaT = setTimeout(()=> mega.classList.remove('open'), 180); };
    shopItem.addEventListener('mouseenter', openMega);
    shopItem.addEventListener('mouseleave', closeMega);
    mega.addEventListener('mouseenter', openMega);
    mega.addEventListener('mouseleave', closeMega);
    $$('#mega a').forEach(a => a.addEventListener('click', ()=> mega.classList.remove('open')));
  }

  /* ============================================================
     BACKDROP helper
     ============================================================ */
  const backdrop = $('#backdrop');
  const openBackdrop = ()=>{ backdrop.classList.add('show'); document.body.classList.add('no-scroll'); };
  const closeBackdrop = ()=>{ backdrop.classList.remove('show'); document.body.classList.remove('no-scroll'); };

  /* ============================================================
     CART DRAWER
     ============================================================ */
  const drawer = $('#cartDrawer');
  const openCart = ()=>{ renderCart(); drawer.classList.add('open'); openBackdrop(); };
  const closeCart = ()=>{ drawer.classList.remove('open'); if(!searchOverlay.classList.contains('open')) closeBackdrop(); };
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);

  function cartCountTotal(){ return cart.reduce((s,l)=> s + l.qty, 0); }
  function cartSubtotal(){ return cart.reduce((s,l)=> s + PMAP[l.id].price * l.qty, 0); }

  function updateBadges(){
    const c = cartCountTotal();
    const badge = $('#cartCount');
    badge.textContent = c;
    badge.classList.toggle('show', c>0);
    const wb = $('#wishCount');
    if(wb){
      wb.textContent = wishlist.size;
      wb.classList.toggle('show', wishlist.size>0);
    }
  }

  function addToCart(id, qty=1, silent=false){
    const line = cart.find(l => l.id===id);
    if(line) line.qty += qty; else cart.push({id, qty});
    persist(); updateBadges(); notifyCart();
    if(!silent) toast(`${PMAP[id].name} added to cart`);
    if(drawer.classList.contains('open')) renderCart();
  }
  function setQty(id, qty){
    const line = cart.find(l => l.id===id);
    if(!line) return;
    line.qty = qty;
    if(line.qty <= 0) cart = cart.filter(l => l.id!==id);
    persist(); updateBadges(); notifyCart(); renderCart();
  }

  function renderCart(){
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    if(cart.length === 0){
      body.innerHTML = `<div class="cart-empty">${I.bag}<h4>Your cart is empty</h4><p>Add some premium dates & dry fruits to get started.</p></div>`;
      foot.style.display = 'none';
      $('#shipMsg').textContent = 'Free shipping on orders above ₹999';
      $('#shipBar').style.width = '0%';
      return;
    }
    foot.style.display = 'block';
    body.innerHTML = cart.map(l => {
      const p = PMAP[l.id];
      return `<div class="cart-line">
        <div class="cart-line-media"><div class="ph ph--gold">${phLabel(p.name)}</div></div>
        <div class="cart-line-info">
          <h4>${p.name}</h4>
          <div class="cl-var">${p.variant}</div>
          <div class="cart-line-foot">
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Decrease">${I.minus}</button>
              <span>${l.qty}</span>
              <button data-inc="${p.id}" aria-label="Increase">${I.plus}</button>
            </div>
            <div class="cl-price">${inr(p.price * l.qty)}</div>
          </div>
          <button class="cl-remove" data-rm="${p.id}">Remove</button>
        </div>
      </div>`;
    }).join('');

    const sub = cartSubtotal();
    $('#cartSub').textContent = inr(sub);
    $('#cartTotal').textContent = inr(sub);

    // shipping progress
    const remaining = FREE_SHIP - sub;
    const pct = Math.min(100, (sub / FREE_SHIP) * 100);
    $('#shipBar').style.width = pct + '%';
    $('#shipMsg').innerHTML = remaining > 0
      ? `Add <b>${inr(remaining)}</b> more for <b>free shipping</b>`
      : `🎉 You've unlocked <b>free shipping</b>`;

    body.querySelectorAll('[data-inc]').forEach(b => b.onclick = ()=> setQty(b.dataset.inc, cart.find(l=>l.id===b.dataset.inc).qty+1));
    body.querySelectorAll('[data-dec]').forEach(b => b.onclick = ()=> setQty(b.dataset.dec, cart.find(l=>l.id===b.dataset.dec).qty-1));
    body.querySelectorAll('[data-rm]').forEach(b => b.onclick = ()=> setQty(b.dataset.rm, 0));
  }

  /* ============================================================
     WISHLIST
     ============================================================ */
  function toggleWish(id, btn){
    if(wishlist.has(id)){ wishlist.delete(id); btn && btn.classList.remove('active'); }
    else { wishlist.add(id); btn && btn.classList.add('active'); toast(`${PMAP[id].name} saved to wishlist`); }
    persist(); updateBadges();
    // sync all buttons for this id
    $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle('active', wishlist.has(id)));
  }

  /* ============================================================
     PRODUCT CARD rendering
     ============================================================ */
  function productCard(p, inGrid){
    const wished = wishlist.has(p.id) ? 'active' : '';
    return `<article class="product-card${inGrid?' in-grid':''}">
      <div class="pc-media">
        <div class="ph ph--gold">${phLabel(p.name, 'product shot')}</div>
        ${p.tag ? `<span class="pc-tag ${p.tag==='Best Seller'?'best':''}">${p.tag}</span>` : ''}
        <button class="pc-wish ${wished}" data-wish="${p.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 4.8 5.4 4.8c2 0 3.4 1.2 4.2 2.4.8-1.2 2.2-2.4 4.2-2.4 3.4 0 5 3.5 3.4 6.9C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <div class="pc-quickadd"><button class="btn btn--primary btn--block" data-add="${p.id}">Quick Add · ${inr(p.price)}</button></div>
      </div>
      <div class="pc-body">
        <div class="pc-rating">${starsHtml(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
        <h3 class="pc-name">${p.name}</h3>
        <p class="pc-desc">${p.desc}</p>
        <div class="pc-foot">
          <div class="pc-price">${inr(p.price)} ${p.was?`<del>${inr(p.was)}</del>`:''}</div>
          <button class="pc-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">${I.plus}</button>
        </div>
      </div>
    </article>`;
  }

  // Best sellers rail
  const rail = $('#bsRail');
  if(rail){
    const bs = ['ajwa','mabroom','medjool','safawi','pista','figs'];
    rail.innerHTML = bs.map(id => productCard(PMAP[id], false)).join('');
  }

  // delegate add / wish across document
  document.addEventListener('click', (e)=>{
    const add = e.target.closest('[data-add]');
    if(add){ addToCart(add.dataset.add); return; }
    const wish = e.target.closest('[data-wish]');
    if(wish){ toggleWish(wish.dataset.wish, wish); return; }
  });

  /* ---------- Carousel controls ---------- */
  const prevBtn = $('#bsPrev'), nextBtn = $('#bsNext');
  if(rail && prevBtn && nextBtn){
    const step = ()=> Math.min(rail.clientWidth*0.8, 360);
    const upd = ()=>{
      prevBtn.disabled = rail.scrollLeft < 8;
      nextBtn.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
    };
    prevBtn.onclick = ()=> rail.scrollBy({left:-step(), behavior:'smooth'});
    nextBtn.onclick = ()=> rail.scrollBy({left:step(), behavior:'smooth'});
    rail.addEventListener('scroll', upd, {passive:true});
    setTimeout(upd, 100);
  }

  /* ============================================================
     SEARCH OVERLAY (predictive)
     ============================================================ */
  const searchOverlay = $('#searchOverlay');
  const searchInput = $('#searchInput');
  const openSearch = ()=>{ searchOverlay.classList.add('open'); openBackdrop(); setTimeout(()=> searchInput.focus(), 350); renderSearch(''); };
  const closeSearch = ()=>{ searchOverlay.classList.remove('open'); if(!drawer.classList.contains('open')) closeBackdrop(); searchInput.value=''; };
  $('#searchBtn').addEventListener('click', openSearch);
  $('#searchClose').addEventListener('click', closeSearch);

  function renderSearch(q){
    const grid = $('#searchProducts');
    const ql = q.trim().toLowerCase();
    let matches = PRODUCTS;
    if(ql) matches = PRODUCTS.filter(p => (p.name+' '+p.cat+' '+p.desc).toLowerCase().includes(ql));
    if(matches.length === 0){
      grid.innerHTML = `<p class="search-empty">No products match “${q}”. Try “dates”, “almonds” or “figs”.</p>`;
      return;
    }
    grid.innerHTML = matches.slice(0,6).map(p => `
      <div class="sp-card" data-add="${p.id}">
        <div class="sp-media"><div class="ph ph--gold">${phLabel('')}</div></div>
        <div class="sp-info"><h6>${p.name}</h6><span>${inr(p.price)}</span></div>
      </div>`).join('');
  }
  if(searchInput){
    searchInput.addEventListener('input', e => renderSearch(e.target.value));
    $$('#searchSuggest a').forEach(a => a.addEventListener('click', (e)=>{
      e.preventDefault(); searchInput.value = a.textContent.trim(); renderSearch(searchInput.value); searchInput.focus();
    }));
  }

  /* ---------- close everything ---------- */
  backdrop.addEventListener('click', ()=>{ closeCart(); closeSearch(); closeMobile(); });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeCart(); closeSearch(); closeMobile(); mega && mega.classList.remove('open'); }
  });

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const mobile = $('#mobileMenu');
  const openMobile = ()=>{ mobile.classList.add('open'); openBackdrop(); };
  const closeMobile = ()=>{ mobile && mobile.classList.remove('open'); if(!drawer.classList.contains('open') && !searchOverlay.classList.contains('open')) closeBackdrop(); };
  const burger = $('#burger');
  if(burger){ burger.addEventListener('click', openMobile); $('#mobileClose').addEventListener('click', closeMobile);
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobile)); }

  /* ============================================================
     ORIGINS MAP
     ============================================================ */
  const originRows = $$('.origin-row');
  const mapDots = $$('.map-dot');
  const mapLabel = $('#mapLabel');
  function activateOrigin(key){
    originRows.forEach(r => r.classList.toggle('active', r.dataset.origin===key));
    mapDots.forEach(d => d.classList.toggle('active', d.dataset.origin===key));
    const dot = mapDots.find(d => d.dataset.origin===key);
    if(dot && mapLabel){
      const x = dot.dataset.x, y = dot.dataset.y;
      mapLabel.textContent = dot.dataset.label;
      mapLabel.style.left = x; mapLabel.style.top = y;
      mapLabel.classList.add('show');
    }
  }
  originRows.forEach(r => r.addEventListener('mouseenter', ()=> activateOrigin(r.dataset.origin)));
  originRows.forEach(r => r.addEventListener('click', ()=> activateOrigin(r.dataset.origin)));
  mapDots.forEach(d => d.addEventListener('mouseenter', ()=> activateOrigin(d.dataset.origin)));
  mapDots.forEach(d => d.addEventListener('click', ()=> activateOrigin(d.dataset.origin)));
  if(originRows.length) activateOrigin(originRows[0].dataset.origin);

  /* ============================================================
     NEWSLETTER
     ============================================================ */
  $$('.news-form').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const input = f.querySelector('input');
    if(input.value.trim()){ toast('Welcome to the Mebran Club ✦'); input.value=''; }
  }));

  /* ============================================================
     TOAST
     ============================================================ */
  let toastT;
  function toast(msg){
    const wrap = $('#toastWrap');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `${I.check}<span>${msg}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 400); }, 2600);
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  /* init */
  updateBadges();
  // sync wishlist buttons on load
  $$('[data-wish]').forEach(b => b.classList.toggle('active', wishlist.has(b.dataset.wish)));

  /* ============================================================
     PUBLIC API — used by product detail & other pages
     ============================================================ */
  window.MEBRAN = {
    PRODUCTS, PMAP, inr, starsHtml, phLabel,
    productCard,
    addToCart: (id, qty=1) => addToCart(id, qty),
    openCart,
    toggleWish,
    isWished: (id) => wishlist.has(id),
    toast,
    getCart: () => cart.map(l => ({...l})),
    setQty: (id, qty) => setQty(id, qty),
    subtotal: cartSubtotal,
    freeShip: FREE_SHIP,
    onCartChange: (fn) => { if(typeof fn==='function'){ cartListeners.push(fn); } }
  };

})();
