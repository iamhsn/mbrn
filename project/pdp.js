/* ============================================================
   MEBRAN — Product Detail Page interactions
   Depends on mebran.js (window.MEBRAN)
   ============================================================ */
(function(){
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const M  = window.MEBRAN || {};
  const inr = M.inr || (n => '₹' + n.toLocaleString('en-IN'));

  const PRODUCT_ID = (document.body.dataset.product || 'ajwa');

  /* ---------- Gallery swap ---------- */
  const mains  = $$('.gallery-main .ph');
  const thumbs = $$('.thumb');
  function showView(i){
    mains.forEach((m,idx)=> m.classList.toggle('show', idx===i));
    thumbs.forEach((t,idx)=> t.classList.toggle('active', idx===i));
  }
  thumbs.forEach((t,i)=>{
    t.addEventListener('click', ()=> showView(i));
    t.addEventListener('mouseenter', ()=> showView(i));
  });
  if(mains.length) showView(0);

  /* ---------- Variant selector ---------- */
  let activeVariant = null;
  const variants = $$('.variant');
  function selectVariant(btn){
    variants.forEach(v=> v.classList.remove('active'));
    btn.classList.add('active');
    activeVariant = btn;
    const now  = +btn.dataset.price;
    const was  = btn.dataset.was ? +btn.dataset.was : null;
    $('#pdpNow').textContent = inr(now);
    const delEl = $('#pdpWas');
    const saveEl = $('#pdpSave');
    if(was){
      delEl.textContent = inr(was); delEl.style.display = '';
      const pct = Math.round((1 - now/was) * 100);
      saveEl.textContent = `Save ${pct}%`; saveEl.style.display = '';
    } else {
      delEl.style.display = 'none'; saveEl.style.display = 'none';
    }
    $('#pdpUnit').textContent = btn.dataset.unit || '';
    const sizeName = $('#optSizeName');
    if(sizeName && btn.dataset.size) sizeName.textContent = btn.dataset.size;
  }
  variants.forEach(v => v.addEventListener('click', ()=> selectVariant(v)));
  if(variants.length) selectVariant(variants.find(v=>v.classList.contains('active')) || variants[0]);

  /* ---------- Quantity ---------- */
  let qty = 1;
  const qtyEl = $('#pdpQty');
  function setQty(n){ qty = Math.max(1, Math.min(20, n)); if(qtyEl) qtyEl.textContent = qty; }
  $('#qtyDec') && $('#qtyDec').addEventListener('click', ()=> setQty(qty-1));
  $('#qtyInc') && $('#qtyInc').addEventListener('click', ()=> setQty(qty+1));

  /* ---------- Add to cart (respects qty) ---------- */
  $('#pdpAdd') && $('#pdpAdd').addEventListener('click', ()=>{
    if(M.addToCart){ M.addToCart(PRODUCT_ID, qty); M.openCart && M.openCart(); }
  });

  /* ---------- Wishlist ---------- */
  const wishBtn = $('#pdpWish');
  if(wishBtn){
    if(M.isWished && M.isWished(PRODUCT_ID)) wishBtn.classList.add('active');
    wishBtn.addEventListener('click', ()=>{
      M.toggleWish && M.toggleWish(PRODUCT_ID, null);
      wishBtn.classList.toggle('active', M.isWished ? M.isWished(PRODUCT_ID) : true);
    });
  }

  /* ---------- Accordion ---------- */
  $$('.acc-item').forEach(item=>{
    const head = item.querySelector('.acc-head');
    const panel = item.querySelector('.acc-panel');
    head.addEventListener('click', ()=>{
      const open = item.classList.contains('open');
      // optional: close others — keep independent here
      if(open){ item.classList.remove('open'); panel.style.maxHeight = '0px'; }
      else { item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });
  // open first accordion by default
  const firstAcc = $('.acc-item');
  if(firstAcc){ firstAcc.classList.add('open'); const p = firstAcc.querySelector('.acc-panel'); p.style.maxHeight = p.scrollHeight + 'px'; }
  window.addEventListener('resize', ()=>{
    $$('.acc-item.open .acc-panel').forEach(p=> p.style.maxHeight = p.scrollHeight + 'px');
  });

  /* ---------- Related rail ---------- */
  const rail = $('#relatedRail');
  if(rail && M.PMAP && M.productCard){
    const ids = ['mabroom','medjool','safawi','figs','pista'].filter(id => M.PMAP[id]);
    rail.innerHTML = ids.map(id => M.productCard(M.PMAP[id], false)).join('');
  }
  const rPrev = $('#relPrev'), rNext = $('#relNext');
  if(rail && rPrev && rNext){
    const step = ()=> Math.min(rail.clientWidth*0.8, 360);
    const upd = ()=>{
      rPrev.disabled = rail.scrollLeft < 8;
      rNext.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
    };
    rPrev.onclick = ()=> rail.scrollBy({left:-step(), behavior:'smooth'});
    rNext.onclick = ()=> rail.scrollBy({left:step(), behavior:'smooth'});
    rail.addEventListener('scroll', upd, {passive:true});
    setTimeout(upd, 120);
  }

})();
