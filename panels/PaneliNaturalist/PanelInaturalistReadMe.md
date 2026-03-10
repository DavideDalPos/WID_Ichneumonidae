# PaneliNaturalist

Displays research-grade iNaturalist observation photos for a given taxon, with responsive grid layout, pagination, and improved UX.

This panel resolves taxon matching issues, supports all taxonomic ranks, and ensures only high-quality research-grade observations are shown.  

See `PaneliNaturalist.vue` for full inline documentation.

---

## Features

### 1. Accurate Taxon Matching

- Resolves `expanded_name` from TaxonWorks into `{ genus, subgenus, epithet }`.
- Uses iNaturalist `/v1/taxa` endpoint to fetch **exact `taxon_id`**, avoiding fuzzy matches.
- Subgenera are verified against the parent genus via the `ancestors` list.
- Prevents unrelated observations from being included.
- Displays a **pill-style message** when no taxon is found:  
  > "No iNaturalist taxon found"

### 2. Research-Grade Observations Only

- API requests include `quality_grade: 'research'`.
- Ensures only verified, high-quality observations are shown.
- Reduces false positives or misidentified occurrences.

### 3. Improved Image Display

- **Responsive grid layout:** `grid-cols-[repeat(auto-fill,minmax(400px,1fr))]`.
- **Consistent 3:2 aspect ratio** for all images (`aspect-[3/2]`).
- Vertical images are cropped to fit horizontally (`object-cover`) for visual consistency.
- Rounded cards with shadows (`rounded`, `shadow-sm`).
- Medium-resolution images (`medium`) instead of small `square` thumbnails.
- Hover effect: images fade slightly (`hover:opacity-80 transition`).
- Images open in a **new tab** safely (`target="_blank" rel="noopener noreferrer"`).

### 4. Enhanced UX

- Loading spinner displayed via `<ClientOnly>` and `<VSpinner>`.
- Pill-style messages for:
  - Taxon not found (`taxonId === null`).
  - No observations found (`!observations.length`).
- Well-styled messages with background, border, padding, and rounded corners.
- Fully compatible with all taxonomic ranks: family, subfamily, tribe, genus, subgenus, species.

### 5. Pagination

- `<VPagination>` component for navigating observation pages.
- Updates automatically when the page changes.
- Works with the `perPage` prop to control the number of observations per page.

---

## Summary of Updates Compared to Original Code

| Feature | Original | This Version |
|---------|---------|--------------|
| Taxon matching | Fuzzy `taxon_name` | Exact `taxon_id` via `/v1/taxa`, handling all ranks and subgenera |
| Observation grade | All observations | Only `quality_grade: 'research'` |
| No results UI | Simple text | Pill-style messages, centered, with padding and borders |
| Spinner | None or basic | `<ClientOnly>` with `<VSpinner>` for loading feedback |
| Image layout | Basic grid | Responsive, consistent 3:2 aspect, medium resolution, rounded, hover effect |
| Vertical images | Displayed as-is | Cropped horizontally with `object-cover` for consistent layout |
| External links | Not always safe | Opens in a new tab with `rel="noopener noreferrer"` |
| Rank support | Mostly genus/species | Fully supports any taxonomic rank |

---

This version **improves reliability, visual consistency, and usability** while remaining fully compatible with TaxonWorks and iNaturalist APIs.