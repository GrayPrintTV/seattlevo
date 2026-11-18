# Typewriter palette — 2026-11-18

Implements the owner's supplied warm typewriter reference, replacing its green/teal accents with ochre. Warm charcoal surfaces, paper text, faded peach primary actions, and wheat metadata replace Deep Plum. Actual book artwork, catalog release ordering, contact details, and audio behavior are unchanged.

Courier Prime regular/bold Latin WOFF2 fonts are self-hosted under the accompanying SIL Open Font License. Lowercase presentation is limited to branding, the landing tagline, navigation, and small labels. Professional names and book metadata retain their original spelling. Responsive spacing accounts for wider monospace letters; 320px navigation is tightened to avoid overflow.

Original SVG typewriter artwork supplies the header mark and a simplified favicon. Browser favicon formats are SVG and multi-resolution ICO (16, 32, 48px); a 180px PNG serves Apple home-screen bookmarks. These are new assets. The previous SVG favicon and all original source media remain intact.

## Recovery

Pre-change production commit: `8a82e42bfef6df39b2e186c40509f65ee2211d45`.
Tag: `seattlevo-before-typewriter-2026-11-18`.

## Verification

- `node scripts/build.mjs`: 33 static pages plus 404 and generated catalog/sitemap.
- `node scripts/check.mjs`: metadata, local image/audio paths, routes, contact and retailer links, token parity, and original-source preservation passed.
- `node scripts/browser-test.mjs`: six widths from 320 to 1920px; all primary sections and long book titles; no overflow/player overlap; zero axe accessibility violations. Filtering, history/deep links, persistent audio, seeking, volume, mobile dialog, video cleanup, keyboard focus, no-JS content, missing-audio recovery, blocked autoplay, offline navigation, reduced motion, and all 28 media paths passed.
- Actual desktop, laptop, and phone screenshots inspected. Font files and all icon formats checked separately before release.
- The generic premium static audit reports 835 actionless-button findings because it cannot associate generated markup with the existing delegated module handlers, and one scrollbar finding in preserved legacy CSS. These are tooling limitations, not passing audit results. Project-owned static handler checks and the browser suite verify the live interface; the legacy file remains preserved.

No content claims, credits, release dates, domain/DNS/email settings, or services changed. Real iOS hardware testing is not claimed.
