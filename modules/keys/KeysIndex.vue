<template>
  <div class="wid-home bg-base-background">
    <header class="wid-keys-header text-white">
      <div class="container mx-auto px-4 py-12 sm:py-16">
        <p class="text-xs font-semibold uppercase tracking-wider text-secondary-color">
          Identify
        </p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
          Identification keys
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-white/75">
          Interactive dichotomous keys from the published literature. Step
          through them couplet by couplet, or view the whole key at once.
        </p>
        <ul
          v-if="keys.length"
          class="mt-6 flex flex-wrap gap-2 text-sm"
        >
          <li
            v-for="s in totals"
            :key="s.label"
            class="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1.5 text-white/80"
          >
            <strong class="text-white tabular-nums">{{ s.value }}</strong>
            {{ s.label }}
          </li>
        </ul>
      </div>
    </header>

    <section class="container mx-auto px-4 py-10 sm:py-12">
      <div class="relative max-w-md">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search keys by taxon, title or description…"
          aria-label="Search keys"
          class="w-full rounded-lg bg-base-foreground ring-1 ring-base-border/60 focus:ring-2 focus:ring-primary-color outline-none border-0 py-2.5 pl-9 pr-3 text-sm text-base-content"
        />
      </div>

      <div
        v-if="loading"
        class="mt-8 grid gap-5 md:grid-cols-2"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="h-48 rounded-2xl bg-base-foreground ring-1 ring-base-border/40 animate-pulse"
        />
      </div>
      <p
        v-else-if="!keys.length"
        class="mt-8 text-base-content/60"
      >
        No public keys in this project yet.
      </p>
      <p
        v-else-if="!filteredKeys.length"
        class="mt-8 text-base-content/60"
      >
        No keys match “{{ searchQuery }}”.
      </p>

      <ul
        v-else
        class="mt-8 grid gap-5 md:grid-cols-2"
      >
        <li
          v-for="k in filteredKeys"
          :key="k.id"
          class="group flex flex-col rounded-2xl bg-base-foreground ring-1 ring-base-border/40 hover:ring-primary-color/50 dark:hover:ring-secondary-color/50 hover:shadow-lg transition-all overflow-hidden"
        >
          <div class="p-6 flex-grow">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p
                  v-if="k.scope"
                  class="text-xs font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color [&_i]:normal-case [&_i]:italic [&_i]:text-sm"
                >
                  <span
                    v-if="k.scopeHtml"
                    v-html="k.scopeHtml"
                  /><template v-else>{{ k.scope }}</template>
                </p>
                <h2 class="mt-1 text-lg font-semibold leading-snug text-base-content [&_i]:italic">
                  <RouterLink
                    :to="{ name: 'dichotomous-key', params: { id: k.id } }"
                    class="text-base-content hover:text-primary-color dark:hover:text-secondary-color"
                    v-html="k.titleHtml"
                  />
                </h2>
              </div>
              <span
                class="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-color text-primary-content"
                aria-hidden="true"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.03 5.91c-.56-.1-1.16.03-1.56.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.82c0-.6.24-1.17.66-1.59l5.16-5.16c.4-.4.52-1 .43-1.56A6 6 0 1 1 21.75 8.25Z"
                  />
                </svg>
              </span>
            </div>

            <p
              v-if="k.description"
              class="mt-3 text-sm text-base-content/75"
            >
              {{ k.description }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span
                v-if="k.coupletsCount"
                class="rounded-full bg-base-muted/50 px-2.5 py-1 font-medium text-base-content/75"
                >{{ k.coupletsCount }} couplet{{ k.coupletsCount === 1 ? '' : 's' }}</span
              >
              <span
                v-if="k.taxaCount"
                class="rounded-full bg-base-muted/50 px-2.5 py-1 font-medium text-base-content/75"
                >{{ k.taxaCount }} taxa</span
              >
              <span
                v-if="k.updatedInWords"
                class="rounded-full px-2.5 py-1 text-base-content/55"
                >Updated {{ k.updatedInWords }} ago</span
              >
            </div>

            <p
              v-if="k.citation"
              class="mt-4 text-xs leading-relaxed text-base-content/60 line-clamp-3 [&_i]:italic [&_a]:text-primary-color dark:[&_a]:text-secondary-color [&_a]:break-all"
              v-html="sanitizeAndLinkifyHtml(k.citation)"
            />
          </div>

          <div class="flex items-center gap-2 border-t border-base-border/30 px-6 py-3 bg-base-background/50">
            <RouterLink
              :to="{ name: 'dichotomous-key', params: { id: k.id } }"
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary-color px-3.5 py-2 text-sm font-semibold text-primary-content hover:opacity-90"
            >
              Start key
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </RouterLink>
            <RouterLink
              v-if="k.otuId"
              :to="{ name: 'otus-id', params: { id: k.otuId } }"
              class="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40"
            >
              Taxon page
            </RouterLink>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { makeAPIRequest } from '@/utils/request'
import { sanitizeAndLinkifyHtml } from '@/utils'
import { rankIndex } from './lib/completeness.js'

const loading = ref(true)
const keys = ref([])
const searchQuery = ref('')

const totals = computed(() => {
  const couplets = keys.value.reduce((n, k) => n + (k.coupletsCount || 0), 0)
  const taxa = keys.value.reduce((n, k) => n + (k.taxaCount || 0), 0)
  return [
    { value: keys.value.length, label: keys.value.length === 1 ? 'key' : 'keys' },
    { value: couplets, label: 'couplets' },
    { value: taxa, label: 'taxa covered' }
  ]
})

// Strip HTML tags so a search for "Ilma" matches the stored "<i>Ilma</i>".
function plain(s) {
  return String(s || '').replace(/<[^>]*>/g, '')
}

// Filter keys by title + scope + description (case-insensitive). Empty → all.
const filteredKeys = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return keys.value
  return keys.value.filter((k) => {
    const haystack = [
      plain(k.titleHtml || k.title),
      plain(k.scopeHtml || k.scope),
      k.description || ''
    ].join(' ').toLowerCase()
    return haystack.includes(q)
  })
})

