<template>
  <VCard>
    <VCardHeader class="text-gray-800">Observations (Research Grade)</VCardHeader>
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
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  taxon: {
    type: Object,
    required: true
  },

  perPage: {
    type: Number,
    default: 60
  },

  parameters: {
    type: Object,
    default: () => {}
  }
})

const isLoading = ref(false)
const observations = ref([])
const pagination = ref({
  page: 1,
  per_page: props.perPage,
  total_results: 0
})

const taxonName = computed(() =>
  props.taxon.expanded_name.replace(/\s*\([^)]+\)/g, '')
)

function loadObservations(params = {}) {
  isLoading.value = true

  axios
    .get(`https://api.inaturalist.org/v1/observations`, {
      params: {
        taxon_name: taxonName.value,
        ...params,
        ...props.parameters
      }
    })
    .then(({ data }) => {
      observations.value = data.results
      pagination.value = {
        page: data.page,
        per_page: data.per_page,
        total_results: data.total_results
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