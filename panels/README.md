# panels

Custom panels for WID taxon pages. Each folder with a `main.js` is loaded automatically; `main.js` gives the panel's `id`, its Vue component and, optionally, the rank groups it is offered for. A panel appears on taxon pages only when its `id` is listed in `config/taxa_page.yml`.

Folders starting with `_` have no `main.js`; they hold code shared by several panels.

| Folder | Panel id | Shows | In `taxa_page.yml` |
|---|---|---|---|
| [PanelAssertedDistributions](PanelAssertedDistributions/readme.md) | `panel:asserted-distributions` | Asserted distributions table grouped by area, with map pop-ups and citations | Asserted Distributions tab |
| [PanelBiologicalAssociationsV2](PanelBiologicalAssociationsV2/readme.md) | `panel:biological-associations-v2` | Hosts and other biological associations with images and citations | Overview |
| [PanelEtymology](PanelEtymology/README.md) | `panel:etymology` | Gender, part of speech and etymology of the name | Overview (genus and species group) |
| [PanelFieldOccurrences](PanelFieldOccurrences/README.md) | `panel:field-occurrences` | Observations recorded without a specimen | Field Occurrences tab |
| [PanelGallery](PanelGallery/README.md) | `panel:gallery-v2` | Image gallery with fallbacks to lower taxa and iNaturalist | **No** — the overview uses the built-in `panel:gallery` |
| [PanelGBIF](PanelGBIF/README.md) | `panel:gbif` | Link to the matching GBIF species page | Overview |
| [PanelGbifImages](PanelGbifImages/readme.md) | `panel:gbif-images` | GBIF image carousel | GBIF tab |
| [PanelGbifMap](PanelGbifMap/readme.md) | `panel:gbif-map` | GBIF occurrence-density map | GBIF tab |
| [PanelGbifTaxon](PanelGbifTaxon/readme.md) | `panel:gbif-taxon` | WID–GBIF concept alignment | **No** — removed pending a redesign |
| [PanelGbifTypeSpecimens](PanelGbifTypeSpecimens/readme.md) | `panel:gbif-type-specimens` | Type specimens recorded in GBIF | GBIF tab |
| [PaneliNaturalist](PaneliNaturalist/README.md) | `panel:inaturalist` | iNaturalist taxon photos and research-grade observations | iNaturalist tab |
| [PanelKeys](PanelKeys/README.md) | `panel:keys` | Dichotomous and interactive keys that include the taxon | Overview |
| [PanelMapV2](PanelMapV2/readme.md) | `panel:map-v2` | Distribution map (asserted distributions, specimens, georeferences) | Overview |
| [PanelScrutiny](PanelScrutiny/README.md) | `panel:scrutiny` | Scrutiny notes with citations | Overview |
| [PanelSpecimenOccurrences](PanelSpecimenOccurrences/readme.md) | `panel:specimen-occurrences` | Specimen and field-occurrence records, with filters and phenology | Specimen & Occurrence Records tab |
| [PanelSpecimenRecords](PanelSpecimenRecords/README.md) | `panel:specimen-records` | Older type-specimen and specimen lists | **No** — replaced by `panel:specimen-occurrences` |
| [_shared](_shared/readme.md) | — | Lightbox, Darwin Core table, citation helpers, design tokens | — |
| [_gbifShared](_gbifShared/readme.md) | — | GBIF name matching and concept alignment helpers | — |

## Writing a panel

```
panels/PanelExample/
├── main.js
├── PanelExample.vue
└── README.md
```

```js
// main.js
import PanelExample from './PanelExample.vue'

export default {
  id: 'panel:example',
  component: PanelExample,
  rankGroup: ['GenusGroup', 'SpeciesGroup'] // optional; omit to allow every rank
}
```

The component receives the taxon page's data as props — most panels use `otuId` (TaxonWorks OTU id), `taxonId` (taxon-name id), `taxon` and `otu`. Call TaxonWorks with `makeAPIRequest` from `@/utils`, which adds the API address and project token from `config/api.yml`; use `axios` directly only for other services (GBIF, iNaturalist). Wrap the content in `<VCard>` / `<VCardHeader>` / `<VCardContent>` so it matches the other panels, and use the theme colour classes rather than fixed colours so dark mode works.

Then add `panel:example` to `config/taxa_page.yml` and give the folder a README: what the panel shows, the API calls it makes and anything unusual.
