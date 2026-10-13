# Subfamilies page

`pages/subfamilies.vue` → `SubfamilyExplorer.vue`

- **Live counts** (`useSubfamilyStats.js`): for every valid subfamily directly under
  Ichneumonidae (taxon name 762910) it asks TaxonWorks for valid genera, valid species,
  all names, specimens and images. Results are cached in `sessionStorage` for 6 hours.
- **Curation status** comes from the hand-edited files in `data/*.js` (one per
  subfamily). Each task is `true` (complete), `'in-progress'` or `false`
  (not started). Groups and labels are defined in `curation.js`.
- Rows can be filtered by name and status, sorted, and expanded to show the full
  checklist and a link to the taxon page.

To add a subfamily, create `data/<Name>.js` (copy an existing one) and import it in
`data/index.js`.
