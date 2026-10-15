# PaneliNaturalist (`panel:inaturalist`)

Photos of the taxon from [iNaturalist](https://www.inaturalist.org).

- **Props:** `taxon`, `perPage` (default 12)
- **Layout:** iNaturalist tab, all ranks

## What it shows

1. **Curated taxon photos** — the representative photos iNaturalist editors chose for the taxon, opened in the image viewer with photographer and licence. The source link points to the photo page on iNaturalist.
2. **Research-grade observations** — a paginated grid of observation photos, each linking to its observation; the heading links to all research-grade observations of the taxon.

When the taxon is not on iNaturalist, or has observations but none research-grade, the panel says so and links to an iNaturalist search or the taxon's observations instead of showing an empty box.

## Matching the name

iNaturalist taxon ids are found by name (`resolveInatTaxonId`):

- a subgenus name (`Genus (Subgenus)`) is searched at rank `subgenus` and accepted only if its parent genus matches;
- other names are searched without the subgenus, at the rank of the WID name, and must match exactly.

No match → the "not on iNaturalist" message. Wrong matches usually come from homonyms in other groups; check the taxon id the panel links to.

## Data (external, no token)

| Call | Purpose |
|---|---|
| `GET https://api.inaturalist.org/v1/taxa?q=<name>&rank=<rank>` | Find the iNaturalist taxon id |
| `GET https://api.inaturalist.org/v1/taxa/<id>` | Curated `taxon_photos` |
| `GET https://api.inaturalist.org/v1/observations?taxon_id=<id>&quality_grade=research` | Research-grade observation photos |
| `GET https://api.inaturalist.org/v1/observations?taxon_id=<id>` (count only) | Explains an empty result |

`inat-mark.svg` is the iNaturalist logo; `PanelGallery` imports it from here for its iNaturalist fallback, so keep it when changing this panel.
