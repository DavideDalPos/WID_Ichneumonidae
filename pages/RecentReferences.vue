<template>
  <div class="container mx-auto py-10">
    <section
      class="border-b border-gray-300 pb-6 mb-8"
      style="opacity: 0; animation: fadeIn 0.8s ease forwards;"
    >
      <h1
        class="text-4xl font-semibold text-gray-900 tracking-tight mb-3 relative inline-block"
      >
        Recent References
        <span
          class="absolute left-0 -bottom-1 h-[2px] w-16 bg-gray-900 rounded"
          aria-hidden="true"
        ></span>
      </h1>
      <p class="mt-3 text-lg text-gray-700 leading-relaxed max-w-full">
        This section shows the most recently added references in the
        <span class="font-medium text-gray-900">World Ichneumonidae Database (WID)</span>,
        offering a snapshot of current activity and updates across the project.
      </p>
      <p class="mt-4 text-sm text-gray-500 italic">
        For access to PDFs of the listed references, please <RouterLink to="about" class="text-gray-700 underline hover:text-gray-900">contact us</RouterLink>.
      </p>
    </section>

    <div class="flex flex-col gap-6 mb-10 -mt-2">
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


<style>
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>












<script setup>
import RecentTable from './components/Section/RecentTable.vue';
</script>