# PanelEtymology (`panel:etymology`)

Shows the grammatical gender, part of speech and etymology of a genus- or species-group name.

- **Rank groups:** `GenusGroup`, `SpeciesGroup`, `SpeciesAndInfraspeciesGroup` (`main.js`)
- **Props:** `taxon` (the TaxonWorks taxon name)
- **Hidden** when the name has no etymology, no gender/part-of-speech classification and no adjectival forms.

## What it shows

- **Gender and part of speech** — from the name's Latinized classifications in TaxonWorks: masculine, feminine, neuter; adjective, participle, noun in apposition, noun in genitive case.
- **Adjectival forms** — for a species-group name classified as an adjective or participle, the masculine / feminine / neuter spellings stored on the name.
- **Etymology** — the name's `etymology` field, rendered as Markdown (HTML allowed).

## Data

| Call | Purpose |
|---|---|
| `GET /taxon_name_classifications?taxon_name_id[]=<id>` | Classifications; only `…::Latinized::…` types are used |

Gender, part of speech and etymology are all edited on the taxon name in TaxonWorks (New taxon name › Etymology / Gender).
