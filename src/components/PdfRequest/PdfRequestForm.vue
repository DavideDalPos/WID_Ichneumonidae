<template>
  <div class="text-sm">
    <!-- Sent -->
    <div
      v-if="isSent"
      class="py-6 text-center"
    >
      <IconCheck class="mx-auto size-10 text-primary-color dark:text-secondary-color" />
      <p class="mt-3 text-lg font-semibold text-base-content">Request received</p>
      <p class="mt-2 text-base-content/70 max-w-md mx-auto">
        Thank you, {{ form.name.split(' ')[0] }}. A WID editor will e-mail the PDF to
        <b>{{ form.email }}</b> if we have it. This is done by hand, so it can take a few days.
      </p>
      <button
        v-if="!inModal"
        type="button"
        class="mt-5 rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-base-border hover:bg-base-muted/40"
        @click="startOver"
      >
        Request another reference
      </button>
    </div>

    <form
      v-else
      class="grid gap-4"
      @submit.prevent="submit"
    >
      <!-- Reference: fixed (from the WID bibliography) -->
      <div v-if="lockedCitation">
        <span class="pdf-label">Reference</span>
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

      <!-- Reference: typed in, or filled from a DOI -->
      <fieldset
        v-else
        class="grid gap-3 rounded-xl bg-base-background/60 p-4 ring-1 ring-base-border/50"
      >
        <legend class="sr-only">Reference</legend>
        <div>
          <label
            class="pdf-label"
            for="pdf-doi"
            >DOI <span class="normal-case font-normal tracking-normal">(fills in the details below)</span></label
          >
          <div class="flex gap-2">
            <input
              id="pdf-doi"
              v-model="form.doi"
              type="text"
              inputmode="url"
              placeholder="10.3897/zookeys.… or https://doi.org/…"
              class="pdf-input flex-1"
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
            v-if="lookupMessage"
            class="mt-1.5 text-xs"
            :class="lookupOk ? 'text-green-700 dark:text-green-400' : 'text-base-content/60'"
          >
            {{ lookupMessage }}
            <a
              v-if="lookupOk && parsedDoi"
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
          <span class="pdf-label">Author(s)</span>
          <input
            v-model="form.authors"
            type="text"
            maxlength="600"
            placeholder="e.g. Townes, H. & Townes, M."
            class="pdf-input"
          />
        </label>
        <div class="grid gap-3 sm:grid-cols-[6rem_1fr]">
          <label class="block min-w-0">
            <span class="pdf-label">Year</span>
            <input
              v-model="form.year"
              type="text"
              inputmode="numeric"
              maxlength="10"
              class="pdf-input"
            />
          </label>
          <label class="block min-w-0">
            <span class="pdf-label">Title</span>
            <input
              v-model="form.title"
              type="text"
              maxlength="800"
              class="pdf-input"
            />
          </label>
        </div>
        <div class="grid gap-3 sm:grid-cols-[1fr_7rem_7rem]">
          <label class="block min-w-0">
            <span class="pdf-label">Journal or book</span>
            <input
              v-model="form.journal"
              type="text"
              maxlength="400"
              class="pdf-input"
            />
          </label>
          <label class="block min-w-0">
            <span class="pdf-label">Volume</span>
            <input
              v-model="form.volume"
              type="text"
              maxlength="40"
              class="pdf-input"
            />
          </label>
          <label class="block min-w-0">
            <span class="pdf-label">Pages</span>
            <input
              v-model="form.pages"
              type="text"
              maxlength="40"
              class="pdf-input"
            />
          </label>
        </div>
      </fieldset>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block min-w-0">
          <span class="pdf-label">Your name</span>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="200"
            autocomplete="name"
            class="pdf-input"
          />
        </label>
        <label class="block min-w-0">
          <span class="pdf-label">E-mail</span>
          <input
            v-model="form.email"
            type="email"
            required
            maxlength="200"
            autocomplete="email"
            class="pdf-input"
          />
        </label>
      </div>

      <label class="block min-w-0">
        <span class="pdf-label">Institution <span class="normal-case font-normal tracking-normal">(optional)</span></span>
        <input
          v-model="form.institution"
          type="text"
          maxlength="300"
          autocomplete="organization"
          class="pdf-input"
        />
      </label>

      <label class="block min-w-0">
        <span class="pdf-label">Note <span class="normal-case font-normal tracking-normal">(optional)</span></span>
        <textarea
          v-model="form.note"
          rows="2"
          maxlength="2000"
          placeholder="e.g. only the pages on Cryptinae"
          class="pdf-input"
        />
      </label>

      <!-- Honeypot: hidden from people, filled in by bots -->
      <input
        v-model="form.website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="hidden"
      />

      <div
        v-if="TURNSTILE_SITE_KEY"
        ref="turnstileEl"
        class="min-h-[65px]"
      />

      <p
        v-if="error"
        class="rounded-lg bg-red-500/10 px-3 py-2 text-red-700 dark:text-red-300"
        role="alert"
      >
        {{ error }}
      </p>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-base-content/55 max-w-sm">
          Your details are seen only by the WID editors and used only to answer this request.
        </p>
        <button
          type="submit"
          :disabled="isSending || (!!TURNSTILE_SITE_KEY && !turnstileToken)"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-color px-5 py-2.5 text-sm font-semibold text-primary-content hover:opacity-90 disabled:opacity-50"
        >
          {{ isSending ? 'Sending…' : 'Send request' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { doiUrl, formatReference, lookupDoi, parseDoi } from './doiLookup.js'
import {
  TURNSTILE_SITE_KEY,
  loadContact,
  loadTurnstile,
  saveContact,
  sendPdfRequest
} from './usePdfRequest.js'

const props = defineProps({
  citation: { type: String, default: '' }, // formatted reference (HTML allowed)
  sourceId: { type: [Number, String], default: '' }, // TaxonWorks source id
  doi: { type: String, default: '' }, // DOI of a fixed citation, or a DOI to pre-fill the free form
  inModal: { type: Boolean, default: false }
})
const emit = defineEmits(['sent'])

const lockedCitation = computed(() => !!props.citation)

const form = reactive({
  name: '',
  email: '',
  institution: '',
  doi: '',
  authors: '',
  year: '',
  title: '',
  journal: '',
  volume: '',
  pages: '',
  note: '',
  website: ''
})
// DOI look-up (free-entry form only)
const parsedDoi = computed(() => parseDoi(form.doi))
const isLooking = ref(false)
const lookupMessage = ref('')
const lookupOk = ref(false)
let lastLooked = ''

async function lookup() {
  const doi = parsedDoi.value
  if (!doi || isLooking.value) return
  lastLooked = doi
  isLooking.value = true
  lookupMessage.value = ''
  try {
    const found = await lookupDoi(doi)
    if (found && (found.title || found.authors)) {
      Object.assign(form, found)
      lookupOk.value = true
      lookupMessage.value = 'Details filled in from the DOI — check them below.'
    } else {
      lookupOk.value = false
      lookupMessage.value = 'This DOI was not found. Please fill in the details below.'
    }
  } catch {
    lookupOk.value = false
    lookupMessage.value = 'The DOI could not be looked up right now. Please fill in the details below.'
  } finally {
    isLooking.value = false
  }
}

// Look up automatically once a complete DOI has been pasted or typed
let lookupTimer
watch(parsedDoi, (doi) => {
  clearTimeout(lookupTimer)
  if (doi && doi !== lastLooked) lookupTimer = setTimeout(lookup, 600)
})

const typedCitation = computed(() => formatReference(form))

const isSending = ref(false)
const isSent = ref(false)
const error = ref('')

const turnstileEl = ref(null)
const turnstileToken = ref('')
let widgetId = null

async function renderTurnstile() {
  if (!TURNSTILE_SITE_KEY) return
  await nextTick()
  if (!turnstileEl.value) return
  try {
    const turnstile = await loadTurnstile()
    if (widgetId !== null) turnstile.remove(widgetId)
    widgetId = turnstile.render(turnstileEl.value, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token) => (turnstileToken.value = token),
      'expired-callback': () => (turnstileToken.value = ''),
      'error-callback': () => (turnstileToken.value = '')
    })
  } catch (e) {
    error.value = 'The spam check could not load. Please check your connection or disable content blockers for this site.'
  }
}

