# SeattleVO listening portfolio

Static, audio-first portfolio for Steve Schaeffer. Cloudflare Pages continues to serve the repository root. No production dependencies, server, database, or build command are required.

## Local review

Requires Node.js 20+ for authoring/tests; the deployed website only needs a modern browser.

```powershell
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. To select another port in PowerShell:

```powershell
$env:PORT = '4174'
node scripts/serve.mjs
```

## Content and architecture

- `assets/data/catalog.json`: canonical audiobook metadata, provenance, original media URLs, optional descriptions.
- `assets/js/views.mjs`: shared semantic HTML renderers for catalog, book details, and sections.
- `assets/js/app.mjs`: History API navigation, URL filters, and one persistent audio controller. Browsing is independent of playback.
- `assets/css/portfolio.css`: responsive layout and canonical design tokens.
- `scripts/page.html`: shared page shell. `scripts/build.mjs` generates the committed static pages, data module, structured metadata, and sitemap.
- `index.html`, `audiobooks/`, `books/`, `commercial/`, `about/`, `contact/`: directly addressable static content. JavaScript enhances navigation; it does not supply the only readable content.
- `404.html`: static missing-page fallback. `_headers`: conservative asset revalidation and noindex headers for authoring/legacy material.
- `assets/images/portfolio/`: optimized copies of actual covers, portrait, and studio photo. All original source assets remain intact.

### Adding an audiobook

1. Add its MP3 and cover to the existing asset directories. Never overwrite unrelated originals.
2. Add a unique record to `assets/data/catalog.json`. Title, ID, genre tags, cover, artwork, thumbnail, sample, and retailer URL are required. Author, editors, subtitle, and description are optional. Record the evidence in `source`.
3. Add 128px and 480px WebP cover derivatives, or point thumbnail/artwork at the original cover until optimized copies are available.
4. Run `node scripts/build.mjs` and commit both metadata and generated pages. No duplicated HTML editing is needed; counts and routes are generated.
5. Update the expected catalog count in `scripts/check.mjs` when intentionally adding a title, then run the checks.

General prose is in `views.mjs`; fixed shell labels are in `scripts/page.html`. All new promotional copy is provisional and easy to revise.

## Tests

```powershell
node scripts/build.mjs
node scripts/check.mjs
npm --prefix scripts ci
$env:TEST_URL = 'http://127.0.0.1:4173'
node scripts/browser-test.mjs
```

The browser suite uses installed Chrome by default and records screenshots/report in ignored `test-results/`. Set `BROWSER_CHANNEL=msedge` to use installed Edge. Browser tests run muted; they verify actual media decoding/time progression and controls. Dev dependencies live under `scripts/` so the root remains a buildless static site.

`node scripts/check-links.mjs` checks external links and writes `docs/link-check.json`. Retailer anti-bot responses are reported separately from verified results.

## Production and rollback

Cloudflare Pages settings remain: production branch `main`, framework `None`, root `/`, build command blank, output `.`. Do not change DNS, domain registration, mail routing, or account settings for this redesign.

Original production baseline: `f446ab9ddf14a12ecf847b55ec1e00ba5965da18`; rollback tag: `seattlevo-before-redesign-2026-11-17`. `legacy.html` preserves the original homepage. Original deployment notes are in `docs/original-README.md`.

Preferred rollback after a merge: revert the redesign merge commit (`git revert -m 1 MERGE_SHA`), push the resulting commit to `main`, wait for Cloudflare Pages, and verify the old site. This preserves history and source assets. Do not force-push or alter mail/DNS settings.

See `docs/REDESIGN.md` for content inventory, review notes, and test results, plus `DESIGN.md` and `UX-CONTRACT.md` for design and behavior decisions.
