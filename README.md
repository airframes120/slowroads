# Slowroads · Plan B

An interactive expedition-journal travel app prototype for **Irvine → El Paso → Houston → Sarasota, November 23–25, 2026**, two drivers and a husky. Three travel days, two baseline hotel nights. Desired Wednesday arrival; Thursday November 26 is a fatigue fallback before a 6 PM dinner, not a guaranteed deadline.

## Run locally

No installation, API keys or build step required. From this folder:

```sh
python3 -m http.server 8765
```

Open http://localhost:8765. You can also open `index.html` directly, although local storage behavior on file URLs varies by browser. All landscape images are bundled locally. System fonts keep the interface independent of remote font services. Offline saving requires HTTPS or localhost, not file URLs.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload **the contents of this folder at the repository root**, including `.github/workflows/pages.yml` and `.nojekyll`.
2. Use `main` as your default branch, or edit the workflow branch trigger.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Push to `main`, or run the **Deploy Pages** workflow manually from Actions.
5. Open the deployment URL reported by the workflow. It will usually be `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

Alternatively, choose **Deploy from a branch**, `main`, `/ (root)`. No workflow is needed for that option. Relative asset and page links support repository subpaths and direct links to each day. Repository: https://github.com/airframes120/slowroads

GitHub Pages target: https://airframes120.github.io/slowroads/ (deployment status is shown in the repository Actions tab).

## Included

- Route-first overview with an illustrated winding road, keyboard-accessible waypoint selection, and a day ticket that updates in place. On mobile, selecting a waypoint brings its ticket into view.
- Floating quick-navigation dock, chapter navigation on day pages, paper textures, landscape photo tickets, and print-friendly roadbooks.
- Live Google Maps route links; schematic artwork is not navigable road geometry.
- Three actual HTML day URLs, with shared rendering and data.
- Distance, wheel time, local departure and arrival, break allowance, delay buffer, driver rotations, congestion, safety, dog care and lodging guidance.
- Editable budget with fuel economy, fuel cost, room rates, pet fees, food, miscellaneous and contingency.
- Persistent browser-local checklist and budget. No login, cloud sync, analytics or booking integration.
- Keyboard navigation, skip link, accessible input labels, reduced-motion support, mobile menu and print styles.
- `sources.html` with research links, estimate methodology and imagery credits.

## Route estimates

Checked November 11, 2026. Approximate city-to-city numbers; hotel addresses and route choices alter totals.

| Date | Leg | Planning miles | Wheel allowance | Depart local | Arrival including planned breaks | With delay allowance |
|---|---|---:|---|---|---|---|
| Nov 23 | Irvine → El Paso | 799 | 12h | Mon 3 AM PST | Mon 6:30 PM MST | Mon 8 PM MST |
| Nov 24 | El Paso → Houston | 745 | 11h15 | Tue 4 AM MST | Tue 6:30 PM CST | Tue 8 PM CST |
| Nov 25 | Houston → Sarasota | 1,032 | 15h | Wed 3 AM CST | Wed 10 PM EST | Thu midnight EST |

Total: **2,576 miles / 38h15 wheel time**, before 7h45 of breaks and 5h of delay allowances. Each day crosses one time zone. El Paso is Mountain Time, unlike Houston. DST already ended November 1. Arrival calculations use absolute instants and IANA zones via `Intl.DateTimeFormat`, including weekday rollover.

The departures are conditional on adequate sleep. Especially after Tuesday's arrival, 3 AM Wednesday may not permit enough recovery after check-in, food and dog care. Delay departure or add an overnight as needed; do not compress sleep to preserve the target. Tallahassee is an optional fallback, not a baseline stop or verified room reservation. Allow another ~327 interstate miles plus breaks from there.

Sources: [Irvine mileage](https://www.travelmath.com/drive-distance/from/Irvine,+CA/to/El+Paso,+TX), [Irvine wheel time](https://www.travelmath.com/driving-time/from/Irvine,+CA/to/El+Paso,+TX), [El Paso–Houston](https://www.rome2rio.com/s/El-Paso/Houston), [Houston mileage](https://www.travelmath.com/drive-distance/from/Houston,+TX/to/Sarasota,+FL), [Houston wheel time](https://www.travelmath.com/driving-time/from/Houston,+TX/to/Sarasota,+FL). Published baselines differ, so rounded allowances are explicit. No future traffic or weather is claimed.

## Structure & customization

- `assets/data.js`: itinerary records; distances, break minutes, delay buffers, routes, lodging notes, photos and IANA time zones.
- `assets/app.js`: renderers, arrival arithmetic, map, calculator and storage handlers.
- `assets/style.css`: shared responsive design.
- `day-1.html` through `day-3.html`: direct day URLs.
- `budget.html`, `checklist.html`, `sources.html`: utility pages.

To add another itinerary, parameterize trip metadata, route-map points, day count, date labels, hotel-night count, source list and budget multipliers in `app.js`, as well as changing the day records. This is a single-trip prototype, not yet a general itinerary engine. The departure offset table is valid for these November dates; dates across DST boundaries require a date-aware conversion implementation.

## Images & third-party assets

Photographs are locally bundled Unsplash landscape moods, **not verified destination photos**. Every image source is linked on the Sources page; use is under the [Unsplash License](https://unsplash.com/license). Keep that license separate from the project code license. Review and download licensed replacements for location-specific production photography, keep photographer/source/license records, update `photo()` to local paths, and update alt text. The three licensed JPEGs are bundled in assets/desert.jpg, assets/forest.jpg and assets/coast.jpg. Their original Unsplash CDN source URLs remain on the Sources page.

The UI uses system fonts with local font fallbacks; no Google Fonts requests are required. The route illustration and brand mark are original SVG artwork. External navigation and source links contact their respective hosts only when opened; there are no analytics.

## Validation

`node --check assets/app.js` checks JavaScript syntax. `node checks.cjs` checks all route dates, distance totals, break-minute sums, time-zone conversions, cross-midnight arrival, page rendering and relative local links. Browser checks cover overview/day display, budget recalculation and persistence, checklist persistence, mobile menu and narrow layout. No automated accessibility conformance claim is made.

## Limitations

Schematic map is not road geometry; navigation links may reroute. Break locations are suggested areas, with no verified opening hours. All lodging is guidance, with no availability or rates claimed. Budget defaults are editable assumptions, not market quotes, and the baseline excludes an optional third hotel night, repairs, vehicle wear and return travel. Local storage can be cleared or unavailable; app data is not backed up or shared.

## Cooperative quest system

Open `passport.html` for the crew passport. Four ranks, three collectible city stamps and 480 possible XP. Each chapter has four self-recorded missions: rest (30 XP), dog care (25 XP), safe driver rotations (25 XP), and a safe landing (50 XP). Completing all four earns that chapter’s stamp. All 18 packing items earn 5 XP each, up to 90. Reversing an item removes its XP and dependent stamp; repeated toggles cannot accumulate points.

Quest state is saved to `slowroads-quest-v1` in browser storage. Checklist XP is derived from the existing checklist. Resetting quests has an explicit confirmation step and preserves the checklist and budget. Test progress has been cleared from the preview. No GPS or live verification; no speed, distance or time bonuses. Earlier overnight stops qualify as safe landings. Roadbook pages are never gated by levels. Update progress only while parked or as a passenger.

`assets/game-core.js` contains pure progress rules, covered by `checks.cjs`. `assets/quests.js` renders and stores the game layer. Browser checks verified a 130 XP chapter stamp, reload persistence, undo, reset, and a 390px layout without horizontal overflow.


## Offline travel pack (PWA)

Open once through HTTPS (GitHub Pages) or localhost, then wait for **Ready offline · all 9 pages + photos saved**. The worker precaches every page, shared script, stylesheet, logo, manifest and three landscape photos in one complete install. This includes pages never individually visited. All core requests are same-origin; the map is local SVG artwork. Pack size is about 0.8 MB, before browser overhead. Cache readiness is verified by checking each required entry, not inferred from connectivity.

On iPhone, use Safari on the published HTTPS URL → Share → Add to Home Screen. Open the installed app online once and wait for its readiness indicator. Then test that same app in airplane mode, including a page reload and another day page. localhost on your computer does not refer to your computer from your phone; deploy to HTTPS for real-device use. Installed-app and browser storage may differ.

**Works offline:** all itinerary pages and imagery; schematic route and waypoint selection; budget edits; checklist and quest progress; crew passport; local confirmed-detail notes; printable roadbook and JSON backup export. **Requires a connection:** live external directions, hotel searches, current road-condition/weather sites and source pages. Save the corridor separately in your navigation app for offline turn-by-turn guidance. This app has no navigation map tiles or live GPS.

`offline.html` includes a standalone full roadbook even if app-rendering JavaScript fails, a local notes area for confirmed hotels/phone numbers, and print/PDF and JSON export buttons. Exports are manual backups, not an automatic restore/sync feature. No cloud upload. Keep exported personal notes private. Printing includes the complete notes text.

Browser storage can be evicted or cleared; offline readiness is a point-in-time verification. Keep a printed/PDF copy and a notes/progress export. Initial install needs a successful connection; private browsing or unsupported browsers may block persistence. The banner reports preparation failures and unsupported contexts. Network status uses the browser connectivity signal, which may not detect a captive portal or an unreachable host; readiness is independently verified. Itinerary and cached traffic notes are planning information, never current conditions.

### Updates and cache scope

`sw.js` uses a versioned, application-scope-specific cache. It installs all files before activating, keeps other apps’ caches intact, and uses cached app files consistently. While connected, **Check for updates** checks the worker; when a new worker takes over an existing page, **Reload updated app** loads that saved release. An update that cannot download fully leaves the prior active pack intact. User progress lives in localStorage and is not removed by app cache updates.

**Change the VERSION in sw.js for every release that changes any cached file.** Keep FILES aligned with application assets; run both checks below before deployment:

```sh
node checks.cjs
node offline-checks.cjs
```

Browser validation: stopped the local HTTP server, navigated to and reloaded Day 3, confirmed the local photo loaded, recorded/reversed a quest and reloaded it, changed/reloaded/reset the budget, and saved/reloaded/cleared sample notes. All succeeded without the server. Unit checks exercise cache scope under a GitHub-style `/repo/` subpath, every precached response without network, missing-file readiness, offline navigation fallback and cleanup isolation. Real iPhone Safari airplane-mode testing remains a user-device check.
