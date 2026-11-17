# SeattleVO redesign — implementation and review notes

## Production baseline and backup

- Original production commit: `f446ab9ddf14a12ecf847b55ec1e00ba5965da18`.
- Remote rollback tag: `seattlevo-before-redesign-2026-11-17`.
- Full byte-for-byte local backup: `seattlevo-working-copy-before-redesign-2026-11-17.zip` in the existing Desktop `backups` folder (208,846,073 bytes, 125 files).
- SHA-256: `bbf23cb0bc81ff44a506a6cf1d701883cbb61280c177fd243198ed31dce8793b`.
- A Git archive of the original commit is beside that backup. The two archives differ in text line endings; the working-copy archive was verified against every original local file.
- `legacy.html` retains the original homepage; `docs/original-README.md` retains the original operational notes. No original image, audio, stylesheet, or script is deleted or overwritten.

## Implementation

Buildless HTML, CSS, and ES modules; no runtime packages. One maintained JSON catalog and shared renderers generate 29 directly addressable static pages plus a custom 404 and sitemap. Cloudflare Pages still serves the repository root. The optional Node authoring script commits the output; the hosting configuration needs no build change.

The enhanced interface uses History API navigation, query-string filters/search, independently scrolling desktop panels, and a single HTML5 audio element. Selecting a book never replaces playback. Explicit Play loads the sample; initial load only cues one sample. Desktop transport and mobile mini-player/Now Playing operate the same element. Keyboard seeking, skip ±15 seconds, duration, mute/volume, Media Session, loading timeout, unavailable-media recovery, and playback restrictions are handled centrally.

Mobile uses separate catalog/detail screens, not squeezed columns. The brand returns home and the Audiobooks nav opens the mobile catalog. Native dialog behavior provides focus containment and Escape/close restoration. External commercial videos pause narration and load only on request. All video links retain a direct YouTube fallback.

Search-engine content is present in static HTML: descriptions, canonical URLs, Open Graph metadata, Person/Audiobook JSON-LD, contact information, and catalog links. Without JavaScript, navigation still works and native sample controls appear. Original Google Analytics property is retained with page views for sections/books, with custom page-view URLs that omit catalog search queries. No new analytics property or paid service is added.

## Migrated catalog

24 active titles were extracted from the original homepage. Authors were transcribed from the actual covers; the anthology uses an editor credit. Original MP3s, cover assets, and retailer URLs remain intact. The initial migration did not promote commented-out titles. On 2026-11-17, the owner authorized restoring four additional titles from older saved pages, bringing the catalog to 28. All 28 now have sourced audiobook release dates and explicit newest-first sorting; see [RELEASE-DATES.md](RELEASE-DATES.md). No duplicate listening-method records were added.

| Title | Author / editors | Initial genre tags | Sample |
| --- | --- | --- | --- |
| Mythology of the World | David Grayson | Mythology, Nonfiction | `/assets/audio/MythologyoftheWorldSample.mp3` |
| The Awakening | Frank Talaber | Fantasy | `/assets/audio/awakening.mp3` |
| Killing the Lieutenant | Raul J. Diaz and Sean Oliver | True crime, Nonfiction | `/assets/audio/KillingLT.mp3` |
| Bloodline Vendetta | Stephen Bentley | Thriller | `/assets/audio/BloodlineVendetta.mp3` |
| Merciless | Stephen Bentley | Thriller | `/assets/audio/Merciless.mp3` |
| Stop Overthinking and Let Go of Anxiety | Marce Mandel | Nonfiction, Wellbeing | `/assets/audio/StopOverthinking.mp3` |
| Oath Bound | Andrew McDermott | Fantasy | `/assets/audio/oathbound.mp3` |
| Wizard’s Gambit | Andrew McDermott | Fantasy | `/assets/audio/wizardsgambit.mp3` |
| Burg of Arcanum | Andrew McDermott | Fantasy | `/assets/audio/BurgofArcanum.mp3` |
| Manhunt | Stephen Bentley | Thriller | `/assets/audio/Manhunt.mp3` |
| Battle of Quang Tri 1972 | Matt Jackson | Military fiction | `/assets/audio/QuangTri.mp3` |
| The Rose Slayer | Stephen Bentley | Thriller | `/assets/audio/RoseSlayer.mp3` |
| 5 Min Resistance Band Exercises for Seniors | Alison Blaire | Nonfiction, Wellbeing | `/assets/audio/resistanceband.mp3` |
| Undaunted Valor: Lam Son 719 | Matt Jackson | Military fiction | `/assets/audio/lamson.mp3` |
| Night’s Redemption | Stephen Bentley | Thriller | `/assets/audio/nightsredemption.mp3` |
| Tai Chi & Qigong — Balancing Exercises for Seniors | Alison Blaire | Nonfiction, Wellbeing | `/assets/audio/taichiqigong.mp3` |
| Redemption | Stephen Bentley | Thriller | `/assets/audio/redemption.mp3` |
| The Gala | Amy Tackett | Thriller | `/assets/audio/thegala.mp3` |
| Tomorrow’s Hope | Editors: Bart Kemper and William Joseph Roberts | Science fiction | `/assets/audio/tomorrowshope.mp3` |
| Montana | Stephen Bentley | Thriller | `/assets/audio/MontanaSample.mp3` |
| Dopamine Diaries | Jeff Piek | Nonfiction | `/assets/audio/DopamineSample.mp3` |
| Empty Plates Fuller Lives | Jeff Piek | Nonfiction, Wellbeing | `/assets/audio/EmptyPlatesSample.mp3` |
| The Circular Continuum | Raymond Rivera | Nonfiction, Business | `/assets/audio/CircularContinuumSample.mp3` |
| The Way of the Sales Samurai | CJ Benham | Nonfiction, Business | `/assets/audio/BusinessSample.mp3` |

