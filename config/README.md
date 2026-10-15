# config

Site settings. TaxonPages reads every `.yml` file here at build time; the values are also available in pages and components through the global `__APP_ENV__` object (for example `__APP_ENV__.project_name`). Restart `npm run dev` after changing a `.yml` file.

| File | Controls |
|---|---|
| `api.yml` | TaxonWorks API address (`https://sfg.taxonworks.org/api/v1`) and the project's **public, read-only** project token. |
| `api.development.yml.example` | Template for pointing a local copy at a different TaxonWorks server. Copy it to `api.development.yml`; files named `*.development.yml` are git-ignored. |
| `project.yml` | Project name, citation, URL (`https://worldichneumonidae.com`) and the author list used in citations. |
| `router.yml` | `base_url: /` (the site is served from the domain root) and `hash_mode: true` (URLs look like `/#/otus/<id>/overview`, which works on GitHub Pages without server rewrites). |
| `header.yml` | Logo and top menu. Each entry has a `label` and either a `link` or a `submenu`. |
| `taxa_page.yml` | Tabs and panel layout of taxon pages (see below). |
| `maps.yml` | Base-map tile servers offered on maps (OpenStreetMap, GBIF). |
| `news.yml` | Layout of the news list, news page and home-page news widget. News items themselves are written in TaxonWorks. |
| `tracker.yml` | Targets of the **Report** button (data issues and website issues). |
| `copyright.yml` | Footer licence text and badge (CC BY 4.0). |
| `metadata.yml` | `<meta>` tags (description, keywords, social-sharing image). |
| `analytics.yml` | Google Analytics id. `enableDev: true` also counts visits from local development; set it to `false` to keep test visits out of the statistics. |
| `analytics.yml.example` | Every analytics service TaxonPages supports. |
| `style/theme.css` | Colour palette as CSS variables in `R, G, B` form (primary, secondary, backgrounds, map colours, dark mode). |
| `vendor/tailwind.config.cjs` | Tailwind configuration; extends the TaxonPages preset. |

## Taxon-page layout (`taxa_page.yml`)

Each top-level key is a tab. `panels` is a list of rows; each row is a list of columns; each column is a list of panel ids, from top to bottom:

```yaml
taxa_page:
  overview:                  # tab id (also the URL segment)
    panels:
      - - - panel:gallery    # row 1, column 1
          - panel:type
        - - panel:map-v2     # row 1, column 2
  asserted_distributions:
    label: 'Asserted Distributions'   # tab title
    rank_group: ['SpeciesGroup']      # only show this tab for species-group names
    panels:
      - - - panel:asserted-distributions
```

Panel ids come from each panel's `main.js` (custom panels: [panels/README.md](../panels/README.md)) or from TaxonPages' built-in panels (`panel:type`, `panel:nomenclature`, `panel:descendants`, `panel:statistics`, …). An id that matches no panel is silently skipped, so check spelling when a panel does not appear.
