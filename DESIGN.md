---
version: alpha
name: SeattleVO Listening Portfolio
description: A voice artist's listening room, with warm charcoal framing, tonal panels, cover artwork, and persistent playback.
colors:
  frame: "#141210"
  surface: "#1e1b17"
  raised: "#29241e"
  hover: "#383027"
  line: "#665747"
  text: "#f3e7d5"
  muted: "#bcae99"
  accent: "#efae83"
  accent-hover: "#f5c5a3"
  secondary-accent: "#d4b56f"
  metadata: "#dfc798"
  error: "#ffb5a0"
typography:
  body:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "15px"
    lineHeight: 1.65
  display:
    fontFamily: "Courier Prime, Courier New, monospace"
    lineHeight: 1.08
rounded:
  DEFAULT: "10px"
  control: "28px"
  artwork: "6px"
spacing:
  panel-gap: "8px"
  desktop-content: "34px"
  mobile-content: "21px"
components:
  button: {}
  catalog: {}
  player: {}
  dialog: {}
---

# SeattleVO design system

## Overview

An audio portfolio for audiobook rights holders evaluating Steve Schaeffer after an audition. Secondary visitors are commercial voiceover clients. English interface, Seattle/US professional context; no Japan-market or multilingual scope.

Hybrid register: expressive landing page and biography inside an application-style catalog and player. The user's Spotify screenshot is the structural reference: warm charcoal outer frame, closely spaced rounded panels, clear active navigation, art-led browsing, and permanent transport. The distinctive signature is the typewriter nameplate paired with Steve's supplied warm-toned studio portrait and audiobook covers. No Spotify logo, retail checkout, playlists, or invented metrics.

Runtime tokens in `assets/css/portfolio.css :root` are canonical (model B). This file mirrors their values and explains their roles. `colors.*` maps directly to `--*`, `typography.body` to `--font-body`, `typography.display` to `--font-display`, and `rounded.DEFAULT` to `--radius`. There is no second theme adapter or exported token layer. The project static test verifies this mapping.

## Colors

The owner's typewriter reference (2026-11-18) sets the palette: ink-black #141210, warm charcoal #1E1B17, paper #F3E7D5, faded peach #EFAE83, and ochre #D4B56F. Raised and hover panels are brown-black; muted text stays readable. Peach marks primary actions and the headline. Ochre replaces every green/teal accent in the supplied reference, including catalog callouts and secondary links. Artwork supplies richer color. Metadata uses light wheat. Errors retain an explicit text message and salmon tone. No texture overlays or decorative gradients obscure the work.

## Typography

Courier Prime brings the typewriter character of the supplied reference to display, body, and interface text. Regular and bold Latin WOFF2 subsets are self-hosted under the SIL Open Font License, preloaded for stable first paint, with Courier New/monospace fallbacks. Bold headlines and catalog titles contrast with regular body copy. All owner-authored visible copy, including Steve’s own name, headings, biography, navigation, buttons, captions, genres, and player status, uses lowercase presentation. The shared stylesheet establishes this inherited editorial rule. Explicit original-case exceptions preserve audiobook titles/subtitles, other authors and editors, client and service names, attributed quotations, and book descriptions. Mixed lines wrap third-party names in `original-case`; client video titles retain this exception in the open dialog. Search input preserves what the visitor types. Source metadata and URLs retain their canonical spelling and casing. Line lengths, wrapping, and compact-screen headline placement are adjusted for the wider monospace face. Descriptions retain comfortable line height; full book titles remain readable in detail views.

## Layout

Desktop: 86px header, 102px player, 8px panel gap, 290–370px catalog; main content owns its vertical scroll and catalog entries own a separate scroll. This viewport shell is explicitly requested by the project brief. No forms or unrelated workflows inherit it.

At 1150px and 900px the catalog and portrait become more compact. At 700px the layout becomes a mobile screen stack: 120px branding/navigation header, one main or catalog screen, and an 84px mini-player plus safe area. The Audiobooks nav opens the mobile catalog; the brand opens the landing view. The player is outside both scrollers. Full controls open in a native modal dialog. Content and controls remain reachable at 320px width.

## Elevation & Depth

Tonal surfaces do the work. Shadows are reserved for large cover art and modal overlays. No decorative gradients; the range-control fill is a data indicator. No animation loops or loading overlays.

## Shapes

10px panel corners, 6–8px artwork and content corners, pill navigation and action buttons. Circular play/pause controls are consistent between sample, mini-player, and Now Playing. Portrait becomes circular only in compact layouts.

## Components

- Navigation: real links, active pill plus `aria-current`, client-side enhancement over static routes.
- Catalog: one shared renderer; tonal hover, peach selection edge, text/title/author, live result count. Filter chips are native pressed buttons. Search has a named clear button. All 28 results are intentionally rendered; no unnecessary pagination. Catalog order is explicitly newest audiobook release first; no visitor-facing sort selector.
- Buttons: peach primary, outlined secondary, quiet icon/text actions. Hover, focus, pressed, and disabled states share tokens. A two-pixel focus outline is visible on all interactive elements.
- Player: one audio element; all views delegate to the same controller. Idle, loading, playing, paused, ended, failed, and blocked playback have distinct text. Controls stay in place. No autoplay.
- Dialogs: native `dialog.showModal()` for focus containment and inert background, close button, Escape, and trigger focus restoration. Video iframes are created only after a request and removed on close.
- Scrollbars: global standards-based colors plus WebKit fallback, visible and operable, stable gutters, and forced-colors reset.
- Identity: an original outlined typewriter replaces the waveform in the header. A simplified matching SVG/ICO favicon and 180px touch icon preserve recognition at small sizes; the old favicon remains in the source assets.
- Icons: small inline SVGs with uniform 1.7px strokes; decorative icons are hidden from assistive technology. Text labels remain on primary actions.
- Motion: 160–200ms hover feedback only, removed with reduced-motion preference.
- Copy: concise, concrete, provisional. No unsupported claims, logos as client lists, or fictitious testimonials.
- About: storytelling leads; radio remains a supporting credential. The catalog callout is a two-line gold heading, “explore the range. / find your voice.”
- Reviews: a warm raised panel with original-case quotations, verified book/client credits, source/project links, and quiet rotation controls. Slides share a stable grid footprint. The car-manual quote opens the sequence; the “fine” review has an owner-authored lowercase aside outside the quotation. No ornamental stars or fabricated ratings.

## Do's and Don'ts

- Use actual covers and the source photography. Optimize into new files; preserve originals.
- Keep browsing state separate from playback state.
- Keep contact and listening actions obvious on every device.
- Do not introduce retail, follower, playlist, authentication, or ranking concepts.
- Do not present speculative demo brands as clients.

Portrait update (2026-11-18): `steve-toned.png` is a byte-for-byte copy of the owner-supplied `sepiame.png`, used on the landing page, About, and social previews. No CSS color filter is applied. Previous portrait assets remain preserved.
