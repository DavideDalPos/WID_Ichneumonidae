<template>
  <VCard>
    <VCardHeader>iNaturalist</VCardHeader>
<VCardContent class="min-h-[6rem]">
      <ClientOnly>
        <VSpinner v-if="isLoading" />
      </ClientOnly>

            <div
        v-if="!isLoading && taxonId === null"
  class="mx-auto my-8 px-2 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-max text-center"
>
        No iNaturalist taxon found
      </div>

<div
  v-if="!isLoading && taxonId !== null && !observations.length"
  class="mx-auto my-8 px-2 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-max text-center"
>
  No iNaturalist taxon found
</div>

 <div class="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
  <div
    v-for="observation in observations"
    :key="observation.id"
  >
    <a
      v-if="observation?.observation_photos[0]"
      :href="`https://www.inaturalist.org/observations/${observation.id}`" 
      target="_blank"
      class="block hover:opacity-80 transition"
      rel="noopener noreferrer"
    >
      <div class="aspect-[3/2] overflow-hidden rounded">
        <img
          :key="observation.observation_photos[0].photo.id"
          :src="observation.observation_photos[0].photo.url.replace('square', 'medium')"
          class="w-full h-full object-cover"
          alt="Observation photo"
        />
      </div>
    </a>
  </div>
</div>
      <VPagination
              v-if="observations.length"
        class="mt-4"
        v-model="pagination.page"
        :total="pagination.total_results"
        :per="pagination.per_page"
        @update:modelValue="
          (value) => {
            loadObservations({ page: value, per_page: perPage })
          }
        "
      />
    </VCardContent>
  </VCard>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const props = defineProps({
  taxon: {
    type: Object,
    required: true
  },

  perPage: {
    type: Number,
    default: 12
  },

  parameters: {
    type: Object,
    default: () => {}
  }
})

const isLoading = ref(false)
const observations = ref([])

/**
 * taxonId states:
 *   undefined = not yet looked up (initial state)
 *   null      = lookup done but taxon not found on iNaturalist
 *   number    = valid iNaturalist taxon ID
 */
const taxonId = ref(undefined)

const pagination = ref({
  page: 1,
  per_page: props.perPage,
  total_results: 0
})

function parseName(expandedName) {
  const subgenusMatch = expandedName.match(/^(\S+)\s+\((\S+)\)(?:\s+(\S+))?$/)
  if (subgenusMatch) {
    return {
      genus: subgenusMatch[1],
      subgenus: subgenusMatch[2],
      epithet: subgenusMatch[3] || null
    }
  }
  const parts = expandedName.trim().split(/\s+/)
  return {
    genus: parts[0],
    subgenus: null,
    epithet: parts[1] || null
  }
}
async function resolveInatTaxonId() {
  const { genus, subgenus, epithet } = parseName(props.taxon.expanded_name)

  if (subgenus && !epithet) {
    // Subgenus page: extract subgenus name from parentheses, verify parent genus
    const { data } = await axios.get('https://api.inaturalist.org/v1/taxa', {
      params: { q: subgenus, rank: 'subgenus', per_page: 10, all_names: true }
    })

    const match = data.results.find((t) => {
      if (t.name.toLowerCase() !== subgenus.toLowerCase()) return false
      // Verify parent genus via ancestors to avoid false matches
      if (t.ancestors?.length) {
        return t.ancestors.some(
          (a) => a.rank === 'genus' && a.name.toLowerCase() === genus.toLowerCase()
        )
      }
      return true // no ancestors returned, trust the name match
    })

    return match ? match.id : null
  }
const plainName = subgenus && epithet ? `${genus} ${epithet}` : props.taxon.expanded_name

  const { data } = await axios.get('https://api.inaturalist.org/v1/taxa', {
    params: { q: plainName, rank: props.taxon.rank, per_page: 10 }
  })

  const match = data.results.find(
    (t) => t.name.toLowerCase() === plainName.toLowerCase()
  )
  return match ? match.id : null
}



function loadObservations(parameters = {}) {
  isLoading.value = true

  // Step 1: resolve the taxon ID first
  axios
    .get(`https://api.inaturalist.org/v1/taxa`, {
      params: {
        q: props.taxon.expanded_name,
        per_page: 1
      }
    })
    .then(({ data }) => {
      const taxonId = data.results[0]?.id
      if (!taxonId) {
        observations.value = []
        pagination.value.total_results = 0
        return
      }

      // Step 2: fetch observations with taxon_id and research grade only
      return axios.get(`https://api.inaturalist.org/v1/observations`, {
        params: {
          taxon_id: taxonId,
          quality_grade: 'research', // only research-grade
          per_page: props.perPage,
          ...parameters
        }
      })
    })
    .then((response) => {
      if (response) {
        const data = response.data
        observations.value = data.results
        pagination.value = {
          page: data.page,
          per_page: data.per_page,
          total_results: data.total_results
        }
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  loadObservations({ per_page: props.perPage })
})
</script>