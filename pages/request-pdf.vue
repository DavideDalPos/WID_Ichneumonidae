<template>
  <div class="wid-home bg-base-background min-h-screen">
    <PageHeader
      eyebrow="Literature"
      title="Request a PDF"
      subtitle="Need a paper cited in WID, or another work on Ichneumonidae? Send us the reference and a WID editor will e-mail you the PDF if we have it."
    />

    <section class="container mx-auto px-4 -mt-8 relative z-10 pb-16">
      <div class="max-w-2xl rounded-2xl bg-base-foreground p-5 sm:p-7 ring-1 ring-base-border/40 shadow-xl shadow-black/5">
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
          />
        </ClientOnly>
      </div>
      <p class="mt-4 max-w-2xl text-sm text-base-content/60">
        Looking for a reference already in WID? Find it in the
        <RouterLink
          to="/resources/tw/filter/bibliography"
          class="underline"
          >bibliography</RouterLink
        >
        and use its <b>Request PDF</b> button.
      </p>
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

// /request-pdf?source=<TaxonWorks source id> pre-fills the reference
const route = useRoute()
const enabled = isPdfRequestEnabled()
const sourceId = ref(/^\d+$/.test(String(route.query.source || '')) ? String(route.query.source) : '')
const citation = ref('')
const isLoading = ref(false)

onMounted(async () => {
  if (!sourceId.value) return
  isLoading.value = true
  try {
    const { data } = await makeAPIRequest.get(`/sources/${sourceId.value}`)
    citation.value = data?.cached || ''
    if (!citation.value) sourceId.value = ''
  } catch {
    sourceId.value = ''
  } finally {
    isLoading.value = false
  }
})
</script>
