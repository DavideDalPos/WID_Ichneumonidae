<template>
  <InboxPage
    eyebrow="Literature"
    title="Request a PDF"
    subtitle="Need a paper on Ichneumonidae you cannot access? Send us the reference and a WID editor will e-mail you the PDF if we have it."
    :steps="steps"
  >
    <VSpinner v-if="isLoading" />
    <PdfRequestForm
      v-else
      :key="citation"
      :citation="citation"
      :source-id="sourceId"
      :doi="doi"
    />
  </InboxPage>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { makeAPIRequest } from '@/utils'
import InboxPage from './components/Inbox/InboxPage.vue'
import PdfRequestForm from '@/components/Inbox/PdfRequestForm.vue'
import { parseDoi } from '@/components/Inbox/doiLookup.js'

// /request-pdf?source=<TaxonWorks source id>  pre-fills a reference from WID
// /request-pdf?doi=<DOI>                      pre-fills from the DOI
const route = useRoute()
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
  { title: 'Get the PDF by e-mail', text: 'A WID editor e-mails you the PDF if we have it, or tells you if we don’t. This is done by hand, usually within a few days.' }
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
