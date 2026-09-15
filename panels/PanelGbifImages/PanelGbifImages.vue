<template>
  <VCard v-if="images.length">
    <VCardHeader class="flex items-center gap-3">
      <img
        :src="gbifMark"
        alt="GBIF"
        class="h-8 w-auto shrink-0"
      />
      <h2 class="text-md grow">Images</h2>
      <PanelDropdown
        panel-key="panel:gbif-images"
        :menu-options="gbifMenuOptions"
      />
    </VCardHeader>
    <div
      class="relative w-full h-80 overflow-hidden bg-base-muted"
    >
      <img
        :key="currentImage.identifier"
        :src="currentImage.identifier"
        :alt="`Occurrence ${currentImage.occurrenceKey}`"
        class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
        :class="imageLoading || imageError ? 'opacity-0' : 'opacity-100'"
        loading="lazy"
        @load="onImageLoad"
        @error="onImageError"
      />

      <div
        v-if="imageLoading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <VSpinner
          logo-class="w-6 h-6"
          legend=""
        />
      </div>

      <p
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center text-xs opacity-70"
      >
        Image failed to load
      </p>

      <button
        v-if="images.length > 1"
        type="button"
        @click="prevImage"
        aria-label="Previous image"
        class="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-base-background/80 border border-base-border shadow hover:bg-base-foreground"
      >
        ‹
      </button>
      <button
        v-if="images.length > 1"
        type="button"
        @click="nextImage"
        aria-label="Next image"
        class="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-base-background/80 border border-base-border shadow hover:bg-base-foreground"
      >
        ›
      </button>

      <a
        :href="currentImageOccurrenceUrl"
        target="_blank"
        rel="noopener"
        class="absolute bottom-2 right-2 px-2 py-1 text-xs rounded bg-base-background/80 border border-base-border shadow hover:bg-base-foreground"
      >
        See details on GBIF.org
      </a>
    </div>

    <p
      class="px-5 py-2 text-xs opacity-70 flex justify-between gap-2 rounded-b"
    >
      <span class="truncate">
        {{ currentImage.rightsHolder || 'Unknown rights holder' }}
        <template v-if="currentImageLicense">
          <span class="opacity-60 mx-1">·</span>
          <a
            :href="currentImageLicense.url"
            target="_blank"
            rel="noopener"
            class="underline"
          >
            {{ currentImageLicense.label }}
          </a>
        </template>
      </span>
      <span class="shrink-0">
        {{ imageIndex + 1 }} / {{ images.length }}
        <a
          v-if="galleryUrl !== '#'"
          :href="galleryUrl"
          target="_blank"
          rel="noopener"
          class="ml-1 underline"
        >
          all
        </a>
      </span>
    </p>

    <!-- ✅ NEW: Use v-html to render italicized caption -->
    <p
      v-if="scopeNote"
      class="px-5 pb-2 text-xs opacity-55"
      v-html="scopeNote"
    >
    </p>
  </VCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  useGbifMatch,
  deriveScientificName,
  recordRequest,
  gbifMenuOptions,
  CHECKLIST_KEY,
  GBIF_OCCURRENCE_BASE,
  GBIF_OCCURRENCE_DETAIL
} from '../_gbifShared/useGbifMatch'
import gbifMark from '../_gbifShared/gbif-mark.svg'
import {
  partitionByName,
  scopeCaption
} from '../_gbifShared/gbifNameFilter'
import { resolveGbifTaxonScope } from '../_gbifShared/gbifTaxonScope'
import PanelDropdown from '@/modules/otus/components/Panel/PanelDropdown.vue'
import { useOtuPageRequestStore } from '@/modules/otus/store/request'

const GBIF_OCCURRENCE_SEARCH = 'https://api.gbif.org/v1/occurrence/search'
const FETCH_LIMIT = 100
const IMAGE_LIMIT = 20
const IMAGE_RANKS = new Set([
  'FAMILY',
  'SUBFAMILY',
  'INFRAFAMILY',
  'SUPERTRIBE',
  'TRIBE',
  'SUBTRIBE',
  'INFRATRIBE',
  'SUPERGENUS',
  'GENUS',
  'SUBGENUS',
  'INFRAGENUS',
  'SECTION',
  'SUBSECTION',
  'SERIES',
  'SUBSERIES',
  'SPECIES_AGGREGATE',
  'SPECIES',
  'SUBSPECIES',
  'INFRASUBSPECIFIC_NAME',
  'VARIETY',
  'SUBVARIETY',
  'FORM',
  'SUBFORM',
  'CULTIVAR',
  'CULTIVAR_GROUP',
  'CONVARIETY',
  'GREX',
  'STRAIN',
  'PATHOVAR',
  'BIOVAR',
  'CHEMOVAR',
  'MORPHOVAR',
  'PHAGOVAR',
  'SEROVAR',
  'FORMA_SPECIALIS',
  'ABERRATION',
  'RACE',
  'NATIO',
  'PROLES'
])

