# Audiobook release-date verification

Verified 2026-11-17. Dates refer to the Steve Schaeffer **audiobook edition**, not the print/ebook publication date. Audible UK dates use day-month-year; Japanese listings use year/month/day. Dates are normalized to ISO 8601 in the catalog and retained with their source URLs. No release dates were inferred from filenames, ASINs, or source ordering.

The shared `assets/js/catalog-order.mjs` sorts newest first for both static pages and enhanced browsing. Missing, invalid, or unsourced dates stop the build. Same-day releases use ID as a stable tie-breaker. There is no sort control. Notes to My Highness is naturally last (2023-08-02); no special ranking is applied and the existing featured selections are unchanged.

## Restored titles

The Future of Work, A Comprehensive Step-by-Step Guide to Lettuce Farming for Beginners or Experienced, The Homeschool College Planner, and Notes to My Highness retain the MP3/cover/retailer associations recorded in `test.html` and `index - Copy.html`. Authors and Steve's narration credit were checked against Audible. New WebP derivatives preserve the original covers.

## Evidence and discrepancies

- Local timestamps for many older assets cluster on 2024-04-30, months after their audiobook releases. Notes and Future of Work samples and covers share that copy day. Lettuce's image is dated 2024-04-30 and its sample 2024-05-10. Both Homeschool assets are dated 2024-05-14, after its 2024-02-08 release. These are useful association checks but not publication evidence.
- Apple Books lists The Future of Work as 2024-05-21, but Audible UK and Australia identify Steve's version as 2023-09-18. Use the earlier Audible audiobook release, consistent with the local sample predating Apple's listing. The author also has other narrated editions; they are not this recording.
- Explicit release ordering corrects the former positions of The Rose Slayer/Battle of Quang Tri, Night's Redemption/Lam Son 719, and Tomorrow's Hope/The Gala. Homeschool belongs between The Gala and Montana; Future of Work between Circular Continuum and Lettuce; Lettuce before Sales Samurai; Notes last.
- Retailer pages can return intermittent 503 errors to automated requests; official indexed narrator, author, and category listings supplied the dates when product pages were unavailable. Cross-checks included US Mythology (10-08-26), Canadian Quang Tri (2025-02-27), Japanese Awakening (2026/06/12) and Notes (2023/08/02), and Australian Homeschool (08-02-2024) and Future of Work (18-09-2023).

## Catalog order and sources

| Audiobook | Release date | Official source |
|---|---|---|
| Mythology of the World | 2026-10-08 | [Audible](https://www.audible.co.uk/author/David-Grayson/B07Q7FJMNF) |
| The Awakening | 2026-06-12 | [Audible](https://www.audible.co.jp/search?searchNarrator=Steve+Schaeffer) |
| Killing the Lieutenant | 2026-05-01 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Bloodline Vendetta | 2025-12-16 | [Audible](https://www.audible.co.uk/series/Steve-Regan-Undercover-Cop-Audiobooks/B07JWB9423) |
| Merciless | 2025-10-23 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Stop Overthinking and Let Go of Anxiety | 2025-10-07 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Oath Bound | 2025-08-19 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Wizard’s Gambit | 2025-08-05 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Burg of Arcanum | 2025-07-14 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Manhunt | 2025-06-09 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| The Rose Slayer | 2025-03-24 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Battle of Quang Tri 1972 | 2025-02-27 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| 5 Min Resistance Band Exercises for Seniors | 2024-10-21 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Night’s Redemption | 2024-08-29 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Undaunted Valor: Lam Son 719 | 2024-08-26 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Tai Chi & Qigong — Balancing Exercises for Seniors | 2024-07-19 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Redemption | 2024-06-06 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Tomorrow’s Hope | 2024-04-24 | [Audible](https://apx-security-uk.audible.co.uk/search?page=3&searchNarrator=Steve+Schaeffer) |
| The Gala | 2024-04-18 | [Audible](https://apx-security-uk.audible.co.uk/search?page=3&searchNarrator=Steve+Schaeffer) |
| The Homeschool College Planner | 2024-02-08 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Montana | 2024-01-31 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Dopamine Diaries | 2024-01-12 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| Empty Plates Fuller Lives | 2023-11-20 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| The Circular Continuum | 2023-09-28 | [Audible](https://apx-security-uk.audible.co.uk/search?searchNarrator=Steve+Schaeffer) |
| The Future of Work | 2023-09-18 | [Audible](https://apx-security-uk.audible.co.uk/search?page=3&searchNarrator=Steve+Schaeffer) |
| A Comprehensive Step-by-Step Guide to Lettuce Farming for Beginners or Experienced | 2023-08-24 | [Audible](https://apx-security-uk.audible.co.uk/search?page=3&searchNarrator=Steve+Schaeffer) |
| The Way of the Sales Samurai | 2023-08-18 | [Audible](https://apx-security-uk.audible.co.uk/search?page=3&searchNarrator=Steve+Schaeffer) |
| Notes to My Highness | 2023-08-02 | [Audible](https://www.audible.co.jp/search?searchAuthor=Alex+Fernand) |

Additional cross-check: [Apple Books — The Future of Work](https://books.apple.com/au/audiobook/the-future-of-work-preparing-for-career-success-in/id1707884690).
