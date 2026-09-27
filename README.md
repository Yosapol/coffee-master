# Coffee Master

A calm, illustrated coffee companion for home brewers. Explore a flavor, choose beans and a method, save a personal cup, then follow a recipe and adjust by taste.

## Experience

- **Find your cup:** six moods, six flavor families, 60 illustrated notes, 12 suggested profiles, and a center-wheel Surprise me action.
- **Your cup:** one saved setup on this browser, an animated coffee-level indicator, explicit bean/recipe/grind saves, edit/remove controls, and Start fresh with Undo.
- **Brew recap:** a centered paper with sequentially revealed choices, complete saved recipe instructions, and a Fix my cup action.
- **Brew tools:** single-grinder starting settings, approximate grinder conversions, 21 recipes from seven educators, and five troubleshooting paths.
- **Coffee journal:** 20 bean entries, brewing and water guides, equipment advice, and six clickable Thai coffee regions with dedicated illustrations.

Ivory paper, pastel colors, serif headings, and watercolor artwork connect the ten pages. Mobile layouts, dark mode, keyboard controls, visible focus, and reduced-motion support are built in.

## Run locally

Requires Node.js 18 or later. There is no application build step or backend.

```sh
npm run preview
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. The public site consists of static HTML, CSS, JavaScript, and assets. Font loading uses Google Fonts with system fallbacks; the main interactions run locally in the browser.

## Verify

In a second terminal, with the preview running:

```sh
npm install
npx playwright install chromium
npm test
```

The test runner stops on failure. Set `COFFEE_BASE_URL` (including the trailing slash) to test a different preview port. Checks cover calculations, recipes, saved journeys, invalid inputs, context conflicts, filters, map navigation, animations, keyboard/touch interaction, and responsive light/dark layouts. Review screenshots are generated in `tests/screenshots/` and excluded from Git.

## Implementation

- `site.css`, `site.js`, and `theme.js`: shared visual system, navigation, URL context, and theme.
- `cup.js` and `cup-data.js`: browser-local saved cup, validated references, and recap. Run `node scripts/build-cup-data.cjs` after changing recipe or reference data.
- `mood.js`, `flavor-notes.js`, and `flavor-explorer.js`: editorial mood matching and illustrated discovery.
- `script.js` and `recipes.js`: grinder reference/calculation data and attributed recipe content.

Optional URL context uses validated `flavor`, `roast`, and `brew` values. Visiting a contextual link does not silently replace the saved cup. Roast ranges require a choice; mood does not imply a brewing method. Browser storage failure falls back to memory for the current page.

## Content and credits

Mood pairings are editorial associations. Bean cards are inspiration, not products or guarantees about every coffee from an origin. Grinder results are starting points or approximate conversions, with source distinctions displayed.

Recipe pages retain their source links. The Brewboy schedules use supplied video notes with timestamp links; CT FLUX is excluded pending confirmation of conflicting measurements. Input and output ratios are labeled separately. Beverage-yield fields are omitted. This is an independent educational showcase, not an endorsement by the featured educators.

Watercolor artwork was generated with AI assistance; flavor and map graphics use SVG. Prompts and attribution are in `assets/ARTWORK.md`, `assets/ILLUSTRATION-SET.md`, the individual illustration folders, and `assets/origins/SOURCES.md`. Educator portraits and third-party references retain their existing provenance; no blanket redistribution license is asserted for third-party material.

See [DEVLOG.md](DEVLOG.md) for the development story, design decisions, verification, and limitations. Publishing this repository does not itself deploy a public website.
