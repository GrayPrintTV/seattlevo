---
version: alpha
name: SeattleVO Listening Portfolio
description: A voice artist's listening room, with deep plum framing, tonal panels, cover artwork, and persistent playback.
colors:
  frame: "#140b18"
  surface: "#1f1224"
  raised: "#2a1c30"
  hover: "#38263f"
  line: "#503c59"
  text: "#f2ecf8"
  muted: "#a799b4"
  accent: "#b58be3"
  accent-hover: "#cba7ee"
  secondary-accent: "#cbb4de"
  lavender: "#d8c1ee"
  error: "#ffb5ae"
typography:
  body:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "15px"
    lineHeight: 1.65
  display:
    fontFamily: "Georgia, Times New Roman, serif"
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

Hybrid register: expressive landing page and biography inside an application-style catalog and player. The user's Spotify screenshot is the structural reference: near-black plum outer frame, closely spaced rounded panels, clear active navigation, art-led browsing, and permanent transport. The distinctive signature is the waveform nameplate paired with Steve's real monochrome studio portrait and audiobook covers. No Spotify logo, retail checkout, playlists, or invented metrics.

Runtime tokens in `assets/css/portfolio.css :root` are canonical (model B). This file mirrors their values and explains their roles. `colors.*` maps directly to `--*`, `typography.body` to `--font-body`, `typography.display` to `--font-display`, and `rounded.DEFAULT` to `--radius`. There is no second theme adapter or exported token layer. The project static test verifies this mapping.

## Colors

The user-selected Deep Plum palette defines the brand: background #140B18, surface #1F1224, accent #B58BE3, text #F2ECF8, and muted #A799B4. Four plum-black tones create separation: frame, surface, raised, and hover. Pale lilac text and readable muted mauve keep the interface light. Violet marks the primary listen action and headline; a softer lilac identifies the catalog and section labels; lavender distinguishes narration metadata. Cover artwork supplies most of the saturation. Errors use both explicit text and the error token. Only one dark theme; forced-colors preserves platform controls.

## Typography

Georgia is the main typeface throughout the portfolio, chosen by the owner on 2026-11-18. Bold Georgia gives the main headline, artist name, and section headings a literary character; regular Georgia keeps body copy, navigation, catalog entries, and secondary controls calm. Headline tracking is restrained and line height accommodates the serifs. The CSS uses locally installed Georgia with Times New Roman and generic serif fallbacks; no font files are bundled or downloaded. Descriptions use comfortable line height. Track times use tabular numerals. Catalog titles wrap to two lines; detail headings show the complete title. Tiny uppercase labels provide quiet hierarchy, never essential standalone instructions.

## Layout

Desktop: 86px header, 102px player, 8px panel gap, 290–370px catalog; main content owns its vertical scroll and catalog entries own a separate scroll. This viewport shell is explicitly requested by the project brief. No forms or unrelated workflows inherit it.

At 1150px and 900px the catalog and portrait become more compact. At 700px the layout becomes a mobile screen stack: 120px branding/navigation header, one main or catalog screen, and an 84px mini-player plus safe area. The Audiobooks nav opens the mobile catalog; the brand opens the landing view. The player is outside both scrollers. Full controls open in a native modal dialog. Content and controls remain reachable at 320px width.

## Elevation & Depth

Tonal surfaces do the work. Shadows are reserved for large cover art and modal overlays. No decorative gradients; the range-control fill is a data indicator. No animation loops or loading overlays.

## Shapes

10px panel corners, 6–8px artwork and content corners, pill navigation and action buttons. Circular play/pause controls are consistent between sample, mini-player, and Now Playing. Portrait becomes circular only in compact layouts.

## Components

- Navigation: real links, active pill plus `aria-current`, client-side enhancement over static routes.
- Catalog: one shared renderer; tonal hover, violet selection edge, text/title/author, live result count. Filter chips are native pressed buttons. Search has a named clear button. All 28 results are intentionally rendered; no unnecessary pagination. Catalog order is explicitly newest audiobook release first; no visitor-facing sort selector.
- Buttons: violet primary, outlined secondary, quiet icon/text actions. Hover, focus, pressed, and disabled states share tokens. A two-pixel focus outline is visible on all interactive elements.
- Player: one audio element; all views delegate to the same controller. Idle, loading, playing, paused, ended, failed, and blocked playback have distinct text. Controls stay in place. No autoplay.
- Dialogs: native `dialog.showModal()` for focus containment and inert background, close button, Escape, and trigger focus restoration. Video iframes are created only after a request and removed on close.
- Scrollbars: global standards-based colors plus WebKit fallback, visible and operable, stable gutters, and forced-colors reset.
- Icons: small inline SVGs with uniform 1.7px strokes; decorative icons are hidden from assistive technology. Text labels remain on primary actions.
- Motion: 160–200ms hover feedback only, removed with reduced-motion preference.
- Copy: concise, concrete, provisional. No unsupported claims, logos as client lists, or fictitious testimonials.

## Do's and Don'ts

- Use actual covers and the source photography. Optimize into new files; preserve originals.
- Keep browsing state separate from playback state.
- Keep contact and listening actions obvious on every device.
- Do not introduce retail, follower, playlist, authentication, or ranking concepts.
- Do not present speculative demo brands as clients.
