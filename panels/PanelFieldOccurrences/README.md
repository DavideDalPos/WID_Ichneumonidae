# PanelFieldOccurrences (`panel:field-occurrences`)

Lists **field occurrences** — observations recorded without keeping a specimen, such as sightings or photographs — for one OTU.

- **Props:** `otuId`
- **Layout:** Field Occurrences tab, species group only (`config/taxa_page.yml`)
- **Superseded by** [`PanelSpecimenOccurrences`](../PanelSpecimenOccurrences/readme.md), which shows specimens and field occurrences together. Keep this panel only while the separate tab is wanted.

## What it shows

- Up to 10 records (`MAX` in `PanelFieldOccurrences.vue`), records with images first. Each record gives count and sex, locality, coordinates and collector from Darwin Core, with image thumbnails that open the image viewer.
- When there are none, a short explanation with links to the specimen-records tab and the How to help page instead of an empty card (`components/ListOccurrences.vue`).

## Data

| Call | Purpose |
|---|---|
| `GET /otus/<otuId>/inventory/dwc.json` | Darwin Core records for the OTU; only `dwc_occurrence_object_type === 'FieldOccurrence'` are kept |
| `GET <associatedMedia URL>` | Image details for each link in a record's `associatedMedia` |
