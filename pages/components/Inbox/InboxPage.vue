<template>
  <div class="wid-home bg-base-background min-h-screen">
    <PageHeader
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
    />

    <section class="container mx-auto px-4 -mt-8 relative z-10 pb-16 grid gap-8 lg:grid-cols-12 items-start">
      <div class="lg:col-span-7 rounded-2xl bg-base-foreground p-5 sm:p-7 ring-1 ring-base-border/40 shadow-xl shadow-black/5">
        <p
          v-if="!enabled"
          class="text-base-content/70"
        >
          This form is not open yet. Please contact the editors listed on the
          <RouterLink
            to="/about"
            class="underline"
            >About</RouterLink
          >
          page.
        </p>
        <ClientOnly v-else>
          <slot />
        </ClientOnly>
      </div>

      <aside class="lg:col-span-5 lg:pt-12">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">How it works</h2>
        <ol class="mt-4 space-y-5">
          <li
            v-for="(s, i) in steps"
            :key="i"
            class="grid grid-cols-[2rem_1fr] gap-3"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-color text-primary-content text-sm font-bold">{{
              i + 1
            }}</span>
            <div>
              <p class="font-semibold text-base-content">{{ s.title }}</p>
              <p
                class="mt-1 text-sm leading-relaxed text-base-content/65"
                v-html="s.text"
              />
            </div>
          </li>
        </ol>
        <p class="mt-6 text-sm text-base-content/60">
          Messages are read by the WID editors. Your name and e-mail are seen only by them and used only to reply to you.
        </p>
        <nav class="mt-6 flex flex-wrap gap-2 text-sm">
          <RouterLink
            v-for="l in otherForms"
            :key="l.to"
            :to="l.to"
            class="rounded-full px-3 py-1 ring-1 ring-base-border/70 text-base-content/75 hover:bg-base-muted/40"
            >{{ l.label }}</RouterLink
          >
        </nav>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../Home/PageHeader.vue'
import { isInboxEnabled } from '@/components/Inbox/useInbox.js'

defineProps({
  eyebrow: { type: String, default: 'Get involved' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  steps: { type: Array, default: () => [] } // [{ title, text (HTML) }]
})

const enabled = isInboxEnabled()
const route = useRoute()
const FORMS = [
  { to: '/request-pdf', label: 'Request a PDF' },
  { to: '/submit-publication', label: 'Submit a missing publication' },
  { to: '/report-error', label: 'Report an error' }
]
const otherForms = computed(() => FORMS.filter((f) => f.to !== route.path))
</script>
