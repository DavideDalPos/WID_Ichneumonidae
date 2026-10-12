<template>
  <div>
    <ul class="flex flex-col gap-3">
      <template v-if="!list.length && loading">
        <li
          v-for="n in 5"
          :key="n"
          class="h-24 rounded-xl bg-base-foreground ring-1 ring-base-border/40 animate-pulse"
        />
      </template>
      <li
        v-for="s in list"
        :key="s.id"
        class="rounded-xl bg-base-foreground ring-1 ring-base-border/40 p-4"
      >
        <div class="flex items-center justify-between gap-3 text-xs text-base-content/55">
          <span class="font-semibold text-base-content/80 truncate">
            {{ s.cached_author_string || 'Unknown author' }}<template v-if="s.year">, {{ s.year }}</template>
          </span>
          <span class="flex-shrink-0">Added {{ added(s.created_at) }}</span>
        </div>
        <p
          class="mt-1.5 text-sm leading-relaxed text-base-content/80 [&_i]:italic"
          :class="compact ? 'line-clamp-3' : ''"
          v-html="clean(s.cached)"
        />
        <a
          v-if="s.doi"
          :href="`https://doi.org/${s.doi}`"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-color dark:text-secondary-color hover:underline"
        >
          DOI {{ s.doi }}
        </a>
      </li>
    </ul>

    <div
      v-if="!compact && list.length < total"
      class="mt-5 text-center"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40 disabled:opacity-50"
        :disabled="loading"
        @click="load(page + 1)"
      >
        {{ loading ? 'Loading…' : 'Show more' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/request'

const props = defineProps({
  per: { type: Number, default: 10 },
  compact: { type: Boolean, default: false }
})

const list = ref([])
const total = ref(0)
const page = ref(0)
const loading = ref(false)

// Drop the trailing DOI / URL text from the formatted citation; the DOI gets its own link
const clean = (html) =>
  String(html || '')
    .replace(/\s*(https?:\/\/doi\.org\/\S+|Available at \S+)\s*$/i, '')
    .trim()

const added = (iso) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function load(next) {
  loading.value = true
  try {
    const { data, headers } = await makeAPIRequest.get('/sources', {
      params: {
        in_project: true,
        recent: true,
        recent_target: 'created_at',
        per: props.per,
        page: next
      }
    })
    total.value = Number(headers['pagination-total']) || 0
    list.value = next === 1 ? data : [...list.value, ...data]
    page.value = next
  } catch {
    // keep what we have
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
