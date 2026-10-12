<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="What's new"
      title="Recently added references"
      subtitle="Publications most recently entered into WID. For access to PDFs of the listed references, please contact the team."
    >
      <WeeklyActivity />
    </PageHeader>

    <section class="container mx-auto px-4 py-10 sm:py-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7 xl:col-span-8">
        <RecentSourcesList :per="15" />
      </div>

      <aside class="min-w-0 lg:col-span-5 xl:col-span-4">
        <div class="flex items-end justify-between gap-3">
          <h2 class="text-lg font-semibold text-base-content">Latest taxa</h2>
          <RouterLink
            to="/RecentTaxa"
            class="text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
          >
            See all
          </RouterLink>
        </div>
        <RecentTaxaList
          class="mt-4"
          :per="10"
        />
      </aside>
    </section>
  </div>
</template>

<script setup>
import PageHeader from './components/Home/PageHeader.vue'
import RecentTaxaList from './components/Recent/RecentTaxaList.vue'
import RecentSourcesList from './components/Recent/RecentSourcesList.vue'
import WeeklyActivity from './components/Recent/WeeklyActivity.vue'
</script>
