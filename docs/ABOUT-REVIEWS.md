# About and reviews update — 2026-11-19

## Content

The About page now leads with “a storyteller’s ear” without a period. Broadcasting is retained as one supporting paragraph. The production section uses the owner's manuscript/production and language/vision wording, the technical-background sentences are joined, and the next paragraph starts “a catalog that spans.” The catalog callout is a larger gold “explore the range. find your voice.” heading.

All eleven supplied passages are included. One passage contained two separate reviews, so it became two slides. Four additional short narration excerpts and the three original commissioned-project testimonials bring the total to 19. The car-manual review opens the carousel. The “fine” review has the requested “my favorite, of course” aside outside its quotation.

## Provenance

Source URLs live with each listener record in `assets/data/reviews.mjs`. Public Audible pages were inspected in Chrome with “See more reviews” expanded, after some web-tool pages were unavailable. Search results alone were not used to invent reviewer names or fill missing text. Full research captures are local, ignored files under `test-results/review-research/`, not published source material.

| Record | Verified book | Review context |
|---|---|---|
| car-manual | The Gala | “Phenomenal Debut Author with Amazing Narrator” |
| distinctly, entertaining, pace | The Rose Slayer | Exact supplied excerpts present on the Audible page. The pace excerpt retains the owner's omission marker. |
| brought-to-life, perfect, pleasant, fine | Night’s Redemption | Exact supplied excerpts present on Audible. “fine” also appears in a Merciless review; Night’s Redemption is a verified association, not a claim that the wording is unique. |
| enhanced | Montana | “A New Deal” review |
| attention | Redemption | “A Father & Son Crime Fighting Duo” |
| great-job | Redemption | “Action” |
| psychological | Redemption | “Psychological Thriller” |
| action-drama (additional) | Redemption | Public UK Audible review |
| approachable (additional) | 5 Min Resistance Band Exercises for Seniors | Public US Audible review |
| pretty-good (additional) | Mythology of the World | “Interesting and well read” |
| smooth (additional) | Mythology of the World | “Enjoy this Mythological World!” |

The originally joined “brought to life / good pace” passage actually spans Night’s Redemption and The Rose Slayer. It is deliberately separated rather than attributed as one review. All supplied excerpts ultimately received a verified association. If a future record lacks one, the renderer shows only the quotation, per the owner's instruction.

Colton S./Hoboken Coffee Roasters, Harry/Hagleitner Hygiene International, and Artur P./The Armenian Church of America — Eastern Diocese are restored from `legacy.html`, with their existing YouTube project links. Commercial demos remain separate from commissioned work. Quotes retain original capitalization; owner-authored copy remains lowercase.

Reviews across all 28 catalog pages were attempted. Eighteen pages exposed review text in the direct browser pass (including Mythology); ten did not. This is not a claim to have read every review ever posted, and no unseen review has been paraphrased or fabricated. Many source reviews disclose a complimentary listening copy; links lead to the complete context. No star ratings are added to excerpts.

## Behavior and architecture

Shared renderers generate static About HTML and the SPA view. `review-carousel.mjs` adds five-second rotation, previous/next, pause/resume, focus/hover pauses, reduced-motion handling, visibility gating, stable slide geometry, and route cleanup. The existing audio controller and video dialog are reused. No dependencies, backend, or hosted service were added.

Run locally:

```powershell
node scripts/build.mjs
node scripts/check.mjs
$env:PORT='4174'; node scripts/serve.mjs
# In another terminal:
node scripts/browser-test.mjs
node scripts/test-reviews.mjs
```

Open http://127.0.0.1:4174/about/. With JavaScript disabled, all reviews appear as a static list.

## Verification

- Static checks: catalog order, all 28 media records, generated routes, metadata, contact/retailer links, and unchanged original assets.
- Existing browser suite: six viewport sizes, catalog filters, navigation/history, playback persistence, seeking, volume, dialogs, error/retry, offline navigation, no-JavaScript content, and automated accessibility.
- Review suite: five-second rotation, hover/focus pause, explicit resume/pause, all 19 slides and wraparound, stable height, hidden-slide inertness, project dialog, book navigation with continuing audio, browser Back, reduced-motion, five responsive sizes, no-JavaScript fallback, and axe checks.
- Generic premium static audit still reports the previously documented delegated-handler false positives and preserved legacy CSS finding. The repository's checks and browser tests exercise the actual handlers; the generic audit is not reported as passing. No physical iOS/Safari-device testing is claimed.

Previous production commit: `3dcfe0ffda5f76017883316ed0cf325c93476aa0`. Original source assets and the original-site backup remain intact. Deployment uses the existing main-branch Cloudflare integration.
