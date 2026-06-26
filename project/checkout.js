/* ============================================================
   MEBRAN — Cart / Checkout page
   Depends on mebran.js (window.MEBRAN)
   ============================================================ */
(function(){
  'use strict';
  const M = window.MEBRAN;
  if(!M) return;
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const { inr, PMAP, phLabel, freeShip } = M;
  const SHIP_FLAT = 79;

  const steps = ['cart','details','payment','success'];
  let step = 'cart';

  const elItems   = $('#coItems');
  const elOsLines = $('#osLines');
  const panels = {
    cart:    $('#stepCart'),
    details: $('#stepDetails'),
    payment: $('#stepPayment'),
    success: $('#stepSuccess')
  };

  function cart(){ return M.getCart(); }
  function subtotal(){ return M.subtotal(); }
  function shipCost(){ return subtotal() >= freeShip || subtotal()===0 ? 0 : SHIP_FLAT; }
  function grand(){ return subtotal() + shipCost(); }

  /* ---------- Cart line items ---------- */
  function renderItems(){
    const list = cart();
    const continueBtn = $('#toDetails');
    if(!list.length){
      elItems.innerHTML = `<div class="co-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
        <h3>Your cart is empty</h3>
        <p>Discover premium dates, dry fruits &amp; nuts to get started.</p>
        <a class="btn btn--primary" href="Shop.html">Browse the Collection</a>
      </div>`;
      if(continueBtn) continueBtn.setAttribute('disabled','');
      return;
    }
    if(continueBtn) continueBtn.removeAttribute('disabled');
    elItems.innerHTML = list.map(l => {
      const p = PMAP[l.id];
      return `<div class="co-item">
        <div class="co-item-media"><div class="ph ph--gold">${phLabel(p.name)}</div></div>
        <div class="co-item-info">
          <h4>${p.name}</h4>
          <div class="cl-var">${p.variant}</div>
          <button class="co-rm" data-rm="${p.id}">Remove</button>
        </div>
        <div class="co-item-right">
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Decrease"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
            <span>${l.qty}</span>
            <button data-inc="${p.id}" aria-label="Increase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <div class="co-price">${inr(p.price * l.qty)}</div>
        </div>
      </div>`;
    }).join('');
    elItems.querySelectorAll('[data-inc]').forEach(b => b.onclick = ()=> M.setQty(b.dataset.inc, cart().find(l=>l.id===b.dataset.inc).qty + 1));
    elItems.querySelectorAll('[data-dec]').forEach(b => b.onclick = ()=> M.setQty(b.dataset.dec, cart().find(l=>l.id===b.dataset.dec).qty - 1));
    elItems.querySelectorAll('[data-rm]').forEach(b => b.onclick = ()=> M.setQty(b.dataset.rm, 0));
  }

  /* ---------- Order summary ---------- */
  function renderSummary(){
    const list = cart();
    elOsLines.innerHTML = list.length ? list.map(l => {
      const p = PMAP[l.id];
      return `<div class="os-line">
        <div class="os-line-media"><div class="ph ph--gold">${phLabel('')}</div><span class="os-line-qty">${l.qty}</span></div>
        <div class="os-line-info"><h5>${p.name}</h5><span>${p.variant}</span></div>
        <div class="os-line-price">${inr(p.price * l.qty)}</div>
      </div>`;
    }).join('') : `<p style="color:var(--text-soft);font-size:14px;padding:8px 0">No items yet.</p>`;

    const sub = subtotal();
    $('#osSub').textContent = inr(sub);
    const ship = shipCost();
    $('#osShip').innerHTML = (ship===0)
      ? `<span class="free">${sub===0 ? 'Calculated at checkout' : 'Free'}</span>`
      : inr(ship);
    $('#osTotal').textContent = inr(grand());

    const remain = freeShip - sub;
    const bar = $('#osShipBar'), msg = $('#osShipMsg');
    if(bar && msg){
      const pct = Math.min(100, sub ? (sub/freeShip)*100 : 0);
      bar.style.width = pct + '%';
      msg.innerHTML = sub===0 ? 'Free shipping on orders above ₹999'
        : remain > 0 ? `Add <b>${inr(remain)}</b> more for <b>free shipping</b>`
        : `✦ You've unlocked <b>free shipping</b>`;
    }
  }

  /* ---------- Step navigation ---------- */
  function goto(s){
    step = s;
    Object.entries(panels).forEach(([k,el]) => el && el.classList.toggle('active-step', k===s));
    Object.values(panels).forEach(el => { if(el) el.style.display = 'none'; });
    if(panels[s]) panels[s].style.display = 'block';
    // step indicator
    const order = { cart:1, details:2, payment:3, success:3 };
    $$('.co-step').forEach(st => {
      const n = +st.dataset.step;
      st.classList.toggle('active', n <= order[s]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Wire buttons ---------- */
  $('#toDetails') && ($('#toDetails').onclick = ()=> { if(cart().length) goto('details'); });
  $('#backToCart') && ($('#backToCart').onclick = ()=> goto('cart'));
  $('#toPayment') && ($('#toPayment').onclick = (e)=>{
    const form = $('#detailsForm');
    if(form && !form.reportValidity()) { e.preventDefault(); return; }
    goto('payment');
  });
  $('#backToDetails') && ($('#backToDetails').onclick = ()=> goto('details'));

  $('#placeOrder') && ($('#placeOrder').onclick = ()=>{
    const ref = 'MBR-' + Math.random().toString(36).slice(2,7).toUpperCase() + '-' + (new Date().getFullYear());
    const refEl = $('#orderRef'); if(refEl) refEl.textContent = ref;
    const total = grand();
    const totEl = $('#successTotal'); if(totEl) totEl.textContent = inr(total);
    // clear cart
    cart().forEach(l => M.setQty(l.id, 0));
    goto('success');
    M.toast('Order placed — thank you!');
  });

  /* ---------- Promo code (demo) ---------- */
  $('#promoApply') && ($('#promoApply').onclick = ()=>{
    const inp = $('#promoInput');
    if(inp && inp.value.trim()){ M.toast('Promo codes apply at final payment'); inp.value=''; }
  });

  /* ---------- React to cart changes ---------- */
  M.onCartChange(()=>{ renderItems(); renderSummary(); if(!cart().length && (step==='details'||step==='payment')) goto('cart'); });

  renderItems();
  renderSummary();
  goto('cart');
})();
