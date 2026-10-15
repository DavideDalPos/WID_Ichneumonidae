<template>
  <div class="text-sm">
    <!-- Sent -->
    <div
      v-if="isSent"
      class="py-6 text-center"
    >
      <IconCheck class="mx-auto size-10 text-primary-color dark:text-secondary-color" />
      <p class="mt-3 text-lg font-semibold text-base-content">{{ sentTitle }}</p>
      <p class="mt-2 text-base-content/70 max-w-md mx-auto">
        Thank you, {{ contact.name.split(' ')[0] }}. {{ sentText }}
      </p>
      <button
        v-if="!inModal"
        type="button"
        class="mt-5 rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-base-border hover:bg-base-muted/40"
        @click="startOver"
      >
        {{ againLabel }}
      </button>
    </div>

    <form
      v-else
      class="grid gap-4"
      novalidate
      @submit.prevent="submit"
    >
      <!-- Form-specific fields -->
      <slot />

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block min-w-0">
          <span class="inbox-label">Your name</span>
          <input
            v-model="contact.name"
            type="text"
            maxlength="200"
            autocomplete="name"
            class="inbox-input"
          />
        </label>
        <label class="block min-w-0">
          <span class="inbox-label">E-mail</span>
          <input
            v-model="contact.email"
            type="email"
            maxlength="200"
            autocomplete="email"
            class="inbox-input"
          />
        </label>
      </div>

      <label class="block min-w-0">
        <span class="inbox-label">Institution <span class="normal-case font-normal tracking-normal">(optional)</span></span>
        <input
          v-model="contact.institution"
          type="text"
          maxlength="300"
          autocomplete="organization"
          class="inbox-input"
        />
      </label>

      <slot name="after-contact" />

      <!-- Honeypot: hidden from people, filled in by bots -->
      <input
        v-model="honeypot"
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
        v-if="error || turnstileFailed"
        class="rounded-lg bg-red-500/10 px-3 py-2 text-red-700 dark:text-red-300"
        role="alert"
      >
        {{
          error ||
          'The spam check could not load. Please check your connection or disable content blockers for this site.'
        }}
      </p>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-base-content/55 max-w-sm">
          Your details are seen only by the WID editors and used only to answer you.
        </p>
        <button
          type="submit"
          :disabled="isSending || (!!TURNSTILE_SITE_KEY && !turnstileToken)"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-color px-5 py-2.5 text-sm font-semibold text-primary-content hover:opacity-90 disabled:opacity-50"
        >
          {{ isSending ? 'Sending…' : submitLabel }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { TURNSTILE_SITE_KEY, loadContact, saveContact, sendToInbox, useTurnstile } from './useInbox.js'

const props = defineProps({
  type: { type: String, required: true }, // 'pdf' | 'publication' | 'correction'
  // () => ({ ...fields }) — the form-specific part of the message
  payload: { type: Function, required: true },
  // () => '' | 'error message' — checked before sending
  validate: { type: Function, default: () => '' },
  submitLabel: { type: String, default: 'Send' },
  sentTitle: { type: String, default: 'Message received' },
  sentText: { type: String, default: 'A WID editor will look at it soon.' },
  againLabel: { type: String, default: 'Send another' },
  inModal: { type: Boolean, default: false }
})
const emit = defineEmits(['sent', 'reset'])

const contact = reactive({ name: '', email: '', institution: '' })
const honeypot = ref('')
const isSending = ref(false)
const isSent = ref(false)
const error = ref('')

const turnstileEl = ref(null)
const { token: turnstileToken, failed: turnstileFailed, render, reset } = useTurnstile(turnstileEl)

async function submit() {
  error.value = props.validate() || ''
  if (!error.value && !contact.name.trim()) error.value = 'Please enter your name.'
  if (!error.value && !/^\S+@\S+\.\S{2,}$/.test(contact.email.trim())) error.value = 'Please enter a valid e-mail address.'
  if (error.value) return

  isSending.value = true
  try {
    await sendToInbox({
      ...props.payload(),
      type: props.type,
      ...contact,
      website: honeypot.value,
      turnstileToken: turnstileToken.value
    })
    saveContact(contact)
    isSent.value = true
    emit('sent')
  } catch (e) {
    error.value = e.message
    reset()
  } finally {
    isSending.value = false
  }
}

async function startOver() {
  emit('reset')
  error.value = ''
  isSent.value = false
  await nextTick()
  render()
}

onMounted(async () => {
  Object.assign(contact, loadContact())
  await nextTick()
  render()
})
</script>

<style>
.inbox-label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--color-base-content), 0.55);
}
.inbox-input {
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
.inbox-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgb(var(--color-primary));
}
</style>