const props = defineProps({
  otuId: { type: [Number, String], required: true },
  taxonId: { type: [Number, String], required: true },
  taxon: { type: Object, default: undefined },
  otu: { type: Object, default: undefined }
})

const scientificName = computed(() => deriveScientificName(props.taxon, props.otu))
const { match, targetUsage, gbifKey, loading: matchLoading } = useGbifMatch(scientificName)

const taxonDisplayName = computed(
  () => match.value?.usage?.canonicalName || scientificName.value
)

const images = ref([])
const imageIndex = ref(0)
const imageLoading = ref(false)
const imageError = ref(false)
const hasImageMismatch = ref(false)

const scopeShown = ref(null)
const scopeTotal = ref(null)
const lumpedNames = ref([])
const hasSynonyms = ref(false)

// ✅ UPDATED: Italicize all species names in caption
const scopeNote = computed(() => {
  if (scopeShown.value == null || !lumpedNames.value.length) return ''

  const caption = scopeCaption({
    shown: scopeShown.value,
    total: scopeTotal.value,
    lumpedNames: lumpedNames.value,
    noun: `imaged occurrence${scopeShown.value === 1 ? '' : 's'}`,
    taxonName: taxonDisplayName.value,
    includesSynonyms: hasSynonyms.value
  })

  // ✅ UPDATED: Italicize all species names
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

// ✅ FIX: Check if we should attempt fetch (not dependent on gbifKey)
const shouldFetchImages = computed(() => {
  // Skip if still loading match info
  if (matchLoading.value) {
    console.log('Images: Still loading match')
    return false
  }

  // HIGHERRANK = name absent from CoL, silently resolved to its genus
  if (match.value?.diagnostics?.matchType === 'HIGHERRANK') {
    console.log('Images: HIGHERRANK match type, skipping')
    return false
  }

  // Check if rank is valid for images
  const rank = targetUsage.value?.rank
  const hasValidRank = rank ? IMAGE_RANKS.has(rank) : false

  if (!hasValidRank) {
    console.log('Images: Invalid rank:', rank)
    return false
  }

  // Must have a scientific name
  if (!scientificName.value) {
    console.log('Images: No scientific name')
    return false
  }

  console.log('Images: Should fetch - valid rank and name')
  return true
})

const currentImage = computed(() => images.value[imageIndex.value])

const currentImageOccurrenceUrl = computed(() =>
  currentImage.value?.occurrenceKey
    ? `${GBIF_OCCURRENCE_DETAIL}/${currentImage.value.occurrenceKey}`
    : '#'
)

const currentImageLicense = computed(() =>
  formatLicense(currentImage.value?.license)
)

// ✅ FIX: Handle null gbifKey gracefully
const galleryUrl = computed(() => {
  return gbifKey.value
    ? `${GBIF_OCCURRENCE_BASE}?taxonKey=${gbifKey.value}&view=gallery`
    : '#'
})

// ✅ NEW: Helper to escape HTML special characters
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

// ✅ NEW: Helper to escape regex special characters
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\__CODE_BLOCK_0__')
}

function formatLicense(url) {
  if (!url) return null

  const cc = url.match(/creativecommons\.org\/licenses\/([a-z-]+)\/([0-9.]+)/i)
  if (cc) return { label: `CC ${cc[1].toUpperCase()} ${cc[2]}`, url }

  const cc0 = url.match(/creativecommons\.org\/publicdomain\/zero\/([0-9.]+)/i)
  if (cc0) return { label: `CC0 ${cc0[1]}`, url }

  const pdm = url.match(/creativecommons\.org\/publicdomain\/mark\/([0-9.]+)/i)
  if (pdm) return { label: `Public Domain ${pdm[1]}`, url }

  return { label: url.replace(/^https?:\/\//, ''), url }
}

const requestStore = useOtuPageRequestStore()

async function fetchImages() {
  const forName = scientificName.value

  if (!forName) {
    console.warn('Images: No scientific name')
    return
  }

  console.log('Images: Fetching for:', forName)

  images.value = []
  imageIndex.value = 0
  scopeShown.value = null
  scopeTotal.value = null
  lumpedNames.value = []
  hasSynonyms.value = false
  hasImageMismatch.value = false

  try {
    console.log('Images: Resolving taxon scope for:', forName)
    const { names, keys } = await resolveGbifTaxonScope(
      scientificName.value,
      props.taxonId,
      { rejectHigherRank: true }
    )

    if (scientificName.value !== forName) {
      console.log('Images: Name changed, aborting')
      return
    }

    hasSynonyms.value = names.length > 1

    if (!keys.length) {
      console.warn('Images: No keys resolved')
      recordRequest(requestStore, 'panel:gbif-images', { url: '', data: null })
      return
    }

    console.log('Images: Resolved keys:', keys, 'Names:', names.length)

    const url = new URL(GBIF_OCCURRENCE_SEARCH)
    url.searchParams.set('checklistKey', CHECKLIST_KEY)
    keys.forEach((k) => url.searchParams.append('taxonKey', k))
    url.searchParams.set('mediaType', 'StillImage')
    url.searchParams.set('limit', String(FETCH_LIMIT))
    const requestUrl = url.toString()

    console.log('Images: Request URL:', requestUrl)

    const res = await fetch(requestUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()

    if (scientificName.value !== forName) {
      console.log('Images: Name changed during fetch, aborting')
      return
    }

    console.log('Images: Got', data.results?.length, 'results, total count:', data.count)

    const { kept, lumpedNames: lumped } = partitionByName(
      data?.results || [],
      names,
      CHECKLIST_KEY
    )

    console.log('Images: Kept after filter:', kept.length, 'Lumped names:', lumped.length)

    // ✅ FIXED: Check if there's a mismatch and relax filtering
    hasImageMismatch.value = lumped.length > 0 && kept.length === 0
    console.log('Images: Name mismatch detected:', hasImageMismatch.value)

    // ✅ FIX: If there's a mismatch, use ALL results, not just kept ones
    let resultsToUse = hasImageMismatch.value ? data?.results || [] : kept

    console.log('Images: Using', resultsToUse.length, 'records for images')

    lumpedNames.value = lumped

    const withImg = resultsToUse.filter((r) =>
      (r.media || []).some((m) => !m.type || m.type === 'StillImage')
    )

    console.log('Images: With images:', withImg.length)

    scopeShown.value = withImg.length
    scopeTotal.value = typeof data?.count === 'number' ? data.count : null

    const seen = new Set()
    const flat = []

    for (const rec of withImg) {
      for (const m of rec.media || []) {
        if (m?.type && m.type !== 'StillImage') continue

        const id = m?.identifier
        if (!id || seen.has(id)) continue

        seen.add(id)
        flat.push({
          identifier: id.replace(/^http:\/\//i, 'https://'),
          occurrenceKey: rec.key,
          rightsHolder: m.rightsHolder || rec.rightsHolder || m.creator || '',
          license: m.license || rec.license || ''
        })

        if (flat.length >= IMAGE_LIMIT) break
      }

      if (flat.length >= IMAGE_LIMIT) break
    }

    console.log('Images: Final array:', flat.length)

    images.value = flat
    recordRequest(requestStore, 'panel:gbif-images', { url: requestUrl, data })
  } catch (e) {
    console.error('Images: Fetch error:', e)
    if (scientificName.value === forName) {
      images.value = []
    }
    recordRequest(requestStore, 'panel:gbif-images', {
      url: '',
      data: null,
      error: e.message
    })
  }
}

function prevImage() {
  if (!images.value.length) return
  imageIndex.value =
    (imageIndex.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  if (!images.value.length) return
  imageIndex.value = (imageIndex.value + 1) % images.value.length
}

function onImageLoad() {
  imageLoading.value = false
  imageError.value = false
}

function onImageError() {
  imageLoading.value = false
  imageError.value = true
}

watch(
  shouldFetchImages,
  (eligible) => {
    console.log('Images: shouldFetchImages watch triggered:', eligible)
    if (eligible) {
      fetchImages()
    } else {
      images.value = []
      imageIndex.value = 0
    }
  },
  { immediate: true }
)

watch(
  () => currentImage.value?.identifier,
  (val) => {
    if (val) {
      imageLoading.value = true
      imageError.value = false
    }
  },
  { immediate: true }
)
</script>