<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="What's new"
      title="Recently added taxa"
      subtitle="The latest valid names entered into WID, newest first. Names with a taxon page link straight to it."
    >
      <WeeklyActivity />
    </PageHeader>

    <section class="container mx-auto px-4 py-10 sm:py-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7 xl:col-span-8">
        <RecentTaxaList />
      </div>

      <aside class="min-w-0 lg:col-span-5 xl:col-span-4">
        <div class="flex items-end justify-between gap-3">
          <h2 class="text-lg font-semibold text-base-content">Latest references</h2>
          <RouterLink
            to="/RecentReferences"
            class="text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
          >
            See all
          </RouterLink>
        </div>
        <RecentSourcesList
          class="mt-4"
          :per="6"
          compact
        />
        <p class="mt-6 text-sm text-base-content/60">
          Have images, records or corrections for any of these taxa?
          <RouterLink
            to="/help"
            class="font-semibold text-primary-color dark:text-secondary-color hover:underline"
            >Let us know</RouterLink
          >.
        </p>
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
