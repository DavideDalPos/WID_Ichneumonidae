# PanelScrutiny (`panel:scrutiny`)

Shows **scrutiny** notes for a taxon name: who last reviewed the name's status and in which publication.

- **Layout:** Overview tab
- **Props:** `taxonId` (taxon-name id)
- **Hidden** when there are no scrutiny notes.

## Data

Scrutiny notes are TaxonWorks **data attributes** on the taxon name using the controlled-vocabulary term with id `3102` (`SCRUTINY_ID` in `PanelScrutiny.vue`). Each note is printed with its citations.

| Call | Purpose |
|---|---|
| `GET /data_attributes.json?attribute_subject_id=<taxonId>&controlled_vocabulary_term_id=3102` | Scrutiny notes |
| `GET /citations.json?citation_object_type=DataAttribute&citation_object_id=<id>` | Sources cited for each note |

If the predicate is recreated in TaxonWorks, update `SCRUTINY_ID`.
