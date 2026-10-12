<template>
  <section class="bg-base-foreground border-t border-base-border/30">
    <div class="container mx-auto px-4 py-16 sm:py-20 grid gap-10 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
          Cite & reuse
        </h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-base-content">
          Using WID in your work
        </p>
        <p class="mt-4 text-base-content/70 leading-relaxed">
          If you use data or content from this website, please acknowledge
          it with the citation below.
        </p>
        <RouterLink
          v-if="showMore"
          to="/cite"
          class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
        >
          More on how to cite
          <HomeIcon
            name="arrow"
            class="h-4 w-4"
          />
        </RouterLink>
      </div>

      <div class="lg:col-span-8 flex flex-col gap-5">
        <figure class="relative rounded-2xl bg-base-background ring-1 ring-base-border/40 p-6 pr-16">
          <HomeIcon
            name="quote"
            class="h-6 w-6 text-primary-color/60 dark:text-secondary-color/70 mb-3"
          />
          <blockquote class="text-base-content/85 leading-relaxed">
            {{ authors }} ({{ year }}).
            <span class="font-semibold text-base-content">World Ichneumonidae Database (WID).</span>
            Accessed <span class="whitespace-nowrap">{{ today }}</span>.
            <a
              :href="url"
              class="text-primary-color dark:text-secondary-color hover:underline break-all"
              >{{ url }}</a
            >
          </blockquote>
          <div class="absolute top-4 right-4">
            <VClipboard :text="citation" />
          </div>
        </figure>

        <div class="grid gap-4 sm:grid-cols-2 text-sm">
          <div class="rounded-xl p-5 ring-1 ring-base-border/40">
            <h3 class="font-semibold text-base-content">Text & data</h3>
            <p class="mt-1 text-base-content/70">
              Licensed under
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-primary-color dark:text-secondary-color hover:underline"
                >CC BY 4.0</a
              >, except where otherwise noted.
            </p>
          </div>
          <div class="rounded-xl p-5 ring-1 ring-base-border/40">
            <h3 class="font-semibold text-base-content">Images</h3>
            <p class="mt-1 text-base-content/70">
              Open access under
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-primary-color dark:text-secondary-color hover:underline"
                >CC BY-NC-SA 4.0</a
              >, unless stated otherwise.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { collaborators } from '../Section/map/AboutMapData.js'
import HomeIcon from './HomeIcon.vue'

defineProps({
  showMore: { type: Boolean, default: true }
})

const url = 'https://worldichneumonidae.com'
const year = new Date().getFullYear()
const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Same author order as the existing citation: everyone else, then Filippo last.
const authors = computed(() => {
  const fmt = (c) => `${c.last_name} ${c.first_name.charAt(0)}.`
  const last = collaborators.filter((c) => c.first_name === 'Filippo')
  const others = collaborators.filter((c) => c.first_name !== 'Filippo')
  return [...others, ...last].map(fmt).join('; ')
})

const citation = computed(
  () =>
    `${authors.value} (${year}). World Ichneumonidae Database (WID). Accessed ${today}. ${url}`
)
</script>
