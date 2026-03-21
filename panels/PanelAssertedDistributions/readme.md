# PanelAssertedDistributions

Table panel (`panel:asserted-distributions`) displaying all asserted distributions for an OTU and its descendants, grouped by country/parent area, with geographic area map popups and structured citations.

## Setup

Place this directory (`PanelAssertedDistributions`) in the `panels/` folder on the setup branch. Add the panel to your `taxa_page.yml` layout under the **SpeciesGroup** tab, since asserted distributions are meaningful at species and infraspecies rank:

```yaml
taxa_page:
  overview:
    rank_group: SpeciesGroup
    label: Overview
    panels:
      - - - id: panel:asserted-distributions
```

> **Note:** Using `rank_group: SpeciesGroup` ensures the panel only appears on species and subspecies pages, where asserted distributions are recorded. It is not useful at genus or family level, and won't work there properly!!!

## Display

### Tabs

When distributions span multiple OTUs (e.g. a species and its subspecies), tabs appear:

- **All** — merged view: one row per geographic area, listing all taxa recorded there (italic, separated by `; `) and all their citations combined.
- **Per-taxon tabs** — filters to a single OTU, one row per distribution record.

Tabs are hidden on pages with a single OTU (e.g. subspecies pages).

### Grouping

Records are grouped by parent area:

- Areas whose parent is `"Earth"` (countries and top-level territories) appear under **"Countries & Territories"**.
- Sub-national areas (states, provinces, etc.) are grouped under their parent country name.

Groups and areas within groups are sorted alphabetically, derived from `asserted_distribution_shape.parent.name`.

### Table columns

| Column | Notes |
|---|---|
| Area | Clickable — opens a map popup with the geographic area polygon |
| Taxa | *(All tab only)* Taxa recorded for this area, in italic, separated by `; ` |
| Absent | "Absent" label when `is_absent` is true |
| Citation | Short reference (e.g. `Smith, 2020:45`); click to expand full reference in a modal. 3+ authors truncated to `First et al., Year`. Multiple citations separated by `; `. |

### Map popups

Clicking an area name opens a modal with a Leaflet map showing the geographic area polygon. GeoJSON is pre-fetched in the background for all OTUs after the table loads, so popups are typically instant. The data comes from `/otus/:otuId/inventory/distribution.geojson`. If no polygon is available for an area, a "No map data available" message is shown instead.

### Map panel

In addition to the per-area map popups, the panel includes a persistent map view displayed alongside the table.

The map is rendered using the PanelDistribution component.
It displays the overall distribution for the currently selected OTU.
The map is shown in a right-hand column on desktop and stacked below the table on smaller screens.
The map container is fixed (sticky) so it remains visible while scrolling the table.
Behavior
When multiple OTUs are present:
The map updates based on the selected tab.
In the "All" tab, the map defaults to the first available OTU.
When a single OTU is present:
The map reflects that OTU directly.
Layout
Desktop: two-column layout
Left (2/3 width): distribution table
Right (1/3 width): map panel
Mobile: stacked layout (table above map)
Data source

The map uses the same GeoJSON endpoint as the popups:

/otus/:otuId/inventory/distribution.geojson

Data is pre-fetched and cached per OTU to ensure fast rendering and avoid duplicate requests.

## API calls

1. **`/asserted_distributions`** — `taxon_name_id[]=X&descendants=true&per=500`
   Returns distribution records for the taxon and all its descendants. Each record includes `asserted_distribution_shape` (name, parent, type) and `is_absent`. No `extend` needed.

2. **`/citations`** — `citation_object_type=AssertedDistribution&citation_object_id[]=...`
   Returns citation records with `source_id` and `citation_source_body`.

3. **`/sources`** — `source_id[]=...`
   Returns full source records (`cached` field, full HTML reference).

4. **`/otus/:otuId/inventory/distribution.geojson`** — one request per OTU, pre-fetched in the background after the table loads. Promises are cached so concurrent requests (pre-fetch racing with a user click) are deduplicated.

## Notes

- Uses `taxon_name_id[]` + `descendants=true` instead of `otu_id[]` so that a species page includes records for all its subspecies and varieties.
- Default `per=500` loads all records at once, appropriate for the grouped display. Configurable as a prop in `taxa_page.yml`.
- `useOtuPageRequest` key is `panel:asserted-distributions` to avoid cache collisions with other panels.