<template>
  <VButton
    primary
    class="text-sm flex items-center"
    title="How to cite this page"
    @click="isOpen = true"
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
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.99 2.7 3.22 1.09.16 2.19.28 3.3.37V21l4.08-4.08a1.13 1.13 0 0 1 .78-.33 48.1 48.1 0 0 0 5.83-.5c1.58-.23 2.7-1.62 2.7-3.22V6.74c0-1.6-1.12-2.99-2.7-3.22A48.4 48.4 0 0 0 12 3c-2.39 0-4.73.17-7.02.52-1.58.23-2.7 1.62-2.7 3.22v6.02Z"
      />
    </svg>
    Cite
  </VButton>

  <Teleport to="body">
    <VModal
      v-if="isOpen"
      container-class="max-w-2xl"
      aria-label="Cite this page"
      @close="isOpen = false"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-base-content px-1">Cite this page</h2>
      </template>
      <div class="px-5 pb-6 text-base-content">
        <div class="relative rounded-xl bg-base-background ring-1 ring-base-border/50 p-4 pr-14 text-sm leading-relaxed break-words">
          {{ cite.authors }}
          <span v-html="cite.subjectHtml.value" />
          {{ cite.citation }}. Retrieved on {{ cite.date }}<template v-if="cite.url.value">
            at
            <a :href="cite.url.value">{{ cite.url.value }}</a></template
          >
          <VClipboard
            class="!absolute top-3 right-3"
            :text="cite.text.value"
          />
        </div>
        <p class="mt-3 text-xs text-base-content/60">
          Please also cite the original publications for the data you use; they
          are listed in the Nomenclature references panel.
        </p>
      </div>
    </VModal>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { usePageCitation } from '@/composables/usePageCitation'

const isOpen = ref(false)
const cite = usePageCitation()
</script>
