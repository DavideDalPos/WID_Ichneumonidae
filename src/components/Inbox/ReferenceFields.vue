<template>
  <fieldset class="grid gap-3 rounded-xl bg-base-background/60 p-4 ring-1 ring-base-border/50">
    <legend class="sr-only">Reference</legend>
    <div>
      <label
        class="inbox-label"
        :for="`${uid}-doi`"
        >DOI <span class="normal-case font-normal tracking-normal">(fills in the details below)</span></label
      >
      <div class="flex gap-2">
        <input
          :id="`${uid}-doi`"
          v-model="fields.doi"
          type="text"
          inputmode="url"
          placeholder="10.3897/zookeys.… or https://doi.org/…"
          class="inbox-input flex-1"
          @keydown.enter.prevent="lookup"
        />
        <button
          type="button"
          :disabled="!parsedDoi || isLooking"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-base-border hover:bg-base-muted/40 disabled:opacity-50"
          @click="lookup"
        >
          {{ isLooking ? 'Looking up…' : 'Look up' }}
        </button>
      </div>
      <p
        v-if="message"
        class="mt-1.5 text-xs"
        :class="found ? 'text-green-700 dark:text-green-400' : 'text-base-content/60'"
      >
        {{ message }}
        <a
          v-if="found && parsedDoi"
          :href="doiUrl(parsedDoi)"
          target="_blank"
          rel="noopener"
          class="underline"
          >Open</a
        >
      </p>
    </div>

    <p class="text-xs text-base-content/55 -mb-1">No DOI? Fill in what you know.</p>

    <label class="block min-w-0">
      <span class="inbox-label">Author(s)</span>
      <input
        v-model="fields.authors"
        type="text"
        maxlength="600"
        placeholder="e.g. Townes, H. & Townes, M."
        class="inbox-input"
      />
    </label>
    <div class="grid gap-3 sm:grid-cols-[6rem_1fr]">
      <label class="block min-w-0">
        <span class="inbox-label">Year</span>
        <input
          v-model="fields.year"
          type="text"
          inputmode="numeric"
          maxlength="10"
          class="inbox-input"
        />
      </label>
      <label class="block min-w-0">
        <span class="inbox-label">Title</span>
        <input
          v-model="fields.title"
          type="text"
          maxlength="800"
          class="inbox-input"
        />
      </label>
    </div>
    <div class="grid gap-3 sm:grid-cols-[1fr_7rem_7rem]">
      <label class="block min-w-0">
        <span class="inbox-label">Journal or book</span>
        <input
          v-model="fields.journal"
          type="text"
          maxlength="400"
          class="inbox-input"
        />
      </label>
      <label class="block min-w-0">
        <span class="inbox-label">Volume</span>
        <input
          v-model="fields.volume"
          type="text"
          maxlength="40"
          class="inbox-input"
        />
      </label>
      <label class="block min-w-0">
        <span class="inbox-label">Pages</span>
        <input
          v-model="fields.pages"
          type="text"
          maxlength="40"
          class="inbox-input"
        />
      </label>
    </div>
  </fieldset>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { doiUrl, lookupDoi, parseDoi } from './doiLookup.js'

// `fields` is a reactive object owned by the parent form (see emptyReference)
const props = defineProps({
  fields: { type: Object, required: true }
})

const uid = `ref-${Math.random().toString(36).slice(2, 8)}`
const parsedDoi = computed(() => parseDoi(props.fields.doi))
const isLooking = ref(false)
const message = ref('')
const found = ref(false)
let lastLooked = ''

async function lookup() {
  const doi = parsedDoi.value
  if (!doi || isLooking.value) return
  lastLooked = doi
  isLooking.value = true
  message.value = ''
  try {
    const result = await lookupDoi(doi)
    if (result && (result.title || result.authors)) {
      Object.assign(props.fields, result)
      found.value = true
      message.value = 'Details filled in from the DOI — please check them.'
    } else {
      found.value = false
      message.value = 'This DOI was not found. Please fill in the details below.'
    }
  } catch {
    found.value = false
    message.value = 'The DOI could not be looked up right now. Please fill in the details below.'
  } finally {
    isLooking.value = false
  }
}

// Look up automatically once a complete DOI has been pasted or typed
let timer
watch(parsedDoi, (doi) => {
  clearTimeout(timer)
  if (!doi) {
    message.value = ''
    lastLooked = ''
  } else if (doi !== lastLooked) timer = setTimeout(lookup, 600)
})

onMounted(() => {
  if (parsedDoi.value && !props.fields.title) lookup()
})
</script>
