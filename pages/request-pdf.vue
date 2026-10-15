<template>
  <div class="wid-home bg-base-background min-h-screen">
    <PageHeader
      eyebrow="Literature"
      title="Request a PDF"
      subtitle="Need a paper on Ichneumonidae you cannot access? Send us the reference and a WID editor will e-mail you the PDF if we have it."
    />

    <section class="container mx-auto px-4 -mt-8 relative z-10 pb-16 grid gap-8 lg:grid-cols-12 items-start">
      <div class="lg:col-span-7 rounded-2xl bg-base-foreground p-5 sm:p-7 ring-1 ring-base-border/40 shadow-xl shadow-black/5">
        <p
          v-if="!enabled"
          class="text-base-content/70"
        >
          PDF requests are not open yet. Please contact the editors listed on the
          <RouterLink
            to="/about"
            class="underline"
            >About</RouterLink
          >
          page.
        </p>
        <ClientOnly v-else>
          <VSpinner v-if="isLoading" />
          <PdfRequestForm
            v-else
            :key="citation"
            :citation="citation"
            :source-id="sourceId"
            :doi="doi"
          />
        </ClientOnly>
      </div>

      <aside class="lg:col-span-5 lg:pt-12">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">How it works</h2>
        <ol class="mt-4 space-y-5">
          <li
            v-for="(s, i) in steps"
            :key="i"
            class="grid grid-cols-[2rem_1fr] gap-3"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-color text-primary-content text-sm font-bold"
              >{{ i + 1 }}</span
            >
            <div>
              <p class="font-semibold text-base-content">{{ s.title }}</p>
              <p
                class="mt-1 text-sm leading-relaxed text-base-content/65"
                v-html="s.text"
              />
            </div>
          </li>
        </ol>
        <p class="mt-6 text-sm text-base-content/60">
          Requests are answered by hand by the WID editors, usually within a few days. Your name and e-mail are seen only by
          the editors and used only to reply to you.
        </p>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { makeAPIRequest } from '@/utils'
import PageHeader from '~/pages/components/Home/PageHeader.vue'
import PdfRequestForm from '@/components/PdfRequest/PdfRequestForm.vue'
import { isPdfRequestEnabled } from '@/components/PdfRequest/usePdfRequest.js'
import { parseDoi } from '@/components/PdfRequest/doiLookup.js'

// /request-pdf?source=<TaxonWorks source id>  pre-fills a reference from WID
// /request-pdf?doi=<DOI>                      pre-fills from the DOI
const route = useRoute()
const enabled = isPdfRequestEnabled()
const sourceId = ref(/^\d+$/.test(String(route.query.source || '')) ? String(route.query.source) : '')
const doi = ref(parseDoi(route.query.doi))
const citation = ref('')
const isLoading = ref(false)

const steps = [
  {
    title: 'Find the reference',
    text: 'In the <a href="#/resources/tw/filter/bibliography" class="underline">bibliography</a> or on a taxon page, click <b>Request PDF</b> next to it. For anything else, use this form: paste the DOI and the details fill in by themselves, or type them.'
  },
  { title: 'Send the request', text: 'Add your name and e-mail. A quick automatic check keeps out spam.' },
  { title: 'Get the PDF by e-mail', text: 'A WID editor e-mails you the PDF if we have it, or tells you if we don’t.' }
]

onMounted(async () => {
  if (!sourceId.value) return
  isLoading.value = true
  try {
    const { data } = await makeAPIRequest.get(`/sources/${sourceId.value}`)
    citation.value = data?.cached || ''
    if (data?.doi) doi.value = parseDoi(data.doi)
    if (!citation.value) sourceId.value = ''
  } catch {
    sourceId.value = ''
  } finally {
    isLoading.value = false
  }
})
</script>
