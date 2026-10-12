<template>
  <section class="container mx-auto px-4 py-16 sm:py-20">
    <div class="max-w-2xl">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
        Explore the database
      </h2>
      <p class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
        Everything about Darwin wasps, in one place
      </p>
      <p class="mt-4 text-lg text-base-content/70">
        Browse the classification, identify specimens with keys, dig into
        the literature or query occurrence data.
      </p>
    </div>

    <div class="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="group relative grid grid-cols-[auto_1fr] sm:flex sm:flex-col gap-x-4 rounded-2xl bg-base-foreground p-5 sm:p-6 ring-1 ring-base-border/40 hover:ring-primary-color/50 dark:hover:ring-secondary-color/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <span
          class="row-span-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-color text-primary-content shadow-sm shadow-primary-color/30"
        >
          <HomeIcon
            :name="card.icon"
            class="h-6 w-6"
          />
        </span>
        <h3 class="sm:mt-5 text-lg font-semibold text-base-content">
          {{ card.title }}
        </h3>
        <p class="mt-1.5 text-sm leading-relaxed text-base-content/65 flex-grow">
          {{ card.text }}
        </p>
        <span
          class="mt-3 sm:mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-color dark:text-secondary-color"
        >
          {{ card.cta }}
          <HomeIcon
            name="arrow"
            class="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import HomeIcon from './HomeIcon.vue'

const cards = [
  {
    to: '/subfamilies',
    icon: 'table',
    title: 'Subfamilies',
    text: 'All subfamilies at a glance, with species counts and the current curation status of each group.',
    cta: 'Open the table'
  },
  {
    to: '/keys',
    icon: 'key',
    title: 'Identification keys',
    text: 'Interactive dichotomous keys you can step through couplet by couplet, filtered by region.',
    cta: 'Browse keys'
  },
  {
    to: '/resources/tw/filter/bibliography',
    icon: 'book',
    title: 'Bibliography',
    text: 'Search the literature on Ichneumonidae by author, year, title or taxon.',
    cta: 'Search literature'
  },
  {
    to: '/resources/tw/filter/dwc_otus',
    icon: 'database',
    title: 'Specimen & occurrence data',
    text: 'Query Darwin Core records and download specimen data for any taxon in the database.',
    cta: 'Search records'
  },
  {
    to: '/RecentTaxa',
    icon: 'sparkles',
    title: 'Recently added taxa',
    text: 'The latest names described or added to WID, so you can keep up with new taxonomy.',
    cta: 'See what’s new'
  },
  {
    to: '/RecentReferences',
    icon: 'document',
    title: 'Latest references',
    text: 'Publications most recently entered into the database and linked to their taxa.',
    cta: 'View additions'
  }
]
</script>
