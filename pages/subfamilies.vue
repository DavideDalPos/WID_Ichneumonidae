<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="Taxa"
      title="Subfamilies of Ichneumonidae"
      subtitle="Live counts from TaxonWorks alongside the curation status of each subfamily. Use this page to judge how complete WID is for the group you work on."
    />

    <section class="container mx-auto px-4 py-10 sm:py-12">
      <div
        class="mb-8 rounded-2xl p-5 bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/20 flex items-start gap-3"
      >
        <HomeIcon
          name="warning"
          class="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400"
        />
        <p class="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
          Ichneumonidae is extremely diverse and has a vast literature, so
          fully updating a subfamily can take years. The species column compares
          the valid species entered in WID so far with the number of described
          species in the world. Open a row to see exactly what has been curated.
        </p>
      </div>

      <SubfamilyExplorer :items="subfamilyData" />
    </section>
  </div>
</template>

<script setup>
import PageHeader from './components/Home/PageHeader.vue'
import HomeIcon from './components/Home/HomeIcon.vue'
import SubfamilyExplorer from './components/subfamilies/SubfamilyExplorer.vue'
import subfamilyData from './components/subfamilies/data'
</script>
