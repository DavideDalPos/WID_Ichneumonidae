<template>
  <VCard v-if="cardVisible">
    <VCardHeader class="flex items-center gap-3">
      <img :src="gbifMark" alt="GBIF" class="h-8 w-auto shrink-0" />
      <h2 class="text-md grow">GBIF occurrences map</h2>
      <PanelDropdown panel-key="panel:gbif-map" :menu-options="gbifMenuOptions" />
    </VCardHeader>

    <div class="relative w-full h-96 overflow-hidden isolate">
      <div
        ref="mapEl"
        class="absolute inset-0"
        role="region"
        :aria-label="`GBIF occurrence map for ${taxonDisplayName}`"
      />

      <!-- no confident GBIF match -->
      <div
        v-if="noGbifMatch"
        class="absolute inset-0 z-[1300] flex flex-col items-center justify-center gap-2 bg-base-background px-6 text-center"
      >
        <p class="text-sm opacity-80">
          No confident GBIF match for
          <span class="italic">{{ taxonDisplayName }}</span>.
        </p>
        <p class="text-xs opacity-60 max-w-xs">
          The spelling in TaxonWorks may differ from GBIF's (for example a
          gender-ending difference like <span class="italic">-um</span> vs
          <span class="italic">-a</span>). Occurrence data can't be shown until
          the names align.
        </p>
      </div>

      <!-- loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 z-[1200] flex flex-col items-center justify-center gap-2 bg-base-background/70 pointer-events-none"
      >
        <span class="gbif-spinner" aria-hidden="true" />
        <span class="text-xs opacity-70">Loading GBIF occurrences…</span>
      </div>

      <!-- precise mode selected but nothing passed the name filter -->
      <div
        v-else-if="mapMode === 'markers' && occurrences.length === 0 && hasAnyData"
        class="absolute inset-0 z-[1200] flex flex-col items-center justify-center gap-3 bg-base-background/70 pointer-events-auto"
      >
        <p class="text-xs opacity-80 max-w-xs text-center">
          No individual records match this concept precisely within the sampled pages.
        </p>
        <button
          type="button"
          class="px-2 py-1 text-xs rounded bg-base-background border border-base-border shadow hover:bg-base-foreground"
          @click="viewMode = 'all'"
        >
          Show all records
        </button>
      </div>

      <!-- GBIF-green explore button -->
      <button
        type="button"
        @click="openExplore"
        class="gbif-explore-btn absolute bottom-2 left-2 z-[1000] px-2 py-1 text-xs rounded shadow"
      >
        Explore on GBIF.org
      </button>

      <SelectInput
        v-model="basemapKey"
        class="absolute top-2 right-2 z-[1000] bg-base-background shadow"
        aria-label="Basemap"
      >
        <option v-for="(cfg, key) in BASEMAPS" :key="key" :value="key">
          {{ cfg.label }}
        </option>
      </SelectInput>
    </div>

    <!-- status bar: mode toggle / chip, caption, density legend -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 border-t border-base-border">
      <div
        v-if="!matchesTW && hasAnyData"
        role="group"
        aria-label="Map coverage"
        class="inline-flex rounded-md border border-base-border overflow-hidden text-xs shrink-0"
      >
        <button
          type="button"
          class="px-2 py-1"
          :class="viewMode === 'all' ? 'gbif-seg-active' : 'hover:bg-base-foreground'"
          :aria-pressed="viewMode === 'all'"
          @click="viewMode = 'all'"
        >
          All records
        </button>
        <button
          type="button"
          class="px-2 py-1 border-l border-base-border"
          :class="viewMode === 'precise' ? 'gbif-seg-active' : 'hover:bg-base-foreground'"
          :aria-pressed="viewMode === 'precise'"
          @click="viewMode = 'precise'"
        >
          Precise points
        </button>
      </div>
      <span
        v-else
        class="shrink-0 text-xs px-2 py-1 rounded-md border border-base-border opacity-80"
      >
        {{ modeChipLabel }}
      </span>

      <p class="text-xs opacity-70 grow min-w-[12rem]" v-html="plottedLabel"></p>

      <div
        v-if="mapMode === 'density'"
        class="flex items-center gap-2 text-[10px] opacity-70 shrink-0"
      >
        <span>Low</span>
        <span class="gbif-legend" aria-hidden="true" />
        <span>High</span>
      </div>
    </div>
  </VCard>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import {
  useGbifMatch,
  deriveScientificName,
  recordRequest,
  gbifMenuOptions,
  CHECKLIST_KEY,
  GBIF_OCCURRENCE_BASE,
  GBIF_OCCURRENCE_DETAIL
} from '../_gbifShared/useGbifMatch'
import {
  occurrenceName,
  epithetKey,
  tallyOccurrenceNames,
  scopeCaption
} from '../_gbifShared/gbifNameFilter'
import { resolveGbifTaxonScope } from '../_gbifShared/gbifTaxonScope'
import { fetchGbifBackboneConcept } from '../_gbifShared/gbifBackboneConcept'
import gbifMark from '../_gbifShared/gbif-mark.svg'
import '../_gbifShared/gbif-tokens.css'
import PanelDropdown from '@/modules/otus/components/Panel/PanelDropdown.vue'
import { useOtuPageRequestStore } from '@/modules/otus/store/request'

