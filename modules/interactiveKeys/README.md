# interactiveKeys

Route for TaxonWorks **interactive (multi-access) keys**, built on [`@sfgrp/distinguish`](https://www.npmjs.com/package/@sfgrp/distinguish).

| Route name | Path | Component |
|---|---|---|
| `interactive-key` | `/interactive-key/:id` | `InteractiveKey.vue` |

- `:id` is the TaxonWorks **observation matrix** id.
- `?otu_filter=12|34|56` limits the key to those OTUs.

## What it changes from the TaxonPages built-in key

- Remaining and eliminated taxa link to their WID taxon pages.
- **View Image Matrix** (`components/ImageMatrixButton.vue`) opens the image matrix (`image-matrices-id` route) for the taxa still selected.
- Colours come from the TaxonPages theme variables, so the key follows the site palette and dark mode.

The key is rendered client-side only (`<ClientOnly>`), and talks to TaxonWorks with the API address and project token from `config/api.yml`.

Taxon pages link here from the Keys panel (`panels/PanelKeys`) for matrices that are not image matrices. Dichotomous keys are handled by [`modules/keys`](../keys/README.md).
