# public

Files here are copied unchanged to the root of the site, so `public/images/logoWID.png` is served as `https://worldichneumonidae.com/images/logoWID.png`.

| Path | Use |
|---|---|
| `favicon.ico` | Browser tab icon |
| `flavicon.ico` | Not referenced anywhere (misspelt copy); can be deleted |
| `robots.txt` | Allows all crawlers |
| `images/logoWid_wasp.png` | Header logo (`config/header.yml`) |
| `images/logoWID.png`, `logoWID.jpg`, `logo.jpg` | Other logo versions; not referenced by the site at the moment |
| `images/og-wid.jpg` | Social-sharing image, 1200 × 630 (`index.html`, `config/metadata.yml`) |
| `images/collaborators/` | Team photos shown on the About page (`image` field in `pages/components/Section/map/AboutMapData.js`) |

Keep images small (photos under ~300 KB, JPEG or WebP). Reference them from pages with a root path, e.g. `/images/logoWID.png`.
