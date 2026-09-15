<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-semibold text-base-content mb-4">Keys</h1>

    <KeySearchBar
      v-model="searchQuery"
      placeholder="Search keys by taxon name…"
      class="mb-4"
    />

    <VSpinner v-if="loading" />
    <p
      v-else-if="!keys.length"
      class="text-base-soft"
    >No public keys in this project.</p>
    <p
      v-else-if="!filteredKeys.length"
      class="text-base-soft"
    >No keys match “{{ searchQuery }}”.</p>

    <ul
      v-else
      class="space-y-4"
    >
      <li
        v-for="k in filteredKeys"
        :key="k.id"
        class="rounded-lg border border-base-muted bg-base-foreground p-4 sm:p-5"
      >
        <RouterLink
          :to="{ name: 'dichotomous-key', params: { id: k.id } }"
          class="text-lg text-secondary hover:underline [&_i]:italic"
          v-html="k.titleHtml"
        />
        <p
          v-if="k.scope"
          class="mt-1 text-sm text-base-content [&_i]:italic"
        >
          <span class="text-base-soft">Scope: </span><RouterLink
            v-if="k.otuId"
            :to="{ name: 'otus-id', params: { id: k.otuId } }"
            target="_blank"
            rel="noopener"
            class="text-secondary hover:underline"
          ><span
            v-if="k.scopeHtml"
            v-html="k.scopeHtml"
          /><template v-else>{{ k.scope }}</template></RouterLink><span
            v-else-if="k.scopeHtml"
            v-html="k.scopeHtml"
          /><template v-else>{{ k.scope }}</template>
        </p>
        <p
          v-if="k.citation"
          class="mt-1 text-sm text-base-content [&_i]:italic"
        >
          <span class="text-base-soft">Primary source: </span><span v-html="sanitizeAndLinkifyHtml(k.citation)" />
        </p>
        <p
          v-if="k.description"
          class="mt-1 text-sm text-base-content"
        >
          <span class="text-base-soft">Description: </span>{{ k.description }}
        </p>

        <div class="mt-2 flex flex-wrap gap-2 text-xs text-base-soft">
          <span
            v-if="k.coupletsCount"
            class="border border-base-muted rounded px-2 py-0.5"
          >{{ k.coupletsCount }} couplets</span>
          <span
            v-if="k.taxaCount"
            class="border border-base-muted rounded px-2 py-0.5"
          >{{ k.taxaCount }} taxa</span>
          <span
            v-if="k.updatedInWords"
            class="border border-base-muted rounded px-2 py-0.5"
          >updated {{ k.updatedInWords }} ago</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { makeAPIRequest } from '@/utils/request'
import { sanitizeAndLinkifyHtml } from '@/utils'
import { rankIndex } from './lib/completeness.js'
import KeySearchBar from './KeySearchBar.vue'

const loading = ref(true)
const keys = ref([])
const searchQuery = ref('')

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