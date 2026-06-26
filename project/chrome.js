/* ============================================================
   MEBRAN — shared site chrome (header, footer, overlays)
   Loads BEFORE mebran.js so all hook IDs exist on init.
   Mount points: #site-header, #site-footer (overlays append to body)
   Active nav: <body data-nav="shop|gifts|corporate|about">
   ============================================================ */
(function(){
  'use strict';
  const nav = (document.body.dataset.nav || '').trim();
  const on = (k) => nav === k ? ' aria-current="page"' : '';

  const HEADER = `
<div class="announce">
  <div class="announce-track">
    <span class="announce-item active"><span class="dot"></span> Free Shipping On Orders Above ₹999 <span class="dot"></span></span>
    <span class="announce-item">Freshly Packed · Delivered Across India</span>
    <span class="announce-item">Premium Saudi Dates &amp; Gourmet Dry Fruits</span>
  </div>
</div>

<header class="header" id="header">
  <div class="wrap header-inner">
    <button class="icon-btn burger" id="burger" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>

    <a href="Mebran Homepage.html" class="logo" aria-label="Mebran home">Mebran<span class="dot-gold">.</span></a>

    <nav class="nav" aria-label="Primary">
      <ul class="nav-list">
        <li class="nav-item" id="shopNav">
          <a href="Shop.html" class="nav-link"${on('shop')}>Shop
            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </a>
        </li>
        <li class="nav-item"><a href="Shop.html?cat=Dates" class="nav-link">Dates</a></li>
        <li class="nav-item"><a href="Shop.html?cat=Dry Fruits" class="nav-link">Dry Fruits</a></li>
        <li class="nav-item"><a href="Shop.html?cat=Nuts" class="nav-link">Nuts &amp; Seeds</a></li>
        <li class="nav-item"><a href="Gift Boxes.html" class="nav-link"${on('gifts')}>Gift Boxes</a></li>
        <li class="nav-item"><a href="Corporate Gifting.html" class="nav-link"${on('corporate')}>Corporate</a></li>
        <li class="nav-item"><a href="About.html" class="nav-link"${on('about')}>About</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <button class="icon-btn" id="searchBtn" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
      </button>
      <a class="icon-btn desk-only" href="Account.html" aria-label="Account">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      </a>
      <button class="icon-btn" id="cartBtn" aria-label="Cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
        <span class="cart-count" id="cartCount">0</span>
      </button>
    </div>
  </div>

  <div class="mega" id="mega">
    <div class="wrap mega-inner">
      <div class="mega-col">
        <h4>Premium Dates</h4>
        <div class="mega-links">
          <a href="Ajwa Dates.html">Ajwa <span>Madinah</span></a>
          <a href="Shop.html?cat=Dates">Mabroom <span>Caramel</span></a>
          <a href="Shop.html?cat=Dates">Medjool <span>Jumbo</span></a>
          <a href="Shop.html?cat=Dates">Safawi <span>Semi-dry</span></a>
        </div>
      </div>
      <div class="mega-col">
        <h4>Dry Fruits</h4>
        <div class="mega-links">
          <a href="Shop.html?cat=Dry Fruits">Figs &amp; Anjeer</a>
          <a href="Shop.html?cat=Dry Fruits">Apricots</a>
          <a href="Shop.html?cat=Dry Fruits">Raisins</a>
          <a href="Shop.html?cat=Dry Fruits">Prunes</a>
        </div>
      </div>
      <div class="mega-col">
        <h4>Nuts &amp; Seeds</h4>
        <div class="mega-links">
          <a href="Shop.html?cat=Nuts">Mamra Almonds</a>
          <a href="Shop.html?cat=Nuts">Pistachios</a>
          <a href="Shop.html?cat=Nuts">Cashews</a>
          <a href="Shop.html?cat=Nuts">Mixed Seeds</a>
        </div>
      </div>
      <div class="mega-col">
        <a class="mega-feature" href="Gift Boxes.html">
          <div class="ph ph--dark"><div class="ph-label">RAMADAN GIFT EDIT · LIFESTYLE<span>rigid box · gold foil</span></div></div>
          <span class="mega-feature-tag">New · Gift Collection 2026 →</span>
        </a>
      </div>
    </div>
  </div>
</header>`;

  const FOOTER = `
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-news">
        <a href="Mebran Homepage.html" class="logo">Mebran<span class="dot-gold">.</span></a>
        <p>Join the Mebran Club for exclusive offers, seasonal launches and healthy inspiration.</p>
        <form class="news-form">
          <input type="email" placeholder="Enter your email" aria-label="Email" required>
          <button type="submit">Join</button>
        </form>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <a href="Shop.html?cat=Dates">Dates</a><a href="Shop.html?cat=Dry Fruits">Dry Fruits</a><a href="Shop.html?cat=Nuts">Nuts</a><a href="Gift Boxes.html">Gift Boxes</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="About.html">About</a><a href="Contact.html">Contact</a><a href="Journal.html">Journal</a><a href="Corporate Gifting.html">Corporate Gifting</a>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <a href="FAQ.html">FAQ</a><a href="Track Order.html">Track Order</a><a href="Contact.html">Shipping &amp; Returns</a><a href="Account.html">My Account</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Mebran Foods. Freshly packed &amp; delivered across India.</span>
      <div class="footer-socials">
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
        <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2 0-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3A2.8 2.8 0 0 0 6.3 12a5 5 0 0 0 1 2.6 11 11 0 0 0 4.2 3.7c2.4 1 2.4.7 2.9.6a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z"/></svg></a>
      </div>
    </div>
  </div>
</footer>`;

  const OVERLAYS = `
<div class="backdrop" id="backdrop"></div>

<aside class="drawer" id="cartDrawer" aria-label="Shopping cart">
  <div class="drawer-head">
    <h3>Your Cart</h3>
    <button class="drawer-close" id="cartClose" aria-label="Close cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="drawer-ship">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h13v13H1z"/><path d="M14 8h4l3 3v5h-7"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
    <span id="shipMsg">Free shipping on orders above ₹999</span>
    <span class="ship-bar"><i id="shipBar" style="width:0%"></i></span>
  </div>
  <div class="drawer-body" id="cartBody"></div>
  <div class="drawer-foot" id="cartFoot" style="display:none">
    <div class="drawer-row"><span>Subtotal</span><span id="cartSub">₹0</span></div>
    <div class="drawer-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    <div class="drawer-row total"><span>Total</span><b id="cartTotal">₹0</b></div>
    <a class="btn btn--primary btn--block" href="Cart.html">Proceed to Checkout</a>
    <p class="drawer-note">Taxes included · Secure checkout · Easy returns</p>
  </div>
</aside>

<div class="search-overlay" id="searchOverlay" aria-label="Search">
  <div class="search-inner">
    <div class="search-bar">
      <svg class="s-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
      <input type="text" id="searchInput" placeholder="Search for dates, almonds, gift boxes…" autocomplete="off">
      <button class="search-close" id="searchClose">Close <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="search-results">
      <div class="search-suggest" id="searchSuggest">
        <h5>Popular Searches</h5>
        <div class="suggest-list">
          <a href="Ajwa Dates.html">Ajwa Dates</a>
          <a href="Shop.html?cat=Dates">Medjool</a>
          <a href="Shop.html?cat=Dry Fruits">Premium Figs</a>
          <a href="Gift Boxes.html">Gift Boxes</a>
          <a href="Shop.html?cat=Nuts">Pistachios</a>
        </div>
      </div>
      <div class="search-products">
        <h5>Products</h5>
        <div class="search-prod-grid" id="searchProducts"></div>
      </div>
    </div>
  </div>
</div>

<aside class="drawer" id="mobileMenu" aria-label="Menu" style="left:0;right:auto;transform:translateX(-100%)">
  <div class="drawer-head">
    <a href="Mebran Homepage.html" class="logo">Mebran<span class="dot-gold">.</span></a>
    <button class="drawer-close" id="mobileClose" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="drawer-body" style="padding:20px 28px">
    <div class="mega-links" style="gap:4px">
      <a href="Shop.html" style="padding:14px 0;border-bottom:1px solid var(--line)">Shop All</a>
      <a href="Shop.html?cat=Dates" style="padding:14px 0;border-bottom:1px solid var(--line)">Dates</a>
      <a href="Shop.html?cat=Dry Fruits" style="padding:14px 0;border-bottom:1px solid var(--line)">Dry Fruits</a>
      <a href="Shop.html?cat=Nuts" style="padding:14px 0;border-bottom:1px solid var(--line)">Nuts &amp; Seeds</a>
      <a href="Gift Boxes.html" style="padding:14px 0;border-bottom:1px solid var(--line)">Gift Boxes</a>
      <a href="Corporate Gifting.html" style="padding:14px 0;border-bottom:1px solid var(--line)">Corporate</a>
      <a href="About.html" style="padding:14px 0;border-bottom:1px solid var(--line)">About</a>
      <a href="Account.html" style="padding:14px 0">My Account</a>
    </div>
  </div>
</aside>

<div class="toast-wrap" id="toastWrap"></div>

<a href="#" class="wa-float" aria-label="WhatsApp support">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2 0-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3A2.8 2.8 0 0 0 6.3 12a5 5 0 0 0 1 2.6 11 11 0 0 0 4.2 3.7c2.4 1 2.4.7 2.9.6a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z"/></svg>
</a>`;

  const headEl = document.getElementById('site-header');
  const footEl = document.getElementById('site-footer');
  if(headEl) headEl.innerHTML = HEADER;
  if(footEl) footEl.innerHTML = FOOTER;
  document.body.insertAdjacentHTML('beforeend', OVERLAYS);
})();