// Pull the marked-up scope name out of an OTU object_tag.
function scopeNameFromObjectTag(tag) {
  if (!tag) return null
  const m = String(tag).match(/otu_tag_(?:taxon_name|otu_name)[^>]*>([\s\S]*?)<\/span>/)
  return m ? m[1].trim() || null : null
}

// Escape plain text before inserting into a v-html string.
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Italicize the genus in a plain-text title using the key's own scope name.
function italicizeTitle(title, scopeHtml) {
  const safe = escHtml(title || '')
  if (!scopeHtml) return safe
  const genus = String(scopeHtml).replace(/<[^>]*>/g, '').trim().split(/\s+/)[0]
  if (!genus) return safe
  const re = new RegExp(`\\b(${genus.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`)
  return safe.replace(re, '<i>$1</i>')
}

onMounted(async () => {
  try {
    const { data: list } = await makeAPIRequest.get('/leads', { params: { per: 1000 } })
    const rows = Array.isArray(list) ? list : []
    const metas = await Promise.all(
      rows.map((r) =>
        makeAPIRequest
          .get(`/leads/key/${r.id}`)
          .then((res) => res.data?.metadata || {})
          .catch(() => ({}))
      )
    )

    const otuIds = [...new Set(rows.map((r) => r.otu_id).filter(Boolean))]
    const nameByOtuId = new Map()
    const rankIdxByOtuId = new Map()
    if (otuIds.length) {
      try {
        const oq = new URLSearchParams()
        otuIds.forEach((id) => oq.append('otu_id[]', id))
        oq.set('per', '1000')
        const { data: otus } = await makeAPIRequest.get(`/otus?${oq.toString()}`)

        const tnIdByOtuId = new Map()
        for (const o of Array.isArray(otus) ? otus : []) {
          nameByOtuId.set(o.id, scopeNameFromObjectTag(o.object_tag))
          if (o.taxon_name_id != null) tnIdByOtuId.set(o.id, o.taxon_name_id)
        }

        const tnIds = [...new Set(tnIdByOtuId.values())]
        if (tnIds.length) {
          const tq = new URLSearchParams()
          tnIds.forEach((id) => tq.append('taxon_name_id[]', id))
          tq.set('per', '1000')
          const { data: tns } = await makeAPIRequest.get(`/taxon_names?${tq.toString()}`)
          const rankByTnId = new Map(
            (Array.isArray(tns) ? tns : []).map((t) => [t.id, t.rank || t.rank_string])
          )
          for (const [otuId, tnId] of tnIdByOtuId) {
            rankIdxByOtuId.set(otuId, rankIndex(rankByTnId.get(tnId)))
          }
        }
      } catch {
        // leave empty — scope falls back to plain text, no sort key
      }
    }

    keys.value = rows
      .map((r, i) => {
        const title = metas[i].title || r.text || `Key ${r.id}`
        const scopeHtml = nameByOtuId.get(r.otu_id) || null
        return {
          id: r.id,
          title,
          titleHtml: italicizeTitle(title, scopeHtml),
          scope: metas[i].taxonomic_scope || null,
          otuId: r.otu_id || null,
          scopeHtml,
          scopeRankIdx: rankIdxByOtuId.get(r.otu_id) ?? -1,
          citation: metas[i].origin_citation || null,
          description: r.description || null,
          coupletsCount: r.couplets_count || null,
          taxaCount: r.otus_count
            ? Math.max(0, r.otus_count - (r.otu_id ? 1 : 0))
            : null,
          updatedInWords: r.key_updated_at_in_words || null
        }
      })
      .sort((a, b) => {
        const ra = a.scopeRankIdx < 0 ? Infinity : a.scopeRankIdx
        const rb = b.scopeRankIdx < 0 ? Infinity : b.scopeRankIdx
        if (ra !== rb) return ra - rb
        if ((a.coupletsCount || 0) !== (b.coupletsCount || 0)) {
          return (b.coupletsCount || 0) - (a.coupletsCount || 0)
        }
        return String(a.title).localeCompare(String(b.title))
      })
  } catch {
    keys.value = []
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.wid-keys-header {
  background:
    radial-gradient(50rem 20rem at 90% 0%, rgba(42, 98, 183, 0.45), transparent 60%),
    linear-gradient(180deg, #0f1b33 0%, #13223f 100%);
}
</style>
