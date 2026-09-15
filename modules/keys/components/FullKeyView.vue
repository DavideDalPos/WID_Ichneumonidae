<template>
  <div class="[&_i]:italic">
    <section
      v-for="couplet in couplets"
      :key="couplet.id"
      :id="`couplet-${couplet.coupletNumber}`"
      :data-current="isCurrent(couplet) || null"
      class="mb-6 scroll-mt-24 rounded transition-colors"
      :class="isCurrent(couplet)
        ? 'ring-2 ring-base-muted ring-offset-2 ring-offset-base-foreground bg-base-muted/20'
        : ''"
    >
      <div class="flex gap-3">
        <!-- Couplet number: thin outline circle -->
        <RouterLink
          :to="coupletTo(couplet.coupletNumber)"
          class="shrink-0 inline-flex items-center justify-center w-8 h-8 tabular-nums font-semibold text-sm rounded-full border border-[#c9c7bf] text-[#44443f] hover:border-[#44443f] hover:text-black transition-colors"
          :aria-label="`Couplet ${couplet.coupletNumber}`"
        >{{ couplet.coupletNumber }}</RouterLink>

        <div class="flex-1 min-w-0">
          <p v-if="fromCouplet(couplet)" class="text-xs mb-1">
            <RouterLink
              :to="coupletTo(fromCouplet(couplet))"
              class="inline-flex items-center gap-0.5 text-[#6b7280] hover:text-[#44443f] hover:underline transition-colors"
              :aria-label="`Back to couplet ${fromCouplet(couplet)}`"
            ><span aria-hidden="true">←</span> from {{ fromCouplet(couplet) }}</RouterLink>
          </p>

          <!-- Shared figure (on every lead) sits once, above the leads. -->
          <LeadFigures
            v-if="hasShared(couplet.id)"
            :figures="sharedFiguresOf(couplet.id)"
            class="mb-3"
          />

          <!-- Leads: description, dotted leader → target, then THIS lead's own
               figures directly below it. -->
          <div
            v-for="(choice, idx) in childrenOf(couplet.id)"
            :key="choice.id"
            class="mb-4 last:mb-0 transition-opacity"
            :class="isDimmed(choice) ? 'opacity-40' : ''"
            :title="isDimmed(choice) ? `leads only outside ${geoLabel}` : undefined"
          >
            <div class="flex gap-2">
              <span class="text-base-soft shrink-0 w-4 text-right">{{ idx === 0 ? '' : '—' }}</span>

              <div class="flex-1 min-w-0">
                <LeadText :node="choice" :citations="citations" @open-citation="$emit('open-citation', $event)" />
                <!-- dotted leader row: dots stretch, target pinned right -->
                <div class="flex items-baseline mt-0.5">
                  <span class="flex-1 self-end border-b-2 border-dotted border-[#c9c7bf] mr-1.5 mb-1.5 min-w-[1.5rem]" aria-hidden="true"></span>
                  <span class="shrink-0 whitespace-nowrap">
                    <RouterLink
                      v-if="choice.isCouplet"
                      :to="coupletTo(choice.coupletNumber)"
                      class="text-[0.95rem] font-semibold tabular-nums no-underline text-[#44443f] hover:text-black hover:underline transition-colors"
                      :aria-label="`Go to couplet ${choice.coupletNumber}`"
                    >{{ choice.coupletNumber }}</RouterLink>

                    <TaxonLink
                      v-else-if="choice.targetType === '/api/v1/otus'"
                      :id="choice.targetId"
                      :label="String(choice.targetLabel)"
                      variant="pill"
                      :suppress-geo-dim="isDimmed(choice)"
                    />

                    
                    <a  v-else-if="choice.targetLink"
                      :href="choice.targetLink"
                      target="_blank"
                      rel="noopener"
                      class="text-[0.95rem] font-semibold no-underline text-[#44443f] hover:text-black hover:underline transition-colors"
                    >{{ choice.targetLabel }}</a>

                    <span v-else class="text-base-soft">{{ choice.targetLabel }}</span>
                  </span>
                </div>

                <!-- This lead's own figures, directly beneath its text.
                     Only when there's no shared figure (that's shown above).
                     Rendered for every lead so the taxon-image fallback loader runs;
                     LeadFigures self-hides when a lead has no figures/OTU target. -->
                <LeadFigures
                  v-if="!hasShared(couplet.id)"
                  :node="choice"
                  :figures="ownFiguresOf(couplet.id, choice.id)"
                  class="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- floating jump-to-current button -->
    <button
      v-if="currentCoupletNumber"
      type="button"
      class="key-print-hide fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-full text-sm px-3 py-2 shadow-lg bg-[#44443f] text-white hover:bg-[#5f5e5a] transition-colors"
      :aria-label="`Scroll to current couplet ${currentCoupletNumber}`"
      @click="scrollToCouplet(currentCoupletNumber)"
    >↑ {{ currentCoupletNumber }}</button>
  </div>
