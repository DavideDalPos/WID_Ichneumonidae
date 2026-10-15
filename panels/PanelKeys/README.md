# PanelKeys (`panel:keys`)

Lists the identification keys that involve the taxon. Replaces the TaxonPages built-in panel with the same id.

- **Props:** `otuId`, `taxon`
- **Layout:** Overview tab
- **Hidden** when there are no keys.

## What it shows

Keys in two groups, as returned by TaxonWorks:

- **Keys to this taxon** — keys whose scope is this taxon (`scoped`);
- **Keys including this taxon** — keys in which the taxon is one of the terminal taxa (`in`).

Each group lists both kinds of key:

| Kind | Opens |
|---|---|
| Dichotomous key (lead) | `/key/<id>` — [`modules/keys`](../../modules/keys/README.md) |
| Interactive key (observation matrix) | `/interactive-key/<id>` — [`modules/interactiveKeys`](../../modules/interactiveKeys/README.md) |
| Image matrix | `/image-matrices/<id>` (TaxonPages built-in) |

## Difference from the built-in panel

TaxonWorks finds a key for a taxon only when the key points at that exact OTU. A taxon can have more than one OTU (e.g. "Brentidae" and "Brentidae (except Nanophyinae)"), so a key that keys out one of the other OTUs would be missed. This panel also looks up every other OTU of the same taxon name and merges their keys in, without duplicates.

## Data

| Call | Purpose |
|---|---|
| `GET /otus/<otuId>/inventory/keys` | Keys for the page's OTU |
| `GET /otus?taxon_name_id[]=<taxonId>` | Other OTUs of the same name |
| `GET /otus/<id>/inventory/keys` (each other OTU) | Their keys, merged in |

Dichotomous keys appear only when their root lead is marked public in TaxonWorks.
