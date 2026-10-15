<template>
  <template v-if="enabled">
    <button
      type="button"
      :class="
        compact
          ? 'inline-flex items-center gap-1 text-xs font-medium text-base-content/55 hover:text-primary-color dark:hover:text-secondary-color'
          : 'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-base-content/80 ring-1 ring-base-border/60 hover:bg-base-muted/40 transition'
      "
      :title="compact ? 'Request a PDF of this reference' : undefined"
      @click="isOpen = true"
    >
      <IconDocument :class="compact ? 'size-3.5' : 'size-4 text-primary-color dark:text-secondary-color'" />
      Request PDF
    </button>
    <Teleport to="body">
      <VModal
        v-if="isOpen"
        container-class="max-w-2xl"
        aria-label="Request a PDF"
        @close="isOpen = false"
      >
        <template #header>
          <h2 class="text-base font-semibold">Request a PDF</h2>
        </template>
        <div class="px-4 pb-5">
          <PdfRequestForm
            :citation="citation"
            :source-id="sourceId"
            :doi="doi"
            in-modal
          />
        </div>
      </VModal>
    </Teleport>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import PdfRequestForm from './PdfRequestForm.vue'
import { isInboxEnabled } from './useInbox.js'

defineProps({
  citation: { type: String, required: true },
  sourceId: { type: [Number, String], default: '' },
  doi: { type: String, default: '' },
  compact: { type: Boolean, default: false } // small text link, for reference lists on taxon pages
})

const enabled = isInboxEnabled()
const isOpen = ref(false)
</script>
