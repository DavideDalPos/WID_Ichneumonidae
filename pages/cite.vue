<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="Cite & reuse"
      title="How to cite WID"
      subtitle="A formal data paper for WID is in preparation. Until it is published, please cite the database as shown below."
    />

    <div class="container mx-auto px-4 pt-12 sm:pt-16">
      <div
        class="rounded-2xl p-6 bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/20 flex items-start gap-3"
      >
        <HomeIcon
          name="warning"
          class="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400"
        />
        <p class="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
          <strong class="font-semibold">WID is a work in progress.</strong>
          Not all subfamilies are fully covered and some taxa are still being
          verified. Before using WID data in a publication, check the
          <RouterLink
            to="/subfamilies"
            class="font-semibold underline underline-offset-2"
            >subfamily status table</RouterLink
          >.
        </p>
      </div>
    </div>

    <HomeCite
      :show-more="false"
      class="!bg-transparent !border-0"
    />
  </div>
</template>

<script setup>
import PageHeader from './components/Home/PageHeader.vue'
import HomeIcon from './components/Home/HomeIcon.vue'
import HomeCite from './components/Home/HomeCite.vue'
</script>