// Two map modes:
//  - density: GBIF's own hex-density tiles, aggregated server-side
//  - markers: name-filtered points (first ~900), shown only when the user picks "Precise points"
const GBIF_OCCURRENCE_SEARCH = 'https://api.gbif.org/v1/occurrence/search'
const GBIF_DENSITY_TILE =
  'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@2x.png'
const GBIF_DENSITY_CAPS =
  'https://api.gbif.org/v2/map/occurrence/density/capabilities.json'
const PAGE = 300
const MARKER_PAGES = 3

const BASEMAPS = {
  dark: {
    label: 'Dark Gray',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  },
  topo: {
    label: 'Topographic',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  }
}

const props = defineProps({
  otuId: { type: [Number, String], required: true },
  taxonId: { type: [Number, String], required: true },
  taxon: { type: Object, default: undefined },
  otu: { type: Object, default: undefined }
})

const scientificName = computed(() => deriveScientificName(props.taxon, props.otu))
const { match, gbifKey, loading: matchLoading } = useGbifMatch(scientificName)

const taxonDisplayName = computed(
  () => match.value?.usage?.canonicalName || scientificName.value
)

// State
const occurrences = ref([])
const totalCount = ref(null)
const lumpedNames = ref([])
const hasSynonyms = ref(false)
const matchesTW = ref(false)
const densityKeys = ref([])
const densityBounds = ref(null)
const loading = ref(false)
const mapEl = ref(null)
const basemapKey = ref('dark')
const viewMode = ref('all')
const hasNameMismatch = ref(false) // ✅ NEW: Track if there's a mismatch

// Map instance tracking
let mapInstance = null
let markerLayer = null
let densityLayers = []
let basemapLayer = null
let resizeObs = null

// Computed properties
const noGbifMatch = computed(
  () => !matchLoading.value && !!scientificName.value && !gbifKey.value
)

const mapMode = computed(() => {
  if (matchesTW.value) return 'density'
  return viewMode.value === 'all' ? 'density' : 'markers'
})

const hasAnyData = computed(
  () =>
    (densityKeys.value.length > 0 && (totalCount.value || 0) > 0) ||
    occurrences.value.length > 0
)

const cardVisible = computed(
  () => hasAnyData.value || loading.value || noGbifMatch.value
)

const modeChipLabel = computed(() => {
  if (matchesTW.value) return 'Exact match'
  return viewMode.value === 'all' ? 'All records' : 'Precise sample'
})

