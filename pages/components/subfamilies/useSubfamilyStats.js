import { ref } from 'vue'
import { makeAPIRequest } from '@/utils/request'

// Root of the classification in TaxonWorks (Ichneumonidae)
export const FAMILY_TAXON_NAME_ID = 762910

const RANK = {
  subfamily: 'NomenclaturalRank::Iczn::FamilyGroup::Subfamily',
  genus: 'NomenclaturalRank::Iczn::GenusGroup::Genus',
  species: 'NomenclaturalRank::Iczn::SpeciesGroup::Species'
}

const CACHE_KEY = 'wid-subfamily-stats-v1'
const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 hours

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { time, data } = JSON.parse(raw)
    return Date.now() - time < CACHE_TTL ? data : null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }))
  } catch {
    // storage unavailable — ignore
  }
}

async function count(url, params) {
  const { headers } = await makeAPIRequest.get(url, {
    params: { ...params, per: 1, page: 1 }
  })
  const n = Number(headers['pagination-total'])
  return Number.isFinite(n) ? n : null
}

// Run async jobs with limited concurrency so we don't flood the API
async function pool(jobs, size = 6) {
  const results = new Array(jobs.length)
  let i = 0
  async function worker() {
    while (i < jobs.length) {
      const idx = i++
      try {
        results[idx] = await jobs[idx]()
      } catch {
        results[idx] = null
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, jobs.length) }, worker))
  return results
}

/**
 * Live per-subfamily numbers from TaxonWorks.
 * stats.value = { [subfamilyName]: { taxonNameId, otuId, author, genera, species, names, specimens, images } }
 */
export function useSubfamilyStats() {
  const stats = ref({})
  const loading = ref(true)
  const error = ref(false)

  async function load() {
    const cached = readCache()
    if (cached) {
      stats.value = cached
      loading.value = false
      return
    }

    try {
      const { data: subfamilies } = await makeAPIRequest.get('/taxon_names.json', {
        params: {
          taxon_name_id: [FAMILY_TAXON_NAME_ID],
          descendants: true,
          validity: true,
          rank: [RANK.subfamily],
          per: 200
        }
      })

      const list = subfamilies.filter((s) => s.parent_id === FAMILY_TAXON_NAME_ID)

      const base = {}
      list.forEach((s) => {
        base[s.name] = {
          taxonNameId: s.id,
          author: s.cached_author_year || '',
          otuId: null,
          genera: null,
          species: null,
          names: null,
          specimens: null,
          images: null
        }
      })
      stats.value = base

      // OTU ids so we can link to the taxon pages
      const { data: otus } = await makeAPIRequest.get('/otus.json', {
        params: { taxon_name_id: list.map((s) => s.id), per: 500 }
      })
      const byTaxon = Object.fromEntries(list.map((s) => [s.id, s.name]))
      otus.forEach((o) => {
        const name = byTaxon[o.taxon_name_id]
        if (name && !stats.value[name].otuId) stats.value[name].otuId = o.id
      })

      const jobs = []
      list.forEach((s) => {
        const scope = { taxon_name_id: [s.id], descendants: true }
        const set = (key) => (value) => {
          stats.value[s.name][key] = value
        }
        jobs.push(() => count('/taxon_names.json', { ...scope, validity: true, rank: [RANK.genus] }).then(set('genera')))
        jobs.push(() => count('/taxon_names.json', { ...scope, validity: true, rank: [RANK.species] }).then(set('species')))
        jobs.push(() => count('/taxon_names.json', scope).then(set('names')))
        jobs.push(() => count('/collection_objects.json', scope).then(set('specimens')))
        jobs.push(() => count('/images.json', scope).then(set('images')))
      })

      await pool(jobs)
      writeCache(stats.value)
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  load()

  return { stats, loading, error }
}
