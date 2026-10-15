<template>
  <InboxForm
    type="correction"
    :payload="payload"
    :validate="validate"
    :in-modal="inModal"
    submit-label="Send report"
    sent-title="Report received"
    sent-text="A WID editor will check it and correct the database where needed. We may write to you if we have questions."
    again-label="Report something else"
    @reset="clear"
  >
    <div class="grid gap-4 sm:grid-cols-[14rem_1fr]">
      <label class="block min-w-0">
        <span class="inbox-label">Type of problem</span>
        <select
          v-model="category"
          class="inbox-input"
        >
          <option
            v-for="c in CATEGORIES"
            :key="c"
            :value="c"
          >
            {{ c }}
          </option>
        </select>
      </label>
      <label class="block min-w-0">
        <span class="inbox-label">Taxon or page</span>
        <input
          v-model="subjectText"
          type="text"
          maxlength="300"
          placeholder="e.g. Ichneumon extensorius"
          class="inbox-input"
        />
      </label>
    </div>

    <label class="block min-w-0">
      <span class="inbox-label">What is wrong?</span>
      <textarea
        v-model="problem"
        rows="3"
        maxlength="4000"
        placeholder="e.g. The species is listed from Brazil, but that record is a misidentification."
        class="inbox-input"
      />
    </label>

    <label class="block min-w-0">
      <span class="inbox-label">What should it be? <span class="normal-case font-normal tracking-normal">(optional)</span></span>
      <textarea
        v-model="suggestion"
        rows="2"
        maxlength="4000"
        class="inbox-input"
      />
    </label>

    <label class="block min-w-0">
      <span class="inbox-label"
        >Evidence <span class="normal-case font-normal tracking-normal">(optional — a reference, DOI or link)</span></span
      >
      <input
        v-model="evidence"
        type="text"
        maxlength="2000"
        placeholder="e.g. Broad et al. 2018, p. 45 · 10.3897/zookeys.…"
        class="inbox-input"
      />
    </label>
  </InboxForm>
</template>

<script setup>
import { ref } from 'vue'
import InboxForm from './InboxForm.vue'

const props = defineProps({
  subject: { type: String, default: '' }, // taxon name or page title, pre-filled
  pageUrl: { type: String, default: '' }, // WID page the report is about
  inModal: { type: Boolean, default: false }
})

const CATEGORIES = [
  'Name or spelling',
  'Author or year',
  'Classification or synonymy',
  'Distribution',
  'Host or biological association',
  'Specimen record',
  'Image',
  'Reference',
  'Missing taxon',
  'Website problem',
  'Other'
]

const category = ref(CATEGORIES[0])
const subjectText = ref(props.subject)
const problem = ref('')
const suggestion = ref('')
const evidence = ref('')

const validate = () => (problem.value.trim() ? '' : 'Please describe what is wrong.')

const payload = () => ({
  category: category.value,
  subject: subjectText.value,
  pageUrl: props.pageUrl,
  problem: problem.value,
  suggestion: suggestion.value,
  evidence: evidence.value
})

function clear() {
  problem.value = suggestion.value = evidence.value = ''
}
</script>
