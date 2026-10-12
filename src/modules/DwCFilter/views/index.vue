<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="Data"
      title="Specimen & occurrence data"
      subtitle="Find taxa by name, author or where they have been recorded, using Darwin Core records. Open “Records” to see and download the matching occurrences."
    />

    <ClientOnly>
      <VSpinner
        v-if="isLoading && !list.length"
        full-screen
      />
    </ClientOnly>

    <section class="container mx-auto px-4 -mt-8 relative z-10">
      <FilterBar
        v-model="parameters"
        @search="() => loadList()"
        @reset="reset"
      />
    </section>

    <section class="container mx-auto px-4 py-8 sm:py-10">
      <div
        v-if="activeFilters.length"
        class="mb-4 flex flex-wrap items-center gap-2"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Filters</span>
        <button
          v-for="f in activeFilters"
          :key="f.key"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full bg-primary-color/10 dark:bg-secondary-color/10 px-3 py-1 text-xs font-medium text-primary-color dark:text-secondary-color hover:bg-primary-color/20"
          :title="`Remove ${f.label}`"
          @click="removeFilter(f.key)"
        >
          {{ f.label }}: {{ f.value }}
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p class="text-sm text-base-content/70">
          <strong class="text-base-content tabular-nums">{{ pagination.total.toLocaleString('en-US') }}</strong>
          {{ pagination.total === 1 ? 'taxon' : 'taxa' }} with matching records
        </p>
        <div class="flex items-center gap-3">
          <VPagination
            v-model="pagination.page"
            :total="pagination.total"
            :per="pagination.per"
            @update:modelValue="(page) => loadList(page)"
          />
          <DropdownMenu
            :parameters="{ ...parameters, ...wildcardParam }"
            :request="requestData"
          />
        </div>
      </div>

      <p
        v-if="!isLoading && !list.length"
        class="rounded-2xl bg-base-foreground ring-1 ring-base-border/40 p-10 text-center text-base-content/60"
      >
        No taxa match these filters.
      </p>

      <ul
        class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 transition-opacity"
        :class="{ 'opacity-50': isLoading }"
      >
        <li
          v-for="item in list"
          :key="item.id"
          class="flex items-center justify-between gap-3 rounded-xl bg-base-foreground ring-1 ring-base-border/40 px-4 py-3"
        >
          <RouterLink
            :to="{ name: 'otus-id', params: { id: item.id } }"
            class="min-w-0 text-sm text-base-content hover:text-primary-color dark:hover:text-secondary-color [&_i]:italic truncate"
            v-html="item.object_tag"
          />
          <OtuModal
            :otu="item"
            :parameters="{ ...parameters, ...wildcardParam }"
          />
        </li>
      </ul>

      <div class="mt-6 flex justify-center">
        <VPagination
          v-model="pagination.page"
          :total="pagination.total"
          :per="pagination.per"
          @update:modelValue="(page) => loadList(page)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { makeAPIRequest } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { flattenParameters } from '../utils/flattenParameters'
import FilterBar from '../components/FilterBar.vue'
import DropdownMenu from '../components/DropdownMenu.vue'
import OtuModal from '../components/OtuModal/OtuModal.vue'
import PageHeader from '~/pages/components/Home/PageHeader.vue'

const FILTER_LABELS = {
  scientificName: 'Name',
  scientificNameAuthorship: 'Author',
  country: 'Country',
  stateProvince: 'State/Province',
  county: 'County',
  institutionCode: 'Institution',
  typeStatus: 'Type',
  specificEpithet: 'Species epithet',
  infraspecificEpithet: 'Infraspecific epithet'
}

const PER = 50

const route = useRoute()
const router = useRouter()

const list = ref([])
const isLoading = ref(false)
const pagination = ref({ page: 1, total: 0, per: PER })
const parameters = ref({})
const requestData = ref()
const wildcardParam = computed(() => ({
  wildcard_attribute: Object.keys(parameters.value)
}))

const applied = ref({})

const activeFilters = computed(() =>
  Object.entries(applied.value || {})
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([key, value]) => ({
      key,
      value,
      label: FILTER_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)
    }))
)

function removeFilter(key) {
  const { [key]: _, ...rest } = parameters.value
  parameters.value = rest
  loadList()
}

function getPagination(headers) {
  return {
    page: Number(headers['pagination-page']),
    per: Number(headers['pagination-per-page']),
    total: Number(headers['pagination-total'])
  }
}

function setParameters(data = {}) {
  parameters.value = data
}

function setPagination(data = {}) {
  pagination.value = {
    page: Number(data.page) || 1,
    total: 0,
    per: PER
  }
}

function setQuery() {
  router.push({
    query: { ...parameters.value, page: pagination.value.page }
  })
}

function loadList(page = 1) {
  isLoading.value = true

  makeAPIRequest
    .get('/otus/inventory/alphabetical', {
      params: {
        ...flattenParameters({
          dwc_occurrence_query: {
            ...parameters.value,
            ...wildcardParam.value
          }
        }),
        page,
        per: PER
      }
    })
    .then(({ data, headers, request }) => {
      list.value = data
      pagination.value = getPagination(headers)
      applied.value = { ...parameters.value }

      requestData.value = {
        data,
        url: request.responseURL
      }

      setQuery()
    })
    .finally(() => {
      isLoading.value = false
    })
}

function reset() {
  setParameters()
  setPagination()
  setQuery()
  list.value = []
  applied.value = {}
}

onMounted(() => {
  const { page, ...params } = route.query

  setParameters(params)
  setPagination({ page })
  loadList()
})
</script>
