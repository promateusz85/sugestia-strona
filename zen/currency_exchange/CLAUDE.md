# ZEN Design Kit — AI Prototyping Guide

This guide is for Claude (or any AI agent) asked to build new HTML prototype screens from Figma designs using this design kit.

---

## Project structure

```
zen-design-kit/
├── shared.css            — All tokens, mobile + web components
├── shared.js             — navigate(), showToast(), account dropdown, nav tabs
├── _template-mobile.html — Blank mobile screen (375×812px phone frame)
├── _template-web.html    — Blank web page layout (fluid, 1200px max)
├── style-guide.html      — Visual component reference
├── icons.html            — All icon asset URLs + fallback SVGs
└── CLAUDE.md             — This file
```

New screens go in this same folder (or a `screens/` subfolder). Reference shared files with `./shared.css` and `./shared.js`.

---

## Figma source files

| File | Key | Primary use |
|------|-----|-------------|
| ZenApp Map | `BdJG2rVEiEQJFeKsvxSLm7` | All main app screens |
| ZenDS Assets | `7TTXh09o7SDNDDFBZWK3WC` | Icon library (canonical source) |
| CC-tests | `bji5Jtp5yK9S8krjG3cbpA` | Action button expanded states |

**ZenDS Assets library key** (for `search_design_system`):
```
lk-d5da8e5eac8f8c555cd9e9eedcbc12e7a099f3c6d54c94bff42941289bd6ebad18b280d831ac8c92c4dff46d2c32431caeaaa80153cfc157e3b95f83034af366
```

---

## Workflow: Figma → HTML

### Step 1 — Get the design

```
get_design_context(
  fileKey: "BdJG2rVEiEQJFeKsvxSLm7",
  nodeId:  "<node-id from Figma URL>"
)
```

The tool returns React+Tailwind reference code plus a screenshot. **Treat this as a reference only** — translate everything to plain HTML using `shared.css` classes and CSS custom properties.

### Step 2 — Start from the right template

- **Mobile screen** → copy `_template-mobile.html`
- **Web page** → copy `_template-web.html`

### Step 3 — Map components

| Figma element | HTML implementation |
|---------------|---------------------|
| Status bar | Copy the SVG block verbatim from any existing screen — do not modify |
| Navbar | `.navbar` with `.icon-btn`, `.avatar`, or `.navbar-title` |
| Balance display | `.balance-section` > `.balance-label` + `.balance-amount` |
| Scrollable content | `.scroll-area` (flex: 1, overflow-y: auto) |
| Bottom navigation | `.bottom-nav` > `.bottom-nav-inner` > 5× `.nav-tab` |
| Page-level grid | `.grid-2`, `.grid-3`, `.grid-4` inside `.page-container` |
| Cards | `.card` or `.card-shadow` |
| Primary button | `.btn.btn-primary` |
| Accent button | `.btn.btn-accent` |
| Outline button | `.btn.btn-secondary` |
| Input | `.input-field` |
| Badge | `.badge.badge-success` / `.badge-error` / `.badge-warning` |

### Step 4 — Handle icons

1. Search for the icon by name in ZenDS Assets:
   ```
   search_design_system(
     query: "Icon-CardMCOutline",
     fileKey: "7TTXh09o7SDNDDFBZWK3WC"
   )
   ```
2. Use the returned asset URL in an `<img>` tag.
3. **Always** add an `onerror` fallback SVG — asset URLs expire after ~7 days.

### Step 5 — Identify complex multi-layer components

Some Figma components are composed of many stacked image assets (logos, mascots, illustrated tiles). Trying to assemble them from individual asset URLs produces broken output. **Use a single component screenshot instead.**

**How to detect:** If the Figma reference code for a component contains more than 3–4 `<img>` nodes stacked on top of each other with absolute positioning, treat it as a complex component.

**How to get the screenshot:**

1. Find the source component node ID from the instance path:
   - Instance node (in reference code): `I4:3883;20161:14956`
   - Source component node ID: `20161:14956` (drop the `I4:3883;` prefix)

