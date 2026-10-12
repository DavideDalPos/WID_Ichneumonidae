<template>
  <div>
    <!-- Summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in summary"
        :key="card.label"
        class="rounded-2xl bg-base-foreground p-5 ring-1 ring-base-border/40"
      >
        <div class="text-sm text-base-content/60">{{ card.label }}</div>
        <div class="mt-1 text-3xl font-bold tracking-tight tabular-nums text-base-content">
          <span
            v-if="card.value === null"
            class="wid-skeleton inline-block h-8 w-20 rounded"
          />
          <template v-else>{{ card.value }}</template>
        </div>
        <div
          v-if="card.note"
          class="mt-1 text-xs text-base-content/50"
        >
          {{ card.note }}
        </div>
        <div
          v-if="card.progress !== undefined"
          class="mt-3 h-1.5 rounded-full bg-base-muted/60 overflow-hidden"
        >
          <div
            class="h-full rounded-full bg-secondary-color transition-all duration-700"
            :style="{ width: card.progress + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="mt-8 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
      <div class="relative w-full lg:max-w-xs">
        <HomeIcon
          name="search"
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50 pointer-events-none"
        />
        <input
          v-model="query"
          type="search"
          placeholder="Filter subfamilies…"
          aria-label="Filter subfamilies by name"
          class="w-full rounded-lg bg-base-foreground ring-1 ring-base-border/60 focus:ring-2 focus:ring-primary-color outline-none border-0 py-2.5 pl-9 pr-3 text-sm text-base-content"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div
          class="inline-flex flex-wrap rounded-lg bg-base-foreground ring-1 ring-base-border/60 p-1 text-sm"
          role="group"
          aria-label="Filter by curation status"
        >
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            class="px-3 py-1.5 rounded-md font-medium transition-colors"
            :class="
              statusFilter === opt.value
                ? 'bg-primary-color text-primary-content'
                : 'text-base-content/70 hover:text-base-content'
            "
            :aria-pressed="statusFilter === opt.value"
            @click="statusFilter = opt.value"
          >
            {{ opt.label }}
            <span class="ml-1 opacity-70 tabular-nums">{{ opt.count }}</span>
          </button>
        </div>

        <label class="flex items-center gap-2 text-sm text-base-content/70">
          <span class="sr-only sm:not-sr-only">Sort by</span>
          <select
            v-model="sortKey"
            class="rounded-lg bg-base-foreground ring-1 ring-base-border/60 border-0 py-2 pl-3 pr-8 text-sm text-base-content focus:ring-2 focus:ring-primary-color"
          >
            <option value="name">Name (A–Z)</option>
            <option value="species">Valid species</option>
            <option value="genera">Valid genera</option>
            <option value="progress">Curation progress</option>
          </select>
        </label>
      </div>
    </div>

    <p
      v-if="error"
      class="mt-4 text-sm text-amber-700 dark:text-amber-300"
    >
      Live counts could not be loaded from TaxonWorks right now. Curation
      status is still shown.
    </p>

    <!-- Column headings (desktop) -->
    <div
      class="hidden lg:grid wid-cols gap-x-4 mt-6 px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50"
      aria-hidden="true"
    >
      <span>Subfamily</span>
      <span class="text-right">Genera</span>
      <span>Valid species</span>
      <span class="text-right">All names</span>
      <span class="text-right">Specimens</span>
      <span class="text-right">Images</span>
      <span>Curation</span>
      <span />
    </div>

    <!-- Rows -->
    <ul class="mt-3 lg:mt-0 flex flex-col gap-2">
      <li
        v-for="row in rows"
        :key="row.name"
        class="rounded-xl bg-base-foreground ring-1 ring-base-border/40 overflow-hidden transition-shadow"
        :class="{ 'shadow-md ring-primary-color/40': open[row.name] }"
      >
        <button
          type="button"
          class="w-full text-left p-4 lg:px-5 lg:py-3.5 grid wid-cols-mobile lg:wid-cols items-center gap-x-4 gap-y-2 hover:bg-base-muted/20 transition-colors"
          :aria-expanded="!!open[row.name]"
          @click="toggle(row.name)"
        >
          <!-- Name -->
          <span class="min-w-0 col-span-3 lg:col-span-1">
            <span class="block font-semibold text-base-content truncate">{{ row.name }}</span>
            <span class="block text-xs text-base-content/50 truncate">{{ row.author || ' ' }}</span>
          </span>

          <!-- Genera -->
          <span class="lg:text-right">
            <span class="lg:hidden block text-[11px] uppercase tracking-wide text-base-content/50">Genera</span>
            <Num :value="row.genera" />
          </span>

          <!-- Species with relative bar -->
          <span>
            <span class="lg:hidden block text-[11px] uppercase tracking-wide text-base-content/50">Species</span>
            <span class="flex items-center gap-2">
              <Num
                :value="row.species"
                class="w-12 lg:text-right"
              />
              <span class="hidden lg:block flex-1 h-1.5 rounded-full bg-base-muted/50 overflow-hidden">
                <span
                  class="block h-full rounded-full bg-primary-color/70"
                  :style="{ width: speciesShare(row) + '%' }"
                />
              </span>
            </span>
          </span>

          <span class="lg:text-right">
            <span class="lg:hidden block text-[11px] uppercase tracking-wide text-base-content/50">Names</span>
            <Num :value="row.names" />
          </span>
          <span class="hidden lg:block text-right"><Num :value="row.specimens" /></span>
          <span class="hidden lg:block text-right"><Num :value="row.images" /></span>

          <!-- Curation -->
          <span class="col-span-3 lg:col-span-1 flex items-center gap-3">
            <span
              class="flex gap-1 flex-1"
              aria-hidden="true"
            >
              <span
                v-for="group in CURATION_GROUPS"
                :key="group.key"
                class="flex-1 h-2 rounded-full bg-base-muted/60 overflow-hidden"
                :title="`${group.label}: ${groupProgress(row.curation, group)}%`"
              >
                <span
                  class="block h-full rounded-full"
                  :class="barColor(groupProgress(row.curation, group))"
                  :style="{ width: groupProgress(row.curation, group) + '%' }"
                />
              </span>
            </span>
            <span
              class="text-xs font-semibold tabular-nums w-9 text-right"
              :class="pctColor(row.progress)"
            >
              {{ row.progress }}%
            </span>
          </span>

          <HomeIcon
            name="arrow"
            class="hidden lg:block h-4 w-4 text-base-content/40 transition-transform justify-self-end"
            :class="open[row.name] ? 'rotate-90' : ''"
          />
        </button>

        <!-- Details -->
        <div
          v-if="open[row.name]"
          class="border-t border-base-border/30 bg-base-background/60 p-4 lg:p-5"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-base-content/70 lg:hidden">
              <span>Specimens: <Num :value="row.specimens" /></span>
              <span>Images: <Num :value="row.images" /></span>
            </div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusPill(row.status)"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-current" />
              {{ row.status }}
            </span>
            <div class="flex gap-2 ml-auto">
              <RouterLink
                v-if="row.link"
                :to="row.link"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-base-border hover:bg-base-muted/40 text-base-content"
              >
                Overview
              </RouterLink>
              <RouterLink
                v-if="row.taxonLink"
                :to="row.taxonLink"
                class="inline-flex items-center gap-1.5 rounded-lg bg-primary-color px-3 py-2 text-sm font-semibold text-primary-content hover:opacity-90"
              >
                Open taxon page
                <HomeIcon
                  name="arrow"
                  class="h-4 w-4"
                />
              </RouterLink>
            </div>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div
              v-for="group in CURATION_GROUPS"
              :key="group.key"
              class="rounded-lg bg-base-foreground ring-1 ring-base-border/40 p-3"
            >
              <div class="flex items-center justify-between text-sm font-semibold text-base-content">
                {{ group.label }}
                <span
                  class="text-xs tabular-nums"
                  :class="pctColor(groupProgress(row.curation, group))"
                  >{{ groupProgress(row.curation, group) }}%</span
                >
              </div>
              <ul class="mt-2 space-y-1.5">
                <li
                  v-for="(label, key) in group.items"
                  :key="key"
                  class="flex items-start gap-2 text-xs text-base-content/75"
                >
                  <StateDot :state="taskState(row.curation?.[group.key]?.[key])" />
                  {{ label }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <p
      v-if="!rows.length"
      class="mt-6 text-center text-base-content/60"
    >
      No subfamilies match your filters.
    </p>

    <!-- Legend -->
    <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-base-content/60">
      <span class="flex items-center gap-1.5"><StateDot state="done" /> Complete</span>
      <span class="flex items-center gap-1.5"><StateDot state="progress" /> In progress</span>
      <span class="flex items-center gap-1.5"><StateDot state="todo" /> Not started</span>
      <span>
        Curation bars, left to right:
        {{ CURATION_GROUPS.map((g) => g.label).join(' · ') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, h, reactive, ref } from 'vue'
import HomeIcon from '../Home/HomeIcon.vue'
import { useSubfamilyStats } from './useSubfamilyStats.js'
import {
  CURATION_GROUPS,
  groupProgress,
  itemProgress,
  statusFromProgress,
  taskState
} from './curation.js'

const props = defineProps({
  items: { type: Array, required: true }
})

const { stats, loading, error } = useSubfamilyStats()

/* Small presentational helpers */
const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—')

const Num = (p) =>
  p.value === null || p.value === undefined
    ? loading.value
      ? h('span', { class: 'wid-skeleton inline-block h-4 w-10 rounded align-middle' })
      : h('span', { class: 'text-base-content/40' }, '—')
    : h('span', { class: 'tabular-nums text-sm text-base-content' }, fmt(p.value))
Num.props = ['value']

const StateDot = (p) => {
  const map = {
    done: ['bg-emerald-500 text-white', '✓'],
    progress: ['bg-amber-400 text-amber-950', '…'],
    todo: ['bg-base-muted text-base-content/50', '–']
  }
  const [cls, glyph] = map[p.state]
  return h(
    'span',
    {
      class: `inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none ${cls}`,
      'aria-label': p.state === 'done' ? 'Complete' : p.state === 'progress' ? 'In progress' : 'Not started'
    },
    glyph
  )
}
StateDot.props = ['state']

const barColor = (p) => (p >= 100 ? 'bg-emerald-500' : p > 0 ? 'bg-amber-400' : 'bg-transparent')
const pctColor = (p) =>
  p >= 100 ? 'text-emerald-600 dark:text-emerald-400' : p > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-base-content/40'
const statusPill = (s) =>
  s === 'Complete'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
    : s === 'In progress'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
      : 'bg-base-muted text-base-content/70'

/* Merge curation data (local files) with live counts (TaxonWorks) */
const merged = computed(() => {
  const curationByName = Object.fromEntries(props.items.map((i) => [i.id, i]))
  const names = new Set([...Object.keys(curationByName), ...Object.keys(stats.value)])

  return [...names].map((name) => {
    const curation = curationByName[name] || {}
    const live = stats.value[name] || {}
    const progress = itemProgress(curation)
    return {
      name,
      curation,
      author: live.author || '',
      genera: live.genera ?? null,
      species: live.species ?? null,
      names: live.names ?? null,
      specimens: live.specimens ?? null,
      images: live.images ?? null,
      progress,
      status: statusFromProgress(progress),
      link: curation.link || '',
      taxonLink: live.otuId ? `/otus/${live.otuId}/overview` : curation.widLink || ''
    }
  })
})

const maxSpecies = computed(() => Math.max(1, ...merged.value.map((r) => r.species || 0)))
const speciesShare = (row) => Math.round(((row.species || 0) / maxSpecies.value) * 100)

/* Filters & sorting */
const query = ref('')
const statusFilter = ref('all')
const sortKey = ref('name')

const statusOptions = computed(() => {
  const c = (s) => merged.value.filter((r) => r.status === s).length
  return [
    { value: 'all', label: 'All', count: merged.value.length },
    { value: 'Complete', label: 'Complete', count: c('Complete') },
    { value: 'In progress', label: 'In progress', count: c('In progress') },
    { value: 'Not started', label: 'Not started', count: c('Not started') }
  ]
})

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = merged.value.filter(
    (r) =>
      (!q || r.name.toLowerCase().includes(q)) &&
      (statusFilter.value === 'all' || r.status === statusFilter.value)
  )
  const by = sortKey.value
  return list.sort((a, b) => {
    if (by === 'name') return a.name.localeCompare(b.name)
    return (b[by] ?? -1) - (a[by] ?? -1) || a.name.localeCompare(b.name)
  })
})

