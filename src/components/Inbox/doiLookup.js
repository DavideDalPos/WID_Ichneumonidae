// Look up a DOI and return the parts of the reference.
// Tries Crossref first (most journals, incl. Pensoft/ZooKeys), then DataCite
// (Zenodo, Figshare, many repositories). Both allow calls from the browser.

export const DOI_RE = /\b(10\.\d{4,9}\/[^\s"<>]+)/i

// Accepts "10.3897/zookeys.1.1", "doi:10…", "https://doi.org/10…", "https://dx.doi.org/10…"
export function parseDoi(text) {
  const m = String(text || '').trim().match(DOI_RE)
  return m ? m[1].replace(/[.,;)\]]+$/, '') : ''
}

export const doiUrl = (doi) => `https://doi.org/${doi}`

const initials = (given = '') =>
  given
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((p) => p.split('-').map((q) => q[0].toUpperCase() + '.').join('-'))
    .join(' ')

// "ÁLVAREZ-ARELLANO" → "Álvarez-Arellano" (some publishers send names in capitals)
const fixCase = (s = '') =>
  s === s.toUpperCase() && /\p{L}{2}/u.test(s)
    ? s.toLowerCase().replace(/(^|[\s\-'’])(\p{L})/gu, (m, sep, ch) => sep + ch.toUpperCase())
    : s

function joinAuthors(list) {
  const names = list.filter(Boolean)
  if (names.length <= 1) return names[0] || ''
  return names.slice(0, -1).join(', ') + ' & ' + names.at(-1)
}

const clean = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

async function fromCrossref(doi) {
  const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
  if (!r.ok) return null
  const w = (await r.json()).message || {}
  const date = w.issued?.['date-parts']?.[0] || w['published-print']?.['date-parts']?.[0] || w['published-online']?.['date-parts']?.[0]
  return {
    authors: joinAuthors(
      (w.author || []).map((a) => (a.family ? `${fixCase(a.family)}${a.given ? ', ' + initials(a.given) : ''}` : clean(a.name)))
    ),
    year: date?.[0] ? String(date[0]) : '',
    title: clean(w.title?.[0]),
    journal: clean(w['container-title']?.[0]),
    volume: [w.volume, w.issue ? `(${w.issue})` : ''].filter(Boolean).join(''),
    pages: String(w.page || w['article-number'] || '').replace(/(\d)-(\d)/, '$1–$2')
  }
}

async function fromDataCite(doi) {
  const r = await fetch(`https://api.datacite.org/dois/${encodeURIComponent(doi)}`)
  if (!r.ok) return null
  const a = (await r.json()).data?.attributes || {}
  return {
    authors: joinAuthors(
      (a.creators || []).map((c) => (c.familyName ? `${fixCase(c.familyName)}${c.givenName ? ', ' + initials(c.givenName) : ''}` : clean(c.name)))
    ),
    year: a.publicationYear ? String(a.publicationYear) : '',
    title: clean(a.titles?.[0]?.title),
    journal: clean(a.container?.title || a.publisher),
    volume: [a.container?.volume, a.container?.issue ? `(${a.container.issue})` : ''].filter(Boolean).join(''),
    pages: [a.container?.firstPage, a.container?.lastPage].filter(Boolean).join('–')
  }
}

export async function lookupDoi(doi) {
  return (await fromCrossref(doi).catch(() => null)) || (await fromDataCite(doi).catch(() => null))
}

// "Townes, H. & Townes, M. (1960) Title. Journal 12(3): 1–20."
export function formatReference({ authors, year, title, journal, volume, pages }) {
  const head = [authors, year ? `(${year})` : ''].filter(Boolean).join(' ')
  const t = title ? title.replace(/[.\s]+$/, '') + '.' : ''
  const where = [journal, volume].filter(Boolean).join(' ')
  const tail = where ? where + (pages ? `: ${pages}` : '') + '.' : pages ? `${pages}.` : ''
  return [head, t, tail].filter(Boolean).join(' ').trim()
}

// Empty reference object for a form: reactive(emptyReference())
export const emptyReference = () => ({ doi: '', authors: '', year: '', title: '', journal: '', volume: '', pages: '' })