// ✅ FIXED: Check if we should attempt to fetch (not dependent on gbifKey)
const shouldFetchOccurrences = computed(() => {
  // Still loading match info
  if (matchLoading.value) {
    console.log('Map: Still loading match')
    return false
  }

  // Must have a scientific name
  if (!scientificName.value) {
    console.log('Map: No scientific name')
    return false
  }

  console.log('Map: Should attempt fetch - name available')
  return true
})

// ✅ UPDATED: Italicize all species names
const plottedLabel = computed(() => {
  if (mapMode.value === 'density') {
    const n = totalCount.value
    const countStr =
      typeof n === 'number' && n > 0 ? ` (${n.toLocaleString()} georeferenced)` : ''

    if (matchesTW.value) {
      return (
        `GBIF's taxonomy matches TaxonWorks for <i>${escapeHtml(taxonDisplayName.value)}</i>: ` +
        `the tiled map shows every GBIF record${countStr}.`
      )
    }

    const lumps = lumpedNames.value.length
      ? ` Includes ${lumpedNames.value.length} name` +
        `${lumpedNames.value.length === 1 ? '' : 's'} GBIF folds in that ` +
        `TaxonWorks treats as distinct — switch to Precise points to exclude them.`
      : ''
    return `Showing every GBIF record for <i>${escapeHtml(taxonDisplayName.value)}</i>${countStr}.${lumps}`
  }

  // Markers mode - get caption from utility
  const caption = scopeCaption({
    shown: occurrences.value.length,
    total: totalCount.value,
    lumpedNames: lumpedNames.value,
    noun: `georeferenced occurrence${occurrences.value.length === 1 ? '' : 's'}`,
    taxonName: taxonDisplayName.value,
    includesSynonyms: hasSynonyms.value
  })

  // ✅ UPDATED: Italicize ONLY scientific names (genus + species)
  let result = caption

  // Italicize primary taxon name (after "identified as")
  result = result.replace(
    new RegExp(`identified as ${escapeRegex(taxonDisplayName.value)}`, 'g'),
    `identified as <i>${escapeHtml(taxonDisplayName.value)}</i>`
  )

  // Italicize lumped names (e.g., "which also includes Chrysotoxum bicincta")
  for (const lumpedName of lumpedNames.value) {
    result = result.replace(
      new RegExp(`includes ${escapeRegex(lumpedName)}`, 'g'),
      `includes <i>${escapeHtml(lumpedName)}</i>`
    )
  }

  // ✅ FIX: Only match genus species when surrounded by spaces or punctuation
  result = result.replace(
    /(\s|,|\(|^)([A-Z][a-z]+) ([a-z]+)(?=\s|,|\)|$|\.)/g,
    '$1<i>$2 $3</i>'
  )

  return result
})

const requestStore = useOtuPageRequestStore()

// ✅ Helper to escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// ✅ Helper to escape regex special characters
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\__CODE_BLOCK_0__')
}

// ✅ NEW: Helper to do fuzzy epithet matching for mismatches
// When names don't match exactly (e.g., bicinctum vs bicincta),
// match by comparing epithet roots (first 6+ chars)
function epithetSimilarity(name1, name2) {
  // Extract last word (epithet)
  const parts1 = name1.trim().split(/\s+/)
  const parts2 = name2.trim().split(/\s+/)

  if (parts1.length < 2 || parts2.length < 2) return false

  const epithet1 = parts1[parts1.length - 1].toLowerCase()
  const epithet2 = parts2[parts2.length - 1].toLowerCase()

  // If epithets are identical, it's a match
  if (epithet1 === epithet2) return true

  // If they share first 6+ characters, likely a match (bicinctum vs bicincta)
  if (epithet1.length >= 6 && epithet2.length >= 6) {
    return epithet1.substring(0, 6) === epithet2.substring(0, 6)
  }

  return false
}

// Utility functions
function toPoint(r) {
  return {
    lat: r.decimalLatitude,
    lng: r.decimalLongitude,
    key: r.key,
    name: occurrenceName(r, CHECKLIST_KEY),
    year: r.year || null,
    country: r.country || r.countryCode || ''
  }
}

