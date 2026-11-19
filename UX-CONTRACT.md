# SeattleVO interaction contract

Source of business rules: user's SeattleVO redesign specification, follow-up Spotify visual reference, backup requirement, and explicit production-deployment authorization. Source of professional content: original `index.html` at `f446ab9`, preserved as `legacy.html`, and original cover artwork. Visual rules: `DESIGN.md`.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Scrollbar | `assets/css/portfolio.css` global selectors | DESIGN.md | fixed catalog, main scroller, horizontal chips | browser responsive suite and computed CSS |
| Toast | `setStatus` in `assets/js/app.mjs` | User playback/error requirements | inline player status, same text in Now Playing | media error/retry and autoplay restriction tests |

Other shared owners: `views.mjs` renders all book details/catalog entries, `app.mjs` owns navigation/filter state, and its single audio controller owns playback. Native ranges own seek and volume keyboard behavior. Native modal dialogs own focus containment. No tables, selects, forms, dates, CRUD, billing, authentication, or deletion capability is present.

## State and navigation

- All main sections and individual books are real static URLs, generated from a single data file and shared views. `pushState` enhances ordinary same-origin links. Reload/direct entry is served by static HTML; no Cloudflare rewrite or backend required.
- Stylesheets and the complete local JavaScript module graph use content-hashed URLs from `scripts/build.mjs`, so a returning browser's cached pre-release assets cannot override the new page's layout or behavior. `scripts/test-style-cache.mjs` reproduces the old-style/new-markup failure and verifies an ordinary revisit gets the new stylesheet without clearing browser cache. Static checks verify file hashes and all nested module imports.
- Back/Forward restores page, filter/query, and saved panel scroll. The application moves focus to the visible page heading. Mobile catalog selection opens details; Audiobooks navigation opens the mobile catalog; branding returns to landing.
- Genre and search live in query parameters. Local filtering is immediate; typing replaces the current entry while chip selection creates history. The selected audiobook does not disappear from its detail view when filters change. No matches offers a reset and focuses search.
- Browsing never changes the loaded sample. Play is the only action that replaces audio. Initial load cues Mythology of the World with metadata only, paused. Only one HTML5 audio element exists in the enhanced interface.
- Audio continues between routes, through search/filter changes, and through browser history. Full page reloads cannot preserve playback; no claim of background playback outside the site is made.
- Play/pause, keyboard-capable seeking, ±15 seconds, mute/volume, elapsed/total time, and Media Session controls share the same state. Loading has a 15-second timeout with explicit retry guidance. Missing media and blocked play calls are caught. No automatic retry/play loop. If a host ignores byte ranges, an explicit seek downloads only the selected sample into one revocable object URL; buffering never occurs merely from browsing. Switching samples cancels pending seek work and releases that buffer.
- Video playback is an explicit separate action. It pauses narration to avoid overlapping sound. Closing removes the iframe; narration resumes only on a new Play action. Direct YouTube links remain the fallback.
- Mobile mini-player opens Now Playing, containing full controls. Dialog closes with Escape or close button and restores focus. Safe-area padding and scroller geometry keep content clear of the player.
- Native `mailto:steve@seattlevo.com` remains the contact mechanism. No forms or user-data storage. The existing Google Analytics property is preserved, with section/book page views; custom page-view URLs omit catalog search text. No new analytics service is introduced. The original hardcoded Cloudflare beacon is preserved only in the legacy page; Cloudflare may manage its own injected analytics.
- Without JavaScript, sections and catalog links remain navigable; each page offers its cued sample through a native audio control. Persistent cross-page playback requires JavaScript.
- `review-carousel.mjs` enhances the About page's static review list. Rotate every five seconds only while at least a quarter of the panel is visible and the document is active. Hover temporarily pauses; keyboard browsing stops automatic rotation for that visit until pointer interaction. Reduced-motion disables automatic rotation. The owner requested only left/right chevrons, with no visible count or pause button. Previous/next wrap; inactive slides are inert and hidden from assistive technology. Manual changes announce the position without repeatedly reading quotes aloud. Navigation disposes timers, observers, and listeners; the persistent audio is unaffected. Without JavaScript, every quote and link remains visible. `test-reviews.mjs` verifies these behaviors and responsive geometry.
- `assets/data/reviews.mjs` owns listener excerpts and verified book/source associations; original commissioned-project reviews remain in `views.mjs` with their existing videos. Missing attribution renders a plain quote with no invented credit or public research note. Editorial asides are separate from quoted text.

## Verification owners

`scripts/check.mjs` validates metadata, source preservation, paths, static routes, and tokens. `scripts/browser-test.mjs` covers responsive layout, keyboard, media, browsing history, filter state, accessibility, no-JS content, unavailable media/retry, autoplay restriction, offline navigation, and video dialog cleanup. Real iOS/Safari hardware testing is not claimed.

- `catalog-order.mjs` owns newest-first audiobook release ordering for both generated HTML and client-side views. Every record requires a verified ISO release date and source URL. Filters preserve this order; ID breaks same-day ties. No sort selector.
