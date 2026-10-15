# src

WID's modified copies of TaxonPages core files. The build checks out the TaxonPages application from the `main` branch and then copies this branch on top, so each file here **replaces** the file with the same path in TaxonPages.

Only change these files when a page or panel cannot do the job. After TaxonPages is updated on `main`, compare each file here with the new upstream version and carry over upstream fixes, otherwise the old copy here silently wins.

Files that differ from TaxonPages (as of October 2026):

| File | Change |
|---|---|
| `components/Layout/LayoutFooter.vue` | WID footer |
| `components/Button/VButton.global.vue` | Button styles |
| `components/Toggle/VToggle.global.vue` | New global toggle switch |
| `composables/usePageCitation.js` | New: builds the "cite this page" text |
| `modules/otus/components/CiteButton.vue` | New: cite button on taxon pages |
| `modules/otus/components/TaxaInfo.vue`, `views/Index.vue`, `views/PageLayout.vue`, `components/Breadcrumb/Breadcrumb.vue`, `components/Panel/PanelNomenclature/PanelCitationRow.vue` | Taxon-page header, search box, layout and breadcrumb |
| `modules/DwCFilter/…` (`views/index.vue`, `components/FilterBar.vue`, facets, `OtuModal.vue`) | Darwin Core search page |
| `modules/bibliography/…` (`views/index.vue`, `components/OtuModal.vue`, `utils/convertUrlsToLinks.js`) | Bibliography search page |
| `modules/news/…` (`views/index.vue`, `views/id.vue`, `components/NewsCard.vue`, `components/PinnedNews.vue`) | News list and news page |
| `utils/index.js` | Extra shared helpers |

Every other file in `src/` is identical to TaxonPages. To list the differences yourself:

```bash
git diff --ignore-cr-at-eol --stat origin/main HEAD -- src index.html
```
