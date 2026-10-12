<template>
  <section class="bg-base-foreground border-y border-base-border/30">
    <div class="container mx-auto px-4 py-16 sm:py-20 grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
          About WID
        </h2>
        <p class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
          A collaborative, global initiative
        </p>

        <div class="mt-6 space-y-4 text-lg leading-relaxed text-base-content/75 max-w-2xl">
          <p>
            The <strong class="text-base-content font-semibold">World Ichneumonidae Database</strong>
            documents the diversity of Ichneumonidae worldwide: their
            <strong class="text-base-content font-semibold">taxonomy</strong>,
            <strong class="text-base-content font-semibold">distribution</strong> and
            <strong class="text-base-content font-semibold">biology</strong>, backed by
            the original literature.
          </p>
          <p>
            It is curated by an international team of specialists and is
            open access and continuously updated. The data live in
            <a
              href="https://taxonworks.org"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-primary-color dark:text-secondary-color underline decoration-2 underline-offset-2 decoration-primary-color/30 hover:decoration-primary-color"
              >TaxonWorks</a
            >, which offers filtering and reporting tools beyond what this site
            shows yet.
          </p>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/about"
            class="inline-flex items-center gap-2 rounded-lg bg-primary-color px-4 py-2.5 text-sm font-semibold text-primary-content hover:opacity-90 transition"
          >
            <HomeIcon
              name="users"
              class="h-5 w-5"
            />
            Meet the team
          </RouterLink>
          <RouterLink
            to="/news"
            class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40 transition"
          >
            Project news
          </RouterLink>
        </div>

        <div class="mt-10 rounded-xl bg-base-background p-5 ring-1 ring-base-border/30 max-w-2xl">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-base-content">
            <HomeIcon
              name="mail"
              class="h-5 w-5 text-base-content/60"
            />
            Need extended access to the data?
          </h3>
          <ul class="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-base-content/75 [&_a]:!text-primary-color dark:[&_a]:!text-secondary-color">
            <li>
              <span class="block font-medium text-base-content">Davide Dal Pos</span>
              <address-maker :items="['daveliga', 'gmail', 'com']" />
            </li>
            <li>
              <span class="block font-medium text-base-content">Filippo Di Giovanni</span>
              <address-maker :items="['aphelocheirus', 'gmail', 'com']" />
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-5 flex flex-col gap-5">
        <div class="rounded-2xl p-6 bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/20">
          <div class="flex items-start gap-3">
            <HomeIcon
              name="warning"
              class="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400"
            />
            <div>
              <h3 class="font-semibold text-amber-900 dark:text-amber-200">
                A work in progress
              </h3>
              <p class="mt-1.5 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                Not all subfamilies are fully covered yet, and some names are
                still being added and verified. Before citing information from
                WID, please check the completeness of the relevant group.
              </p>
              <RouterLink
                to="/subfamilies"
                class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-200"
              >
                Check subfamily status
                <HomeIcon
                  name="arrow"
                  class="h-4 w-4"
                />
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="wid-contribute rounded-2xl p-6 text-white">
          <h3 class="text-xl font-semibold">Your contributions matter</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/80">
            Specimen records, images, missing papers or a simple correction:
            every contribution makes WID more complete and more reliable.
          </p>
          <div class="mt-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <a
              href="https://benevolent-cuchufli-47bd77.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-color px-4 py-2.5 text-sm font-semibold text-secondary-content hover:brightness-105 transition"
            >
              <HomeIcon
                name="document"
                class="h-5 w-5"
              />
              Submit a paper
            </a>
            <a
              href="https://benevolent-cuchufli-47bd77.netlify.app/correction.html"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 transition"
            >
              <HomeIcon
                name="pencil"
                class="h-5 w-5"
              />
              Report a correction
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import HomeIcon from './HomeIcon.vue'
</script>

<style scoped>
.wid-contribute {
  background:
    radial-gradient(30rem 15rem at 100% 0%, rgba(42, 98, 183, 0.6), transparent 70%),
    linear-gradient(135deg, #13223f 0%, #1b3466 100%);
}
</style>
