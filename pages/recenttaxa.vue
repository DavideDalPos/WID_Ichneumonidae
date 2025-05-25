<template>
  <div class="container mx-auto py-10">
    <section
      class="border-b border-gray-300 pb-6 mb-8"
      style="opacity: 0; animation: fadeIn 0.8s ease forwards;"
    >
      <h1
        class="text-4xl font-semibold text-gray-900 tracking-tight mb-3 relative inline-block"
      >
        Recent taxa added
        <span
          class="absolute left-0 -bottom-1 h-[2px] w-16 bg-gray-900 rounded"
          aria-hidden="true"
        ></span>
      </h1>
      <p class="mt-3 text-lg text-gray-700 leading-relaxed max-w-full">
        Below is a curated list of the most recently added taxa to the database, reflecting the latest additions to our taxonomic records and ongoing research efforts.
      </p>
<p class="mt-4 text-sm text-gray-500 italic">
  If you have additional information, images, or corrections for any taxa listed, please <RouterLink to="about" class="text-gray-700 underline hover:text-gray-900">get in touch with us</RouterLink>.
</p>

    </section>

    <div class="flex flex-col gap-6 mb-5 mt-10">
      <RecentTaxonTable
        :parameters="{
          validity: true,
          recent: true,
          taxon_name_type: 'Protonym',
          recent_target: 'created_at'
        }"
      />
      <RecentTable
        :attributes="{ cached: 'Source' }"
        route="/sources"
        :parameters="{
          in_project: true,
          recent: true,
          recent_target: 'created_at'
        }"
      />
    </div>
  </div>
</template>

<script setup>
import RecentTaxonTable from './components/Section/RecentTaxonTable.vue';
</script>

<style>
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
