<template>
  <ul
    v-if="items.length"
    class="flex flex-wrap items-center gap-2 text-sm"
  >
    <li class="text-white/60 mr-1">Past 7 days:</li>
    <li
      v-for="s in items"
      :key="s.label"
      class="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1.5 text-white/80"
    >
      <strong class="text-white tabular-nums">{{ s.value }}</strong>
      {{ s.label }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { makeAPIRequest } from '@/utils/request'

// "Past week" counters from the TaxonWorks /stats endpoint
const LABELS = {
  'Past week: New taxon names': 'new names',
  'Past week: New project sources': 'new references',
  'Past week: New citations': 'new citations',
  'Past week: New images': 'new images',
  'Past week: New collection objects': 'new specimens'
}

const items = ref([])

makeAPIRequest('/stats')
  .then(({ data }) => {
    const meta = data?.metadata || {}
    items.value = Object.entries(LABELS)
      .filter(([k]) => Number(meta[k]) > 0)
      .map(([k, label]) => ({ value: meta[k], label }))
  })
  .catch(() => {})
</script>
