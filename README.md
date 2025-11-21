# Cook14U — Project Overview & Specifications

This repository contains the static frontend for the Cook14U site: a small, stylized Warzone-inspired landing page with live-stream indicator, content cards, and lightweight WebGL visual effects.

**Quick Summary**

- Project type: Static HTML / CSS / Vanilla JavaScript
- Visuals: Three.js-based smoke and procedural left/right lines shader
- Primary purpose: Landing / community hub showcasing live streams and content links

**Features**

- Live indicator in the navbar with an animated badge and demo toggle.
- Green smoke VFX (Three.js particles) tuned to spawn within the viewport.
- Left-side (and mirrored right-side) animated lines implemented as a shader canvas (fixed to viewport with scroll-linked animation).
- Content cards section with platform options: Twitch, YouTube, Instagram, TikTok.
- Dynamic single platform link shown under the active content card (styled like the `SHOW SETUP` button).
- Responsive layout optimized for desktop and mobile (mobile FAB + side tabs).
- Lightweight lazy-loading for embedded iframes (iframes use `data-src` and are loaded only when needed).

**Important Files**

- `index.html` — Main markup and anchors for the navbar, content cards, modals, and embed placeholders.
- `style.css` — All styling, variables, responsive breakpoints, and the Warzone-style UI tokens.
- `script.js` — App logic: VFX inits (`initLeftLines`, smoke), content card behavior, live indicator controller, demo toggle, and helpers.
- `assets/` — Images, icons and other media used by the site.

**Key Specifications**

- Live indicator
  - Element: `#live-indicator` (button with camera icon)
  - Live state: toggled by adding `.is-live` class
  - Live check: `decapi.me` Twitch endpoint is polled every 60s (best-effort). Manual overrides: right-click toggles `cook14u_force_live` in `localStorage`. A `#demo-live-toggle` button is available for visual testing.
  - Visual: small top-right red badge plus soft pulsing ring (CSS only)

- Left-lines shader
  - Implemented in `initLeftLines()` inside `script.js` using Three.js ShaderMaterial
  - Configurable uniforms: `uGlow`, `uThickness`, `uLines`, `uLeftOffset`, `uSpeed`, `uScroll` and `uTime`
  - Render method: fullscreen orthographic plane; canvas fixed to the viewport and updated each animation frame

- Smoke (Three.js particles)
  - Spawns particles inside a constrained region so smoke appears within the visible viewport
  - Particle textures derived from `assets` / generated textures and updated per-frame

- Content cards & dynamic link
  - Cards: `.option[data-type="twitch"|"youtube"|"instagram"|"tiktok"]`
  - Lazy-loading: `iframe[data-src]` attributes are copied to `src` when the card becomes active
  - Platform link: `#content-link-btn` is updated by `derivePlatformLink()` to point to the appropriate profile or playlist
  - Currently configured profile URLs:
    - YouTube: `https://www.youtube.com/@Cook14u`
    - Instagram: `https://www.instagram.com/cook14u2/`
    - Twitch: `https://twitch.tv/cook14u`
    - TikTok: `https://www.tiktok.com/@Cook14U`

- Accessibility & keyboard
  - Buttons and interactive elements use `aria-label` and `title` attributes.
  - Focus-visible outlines are preserved for keyboard users (`:focus-visible` rules in `style.css`).

**Customization**

- Theme color: `--seahawks-blue-rgb` (RGB tuple) is used across the stylesheet for glow/accents. Change this CSS variable at the top of `style.css` to recolor accents uniformly.
- Shader tuning: modify the uniforms inside `initLeftLines()` (in `script.js`) to adjust glow, thickness, line count and speed.
- Smoke parameters: tune spawn bounds, particle count and life inside `initGreenSmoke()`.

**Local preview**

1. Serve files from a static server (recommended) or open `index.html` directly in a browser.
   - Quick PowerShell static server (requires Python):

```powershell
cd 'c:\Users\lamer\OneDrive\Desktop\Cook14u.Final'
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

2. To preview the live badge manually via DevTools console:

```js
// show live state
document.getElementById('live-indicator').classList.add('is-live')
// hide live state
document.getElementById('live-indicator').classList.remove('is-live')
// or use the Demo toggle button
document.getElementById('demo-live-toggle').click()
```

**Developer notes**

- The project uses no build step — edits to `index.html`, `style.css`, or `script.js` are immediately testable by reloading the page.
- Some embed providers require a matching `parent` or `origin` to be set in embed URLs for local testing (e.g., Twitch requires `parent=localhost` when testing locally).
- The live check endpoint (`decapi.me`) is unauthenticated and may be rate-limited or change. Consider replacing with your own service or Twitch API token for production.

**Credits**
- Built and styled for the Cook14U project by Tom Lamers.

**Next steps (suggested)**
- Replace test YouTube playlist with channel-specific playlist or dynamic feed.
- Add server-side health check or Twitch API-backed live status for reliability.
- Optional: bundle assets and enable a basic build step if deploying to a CDN.

---

If you want changes to the README content or a different layout (shorter one-pager vs detailed developer doc), tell me which sections to modify and I'll update the file.