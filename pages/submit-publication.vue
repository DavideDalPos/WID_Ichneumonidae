<template>
  <InboxPage
    title="Submit a missing publication"
    subtitle="Know of a paper on Ichneumonidae that is not yet in WID, perhaps your own? Send us the reference and we will add it."
    :steps="steps"
  >
    <PublicationForm :doi="doi" />
  </InboxPage>
</template>

<script setup>
import { useRoute } from 'vue-router'
import InboxPage from './components/Inbox/InboxPage.vue'
import PublicationForm from '@/components/Inbox/PublicationForm.vue'
import { parseDoi } from '@/components/Inbox/doiLookup.js'

// /submit-publication?doi=<DOI> pre-fills the form
const doi = parseDoi(useRoute().query.doi)

const steps = [
  {
    title: 'Check the bibliography',
    text: 'Search the <a href="#/resources/tw/filter/bibliography" class="underline">bibliography</a> first: the work may already be there.'
  },
  { title: 'Give us the reference', text: 'Paste the DOI and the details fill in by themselves, or type them. Tell us which taxa it treats if you can.' },
  { title: 'We add it', text: 'A WID editor checks the work and adds it with its names and records. We may write to you with questions.' }
]
</script>
