<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="Literature"
      title="Bibliography"
      subtitle="Search the references in WID by any part of the citation, by author or by publication year. Open “Linked taxa” to see the names cited in each work."
    />

    <ClientOnly>
      <VSpinner
        v-if="isLoading && !list.length"
        full-screen
      />
    </ClientOnly>

    <section class="container mx-auto px-4 -mt-8 relative z-10">
      <form
        class="rounded-2xl bg-base-foreground p-5 sm:p-6 ring-1 ring-base-border/40 shadow-xl shadow-black/5 grid gap-4 lg:grid-cols-12 items-end"
        @submit.prevent="() => loadList()"
      >
        <label class="lg:col-span-5 block">
          <span class="block text-xs font-semibold uppercase tracking-wider text-base-content/55 mb-1.5">Anywhere in the citation</span>
          <span class="relative block">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/45 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z"
              />
            </svg>
            <input
              v-model="parameters.query_term"
              type="search"
              placeholder="Title, journal, genus, keyword…"
              class="wid-input pl-9"
            />
          </span>
        </label>

        <label class="lg:col-span-3 block">
          <span class="block text-xs font-semibold uppercase tracking-wider text-base-content/55 mb-1.5">Author(s)</span>
          <input
            v-model="parameters.author"
            type="search"
            placeholder="e.g. Townes"
            class="wid-input"
          />
        </label>

        <div class="lg:col-span-4">
          <span class="flex justify-between text-xs font-semibold uppercase tracking-wider text-base-content/55 mb-1.5">
            Published
            <span class="normal-case tracking-normal font-medium text-base-content/70 tabular-nums"
              >{{ parameters.year_start }} – {{ parameters.year_end }}</span
            >
          </span>
          <div class="flex items-center gap-2">
            <YearPicker
              v-model="parameters.year_start"
              :min="MIN_YEAR"
              :max="MAX_YEAR"
            />
            <VSlider
              class="flex-1"
              :min="MIN_YEAR"
              :max="MAX_YEAR"
              v-model:start="parameters.year_start"
              v-model:end="parameters.year_end"
            />
            <YearPicker
              v-model="parameters.year_end"
              :min="MIN_YEAR"
              :max="MAX_YEAR"
            />
          </div>
        </div>

        <div class="lg:col-span-12 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-lg bg-primary-color px-5 py-2.5 text-sm font-semibold text-primary-content hover:opacity-90"
          >
            Search
          </button>
          <button
            type="button"
            class="rounded-lg px-4 py-2.5 text-sm font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40"
            @click="() => reset()"
          >
            Reset
          </button>
          <span class="ml-auto text-xs text-base-content/50 hidden sm:inline">Quick range:</span>
          <button
            v-for="r in QUICK_RANGES"
            :key="r.label"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-base-border/60 text-base-content/70 hover:bg-base-muted/40"
            @click="setRange(r)"
          >
            {{ r.label }}
          </button>
        </div>
      </form>
    </section>

    <section class="container mx-auto px-4 py-8 sm:py-10">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p class="text-sm text-base-content/70">
          <strong class="text-base-content tabular-nums">{{ pagination.total.toLocaleString('en-US') }}</strong>
          {{ pagination.total === 1 ? 'reference' : 'references' }}
          <span v-if="pagination.total > pagination.per">
            · page {{ pagination.page }} of {{ Math.ceil(pagination.total / pagination.per) }}</span
          >
        </p>
        <div class="flex items-center gap-3">
          <VPagination
            v-model="pagination.page"
            :total="pagination.total"
            :per="pagination.per"
            @update:modelValue="(page) => loadList(page)"
          />
          <DropdownMenu :request="requestData" />
        </div>
      </div>

      <p
        v-if="!isLoading && !list.length"
        class="rounded-2xl bg-base-foreground ring-1 ring-base-border/40 p-10 text-center text-base-content/60"
      >
        No references match these filters.
      </p>

      <ol
        class="flex flex-col gap-3 transition-opacity"
        :class="{ 'opacity-50': isLoading }"
      >
        <li
          v-for="item in list"
          :key="item.id"
          class="flex gap-4 rounded-xl bg-base-foreground ring-1 ring-base-border/40 p-4 sm:p-5"
        >
          <span
            class="hidden sm:flex flex-shrink-0 h-12 w-14 items-center justify-center rounded-lg bg-primary-color/10 text-primary-color dark:bg-secondary-color/10 dark:text-secondary-color text-sm font-bold tabular-nums"
          >
            {{ item.year || '—' }}
          </span>
          <div class="min-w-0 flex-1">
            <p
              class="text-sm leading-relaxed text-base-content/85 [&_i]:italic [&_a]:break-all"
              v-html="convertUrlsToLinks(item.cached)"
            />
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <OtuModal
                :source-id="item.id"
                :label="item.cached"
              />
              <span
                v-if="item.year"
                class="sm:hidden text-xs text-base-content/50"
                >{{ item.year }}</span
              >
            </div>
          </div>
        </li>
      </ol>

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
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { makeAPIRequest } from '@/utils'
import { getPagination, convertUrlsToLinks } from '../utils'
import DropdownMenu from '../components/DropdownMenu.vue'
import YearPicker from '../components/YearPicker.vue'
import VSlider from '../components/VSlider.vue'
import OtuModal from '../components/OtuModal.vue'
import PageHeader from '~/pages/components/Home/PageHeader.vue'

const PER = 50
const MIN_YEAR = 1650
const MAX_YEAR = new Date().getFullYear()

const QUICK_RANGES = [
  { label: 'Last 5 years', start: MAX_YEAR - 4, end: MAX_YEAR },
  { label: 'Since 2000', start: 2000, end: MAX_YEAR },
  { label: 'All years', start: MIN_YEAR, end: MAX_YEAR }
]

function setRange(r) {
  parameters.value.year_start = r.start
  parameters.value.year_end = r.end
  loadList()
}

const route = useRoute()
const router = useRouter()

const parameters = ref({})
const list = ref([])
const isLoading = ref(false)
const pagination = ref({ page: 1, total: 0, per: PER })
const requestData = ref()

async function loadList(page = 1) {
  isLoading.value = true

  makeAPIRequest
    .get('/sources', {
      params: {
        in_project: true,
        page,
        per: pagination.value.per,
        ...parameters.value
      }
    })
    .then(({ data, headers, request }) => {
      pagination.value = getPagination(headers)
      list.value = data

      requestData.value = {
        data,
        url: request.responseURL
      }

      setQuery()
    })
    .finally(() => {
      isLoading.value = false
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

function setParameters(data = {}) {
  parameters.value = {
    year_start: Number(data.year_start || 1650),
    year_end: Number(data.year_end || MAX_YEAR),
    author: data.author,
    query_term: data.query_term
  }
}

function setPagination(data = {}) {
  pagination.value = {
    page: Number(data.page) || 1,
    total: 0,
    per: PER
  }
}

function reset() {
  setParameters()
  setPagination()
  loadList()
}

function setQuery() {
  router.push({
    query: { ...parameters.value, page: pagination.value.page }
  })
}

onBeforeMount(() => {
  setParameters(route.query)
  setPagination(route.query)
  loadList(pagination.value.page)
})
</script>

<style scoped>
.wid-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 0;
  background: rgb(var(--color-base-background));
  box-shadow: inset 0 0 0 1px rgba(var(--color-base-border), 0.7);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(var(--color-base-content));
}

.wid-input.pl-9 {
  padding-left: 2.25rem;
}

.wid-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgb(var(--color-primary));
}
</style>