2. Call `get_screenshot` with the source file and node ID:
   ```
   get_screenshot(
     fileKey: "BdJG2rVEiEQJFeKsvxSLm7",   ← ZenApp Map (most components live here)
     nodeId:  "20161:14956"
   )
   ```

3. Use the returned URL as a single `<img>` src.

4. **Always** add an `onerror` fallback — screenshot URLs also expire after ~7 days. Fallback can be CSS-only, an SVG approximation, or `display:none`.

**Known complex components** (pre-screenshotted node IDs in ZenApp Map `BdJG2rVEiEQJFeKsvxSLm7`):

| Component | Node ID | Natural size | Notes |
|-----------|---------|-------------|-------|
| `✅ZenekActionButton` | `20161:14956` | 72×88px | Mascot with eyes & shadow |
| `✅Tile/ZenQuest` | `20161:15007` | 325×104px | Full tile incl. badge, link, character |
| `✅DealsButtonset` | `20161:14987` | 301×44px | All brand icons incl. AliExpress |

**Fallback pattern (screenshot + hidden fallback):**

```html
<img src="SCREENSHOT_URL"
     width="W" height="H" alt="..."
     onclick="showToast('...')"
     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
<!-- Fallback shown only if screenshot URL expires -->
<div style="display:none;">
  <!-- CSS/SVG approximation goes here -->
</div>
```

For a self-contained single element (not a strip), `onerror` can insert an SVG directly:
```html
<img src="SCREENSHOT_URL" alt="..."
     onerror="this.replaceWith(document.getElementById('fb').content.cloneNode(true))">
<template id="fb"><!-- fallback markup --></template>
```

---

## Design tokens

### Colors
```css
--color-primary:       #222222   /* all primary text and controls */
--color-secondary:     #727272   /* secondary text, labels */
--color-accent:        #22e243   /* accent green (CTA, success) */
--color-surface:       #ffffff   /* card / phone background */
--color-surface-light: #f7f7f7   /* page background in web layout */
--color-border:        #dfdfdf   /* dividers, card borders */
--color-success:       #22c55e
--color-error:         #ef4444
--color-warning:       #f59e0b
```

### Typography
- **Font family**: Nunito (loaded via Google Fonts in shared.css)
- **Weights used**: 400, 500, 600, 700, 800
- `button, input, select, textarea` inherit font-family from body — do not override

### Spacing scale
`--space-4` (4px) → `--space-8` → `--space-12` → `--space-16` → `--space-20` → `--space-24` → `--space-32` → `--space-48`

### Border radius
`--radius-sm` (8px) → `--radius-md` (12px) → `--radius-lg` (16px) → `--radius-xl` (24px) → `--radius-full` (9999px)

---

## Navigation (mobile)

Use `navigate(url, exitClass, entryClass)` for all page transitions. Never use `window.location.href` directly.

```javascript
// Navigate forward (push)
navigate('next-screen.html', 'exit-left', 'enter-right')

// Navigate back
navigate('prev-screen.html', 'exit-right', 'enter-left')

// Tab switch / cross-fade
navigate('other-screen.html', 'exit-fade', 'enter-fade')
```

The function adds the exit class to `.phone`, waits 270ms, then navigates. The new page reads `sessionStorage['zen_entry']` on load and applies the entry animation.

---

## Mobile layout anatomy

```
.phone (375×812px, border-radius:50px, overflow:hidden)
  .status-bar          — 44px, always present
  .navbar              — 44px, always present
  [.balance-section]   — optional, shows balance + currency
  [.account-selector]  — optional, inside .navbar
  .scroll-area         — flex:1, overflow-y:auto (main content)
  .bottom-nav          — fixed-height, 5 tabs
  .toast               — overlay, triggered by showToast()
```

For screens without bottom nav (pickers, modals), add to `<style>`:
```css
body { align-items: stretch; justify-content: stretch; }
```

---

## Web layout anatomy

```html
<body class="web-layout">
  <div class="page">
    <nav class="top-nav">            <!-- sticky, 64px -->
      <div class="top-nav-inner">   <!-- max-width:1200px centered -->
        ...logo, links, actions
      </div>
    </nav>
    <div class="page-container">   <!-- max-width:1200px, horizontal padding -->
      <div class="section">        <!-- vertical rhythm block (margin-bottom:40px) -->
        <div class="grid-3">
          <div class="card">...</div>
          ...
        </div>
      </div>
    </div>
  </div>
</body>
```

