<template>
  <InboxForm
    type="publication"
    :payload="payload"
    :validate="validate"
    submit-label="Submit publication"
    sent-title="Publication received"
    sent-text="A WID editor will check it and add it to the database. We may write to you if we have questions."
    again-label="Submit another publication"
    @reset="clear"
  >
    <ReferenceFields :fields="reference" />

    <label class="block min-w-0">
      <span class="inbox-label">Taxa treated <span class="normal-case font-normal tracking-normal">(optional)</span></span>
      <input
        v-model="taxa"
        type="text"
        maxlength="1000"
        placeholder="e.g. Acrotaphus, new species of Pimplinae from Colombia"
        class="inbox-input"
      />
    </label>

    <label class="block min-w-0">
      <span class="inbox-label"
        >Link to the PDF <span class="normal-case font-normal tracking-normal">(optional — e.g. journal page, Zenodo, ResearchGate)</span></span
      >
      <input
        v-model="pdfUrl"
        type="url"
        maxlength="500"
        placeholder="https://…"
        class="inbox-input"
      />
    </label>

    <label class="flex items-center gap-2 text-sm text-base-content/80">
      <input
        v-model="isAuthor"
        type="checkbox"
        class="size-4 accent-[rgb(var(--color-primary))]"
      />
      I am an author of this work
    </label>

    <label class="block min-w-0">
      <span class="inbox-label">Note <span class="normal-case font-normal tracking-normal">(optional)</span></span>
      <textarea
        v-model="note"
        rows="2"
        maxlength="2000"
        class="inbox-input"
      />
    </label>
  </InboxForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InboxForm from './InboxForm.vue'
import ReferenceFields from './ReferenceFields.vue'
import { emptyReference, formatReference, parseDoi } from './doiLookup.js'

const props = defineProps({
  doi: { type: String, default: '' } // optional DOI to pre-fill
})

const reference = reactive({ ...emptyReference(), doi: props.doi })
const taxa = ref('')
const pdfUrl = ref('')
const isAuthor = ref(false)
const note = ref('')

const validate = () =>
  reference.title.trim() || parseDoi(reference.doi) ? '' : 'Please give at least the title of the work, or its DOI.'

const payload = () => {
  const doi = parseDoi(reference.doi)
  return {
    citation: formatReference(reference) || `DOI ${doi}`,
    doi,
    taxa: taxa.value,
    pdfUrl: pdfUrl.value,
    isAuthor: isAuthor.value ? 'yes' : '',
    note: note.value
  }
}

function clear() {
  Object.assign(reference, emptyReference())
  taxa.value = pdfUrl.value = note.value = ''
  isAuthor.value = false
}
</script>
