# PanelGBIF (`panel:gbif`)

A small card linking the taxon to its page on [GBIF](https://www.gbif.org).

- **Props:** `taxon`
- **Layout:** Overview tab
- **Hidden** when GBIF finds no match.

The panel sends the name (`taxon.expanded_name`) to the GBIF species-match service and, if a usage key comes back, links to `https://www.gbif.org/species/<usageKey>` with the formatted name as the link text.

| Call | Purpose |
|---|---|
| `GET https://api.gbif.org/v1/species/match?name=<name>` | Match the name against the GBIF Backbone |

This uses the **GBIF Backbone** (integer keys), while the GBIF tab panels (`PanelGbifImages`, `PanelGbifMap`, `PanelGbifTypeSpecimens`) match against the Catalogue of Life checklist through [`_gbifShared`](../_gbifShared/readme.md). For a few names the two can point to different GBIF concepts.

`components/gbifLogo.vue` is the GBIF logo used in the header.
