<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="rounded-full bg-white/10 ring-1 ring-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-secondary-color"
      >
        {{ store.taxon.rank || 'Combination' }}
      </span>
      <span
        v-if="store.taxon.is_valid"
        class="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300"
        :title="store.taxon.short_status"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-current" />
        Valid
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1 rounded-full bg-red-400/15 px-2.5 py-0.5 text-xs font-semibold text-red-300"
        :title="store.taxon.short_status"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-current" />
        {{ store.taxon.short_status || 'Not valid' }}
      </span>
      <span
        v-for="status in store.taxon.descorator_status"
        :key="status"
        class="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80"
      >
        {{ status }}
      </span>
    </div>

    <h1
      class="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight [&_i]:font-bold"
      :title="store.taxon.short_status"
      v-html="store.taxon.full_name_tag"
    />

    <p
      v-if="commonNames"
      class="mt-2 text-white/75"
    >
      <CommonNames />
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOtuStore } from '../store/store'
import CommonNames from './CommonNames.vue'

const store = useOtuStore()
const commonNames = computed(() => store.taxonomy.commonNames?.length)
</script>
