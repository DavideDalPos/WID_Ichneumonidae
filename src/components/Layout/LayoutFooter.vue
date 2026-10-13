<template>
  <footer class="wid-footer text-white/80 print:hidden">
    <div class="container mx-auto px-4 pt-12 pb-8 box-border">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
        <!-- Brand -->
        <div class="lg:col-span-4">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-3 text-white"
          >
            <img
              :src="logoUrl"
              alt=""
              class="h-9 w-auto"
            />
            <span class="font-semibold leading-tight">
              World Ichneumonidae<br />Database
            </span>
          </RouterLink>
          <p class="mt-4 text-sm leading-relaxed text-white/60 max-w-sm">
            An open, expert-curated catalogue of the Darwin wasps of the world,
            maintained by an international team of specialists.
          </p>
          <TrackerReport
            icon
            label="Report a problem"
            button-class="mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/10"
            icon-class="w-4 h-4"
          />
        </div>

        <!-- Link columns -->
        <nav
          v-for="col in COLUMNS"
          :key="col.title"
          class="lg:col-span-2"
          :aria-label="col.title"
        >
          <h2 class="text-xs font-semibold uppercase tracking-wider text-secondary-color">
            {{ col.title }}
          </h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li
              v-for="link in col.links"
              :key="link.to"
            >
              <RouterLink
                :to="link.to"
                class="text-white/70 hover:text-white"
                >{{ link.label }}</RouterLink
              >
            </li>
          </ul>
        </nav>

        <!-- Cite this page -->
        <div class="md:col-span-2 lg:col-span-4">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-secondary-color">
            Cite this page
          </h2>
          <div class="mt-3 relative rounded-xl bg-white/5 ring-1 ring-white/10 p-4 pr-12 text-xs leading-relaxed text-white/70 break-words">
            <ClientOnly>
              {{ cite.authors }}
              <span v-html="cite.subjectHtml.value" />
              {{ cite.citation }}. Retrieved on {{ cite.date }}<template v-if="cite.url.value">
                at
                <a
                  :href="cite.url.value"
                  class="text-white/80 underline decoration-white/30 hover:decoration-white"
                  >{{ cite.url.value }}</a
                ></template
              >
              <VClipboard
                class="!absolute top-3 right-3"
                :text="cite.text.value"
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      <div
        class="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-white/55"
      >
        <p class="flex flex-wrap items-center gap-2">
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer license"
            class="inline-flex items-center rounded border border-white/25 px-1.5 py-0.5 font-semibold text-white/80 hover:bg-white/10"
            >CC BY 4.0</a
          >
          <span>Text and data under CC BY 4.0; images under
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer license"
              class="text-white/70 underline decoration-white/30 hover:text-white"
              >CC BY-NC-SA 4.0</a
            >, except where otherwise noted.</span>
        </p>
        <p class="[&>*:not(:last-child)]:after:content-['·'] [&>*:not(:last-child)]:after:mx-1.5">
          <span>
            Data by
            <a
              class="text-white/80 hover:text-white"
              href="https://taxonworks.org/"
              target="_blank"
              rel="noopener"
              >TaxonWorks</a
            >
          </span>
          <span>
            Pages by
            <a
              class="text-white/80 hover:text-white"
              href="https://github.com/SpeciesFileGroup/taxonpages"
              target="_blank"
              rel="noopener"
              >TaxonPages</a
            >
          </span>
          <span>
            Supported by
            <a
              class="text-white/80 hover:text-white"
              href="https://speciesfilegroup.org"
              target="_blank"
              rel="noopener"
              >Species File Group</a
            >
          </span>
          <FooterAnalytics class="italic" />
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import FooterAnalytics from '@/components/Footer/FooterAnalytics.vue'
import { usePageCitation } from '@/composables/usePageCitation'
import { isValidUrl } from '@/utils/url'

const { header_logo_url, base_url } = __APP_ENV__
const logoUrl = isValidUrl(header_logo_url)
  ? header_logo_url
  : (base_url + header_logo_url).replace('//', '/')

const cite = usePageCitation()

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Subfamilies', to: '/subfamilies' },
      { label: 'Identification keys', to: '/keys' },
      { label: 'Bibliography', to: '/resources/tw/filter/bibliography' },
      { label: 'Specimen data', to: '/resources/tw/filter/dwc_otus' },
      { label: "What's new", to: '/RecentTaxa' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'About & team', to: '/about' },
      { label: 'News', to: '/news' },
      { label: 'How to cite', to: '/cite' },
      { label: 'How to help', to: '/help' }
    ]
  }
]
</script>

<style scoped>
.wid-footer {
  background:
    radial-gradient(40rem 16rem at 100% 0%, rgba(42, 98, 183, 0.25), transparent 70%),
    #0b1427;
}

.wid-footer :deep(.tp-button) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
