/* ============================================================
   MEBRAN — shared secondary-page interactions
   (faq accordion, account tabs, track order, forms, filters)
   Depends on mebran.js (window.MEBRAN) for toast
   ============================================================ */
(function(){
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const toast = (window.MEBRAN && window.MEBRAN.toast) || (m => alert(m));

  /* ---------- Generic accordion (FAQ + any .acc) ---------- */
  function wireAccordion(itemSel, headSel, panelSel){
    $$(itemSel).forEach(item => {
      const head = item.querySelector(headSel);
      const panel = item.querySelector(panelSel);
      if(!head || !panel) return;
      head.addEventListener('click', ()=>{
        const open = item.classList.contains('open');
        // close siblings within same group
        const group = item.parentElement;
        $$(itemSel, group).forEach(sib => {
          if(sib!==item){ sib.classList.remove('open'); const p = sib.querySelector(panelSel); if(p) p.style.maxHeight = null; }
        });
        if(open){ item.classList.remove('open'); panel.style.maxHeight = null; }
        else { item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
      });
    });
  }
  wireAccordion('.faq-item', '.faq-q', '.faq-a');
  wireAccordion('.acc-item', '.acc-head', '.acc-panel');

  /* ---------- FAQ side nav (scrollspy + smooth) ---------- */
  const faqNav = $$('.faq-nav a');
  if(faqNav.length){
    const groups = faqNav.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    faqNav.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.getElementById(a.getAttribute('href').slice(1));
      if(t){ const y = t.getBoundingClientRect().top + window.scrollY - 110; window.scrollTo({ top:y, behavior:'smooth' }); }
    }));
    const spy = new IntersectionObserver((ents)=>{
      ents.forEach(en => {
        if(en.isIntersecting){
          faqNav.forEach(a => a.classList.toggle('active', a.getAttribute('href').slice(1)===en.target.id));
        }
      });
    }, { rootMargin: '-120px 0px -65% 0px' });
    groups.forEach(g => spy.observe(g));
  }

  /* ---------- Account auth tabs ---------- */
  const authTabs = $$('.auth-tab');
  if(authTabs.length){
    authTabs.forEach(tab => tab.addEventListener('click', ()=>{
      const target = tab.dataset.tab;
      authTabs.forEach(t => t.classList.toggle('active', t===tab));
      $$('.auth-panel').forEach(p => p.classList.toggle('active', p.dataset.panel===target));
    }));
  }

  /* ---------- Journal category filter ---------- */
  const jfilters = $$('.jfilter');
  if(jfilters.length){
    jfilters.forEach(f => f.addEventListener('click', ()=>{
      const cat = f.dataset.cat;
      jfilters.forEach(x => x.classList.toggle('active', x===f));
      $$('.article-card').forEach(card => {
        const show = cat==='all' || card.dataset.cat===cat;
        card.style.display = show ? '' : 'none';
      });
    }));
  }

  /* ---------- Track order (demo) ---------- */
  const trackForm = $('#trackForm');
  if(trackForm){
    trackForm.addEventListener('submit', e => {
      e.preventDefault();
      const id = $('#trackId');
      const result = $('#trackResult');
      if(id && !id.value.trim()){ id.focus(); return; }
      const shown = id ? id.value.trim().toUpperCase() : 'MBR-DEMO';
      const idEl = $('#trackResultId'); if(idEl) idEl.textContent = shown;
      if(result){ result.classList.remove('hidden'); const y = result.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({ top:y, behavior:'smooth' }); }
      toast('Order found · in transit');
    });
  }

  /* ---------- Demo forms (contact / corporate) ---------- */
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    if(!f.reportValidity()) return;
    const msg = f.dataset.demo || 'Thanks — we\'ll be in touch shortly.';
    f.reset();
    toast(msg);
  }));

  /* ---------- Account login (demo) ---------- */
  $$('form[data-auth]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    if(!f.reportValidity()) return;
    toast(f.dataset.auth === 'register' ? 'Welcome to Mebran ✦' : 'Signed in successfully');
  }));

  /* ---------- Custom select-less password reveal (optional) ---------- */
  $$('[data-reveal]').forEach(btn => btn.addEventListener('click', ()=>{
    const inp = document.getElementById(btn.dataset.reveal);
    if(inp){ inp.type = inp.type==='password' ? 'text' : 'password'; btn.classList.toggle('on'); }
  }));

})();
