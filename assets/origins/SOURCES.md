# Bean origin artwork

Country silhouettes are derived from the public-domain Natural Earth 1:110m country dataset:
https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/

Source GeoJSON: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Flag SVGs are from flag-icons by Panayiotis Lipiridis, under the MIT license. The complete license is retained in `FLAG-ICONS-LICENSE.txt`.
https://github.com/lipis/flag-icons

The country map SVGs have transparent canvases with no background rectangle. They show the countries named or implied by each existing origin description, not verified farm coordinates. Racemosa shows both Mozambique and South Africa. Stenophylla shows Sierra Leone with the wider West Africa context in text. Excelsa and Catimor show broad regional maps because their existing entries do not name a single source country; national flags would imply unsupported specificity. Map sizes are fitted to each card and are not comparative geographic scales.

The six single-bean SVG illustrations in `../bean-types/` are original code-native drawings. They are illustrative examples, not a species identification guide or a size comparison. The Rare filter uses a Stenophylla example, and Hybrid uses Catimor. Filter taste icons reuse the original flavor illustrations; flavor-family colors match the six colors in `mood.js`.

To refresh source files: `node scripts/fetch-origin-sources.cjs`.
To rebuild map and bean drawings and card headers: `node scripts/build-bean-visuals.cjs`.