function pageUrl(keys, offset) {
  const u = new URL(GBIF_OCCURRENCE_SEARCH)
  u.searchParams.set('checklistKey', CHECKLIST_KEY)
  keys.forEach((k) => u.searchParams.append('taxonKey', k))
  u.searchParams.set('hasCoordinate', 'true')
  u.searchParams.set('hasGeospatialIssue', 'false')
  u.searchParams.set('limit', String(PAGE))
  u.searchParams.set('offset', String(offset))
  return u.toString()
}

async function fetchDensityBounds(key) {
  if (!key) return null
  try {
    const u = new URL(GBIF_DENSITY_CAPS)
    u.searchParams.set('taxonKey', String(key))
    u.searchParams.set('checklistKey', CHECKLIST_KEY)
    const res = await fetch(u)
    if (!res.ok) return null
    const c = await res.json()
    const { minLat, minLng, maxLat, maxLng } = c || {}
    if (
      [minLat, minLng, maxLat, maxLng].every((v) => typeof v === 'number') &&
      maxLat > minLat &&
      maxLng > minLng
    ) {
      return [
        [minLat, minLng],
        [maxLat, maxLng]
      ]
    }
  } catch (e) {
    console.warn('Map: Failed to fetch density bounds:', e)
  }
  return null
}

async function fetchOccurrences() {
  const forName = scientificName.value

  if (!forName) {
    console.warn('Map: No scientific name for fetch')
    return
  }

  console.log('Map: Fetching occurrences for:', forName)

  loading.value = true
  occurrences.value = []
  totalCount.value = null
  lumpedNames.value = []
  hasSynonyms.value = false
  matchesTW.value = false
  densityKeys.value = []
  densityBounds.value = null
  hasNameMismatch.value = false // ✅ Reset mismatch flag

  try {
    // ✅ FIXED: Always resolve scope, even if gbifKey is null
    console.log('Map: Resolving taxon scope...')
    const [{ names, keys }, backbone] = await Promise.all([
      resolveGbifTaxonScope(scientificName.value, props.taxonId, {
        rejectHigherRank: true
      }),
      fetchGbifBackboneConcept(scientificName.value)
    ])

    if (scientificName.value !== forName) {
      console.log('Map: Name changed mid-flight, aborting')
      return
    }

    hasSynonyms.value = names.length > 1

    if (!keys.length) {
      console.warn('Map: No keys resolved from taxon scope')
      totalCount.value = 0
      recordRequest(requestStore, 'panel:gbif-map', { url: '', data: null })
      return
    }

    console.log('Map: Resolved keys:', keys, 'Names:', names.length)

    densityKeys.value = keys
    densityBounds.value = await fetchDensityBounds(gbifKey.value || keys[0])

    if (scientificName.value !== forName) {
      console.log('Map: Name changed after bounds fetch, aborting')
      return
    }

    const twEpithets = new Set(names.map(epithetKey))
    const backboneAgrees =
      !!backbone &&
      twEpithets.has(epithetKey(backbone.acceptedName)) &&
      (backbone.synonymNames || []).every((n) => twEpithets.has(epithetKey(n)))

    // Fetch first page
    const first = pageUrl(keys, 0)
    console.log('Map: Fetching first page')

    const res = await fetch(first)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (scientificName.value !== forName) {
      console.log('Map: Name changed after fetch, aborting')
      return
    }

    console.log('Map: Got', data.results?.length, 'results, total:', data.count)

    recordRequest(requestStore, 'panel:gbif-map', { url: first, data })
    totalCount.value = typeof data?.count === 'number' ? data.count : null

    const t0 = tallyOccurrenceNames(data?.results || [], names, CHECKLIST_KEY)

    if (!t0.excluded.length && backboneAgrees) {
      console.log('Map: Exact match found')
      matchesTW.value = true
      return
    }

    // ✅ FIXED: Check if there's a mismatch and relax filtering
    hasNameMismatch.value = t0.excluded.length > 0
    console.log('Map: Name mismatch detected:', hasNameMismatch.value)

    // Marker data: name-filtered points
    // ✅ FIX: If there's a mismatch, use ALL results, not just kept ones
    let kept = hasNameMismatch.value ? data?.results || [] : t0.keptRows

    console.log('Map: Using', kept.length, 'records for markers')

    const excluded = new Map(t0.excluded.map((e) => [e.name, true]))
    const total = data?.count || 0

    if (total > PAGE) {
      const offsets = []
      for (let p = 1; p < MARKER_PAGES && p * PAGE < total; p++) {
        offsets.push(p * PAGE)
      }

      console.log('Map: Fetching additional pages at offsets:', offsets)

      const more = await Promise.all(
        offsets.map((o) =>
          fetch(pageUrl(keys, o))
            .then((r) => (r.ok ? r.json() : null))
            .catch((e) => {
              console.warn(`Map: Failed to fetch page offset ${o}:`, e)
              return null
            })
        )
      )

      if (scientificName.value !== forName) {
        console.log('Map: Name changed during multi-page fetch, aborting')
        return
      }

      for (const d of more) {
        if (!d?.results) continue

        // ✅ FIX: If mismatch, use all results; otherwise filter
        if (hasNameMismatch.value) {
          kept = kept.concat(d.results || [])
        } else {
          const t = tallyOccurrenceNames(d.results, names, CHECKLIST_KEY)
          kept = kept.concat(t.keptRows)
          t.excluded.forEach((e) => excluded.set(e.name, true))
        }
      }
    }

    lumpedNames.value = [...excluded.keys()]
    occurrences.value = kept
      .filter(
        (r) =>
          typeof r.decimalLatitude === 'number' &&
          typeof r.decimalLongitude === 'number'
      )
      .map(toPoint)

    console.log('Map: Final occurrences:', occurrences.value.length)
  } catch (e) {
    console.error('Map: Fetch error:', e)
    if (scientificName.value === forName) {
      occurrences.value = []
      totalCount.value = 0
    }
    recordRequest(requestStore, 'panel:gbif-map', { url: '', data: null })
  } finally {
    if (scientificName.value === forName) {
      loading.value = false
      renderIfReady()
    }
  }
}

