<template>
  <form
    class="rounded-2xl bg-base-foreground p-5 sm:p-6 ring-1 ring-base-border/40 shadow-xl shadow-black/5"
    @submit.prevent="emit('search')"
  >
    <div class="grid gap-4 lg:grid-cols-12 items-end">
      <label class="lg:col-span-4 block">
        <span class="wid-label">Scientific name</span>
        <input
          v-model="parameters.scientificName"
          type="search"
          placeholder="e.g. Ophion luteus"
          class="wid-input"
        />
      </label>
      <label class="lg:col-span-3 block">
        <span class="wid-label">Author</span>
        <input
          v-model="parameters.scientificNameAuthorship"
          type="search"
          placeholder="e.g. Gravenhorst"
          class="wid-input"
        />
      </label>
      <div class="lg:col-span-5">
        <FacetDistribution
          v-model="parameters"
          class="wid-facet"
        />
      </div>
    </div>

    <div
      v-if="showMoreFilters"
      class="mt-5 pt-5 border-t border-base-border/30 grid gap-6 lg:grid-cols-12 wid-facet"
    >
      <div class="lg:col-span-8">
        <FacetOrder v-model="parameters" />
      </div>
      <div class="lg:col-span-4 flex flex-col gap-4">
        <p class="text-sm font-semibold text-base-content">Specimen records</p>
        <FacetInstitutionCode v-model="parameters" />
        <FacetTypeStatus v-model="parameters" />
      </div>
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="submit"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-color px-5 py-2.5 text-sm font-semibold text-primary-content hover:opacity-90"
      >
        Search
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2.5 text-sm font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40"
        @click="emit('reset')"
      >
        Reset
      </button>
      <button
        type="button"
        class="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-color dark:text-secondary-color"
        :aria-expanded="showMoreFilters"
        @click="showMoreFilters = !showMoreFilters"
      >
        <IconMinusCircle
          v-if="showMoreFilters"
          class="w-5 h-5"
        />
        <IconPlusCircle
          v-else
          class="w-5 h-5"
        />
        {{ showMoreFilters ? 'Fewer filters' : 'More filters' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import FacetOrder from './Facet/FacetOrder.vue'
import FacetDistribution from './Facet/FacetDistribution.vue'
import FacetTypeStatus from './Facet/FacetTypeStatus.vue'
import FacetInstitutionCode from './Facet/FacetInstitutionCode.vue'

const parameters = defineModel({
  type: Object,
  required: true
})

const emit = defineEmits(['search', 'reset'])

const showMoreFilters = ref(false)
</script>

<style scoped>
.wid-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--color-base-content), 0.55);
  margin-bottom: 0.375rem;
}

.wid-input,
.wid-facet :deep(input),
.wid-facet :deep(select) {
  width: 100%;
  border-radius: 0.5rem;
  border: 0;
  background: rgb(var(--color-base-background));
  box-shadow: inset 0 0 0 1px rgba(var(--color-base-border), 0.7);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(var(--color-base-content));
  box-sizing: border-box;
}

.wid-input:focus,
.wid-facet :deep(input:focus),
.wid-facet :deep(select:focus) {
  outline: none;
  box-shadow: inset 0 0 0 2px rgb(var(--color-primary));
}

.wid-facet :deep(.tp-autocomplete input) {
  padding-left: 2.5rem;
}

.wid-facet :deep(label),
.wid-facet :deep(h3) {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--color-base-content), 0.55);
  margin-bottom: 0.375rem;
}
</style>
