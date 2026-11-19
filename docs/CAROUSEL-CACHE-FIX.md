# Carousel cache fix and simpler controls — 2026-11-19

The owner saw all reviews stacked despite the carousel JavaScript running. Shift+F5 resolved it. Production served the correct CSS, but a returning browser retained the older unversioned stylesheet. The regression test reproduces that exact combination and verifies the fix without clearing cache.

The authoring build now fingerprints CSS and the complete local JavaScript dependency graph. Static pages link the generated files, and module imports point to matching fingerprinted dependencies. A source change produces a new URL. Canonical source files remain unchanged in location; edit them and run `node scripts/build.mjs`. Generated files are committed because Cloudflare serves the repository directly. No bundler or dependency was added. Previous generated snapshots can remain valid for cached older pages.

The owner's follow-up removes the pause button and visible count, puts chevrons on either side of the review, and changes the heading to “kind words from the other side of the mic.” Rotation remains five seconds. Mouse hover pauses and leaving resumes; keyboard browsing stops automatic changes; reduced-motion disables rotation; touch arrows continue rotating without synthetic hover trapping the panel.

Validation: `node scripts/check.mjs`, `node scripts/test-style-cache.mjs`, and `node scripts/test-reviews.mjs`. Static checks cover asset hashes and nested module imports. The cache regression uses one real browser context with long-lived old CSS, reproduces the stacked list, then loads the new page and verifies a single visible review plus timed advancement. The review suite covers responsive layouts, all slides, arrow browsing, hover/keyboard/reduced-motion/touch behavior, audio persistence, video links, no-JavaScript content, and axe checks. Desktop and mobile screenshots are reviewed before deployment.

Original assets are preserved. Previous production commit: `5c88b0b096231532ff137c70b9e8037c124349af`.