async function initMap() {
  if (typeof window === 'undefined' || !mapEl.value || mapInstance) return

  try {
    const L = (await import('leaflet')).default

    mapInstance = L.map(mapEl.value, {
      center: [20, 0],
      zoom: 1,
      minZoom: 1,
      worldCopyJump: true,
      scrollWheelZoom: false,
      attributionControl: true
    })

    setBasemap(L, basemapKey.value)
    renderMap(L)

    await nextTick()
    if (mapInstance) {
      mapInstance.invalidateSize()
    }

    if (typeof ResizeObserver !== 'undefined' && mapEl.value) {
      resizeObs = new ResizeObserver(() => {
        if (mapInstance) {
          mapInstance.invalidateSize()
        }
      })
      resizeObs.observe(mapEl.value)
    }
  } catch (e) {
    console.error('Map: Failed to initialize map:', e)
    mapInstance = null
  }
}

async function renderIfReady() {
  if (!cardVisible.value || !mapEl.value) return

  // Skip rendering overlays if no match, but ensure map exists for later
  if (noGbifMatch.value) {
    if (!mapInstance) {
      try {
        const L = (await import('leaflet')).default
        await initMap()
      } catch (e) {
        console.error('Map: Failed to init map for no-match state:', e)
      }
    }
    return
  }

  try {
    await nextTick()
    if (!mapEl.value) return

    const L = (await import('leaflet')).default

    if (mapInstance) {
      renderMap(L)
      if (mapInstance) {
        mapInstance.invalidateSize()
      }
    } else {
      await initMap()
    }
  } catch (e) {
    console.error('Map: Failed to render map:', e)
  }
}

