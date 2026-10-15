<template>
  <template v-if="enabled">
    <VButton
      class="text-sm flex items-center whitespace-nowrap"
      title="Report an error on this page"
      @click="open"
    >
      <svg
        class="w-4 h-4 mr-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m16.86 4.49 1.69-1.69a1.88 1.88 0 1 1 2.65 2.65L10.58 16.07a4.5 4.5 0 0 1-1.9 1.13L6 18l.8-2.68a4.5 4.5 0 0 1 1.13-1.9l8.93-8.93Zm0 0L19.5 7.13M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
      {{ label }}
    </VButton>
    <Teleport to="body">
      <VModal
        v-if="isOpen"
        container-class="max-w-2xl"
        aria-label="Report an error"
        @close="isOpen = false"
      >
        <template #header>
          <h2 class="text-base font-semibold">Report an error</h2>
        </template>
        <div class="px-4 pb-5">
          <CorrectionForm
            :subject="subject"
            :page-url="pageUrl"
            in-modal
          />
        </div>
      </VModal>
    </Teleport>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import CorrectionForm from './CorrectionForm.vue'
import { isInboxEnabled } from './useInbox.js'

defineProps({
  subject: { type: String, default: '' }, // e.g. the taxon name, pre-filled in the form
  label: { type: String, default: 'Report error' }
})

const enabled = isInboxEnabled()
const isOpen = ref(false)
const pageUrl = ref('')

function open() {
  pageUrl.value = window.location.href
  isOpen.value = true
}
</script>
