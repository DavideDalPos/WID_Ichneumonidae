<template>
  <InboxPage
    title="Report an error"
    subtitle="Spotted a wrong author or year, a misspelled name, an outdated synonymy or a doubtful record? Tell us what should be fixed."
    :steps="steps"
  >
    <CorrectionForm
      :subject="subject"
      :page-url="pageUrl"
    />
  </InboxPage>
</template>

<script setup>
import { useRoute } from 'vue-router'
import InboxPage from './components/Inbox/InboxPage.vue'
import CorrectionForm from '@/components/Inbox/CorrectionForm.vue'

// /report-error?subject=<taxon or page>&page=<WID page address> pre-fill the form
const query = useRoute().query
const subject = String(query.subject || '').slice(0, 300)
const pageUrl = String(query.page || '').slice(0, 500)

const steps = [
  {
    title: 'Tell us what is wrong',
    text: 'Choose the type of problem and name the taxon or page. On a taxon page, the <b>Report error</b> button fills this in for you.'
  },
  { title: 'Add the evidence', text: 'A reference, page number, DOI or link helps us fix it quickly.' },
  { title: 'We correct it', text: 'A WID editor checks the report and corrects the database. We may write to you with questions.' }
]
</script>
