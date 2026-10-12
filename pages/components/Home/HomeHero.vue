<template>
  <section class="wid-hero relative overflow-hidden text-white">
    <div
      class="container mx-auto px-4 pt-12 pb-28 sm:pt-16 lg:pt-20 lg:pb-36 grid lg:grid-cols-12 gap-10 items-center relative"
    >
      <div class="lg:col-span-6 xl:col-span-6 relative z-10">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-color"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-secondary-color" />
          Darwin wasps of the world
        </p>

        <h1
          class="mt-5 text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          World Ichneumonidae
          <span class="block text-secondary-color">Database</span>
        </h1>

        <p class="mt-5 max-w-xl text-lg text-white/75 leading-relaxed">
          An open, expert-curated catalogue of the names, literature,
          distribution, images and specimens of Ichneumonidae, one of the
          most species-rich families of animals.
        </p>

        <div class="wid-search mt-8 max-w-xl">
          <AutocompleteOtu
            autofocus
            class="w-full"
            placeholder="Search a genus or species, e.g. Ichneumon"
          />
        </div>

        <ul class="mt-5 flex flex-wrap gap-2 text-sm">
          <li
            v-for="link in quickLinks"
            :key="link.to"
          >
            <RouterLink
              :to="link.to"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 ring-1 ring-white/10 text-white/90 hover:text-white transition-colors"
            >
              <HomeIcon
                :name="link.icon"
                class="h-4 w-4 text-secondary-color"
              />
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <figure class="lg:col-span-6 relative order-first lg:order-none">
        <div
          class="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-primary-color/40 blur-3xl"
          aria-hidden="true"
        />
        <img
          :src="waspUrl"
          alt="A metallic blue ichneumonid wasp in lateral view"
          class="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none drop-shadow-2xl"
          width="654"
          height="352"
        />
      </figure>
    </div>
  </section>
</template>

<script setup>
import HomeIcon from './HomeIcon.vue'

const { base_url = '/' } = __APP_ENV__
const waspUrl = (base_url + '/images/logoWid_wasp.png').replace('//', '/')

const quickLinks = [
  { label: 'Subfamilies', to: '/subfamilies', icon: 'table' },
  { label: 'Keys', to: '/keys', icon: 'key' },
  { label: 'Bibliography', to: '/resources/tw/filter/bibliography', icon: 'book' },
  { label: 'Specimen data', to: '/resources/tw/filter/dwc_otus', icon: 'database' }
]
</script>

<style scoped>
.wid-hero {
  background:
    radial-gradient(60rem 30rem at 85% 30%, rgba(42, 98, 183, 0.45), transparent 60%),
    radial-gradient(40rem 20rem at 0% 100%, rgba(243, 182, 55, 0.12), transparent 60%),
    linear-gradient(180deg, #0f1b33 0%, #13223f 100%);
}

.wid-search :deep(.tp-autocomplete) {
  width: 100%;
}

.wid-search :deep(.tp-autocomplete__item) {
  font-size: 0.875rem;
  padding: 0.6rem 1rem;
}

.wid-search :deep(.tp-autocomplete__list) {
  border-radius: 0.75rem;
  margin-top: 0.5rem !important;
  max-height: 20rem;
}

/* Make the shared TaxonPages autocomplete feel at home on the dark hero */
.wid-search :deep(input) {
  height: 3.25rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  border: 0;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.wid-search :deep(input:focus) {
  outline: none;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6),
    0 0 0 3px rgb(var(--color-secondary));
}
</style>
