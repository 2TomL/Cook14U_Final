# Cook14U — Project Overview & Specifications

## Recent changes (2025-11-22)

- **Twitch Integration:** Replaced `decapi.me` with official Twitch API for live status checks.
  - Uses Client ID and Client Secret to fetch status.
  - Automatically switches the Twitch card embed between the Live Stream (when online) and the latest VOD (when offline).
- **YouTube Playlist:** Updated the YouTube card to play a specific playlist (`PLiTMPYv3qvSazAK3SIEj3QYuxX2ds2ouI`) and enabled navigation controls via the YouTube IFrame API.
- **Footer Fix:** Prevented translation script from overwriting the footer HTML, preserving the author link.
- **Style Reversion:** Reverted the heavy engraved/glow style on the hero subtitle (`.home-subtext`) back to a simpler style.
- **I18n:** Added client-side i18n support and a language toggle (English / Spanish).

## Recent changes (2025-11-26)

- **Merch buy-station:** Added a clickable merch button that links to an external shop. The button uses a hover-only animated glow that follows the PNG's alpha (drop-shadow) and removes the focus glow after click to avoid persisting state.
- **Mobile card layout:** Improved mobile behavior for content cards: closed cards center icons, icons normalized in size, and opened cards nudge the embedded video and lift the platform icon for better visual balance.
- **Polish & accessibility:** Removed an always-visible demo toggle, kept a right-click session-only live override, and added small JS fixes to clear persistent focus after interaction.


This repository contains the static frontend for the Cook14U site: a small, stylized Warzone-inspired landing page with live-stream indicator, content cards, and lightweight WebGL visual effects.

**Quick Summary**

- Project type: Static HTML / CSS / Vanilla JavaScript
- Visuals: Three.js-based smoke and procedural left/right lines shader
- Primary purpose: Landing / community hub showcasing live streams and content links

**Features**

- Live indicator in the navbar with an animated badge and demo toggle.
- Green smoke VFX (Three.js particles) tuned to spawn within the viewport.
- Left-side (and mirrored right-side) animated lines implemented as a shader canvas.
- Content cards section with platform options: Twitch, YouTube, Instagram, TikTok.
- Dynamic single platform link shown under the active content card.
- Responsive layout optimized for desktop and mobile.
- Lightweight lazy-loading for embedded iframes.

**Important Files**

- `index.html` — Main markup and anchors.
- `style.css` — All styling, variables, and UI tokens.
- `script.js` — App logic: VFX, content card behavior, live indicator controller (Twitch API), and helpers.
- `assets/` — Images, icons and other media.

**Key Specifications**

- Live indicator
  - Element: `#live-indicator`
  - Live state: toggled by adding `.is-live` class.
  - Live check: Uses Twitch API (Helix) to check stream status every 60s.
  - **Note:** The implementation uses a Client Secret in client-side code (`script.js`). This is generally insecure for production apps but implemented here per request for a static site.
  - Visual: small top-right red badge plus soft pulsing ring.

- Content cards & dynamic link
  - **Twitch:** Embeds live player if online, or latest VOD if offline.
  - **YouTube:** Embeds playlist `PLiTMPYv3qvSazAK3SIEj3QYuxX2ds2ouI`.
  - **Instagram/TikTok:** Embeds profile or feed.
  - Platform link: `#content-link-btn` points to the appropriate profile.

- Left-lines shader & Smoke
  - Implemented in `script.js` using Three.js.

**Customization**

- Theme color: `--seahawks-blue-rgb` in `style.css`.
- Twitch Credentials: Update `CLIENT_ID` and `CLIENT_SECRET` in `script.js` if they change.
**Credits**
- Built and styled for the Cook14U project by Tom Lamers.