/* Expand / collapse */
const open = reactive({})
const toggle = (name) => (open[name] = !open[name])

/* Summary cards */
const sum = (key) => {
  const vals = merged.value.map((r) => r[key])
  if (loading.value && vals.every((v) => v === null)) return null
  return vals.reduce((s, v) => s + (v || 0), 0)
}

const overallProgress = computed(() => {
  const list = merged.value
  return list.length ? Math.round(list.reduce((s, r) => s + r.progress, 0) / list.length) : 0
})

const summary = computed(() => {
  const species = sum('species')
  const genera = sum('genera')
  return [
    { label: 'Subfamilies', value: merged.value.length, note: 'Recognised in WID' },
    { label: 'Valid genera', value: genera === null ? null : fmt(genera), note: 'Live from TaxonWorks' },
    { label: 'Valid species', value: species === null ? null : fmt(species), note: 'Live from TaxonWorks' },
    {
      label: 'Overall curation',
      value: `${overallProgress.value}%`,
      progress: overallProgress.value
    }
  ]
})
</script>

<style scoped>
.wid-cols-mobile {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:wid-cols,
  .wid-cols {
    grid-template-columns:
      minmax(10rem, 1.6fr) 4.5rem minmax(8rem, 1.6fr) 5rem 5.5rem 4.5rem
      minmax(9rem, 1.4fr) 1rem;
  }
}

.wid-skeleton {
  background: linear-gradient(90deg, rgba(var(--color-base-muted), 0.6), rgba(var(--color-base-muted), 1), rgba(var(--color-base-muted), 0.6));
  background-size: 200% 100%;
  animation: wid-shimmer 1.2s infinite linear;
}

@keyframes wid-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
</style>
