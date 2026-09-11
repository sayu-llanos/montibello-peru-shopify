# Montibello Peru — Range Pages Master Map (UNDER + HOP + LUXLIGHT)

Cross-range summary of the forensic audit performed 2026-09-10. Per-range detail
lives in `under-reference-map.md`, `hop-reference-map.md`, `luxlight-reference-map.md`.
Full asset inventory: `range-assets-master.csv` (114 rows, merged from the three
per-range CSV fragments — schema identical across all three).

This audit is research/documentation only. No homepage file, template, section,
navigation, or Shopify object was modified. Confirmed by file mtimes: every
`templates/index.json` / `sections/montibello-*.liquid` file predates this
session's work (last touched 2026-09-09 or earlier).

## Build readiness at a glance

| Range | Build readiness | Blocking item |
|---|---|---|
| UNDER | READY for 6/9 sections | Elevated Warmth section (#5) uses the wrong image locally — a campaign portrait instead of the reference's floral tone-swatch graphic — and two split-banners have inverted `media_position` vs. reference. Both are existing-file bugs, not missing assets. |
| HOP | READY | Hub (`/pages/hop`) + 3 sub-collections (`hop-ultra-repair`, `hop-color-last`, `hop-smooth-hydration`) architecture matches the reference's own IA exactly — no tabs/anchors/filters to replicate. Open item: verify percentage/stat-claim footnotes against the local 84pp `hop-guia-tecnica.pdf` before publishing any claim copy. |
| LUXLIGHT | NOT READY | Two Éclat occurrences need a decision: (1) an Éclat-watermarked photo embedded in the before/after results slider has no Peru-safe substitute yet — needs new or different official photography; (2) the entire "Luxlight + Éclat: el dúo perfecto" module should be removed outright (its premise is a service Peru doesn't sell). |

## Unexpected finding: UNDER template already exists

The UNDER audit agent discovered `templates/collection.under.json` already exists
in the theme (read-only reference material for the audit, not created or modified
by it). It has real sections wired up already, with two concrete bugs identified
above. This means UNDER implementation is likely a **fix-and-verify** pass against
an existing template, not a from-scratch build — re-confirm this file's current
state before starting UNDER work.

## HOP routing architecture — recommendation confirmed

The proposed structure (`/pages/hop` master hub with `/collections/hop-ultra-repair`,
`/collections/hop-color-last`, `/collections/hop-smooth-hydration` sub-collections)
was evaluated against the live reference's actual information architecture and
found to match it directly — the official hub page uses a flat family-card grid
linking out to dedicated family pages, no tabs/anchors/JS filtering to reproduce.
No change to the planned architecture is recommended. (Not implemented — routes
were not created.)

## Asset inventory totals (from range-assets-master.csv)

| Range | Reference assets identified | Exact local | Probable local | Downloaded | No match | Peru exclusions |
|---|---|---|---|---|---|---|
| UNDER | ~28 | 9 (incl. byte-identical Carta de Color PDF) | — | 9 | ~7 (gallery slides) | disabled "no disponible" buttons, Cookiebot banner, Spain-specific locator URLs |
| HOP | ~34 Peru-relevant + 9 excluded-family thumbnails (layout reference only) | 11 (visually verified packshots) | — | 39 (~18MB) | 1 (no standalone HOP wordmark file exists) | Full Volume, Sun Care, Detox, Sensitive Protection, Purifying Balance, Blonde Glow, Silver White, Reflects, Well-Ageing/in-salon (9 families) |
| LUXLIGHT | 27 range-specific + local step/PDF library confirmed archived | 1 MD5-verified + 6 probable | 6 | 10 | 11 | 2 (before/after photo + full "Luxlight + Éclat" module) |

## Videos across all three ranges

- UNDER: 1 Vimeo embed (1153294336) — already correctly configured locally.
- HOP: 0 embedded on any of the 4 live pages (hub + 3 family pages) — confirmed via raw HTML, no `<video>`/iframe/PDF found. 3 local HOP videos exist but currently have no reference counterpart driving their use.
- LUXLIGHT: 2 Vimeo embeds (1168380624 campaign-modal, 1168379823 technology-inline) — matched by role to local `luxlight-video-campana.mp4` / `luxlight-video-tecnologia.mp4`.

## PDFs across all three ranges

- UNDER: Carta de Color (`Carta-UNDER_26.pdf`) — byte-identical MD5 match to the live reference's linked PDF, already local and current. 2 supplementary catalogs also local.
- HOP: `hop-guia-tecnica.pdf` (84pp) already local — needed to verify stat-claim footnotes before publishing any percentage claims copied from the reference.
- LUXLIGHT: 3 PDFs confirmed archived locally but not linked from this specific reference URL (not blocking).

## Operational note

The three range audits ran as parallel background agents sharing one Playwright
browser instance, which caused intermittent tab cross-talk (one agent's page
briefly showing another range's content). Both the HOP and LUXLIGHT agents
detected this and worked around it — HOP by re-deriving all data from raw `curl`
HTML fetches and the WordPress REST API (`wp-json/wp/v2/media`) instead of DOM
snapshots, LUXLIGHT by opening dedicated new tabs and re-verifying the URL before
every extraction/screenshot. Both explicitly re-confirmed their final data was
race-free. No data quality issue is expected, but if anything in the per-range
reports looks inconsistent with the live site, treat it as the first thing to
spot-check.