## Other migrated material

- Steve's original monochrome studio portrait (`assets/images/steve.jpg`) and recording workspace (`assets/images/studio.jpg`), with new compressed WebP copies.
- All active audiobook covers, with new 128px and 480px WebP derivatives. Originals remain under `assets/images/books/`.
- Both commercial reels: `fmJ9mQk64XI` (TV commercial demo) and `E6YjxAUbxfk` (commercial demo).
- Three original client projects and authentic testimonials: Hoboken Coffee Roasters (`0w_xusRYoto`), Hagleitner Hygiene International (`V7s4bjxJsEY`), and Armenian Church of America — Eastern Diocese (`H_XPdan_3Us`). No brands from speculative reel spots are presented as clients.
- Existing biography's Pacific Northwest radio background, commercials/promos/imaging experience, and technical/literature/science interests.
- `steve@seattlevo.com`, Audible narrator search, Audiobooks.com narrator profile, and the existing Voices profile.
- Legacy section anchors are mapped into the new navigation.

## Content decisions requiring owner review

1. All new promotional prose is provisional. Copy is centralized in `assets/js/views.mjs`; fixed shell labels are in `scripts/page.html`.
2. Genre tags are conservative editorial classifications based on titles, covers, and the original catalog, not an imported publisher taxonomy. Confirm the desired categories, particularly military fiction and business nonfiction.
3. The original page labels both Oath Bound and Wizard's Gambit as Glyphbane Book 2. Series numbers are deliberately omitted until confirmed. The series name remains.
4. No publisher, release date, review score, full-book runtime, or synopsis was invented. Most descriptions are omitted because the source did not contain them. Dopamine Diaries has a short paraphrase of its verified Audible description; its record links the source.
5. Tomorrow's Hope credits the two editors shown on its cover instead of misrepresenting the multi-author anthology as a single-author book.
6. The Way of the Sales Samurai retains its original Audible URL, whose slug uses a different title (How to Start a Business: Strategies from Idea to Launch). Confirm that the original destination is still the intended edition.
7. Mythology of the World retains the original site's subtitle spelling (“Monster and Heroes”). Confirm the publisher's preferred subtitle.
8. Existing portrait styling is baked into the original image. No AI portrait was created. A newer unprocessed headshot could be substituted later if desired.
9. Retailer checks returned 200 for The Awakening, Manhunt, Battle of Quang Tri, Lam Son 719, and Empty Plates, plus Audible/Audiobooks.com profiles. Many Audible requests returned 503 and Voices returned 403 to automation. YouTube returned restricted pages. These links are preserved from the source; full third-party availability was not inferred from blocked requests. See `link-check.json`.
10. The previous Google Analytics property is retained; actual analytics ingestion requires owner dashboard confirmation. DNS and email routing are untouched.

## Verification

- `node scripts/build.mjs`: generates 29 static routes, custom 404, data module, and sitemap.
- `node scripts/check.mjs`: passes unique records, source asset preservation, original homepage hash, all local paths, canonical/contact/retailer links, static content, UTF-8 integrity, delegated-button wiring, and design-token mapping.
- `node scripts/browser-test.mjs`: passes at 1920×1080, 1366×768, 1024×768, 768×1024, 390×844, and 320×740. No horizontal overflow or player/content overlap. Also covers all section views, long titles, search/genre/empty state, playback persistence across navigation/history, seek/skip/mute/volume, mobile dialogs and focus restoration, direct routes, no-JS content, missing audio/retry, autoplay rejection, offline navigation, and reduced motion. Zero uncaught app exceptions. Axe WCAG A/AA scans report zero violations in all tested states.
- `node scripts/test-catalog-playback.mjs`: all 24 samples actually decode and advance playback in Chrome. Durations and results are recorded in `catalog-playback-check.json`.
- `npm --prefix scripts ci`: successful; dependency audit reports zero vulnerabilities. Dependencies are test-only, outside the hosting root's package detection.
- Official DESIGN.md lint: zero errors. It warns about CSS-owned tokens referenced in prose rather than its component-export format; runtime mapping is independently checked.
- Premium static scanner: the raw `premium-audit.json` contains 739 “actionless button” findings because its detector recognizes inline onclick/framework handlers, not this app's delegated native listeners, and one scrollbar finding in the untouched legacy stylesheet. These are reviewed false positives/out-of-scope legacy findings, not unimplemented controls. The project wiring check and browser interaction suite verify actual actions. Strict scanner success is not claimed.
- Actual rendered desktop, laptop, tablet, phone, detail, About, Commercial, and Now Playing screenshots were visually reviewed. A 320px nav overflow and template encoding issue were corrected before deployment.

- Hosted-preview testing exposed full-file HTTP 200 responses to Range requests on both Pages preview hosts; the existing production domain returned correct HTTP 206 responses. Added a client-side fallback that buffers only the selected sample after an explicit seek. `scripts/test-seek-fallback.mjs` verifies seek/play/pause, sample switching, uninterrupted browsing after buffering, and cleanup on browser Back. A browser cache-lock issue was also corrected by bypassing the in-progress streaming cache entry for this explicit fallback download. No backend or Cloudflare account change is required.

Limits: viewport emulation on Windows Chrome is not physical iOS/Android or Safari testing. iOS commonly delegates volume to hardware; native seek and play controls remain available. External embeds depend on YouTube, network policy, and browser privacy settings. The direct external link is always available. No email is sent during tests; the existing mailto address is verified without changing mail settings.
