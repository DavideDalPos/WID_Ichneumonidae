<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="Get involved"
      title="How can you help?"
      subtitle="WID grows through the expertise and generosity of the entomological community. Every correction, record and reference keeps it accurate and useful to researchers worldwide."
    />

    <section class="container mx-auto px-4 py-12 sm:py-16">
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="action in actions"
          :key="action.to"
          class="flex flex-col rounded-2xl bg-base-foreground p-6 sm:p-8 ring-1 ring-base-border/40"
        >
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-color text-primary-content"
          >
            <HomeIcon
              :name="action.icon"
              class="h-6 w-6"
            />
          </span>
          <h2 class="mt-5 text-xl font-semibold text-base-content">
            {{ action.title }}
          </h2>
          <p class="mt-2 leading-relaxed text-base-content/70 flex-grow">
            {{ action.text }}
          </p>
          <RouterLink
            :to="action.to"
            class="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-primary-color px-5 py-3 font-semibold text-primary-content hover:opacity-90 transition"
          >
            {{ action.cta }}
            <HomeIcon
              name="arrow"
              class="h-4 w-4"
            />
          </RouterLink>
        </article>
      </div>

      <div
        class="mt-6 rounded-2xl p-6 sm:p-8 ring-1 ring-base-border/40 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-base-content">
            Have specimen records or images to share?
          </h2>
          <p class="mt-1 text-base-content/70">
            Get in touch with the WID administrators and we will help you add
            them to the database.
          </p>
        </div>
        <RouterLink
          to="/about"
          class="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40 transition whitespace-nowrap"
        >
          <HomeIcon
            name="users"
            class="h-5 w-5"
          />
          Contact the team
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import PageHeader from './components/Home/PageHeader.vue'
import HomeIcon from './components/Home/HomeIcon.vue'

const actions = [
  {
    icon: 'document',
    title: 'Submit a missing publication',
    text: 'Know of a published paper that is not yet in WID? No account is needed: paste the DOI or fill in the citation, and we will take care of the rest.',
    to: '/submit-publication',
    cta: 'Submit a published paper'
  },
  {
    icon: 'pencil',
    title: 'Report an error or correction',
    text: 'Spotted a wrong authorship, a misspelled name, an outdated synonymy, or a distribution that looks off? Tell us what should be fixed and, if you can, a reference to back it up.',
    to: '/report-error',
    cta: 'Report a correction'
  },
  {
    icon: 'book',
    title: 'Request a PDF',
    text: 'Cannot access a paper cited in WID, or another work on Ichneumonidae? Send us the reference and a WID editor will e-mail you the PDF if we have it.',
    to: '/request-pdf',
    cta: 'Request a PDF'
  }
]
</script>