async function submit() {
  error.value = ''
  if (!lockedCitation.value && !form.title.trim() && !parsedDoi.value) {
    error.value = 'Please give at least the title of the work, or its DOI.'
    return
  }
  isSending.value = true
  try {
    await sendPdfRequest({
      name: form.name,
      email: form.email,
      institution: form.institution,
      citation: props.citation || typedCitation.value || `DOI ${parsedDoi.value}`,
      sourceId: props.sourceId ? String(props.sourceId) : '',
      doi: props.doi || parsedDoi.value,
      note: form.note,
      website: form.website,
      turnstileToken: turnstileToken.value
    })
    saveContact(form)
    isSent.value = true
    emit('sent')
  } catch (e) {
    error.value = e.message
    turnstileToken.value = ''
    if (widgetId !== null) window.turnstile?.reset(widgetId)
  } finally {
    isSending.value = false
  }
}

function startOver() {
  Object.assign(form, { doi: '', authors: '', year: '', title: '', journal: '', volume: '', pages: '', note: '' })
  lookupMessage.value = ''
  lastLooked = ''
  isSent.value = false
  renderTurnstile()
}

onMounted(() => {
  Object.assign(form, loadContact())
  if (!props.citation && props.doi) form.doi = props.doi
  renderTurnstile()
})
onBeforeUnmount(() => {
  if (widgetId !== null) window.turnstile?.remove(widgetId)
})
</script>

<style scoped>
.pdf-label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--color-base-content), 0.55);
}
.pdf-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border-radius: 0.5rem;
  border: 0;
  background: rgb(var(--color-base-background));
  box-shadow: inset 0 0 0 1px rgba(var(--color-base-border), 0.7);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(var(--color-base-content));
}
.pdf-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgb(var(--color-primary));
}
</style>
