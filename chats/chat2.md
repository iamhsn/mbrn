# Individual detailed product page

_Started 2026-06-25 09:07 UTC_

---

## User

Let's build the individual detailed product page

## Assistant

Let me look at the existing files to understand the design language before building.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Good — I understand the Mebran system (plum/gold/ivory, Cormorant + Hanken, the `.ph` placeholder pattern, and the cart/search/wishlist JS). I'll build a full product detail page for the signature Ajwa product, reusing the existing header/footer/overlays and CSS tokens, with a dedicated `pdp.css` and `pdp.js`. First, a tiny non-breaking addition to expose the cart API so the PDP can add with quantity.

_[tool: update_todos]_

Now expose the cart API from mebran.js (minimal, non-breaking):

_[tool: str_replace_edit]_

Now the PDP-specific stylesheet:

_[tool: write_file]_

Now the PDP JavaScript:

_[tool: write_file]_

Now the product page itself:

_[tool: write_file]_

One fix — the JS doesn't update the pack-size label in the option header. Let me wire that:

_[tool: str_replace_edit]_

_[tool: update_todos]_

I built a full Ajwa Dates product page matching the Mebran system. Let me verify it loads cleanly.

_[tool: ready_for_verification]_

Built the **Ajwa Dates** product page (`Ajwa Dates.html`), reusing the existing Mebran header, cart, search, and footer — and the same plum/gold/ivory + Cormorant/Hanken system.

What's on it:
- **Gallery** with 5 swappable thumbnails, badges, and zoom affordance
- **Buy panel** — rating, dynamic pricing, three pack-size variants (250g/500g/1kg) that update price + savings + per-gram unit, quantity stepper, add-to-cart (opens the shared cart drawer with the right quantity), wishlist toggle, delivery estimate, assurances, and a 4-section accordion (description, nutrition, storage, shipping)
- **Highlights** strip, **Madinah origin** story, **nutrition** stats + facts table, **detailed reviews** (score, rating bars, review cards), and a **"You may also like"** rail rendered from the shared catalogue

I made one small non-breaking addition to `mebran.js` — a `window.MEBRAN` API — so the PDP can add to cart with a quantity and reuse the product-card renderer. The homepage is unchanged.

Two notes: the cart stores by product id, so a selected pack size shows the catalogue's default variant label in the drawer (the PDP price/UX is fully dynamic); and links point back to `Mebran Homepage.html`. If you'd like, I can template this so any product (Medjool, Mabroom, etc.) generates from the catalogue rather than being hand-built.

## User

Let's build the shop page

## Assistant

Now a shop / collection page. It'll reuse the catalogue and `productCard` exposed via `window.MEBRAN`, with category tabs, sidebar filters, sort, and a responsive grid.

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

Now the Shop page itself:

_[tool: write_file]_

Let me verify the shop page loads and renders the grid correctly.

_[tool: ready_for_verification]_

_[tool: update_todos]_

Built **`Shop.html`** — the collection page, reusing the shared catalogue and the same header/cart/search/footer system.

What's on it:
- **Plum hero** with category tabs (All / Dates / Dry Fruits / Nuts) showing live counts
- **Sticky sidebar filters** — price buckets, collection (Best Sellers / New / On Offer), and rating; with a clear-all
- **Toolbar** — result count + sort (Featured, Price ↑/↓, Top Rated, Most Reviewed)
- **Active filter chips** that remove individually
- **Responsive product grid** rendered from the catalogue, with quick-add, wishlist, and whole-card click-through to the product page
- Empty state, an assurances strip, and a **mobile filter drawer**

It's all driven by `shop.js` off `window.MEBRAN`, so it stays in sync with the cart/wishlist. Category links and `?cat=` deep-links work across nav, mega menu, and footer.

Two notes: product cards currently route to the Ajwa PDP as the template — each other product will route to its own page once built. And the catalogue has 8 items, so some filtered views are short. Want me to generate PDPs for the rest from the Ajwa template, or expand the catalogue?