</template>

<script setup>
import { watch, nextTick, computed, inject } from 'vue'
import { childChoices } from '../lib/tree.js'
import { leadGeoStatus } from '../lib/geoMatch.js'
import { partitionCoupletFigures } from '../lib/images.js'
import LeadText from './LeadText.vue'
import TaxonLink from './TaxonLink.vue'
import LeadFigures from './LeadFigures.vue'

const props = defineProps({
  keyId: { type: [String, Number], required: true },
  couplet: { type: String, default: null },
  couplets: { type: Array, required: true },
  nodes: { type: Object, required: true },
  citations: { type: Object, default: () => ({}) }
})
defineEmits(['open-citation'])

const childrenOf = (id) => childChoices(id, props.nodes)

// Geography path roll-up: dim a lead whose whole reachable subtree is outside
// the selection. 'unknown' and 'in' are left alone.
const geo = inject('keyGeo', null)
const geoLabel = computed(() => geo?.selectionLabel?.value || 'the selected area')
function leadStatus(nodeId) {
  if (!geo) return 'in'
  return leadGeoStatus(
    geo.reachableTerminalsByNode.value.get(Number(nodeId)),
    geo.territoriesByOtu.value,
    geo.effective.value,
    geo.hasDataByOtu?.value ?? null
  )
}
// Dim any lead whose reachable subtree is entirely out of area, taxon leads
// included (the taxon pill is told to suppress its own dimming so opacities
// don't compound).
const isDimmed = (choice) => leadStatus(choice.id) === 'out'

// Per couplet: figures shared by every lead (hoisted to a couplet-level row) vs.
// the individual figures that stay under each lead. Keyed by couplet id.
const coupletFigures = computed(() => {
  const out = {}
  for (const couplet of props.couplets) {
    const leads = childrenOf(couplet.id)
    const { shared, own } = partitionCoupletFigures(leads.map((l) => l.figures || []))
    out[couplet.id] = {
      shared,
      ownByLeadId: Object.fromEntries(leads.map((l, i) => [l.id, own[i] || []]))
    }
  }
  return out
})
const sharedFiguresOf = (coupletId) => coupletFigures.value[coupletId]?.shared || []
const hasShared = (coupletId) => sharedFiguresOf(coupletId).length > 0
const ownFiguresOf = (coupletId, leadId) =>
  coupletFigures.value[coupletId]?.ownByLeadId?.[leadId] || []

// RouterLink target for a couplet number — same route, :couplet param changes. No hash.
const coupletTo = (n) => ({ name: 'dichotomous-key', params: { id: props.keyId, couplet: String(n) } })

// The couplet number whose lead points into this couplet (its parent couplet), for a back-reference.
function fromCouplet(couplet) {
  const parent = couplet.parentId == null ? null : props.nodes[couplet.parentId]
  return parent && parent.isCouplet ? parent.coupletNumber : null
}

const currentCoupletNumber = computed(() =>
  props.couplet != null && props.couplet !== '' ? String(props.couplet) : null
)
function isCurrent(couplet) {
  return currentCoupletNumber.value != null &&
    String(couplet.coupletNumber) === currentCoupletNumber.value
}

// When the URL names a couplet, bring its section into view (client only).
//
// The framework router's scrollBehavior forces { top: 0 } on every hashless nav,
// so a naive smooth scroll would jump the reader to the top of the key and then
// glide the whole way back down to the target — jarring, and "further than
// necessary" for a hop between neighbouring couplets. Instead: capture where the
// reader actually was (fromY, read synchronously before the router scrolls),
// undo the { top: 0 } jump with no animation, then smooth-scroll the short
// remaining distance to the target.
function scrollToCouplet(n, fromY) {
  if (n == null || n === '' || typeof document === 'undefined') return
  const startY = typeof fromY === 'number'
    ? fromY
    : (typeof window !== 'undefined' ? window.scrollY : 0)
  nextTick(() => {
    const undoRouterJump = () => {
      if (window.scrollY === 0 && startY > 0) window.scrollTo(0, startY)
    }
    requestAnimationFrame(() => {
      undoRouterJump()
      requestAnimationFrame(() => {
        undoRouterJump()
        document.getElementById(`couplet-${n}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  })
}
const currentScrollY = () => (typeof window !== 'undefined' ? window.scrollY : 0)
watch(() => props.couplet, (n) => scrollToCouplet(n, currentScrollY()), { immediate: true })
watch(() => props.couplets, () => scrollToCouplet(props.couplet, currentScrollY()))
</script>