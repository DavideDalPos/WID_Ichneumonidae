# World Ichneumonidae Database (WID)

The website of the **World Ichneumonidae Database** — taxonomy, literature, specimens, distributions, images and identification keys for the world's Ichneumonidae (Hymenoptera).

- **Website:** <https://worldichneumonidae.com>
- **Data:** curated in [TaxonWorks](https://sfg.taxonworks.org) and read live through its public API
- **Software:** [TaxonPages](https://github.com/SpeciesFileGroup/taxonpages) (Species File Group), with WID-specific pages, panels and modules
- **Organization:** [WorldIchneumonidaeDatabase](https://github.com/WorldIchneumonidaeDatabase)

The site has no database of its own. Every taxon page, bibliography search and statistic is requested from TaxonWorks when someone opens it, so corrections to names, specimens or references are made in TaxonWorks, not in this repository. This repository holds only the website: its configuration, pages, layout and custom components.

## How the repository works

TaxonPages keeps the software and a project's own files on two branches:

| Branch | Contains | Edit it? |
|---|---|---|
| `setup` (default) | Everything specific to WID: `config/`, `pages/`, `panels/`, `modules/`, `public/`, plus WID's changed versions of a few TaxonPages files in `src/` | Yes — almost all work happens here |
| `main` | The TaxonPages application, kept in step with [SpeciesFileGroup/taxonpages](https://github.com/SpeciesFileGroup/taxonpages) | Only to pull in TaxonPages updates |

Other branches (`gh-pages`, `development`, `ssr`, …) are older or experimental and are not used by the live site.

### Deployment

`.github/workflows/gh-pages.yml` runs on every push to `setup` or `main` (or by hand from the **Actions** tab). It:

1. checks out `main` (the TaxonPages application);
2. copies the `setup` branch on top of it, so WID's files replace the defaults;
3. runs `npm ci` and `npm run build`;
4. publishes `dist/` with GitHub Pages.

The site is live a few minutes after a push. The custom domain `worldichneumonidae.com` is set under **Settings › Pages**; the build uses hash routing (`hash_mode: true` in `config/router.yml`), so taxon pages look like `https://worldichneumonidae.com/#/otus/<id>/overview`.

## Repository layout

| Folder | What it holds | Docs |
|---|---|---|
| `config/` | Site settings: TaxonWorks API, header menu, taxon-page layout, maps, news, theme colours | [config/README.md](config/README.md) |
| `pages/` | Site pages (home, about, subfamilies, cite, help, recent additions, …) and their components | [Pages](#pages) below |
| `panels/` | Custom panels shown on taxon pages | [panels/README.md](panels/README.md) |
| `modules/` | Extra routes: dichotomous keys and interactive keys | [modules/keys](modules/keys/README.md), [modules/interactiveKeys](modules/interactiveKeys/README.md) |
| `src/` | WID's modified copies of TaxonPages core files (they overwrite the `main` versions at build time) | [src/README.md](src/README.md) |
| `public/` | Static files served from the site root: logos, favicon, team photos, `robots.txt` | [public/README.md](public/README.md) |
| `index.html` | Page shell with WID's metadata and social-sharing tags | |
| `.github/workflows/` | The build-and-deploy workflow | |

`.gitignore` ignores everything except the folders above, so the TaxonPages files you bring in for local development (next section) are never committed to `setup`.

## Running the site locally

You need [Node.js](https://nodejs.org) 20 or later and Git.

```bash
git clone https://github.com/WorldIchneumonidaeDatabase/WID_Database.git
cd WID_Database                 # opens on the setup branch
git checkout origin/main -- .   # bring in the TaxonPages application files
git reset                       # unstage them (they are ignored on setup)
git checkout .                  # restore WID's own versions of the overlapping files
npm install
npm run dev
```

The site runs at <http://localhost:5173>. Edits to `config/`, `pages/`, `panels/` and `modules/` reload automatically; restart `npm run dev` after changing a `.yml` file.

To preview the production build: `npm run build`, then `npm run preview`.

After TaxonPages is updated on `main`, repeat the three `git checkout` / `git reset` lines and `npm install`.

## Pages

Every `.vue` or `.md` file in `pages/` becomes a page; the file name is the route (`about.vue` → `/#/about`). `components/` holds the pieces these pages use and is not routed.

| Page | Route | Content |
|---|---|---|
| `home.vue` | `/` | Hero with search, live statistics and "explore" cards (`components/Home/`) |
| `about.vue` | `/about` | About WID, the team list and collaborator map (`components/Section/map/`) |
| `subfamilies.vue` | `/subfamilies` | Subfamily explorer with live counts and curation status ([subfamilies README](pages/components/subfamilies/README.markdown)) |
| `taxonomy.vue` | `/taxonomy` | Classification tree of the family (`components/TaxonomyPanel/`); not in the menu |
| `recenttaxa.vue` | `/RecentTaxa` | Recently added taxa and references (`components/Recent/`) — menu: Taxa & Keys › Taxa Addition |
| `RecentReferences.vue` | `/RecentReferences` | Recently added references and taxa — menu: Bibliography › Latest Addition |
| `request-pdf.vue` | `/request-pdf` | Request a PDF form — menu: Bibliography › Request a PDF |
| `cite.vue` | `/cite` | How to cite WID |
| `help.vue` | `/help` | How to contribute data and report errors |
| `announcements.vue` | `/announcements` | Announcements (`components/Section/SectionAnnouncements.vue`); not in the menu |
| `Acaenitinae.vue` | `/Acaenitinae` | Subfamily description page (`components/Section/Description/`); not in the menu |

Other routes in the menu come from TaxonPages or from `modules/`: `/news`, `/keys`, `/key/:id`, `/resources/tw/filter/bibliography` (bibliography search) and `/resources/tw/filter/dwc_otus` (Darwin Core search).

### Page components (`pages/components/`)

| Folder | Used by | Notes |
|---|---|---|
| `Home/` | `home.vue`, `cite.vue`, `help.vue` | `HomeStats.vue` asks TaxonWorks for live totals; `HomeIcon.vue` is the shared icon set. |
| `Recent/` | `recenttaxa.vue`, `RecentReferences.vue` | Lists of the newest taxon names and sources, plus a weekly activity chart. |
| `Search/` | home hero, taxon pages | `GlobalSearch.vue` — taxon and reference search box. |
| `Section/` | about, announcements, subfamily pages | `map/AboutMapData.js` is the **team list** (name, institution, coordinates, links, photo in `public/images/collaborators/`). `Description/SubfamilyData.js` holds the text of subfamily description pages. |
| `TaxonomyPanel/` | `taxonomy.vue` | Descendants tree without synonyms. |
| `subfamilies/` | `subfamilies.vue` | See its [README](pages/components/subfamilies/README.markdown). One data file per subfamily in `data/`. |
| `AnimateNumber.vue` | statistics | Counting-up number animation. |

### Adding a page

1. Create `pages/<name>.vue` (or `<name>.md` for plain text; Markdown pages can use `{{ app:project_name }}` and the TaxonPages global components).
2. Add a menu entry in `config/header.yml` if it should appear in the header.

> Because `.md` files under `pages/` are turned into pages too, documentation for this folder lives here in the root README rather than in a `pages/README.md`. Notes kept inside `pages/` use the `.markdown` extension (GitHub still displays them), which the page builder ignores.

## Common tasks

| Task | Where |
|---|---|
| Change the menu | `config/header.yml` |
| Add, move or remove panels on taxon pages | `config/taxa_page.yml` (panel ids are listed in [panels/README.md](panels/README.md)) |
| Edit a page (About, How to cite, How to help, …) | `pages/*.vue` |
| Update a subfamily's curation status | `pages/components/subfamilies/data/<Subfamily>.js` |
| Update the team list and map on the About page | `pages/components/Section/map/AboutMapData.js` |
| Post news | In TaxonWorks (news is read from the project); display options in `config/news.yml` |
| Change colours | `config/style/theme.css` |
| Replace logos or images | `public/images/` |
| PDF requests | Requests arrive as issues in the private `WorldIchneumonidaeDatabase/PDF_Requests` repository; settings in `config/pdf_requests.yml` |
| Update TaxonPages | Sync `main` with SpeciesFileGroup/taxonpages, then test locally before pushing |

## Reporting problems

- **Data** (a missing or wrong name, specimen, reference or image): open an [issue](https://github.com/WorldIchneumonidaeDatabase/WID_Database/issues) in this repository, or contact the editors listed on the [About](https://worldichneumonidae.com/#/about) page.
- **Website** (a broken link, panel or page): open an [issue](https://github.com/WorldIchneumonidaeDatabase/WID_Database/issues) in this repository. Problems in TaxonPages itself can be reported to [SpeciesFileGroup/taxonpages](https://github.com/SpeciesFileGroup/taxonpages/issues).

The **Report** links on the site are set in `config/tracker.yml`.

## Citation and licence

Cite the database as shown on the [How to cite](https://worldichneumonidae.com/#/cite) page. The authors and editors are listed in `config/project.yml` and on the About page.

Except where otherwise noted, site content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (`config/copyright.yml`). TaxonPages is developed by the [Species File Group](https://speciesfilegroup.org); see its repository for the software licence.

## Acknowledgements

WID is built on TaxonWorks and TaxonPages, developed by the Species File Group. The GBIF panels started from [Morten Høfft's TaxonPages panels](https://github.com/MortenHofft/taxonpages); the panel READMEs give the details of each one.