---

## Bottom navigation icons

| Tab | Component name | Asset UUID |
|-----|---------------|------------|
| Card | `✅Icon-CardMCOutline` | `4fa6d8e3-9a63-400b-b6a3-518a8dbe2067` |
| Home | `✅Icon-CashbackHouse` | `5404261c-e953-4e85-97b5-cf2c32c903ad` |
| Stones | `✅Icon-Stones` | `9a3f9800-0854-4b38-9a8b-6786461d7093` |
| Cashback | `Icon-Cashback✅` | `c6a13259-ad00-4e5a-98f5-eb9238fd5c66` |

To refresh expired URLs, call:
```
get_design_context(fileKey="BdJG2rVEiEQJFeKsvxSLm7", nodeId="27287:46066")
```

---

## Shadow rules

### Applying shadows
Use the elevation tokens — never hardcode raw `rgba` values:
```css
box-shadow: var(--shadow-sm);   /* subtle card lift */
box-shadow: var(--shadow-md);   /* standard card (notification, panel) */
box-shadow: var(--shadow-lg);   /* modal, dropdown */
```

### The overflow:hidden trap
`overflow: hidden` clips `box-shadow` at the element's **padding box**. If a
shadowed card is inside an `overflow: hidden` parent (e.g. a collapsible row
using a `max-height` animation), the shadow will be completely invisible.

**Fix:** add `.shadow-bleed-md` (or sm/lg) to the `overflow: hidden` wrapper.
This pre-applies the right amount of padding so the shadow paints inside the
clip rect. Use `padding` — not `margin` — on the wrapper, because only padding
sits inside the overflow boundary.

```html
<!-- WRONG: shadow is clipped -->
<div style="overflow:hidden; margin: 8px 20px;">
  <div class="card" style="box-shadow: var(--shadow-md);">…</div>
</div>

<!-- CORRECT: .shadow-bleed-md adds padding inside the clip boundary -->
<div class="shadow-bleed-md" style="overflow:hidden;">
  <div class="card" style="box-shadow: var(--shadow-md);">…</div>
</div>
```

When the wrapper also collapses (e.g. dismiss animation), zero out
`padding-top` and `padding-bottom` in the dismissed state and include
`padding` in the `transition` list alongside `max-height`.

---

## Key conventions

- **No React, no build tools.** Plain HTML + CSS + vanilla JS. Files open directly in browser.
- **No inline styles for tokens.** Use CSS custom properties (`var(--color-primary)`) instead of `#222222`.
- **No hardcoded pixel values for spacing.** Use `--space-N` variables.
- **Nunito everywhere.** The font-family reset in shared.css covers `<button>`, `<input>`, etc.
- **Fallback SVGs on every `<img>`.** Asset URLs expire. Every `<img>` with a Figma asset src must have an `onerror` that renders an inline SVG fallback.
- **Complex multi-layer components → use `get_screenshot`.** If a component stacks 3+ image assets (mascots, brand logos, illustrated tiles), skip individual assets and call `get_screenshot(fileKey, nodeId)` on the source component node. See Step 5 above and the pre-screenshotted node table.
- **Toast required on every mobile screen.** Add `<div class="toast" id="toast"></div>` before `</div><!-- /phone -->`.
- **Keep status bar SVGs verbatim.** Do not recreate or simplify the signal/wifi/battery SVGs.
- **Screen-specific CSS in `<style>` block.** Never modify shared.css — add overrides in the screen's own `<style>` tag.

---

## Existing screens (in zen-prototype/)

| File | Route | Description |
|------|-------|-------------|
| `01-home.html` | Home | Balance, account selector, deals strip, Zenek/actions toggle |
| `02-wallet.html` | Wallet | Currency bubble visualization (5 bubbles, absolute positioned) |
| `03-exchange.html` | Exchange | Form with live conversion, iOS numeric keyboard, swap |
| `04-currency-picker.html` | Currency | Scrollable currency list, select → returns to exchange |
