# seattlevo.com static site

This repository is the complete static website for `seattlevo.com`. Cloudflare Pages serves it directly from the repository root; it does not need PHP, a database, a server runtime, a package manager, or a build step.

## Deployment settings

Create a **Pages** project in Cloudflare from the GitHub repository
`GrayPrintTV/seattlevo` with these exact values:

| Cloudflare field | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | `/` (repository root; leave blank if Cloudflare shows no root-directory field) |
| Build command | `None` / leave blank |
| Build output directory | `.` |
| Node version / environment variables | None required |

Do **not** select `public_html` as the root or output directory: `public_html` is the local checkout folder and is already the Git repository root. A successful first deployment will have a preview address in the form `<project>.pages.dev`.

## Cloudflare Pages and domain cutover

1. In Cloudflare, select **Workers & Pages** > **Create application** > **Pages** > **Import an existing Git repository**. Authorize GitHub if prompted, choose `GrayPrintTV/seattlevo`, and enter the settings above. Deploy `main` and test the generated `*.pages.dev` address first.
2. This domain is already an active Cloudflare zone: public DNS currently delegates to `lars.ns.cloudflare.com` and `nola.ns.cloudflare.com`. Create the Pages project in the **same Cloudflare account** that owns that zone. Do not add a duplicate zone or change nameservers at GoDaddy.
3. In the Pages project, open **Custom domains** > **Set up a domain**, add `seattlevo.com`, and complete the prompts. Cloudflare creates the apex Pages DNS record automatically.
4. In the same Pages project, add `www.seattlevo.com` under **Custom domains**. Cloudflare creates the required `www` CNAME to the Pages project automatically. Pick the desired canonical hostname in Cloudflare (recommended: `https://seattlevo.com`) and configure a redirect for the other hostname if Pages does not offer it in the custom-domain flow.

### Exact GoDaddy DNS change

For this deployment, **no GoDaddy DNS or nameserver change is required**. Public DNS already uses Cloudflare nameservers, so Cloudflare — not GoDaddy — is authoritative for the Pages records:

| Location | Change |
| --- | --- |
| GoDaddy Domain settings > Nameservers | **No change.** They should already be `lars.ns.cloudflare.com` and `nola.ns.cloudflare.com`. |
| GoDaddy DNS records screen | **No change.** It is not authoritative while the Cloudflare nameservers are active. |
| Cloudflare Pages > Custom domains | Add `seattlevo.com`, then `www.seattlevo.com`; let Pages create the corresponding Cloudflare DNS records. |

Do not modify the existing mail DNS records. At the time of this review, the apex has Cloudflare Email Routing MX records (`route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, and `route3.mx.cloudflare.net`) and an SPF TXT record referencing `_spf.mx.cloudflare.net`. This migration must leave those records in place.

## Pre-cancellation verification

Before cancelling hosting, verify all of the following after DNS has propagated:

- `https://seattlevo.com` and `https://www.seattlevo.com` load over HTTPS and one consistently redirects to the chosen canonical hostname.
- Navigation, mobile menu, animations, audio players and every book/voiceover sample work.
- Representative JPEG/PNG images load without 404 errors; open browser developer tools and check Console/Network for failed requests.
- The `mailto:steve@seattlevo.com` contact link opens correctly.
- Send a test message to `steve@seattlevo.com` and confirm its current forwarding still reaches Gmail. This tests DNS continuity only; it does not migrate email.
- Check the Google Analytics tag still receives a page view if that measurement is expected.
- Recheck from a phone on cellular data (not only the desktop browser) after the nameserver change.

## What may be cancelled, and when

After the site and email-forwarding verification above, cancel **GoDaddy Web Hosting Deluxe** and the associated **PHP Extended Support** add-on/charge. Keep the GoDaddy domain registration and DNS/registrar access. Do not cancel Microsoft 365, email forwarding, or any mail-related product until the separate email migration is planned and completed.

## Site inventory

- Entry page: `index.html`
- Local assets: `assets/images/` and `assets/audio/`
- Local styling and behavior: `assets/css/`, `assets/js/`
- External browser-loaded libraries: Google Fonts, Google Analytics, Font Awesome, Bootstrap, jQuery and Owl Carousel

There are no PHP files, forms, form actions, databases, AJAX/fetch/XHR calls, server-side routes, or backend/API requirements in the deployed site. `test.html` and `index - Copy.html` are retained repository files but are not required for the primary `/` page.
