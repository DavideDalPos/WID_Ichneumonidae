<template>
  <InboxForm
    type="pdf"
    :payload="payload"
    :validate="validate"
    :in-modal="inModal"
    submit-label="Send request"
    sent-title="Request received"
    :sent-text="`A WID editor will e-mail you the PDF if we have it. This is done by hand, so it can take a few days.`"
    again-label="Request another reference"
    @reset="clear"
  >
    <!-- Reference from the WID bibliography -->
    <div v-if="citation">
      <span class="inbox-label">Reference</span>
      <p
        class="rounded-lg bg-base-background p-3 leading-relaxed text-base-content/85 ring-1 ring-base-border/50 [&_i]:italic"
        v-html="citation"
      />
      <a
        v-if="doi"
        :href="doiUrl(doi)"
        target="_blank"
        rel="noopener"
        class="mt-1 inline-block text-xs text-primary-color dark:text-secondary-color hover:underline"
        >doi:{{ doi }}</a
      >
    </div>

    <!-- Any other reference -->
    <ReferenceFields
      v-else
      :fields="reference"
    />

    <label class="block min-w-0">
      <span class="inbox-label">Note <span class="normal-case font-normal tracking-normal">(optional)</span></span>
      <textarea
        v-model="note"
        rows="2"
        maxlength="2000"
        placeholder="e.g. only the pages on Cryptinae"
        class="inbox-input"
      />
    </label>
  </InboxForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InboxForm from './InboxForm.vue'
import ReferenceFields from './ReferenceFields.vue'
import { doiUrl, emptyReference, formatReference, parseDoi } from './doiLookup.js'

const props = defineProps({
  citation: { type: String, default: '' }, // formatted reference from WID (HTML allowed)
  sourceId: { type: [Number, String], default: '' }, // TaxonWorks source id
  doi: { type: String, default: '' }, // DOI of that reference, or a DOI to pre-fill the free form
  inModal: { type: Boolean, default: false }
})

const reference = reactive({ ...emptyReference(), doi: props.citation ? '' : props.doi })
const note = ref('')

function validate() {
  if (props.citation) return ''
  return reference.title.trim() || parseDoi(reference.doi) ? '' : 'Please give at least the title of the work, or its DOI.'
}

function payload() {
  const doi = props.citation ? props.doi : parseDoi(reference.doi)
  return {
    citation: props.citation || formatReference(reference) || `DOI ${doi}`,
    sourceId: props.citation && props.sourceId ? String(props.sourceId) : '',
    doi,
    note: note.value
  }
}

function clear() {
  Object.assign(reference, emptyReference())
  note.value = ''
}
</script>
