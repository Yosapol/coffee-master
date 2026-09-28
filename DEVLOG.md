# Development log

## 2026-09-27 — A unified Coffee Master showcase

### Goal
Turn a collection of coffee tools and reference pages into a welcoming journey for home brewers. Keep the experience visually rich, easy to scan, and useful without an account or backend.

### Design and navigation
- Unified ten coffee routes around an ivory/pastel watercolor design, coordinated dark theme, shared controls, and mobile navigation.
- Organized the site into Find your cup, Brew tools, and Coffee journal; added practical shortcuts and related next steps.
- Shortened page introductions and moved deeper information into expandable sections.
- Added gentle one-time entrances and save-button invitations; reduced-motion users receive the same content without animation.

### Discovery and learning
- Built six mood choices, six flavor families, 60 illustrated tasting notes, a searchable gallery, and twelve explained recommendations.
- Added keyboard/touch flavor exploration and center-wheel Surprise me, with no immediate repeat of the same pairing.
- Used WCR-informed sensory concepts in original, optional tasting explanations and a Smell → Sip → Finish journal section. The wheel remains our own simplified design.
- Added bean-origin visuals, filter counts/reset/empty states, illustrated water and equipment guidance, and an interactive Thailand map.
- Created ten dedicated Thai coffee illustrations. Removed external regional reading links at the owner's request; retained map attribution and internal guide links.

### Your cup
- Added one browser-local saved cup with validated data, explicit saves for beans, recipes, and grinder results, and automatic recording of deliberate taste/method/roast choices.
- Kept hover previews, browsing alternatives, and incoming URL context separate from saved choices.
- Added change/remove controls, Start fresh with Undo, compatibility handling, storage fallback, and a suggested next step.
- Replaced the bottom bar with an upper-right floating cup. Its liquid level reflects saved choices across five areas: taste, beans, method, roast, and recipe/grind.
- Added the centered brew paper: saved choices appear in order, Show all now skips the reveal, and Fix my cup links to troubleshooting.
- Embedded saved recipe measurements, full pour instructions, and source links into the paper.

### Tools and recipes
- Made single-grinder starting settings the default while preserving the existing conversion formulas and source distinctions.
- Added explicit validation and removed stale results after invalid input.
- Preserved seven educators and 21 recipes; standardized six measurement fields and timed steps across the recipe page and recap.
- Updated Brewboy SOLO, CT62, and CT62 Transit Pro from owner-supplied video notes, including valve actions, Comandante click settings, and timestamp links.
- Preserved the prior saved identifier for CT62 Transit Pro. CT FLUX remains excluded until its input/output measurements are confirmed.
- Removed beverage-yield fields from every recipe at the owner's request. Input ratios remain distinct from Brewboy's reported output ratios.

### Engineering and verification
Static HTML/CSS/JavaScript keeps the site portable and straightforward to inspect. Shared reference data is generated from the existing content; no public API, tracking service, or account system is required for the core journey.

Automated browser checks cover all ten routes, light/dark themes, 320/390/768/1440px layouts, recipe preservation, representative grinder conversions, validation, filters, local links, image loading, menu access, keyboard/touch behavior, and saved-cup lifecycle. Focused checks exercise floating progress, animated recap, reduced motion, source labels, and Brewboy instructions. See the runnable suites in `tests/`.

Submission verification: all 12 browser suites passed against an isolated static preview of the GitHub submission copy. The staged diff passed whitespace checks, and a targeted review found no local user paths or token-pattern matches in the submission files.

Visual review informed fixes to the mobile recap, recipe layout, cup positioning, and focus behavior. A grinder save-click race was fixed by avoiding unnecessary result replacement on input blur.

### Boundaries and next opportunities
- Coffee recommendations and flavor mappings are editorial; tasting is personal.
- Grinder conversions are estimates and do not model every calibration or burr set.
- Some inherited recipes are concise interpretations, not independently revalidated transcriptions. Brewboy details are based on supplied notes; the video could not be independently retrieved during that update.
- Saved cups stay on this browser; unavailable storage only retains state on the current page.
- Thai region illustrations are artistic interpretations, not documentary farm images. Map markers are approximate.
- Accessibility was checked through automated interaction and visual review; this is not a claim of formal accessibility certification.
- This submission covers source and assets on GitHub. Public hosting, analytics, and a custom domain are separate work.