function clearOverlays() {
  if (markerLayer) {
    markerLayer.remove()
    markerLayer = null
  }
  densityLayers.forEach((l) => {
    try {
      l.remove()
    } catch (e) {
      console.warn('Map: Failed to remove density layer:', e)
    }
  })
  densityLayers = []
}

function renderMap(L) {
  if (!mapInstance) return
  clearOverlays()
  if (mapMode.value === 'density') addDensityLayer(L)
  else renderMarkers(L)
}

function frameDensity(L) {
  if (!mapInstance) return
  if (densityBounds.value) {
    mapInstance.fitBounds(L.latLngBounds(densityBounds.value).pad(0.15), {
      maxZoom: 8
    })
  } else {
    mapInstance.setView([20, 0], 2)
  }
}

function addDensityLayer(L) {
  const keys = densityKeys.value.length
    ? densityKeys.value
    : gbifKey.value
      ? [gbifKey.value]
      : []

  if (!keys.length) {
    console.warn('Map: No keys for density layer')
    return
  }

  console.log('Map: Adding density layers for keys:', keys)

  for (const k of keys) {
    const params = new URLSearchParams({
      style: 'classic.poly',
      bin: 'hex',
      hexPerTile: '70',
      checklistKey: CHECKLIST_KEY,
      srs: 'EPSG:3857',
      taxonKey: String(k)
    })

    try {
      const layer = L.tileLayer(`${GBIF_DENSITY_TILE}?${params}`, {
        attribution: 'Occurrences &copy; <a href="https://www.gbif.org">GBIF</a>',
        maxNativeZoom: 14,
        opacity: 0.9
      })

      if (mapInstance) {
        layer.addTo(mapInstance)
        densityLayers.push(layer)
      }
    } catch (e) {
      console.error(`Map: Failed to add density layer for key ${k}:`, e)
    }
  }

  frameDensity(L)
}

function setBasemap(L, key) {
  if (!mapInstance || !BASEMAPS[key]) {
    console.warn(`Map: Invalid basemap key: ${key}`)
    return
  }

  try {
    if (basemapLayer) {
      basemapLayer.remove()
      basemapLayer = null
    }

    const cfg = BASEMAPS[key]
    basemapLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 18
    })

    if (mapInstance) {
      basemapLayer.addTo(mapInstance)
    }
  } catch (e) {
    console.error(`Map: Failed to set basemap ${key}:`, e)
  }
}

function renderMarkers(L) {
  if (!mapInstance) return

  try {
    markerLayer = L.layerGroup()

    console.log('Map: Rendering', occurrences.value.length, 'markers')

    for (const o of occurrences.value) {
      const m = L.circleMarker([o.lat, o.lng], {
        radius: 4,
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.6,
        className: 'gbif-occ-marker'
      })

      const bits = [
        o.name,
        [o.year, o.country].filter(Boolean).join(' · '),
        `<a href="${GBIF_OCCURRENCE_DETAIL}/${o.key}" target="_blank" rel="noopener noreferrer">GBIF occurrence ${o.key}</a>`
      ].filter(Boolean)

      m.bindPopup(bits.join('<br>'))
      m.addTo(markerLayer)
    }

    if (mapInstance) {
      markerLayer.addTo(mapInstance)
    }

    const pts = occurrences.value.map((o) => [o.lat, o.lng])
    if (pts.length === 1) {
      mapInstance.setView(pts[0], 6)
    } else if (pts.length > 1) {
      mapInstance.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 8 })
    }
  } catch (e) {
    console.error('Map: Failed to render markers:', e)
  }
}

