# PanelSpecimenRecords (`panel:specimen-records`)

> **Not in use.** Replaced by [`PanelSpecimenOccurrences`](../PanelSpecimenOccurrences/readme.md) (`panel:specimen-occurrences`), which is the panel on the Specimen & Occurrence Records tab. Kept for reference; it can be deleted.

Two cards for one OTU:

- **Type specimens** — collection objects with a type status, each with its status, a specimen label (count and sex, repository, catalogue number, locality, coordinates, collector) and image thumbnails;
- **Specimen records** — the other collection objects, same layout.

- **Props:** `otuId`

## Data

| Call | Purpose |
|---|---|
| `GET /otus/<otuId>/inventory/dwc.json` | Darwin Core records; `CollectionObject` rows split by whether `typeStatus` is set |
| `GET <associatedMedia URL>` | Image details for each record's media links |