function openExplore() {
  const params = new URLSearchParams()
  if (gbifKey.value) {
    params.set('checklist_key', CHECKLIST_KEY)
    params.set('taxon_key', String(gbifKey.value))
  }
  params.set('has_coordinate', 'true')

  if (mapInstance) {
    const b = mapInstance.getBounds()
    const ring = [
      [b.getWest(), Math.max(-90, b.getSouth())],
      [b.getEast(), Math.max(-90, b.getSouth())],
      [b.getEast(), Math.min(90, b.getNorth())],
      [b.getWest(), Math.min(90, b.getNorth())],
      [b.getWest(), Math.max(-90, b.getSouth())]
    ]
      .map(([lng, lat]) => `${lng} ${lat}`)
      .join(', ')
    params.set('geometry', `POLYGON((${ring}))`)
  }

  window.open(`${GBIF_OCCURRENCE_BASE}?${params}`, '_blank', 'noopener')
}

function destroyMap() {
  try {
    if (resizeObs) {
      resizeObs.disconnect()
      resizeObs = null
    }
    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }
    markerLayer = null
    clearOverlays()
    basemapLayer = null
  } catch (e) {
    console.warn('Map: Error destroying map:', e)
  }
}

// ✅ FIXED: Watch shouldFetchOccurrences instead of gbifKey
watch(
  shouldFetchOccurrences,
  (eligible) => {
    console.log('Map: shouldFetchOccurrences changed:', eligible)

    if (eligible) {
      fetchOccurrences()
    } else {
      destroyMap()
      occurrences.value = []
      totalCount.value = null
      matchesTW.value = false
      densityKeys.value = []
      densityBounds.value = null
    }
  },
  { immediate: true }
)

// ✅ NEW: Watch for viewMode changes independently
watch(viewMode, async (newMode) => {
  console.log('Map: viewMode changed to:', newMode)

  if (!mapInstance || !mapEl.value || noGbifMatch.value) {
    console.log('Map: Skipping render on viewMode change')
    return
  }

  try {
    const L = (await import('leaflet')).default
    console.log('Map: Re-rendering for viewMode change')
    renderMap(L)
    mapInstance.invalidateSize()
  } catch (e) {
    console.error('Map: Failed on viewMode change:', e)
  }
})

watch([cardVisible, mapMode], async ([visible, mode]) => {
  console.log('Map: cardVisible/mapMode changed:', { visible, mode })

  if (!visible) {
    console.log('Map: Card not visible, destroying')
    destroyMap()
    return
  }

  if (noGbifMatch.value) {
    console.log('Map: No match, init empty map only')
    if (!mapInstance && mapEl.value) {
      try {
        const L = (await import('leaflet')).default
        await initMap()
      } catch (e) {
        console.error('Map: Failed to init no-match map:', e)
      }
    }
    return
  }

  await nextTick()
  if (!mapEl.value) return

  try {
    const L = (await import('leaflet')).default

    if (mapInstance) {
      console.log('Map: Re-rendering for mode:', mode)
      renderMap(L)
      mapInstance.invalidateSize()
    } else {
      console.log('Map: Initializing')
      await initMap()
    }
  } catch (e) {
    console.error('Map: Failed to update:', e)
  }
})

watch(basemapKey, async (key) => {
  if (!mapInstance) return
  try {
    const L = (await import('leaflet')).default
    setBasemap(L, key)
  } catch (e) {
    console.error('Map: Failed to change basemap:', e)
  }
})

onBeforeUnmount(() => {
  destroyMap()
})
</script>

<style scoped>
:deep(.gbif-occ-marker) {
  stroke: var(--pp-gbif);
  fill: var(--pp-gbif);
}

.gbif-seg-active {
  background: var(--pp-gbif);
  color: #fff;
}

.gbif-explore-btn {
  background: var(--pp-gbif);
  color: #fff;
  border: 1px solid var(--pp-gbif);
}

.gbif-explore-btn:hover {
  filter: brightness(0.92);
}

.gbif-legend {
  display: inline-block;
  width: 56px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(90deg, #fde68a, #fb923c, #dc2626);
}

.gbif-spinner {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  opacity: 0.6;
  animation: gbif-spin 0.8s linear infinite;
}

@keyframes gbif-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>