<template>
  <section class="container mx-auto px-4 pt-10 sm:pt-12">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
          Where we are
        </h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-base-content">
          A team spread across the world
        </p>
      </div>
      <ul class="flex flex-wrap gap-2 text-sm">
        <li
          v-for="s in summary"
          :key="s.label"
          class="rounded-full bg-base-foreground ring-1 ring-base-border/40 px-3 py-1.5 text-base-content/70"
        >
          <strong class="text-base-content tabular-nums">{{ s.value }}</strong>
          {{ s.label }}
        </li>
      </ul>
    </div>

    <div
      class="mt-6 grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden bg-base-foreground ring-1 ring-base-border/40 shadow-sm"
    >
      <!-- People by country -->
      <aside
        class="lg:col-span-4 xl:col-span-3 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-base-border/30 max-h-[520px] overflow-y-auto"
        aria-label="Collaborators by country"
      >
        <div
          v-for="group in byCountry"
          :key="group.country"
        >
          <h3
            class="sticky top-0 z-10 bg-base-foreground/95 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/50 border-b border-base-border/20"
          >
            {{ group.country }}
            <span class="font-normal">· {{ group.people.length }}</span>
          </h3>
          <ul>
            <li
              v-for="c in group.people"
              :key="fullName(c)"
            >
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-base-muted/30 transition-colors"
                :class="{ 'bg-primary-color/10': active === fullName(c) }"
                @click="focus(c)"
              >
                <img
                  v-if="c.image"
                  :src="c.image"
                  :alt="''"
                  class="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
                <span
                  v-else
                  class="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white"
                  :style="{ background: avatarColor(c) }"
                  >{{ initials(c) }}</span
                >
                <span class="min-w-0">
                  <span class="block text-sm font-medium text-base-content truncate">{{ fullName(c) }}</span>
                  <span class="block text-xs text-base-content/55 truncate">{{ c.institution }}</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Map -->
      <div class="lg:col-span-8 xl:col-span-9 order-1 lg:order-2 relative">
        <div
          ref="mapEl"
          class="wid-map h-[360px] sm:h-[440px] lg:h-[520px] w-full"
          role="region"
          aria-label="Map of collaborators"
        />
        <p
          class="hidden sm:block pointer-events-none absolute bottom-3 left-3 z-[400] rounded-md bg-base-foreground/90 px-2.5 py-1 text-xs text-base-content/70 shadow-sm"
        >
          Click a person or a marker for details
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { collaborators } from './AboutMapData.js'
import {
  avatarColor,
  continentOf,
  escapeHtml,
  fullName,
  initials,
  roles
} from './teamUtils.js'

const mapEl = ref(null)
const active = ref('')
let map = null
let cluster = null
let tiles = null
let observer = null
const markers = new Map()

const summary = computed(() => {
  const countries = new Set(collaborators.map((c) => c.country))
  const continents = new Set(collaborators.map((c) => continentOf(c.country)))
  return [
    { value: collaborators.length, label: 'curators' },
    { value: countries.size, label: 'countries' },
    { value: continents.size, label: 'continents' }
  ]
})

const byCountry = computed(() => {
  const groups = {}
  collaborators.forEach((c) => {
    ;(groups[c.country] ||= []).push(c)
  })
  return Object.keys(groups)
    .sort()
    .map((country) => ({
      country,
      people: groups[country].sort((a, b) => a.last_name.localeCompare(b.last_name))
    }))
})

const isDark = () => document.documentElement.classList.contains('dark')
// Esri Canvas basemaps: clean, keyless, with light and dark variants
const tileUrl = () =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${isDark() ? 'Dark' : 'Light'}_Gray_Base/MapServer/tile/{z}/{y}/{x}`

function avatarHtml(c, size) {
  return c.image
    ? `<img src="${escapeHtml(c.image)}" alt="" style="width:${size}px;height:${size}px" class="wid-avatar">`
    : `<span class="wid-avatar" style="width:${size}px;height:${size}px;background:${avatarColor(c)};font-size:${Math.round(size / 2.6)}px">${escapeHtml(initials(c))}</span>`
}

function popupHtml(c) {
  const links = [
    ['ORCID', c.orcid],
    ['ResearchGate', c.researchgate],
    ['Google Scholar', c.googlescholar]
  ]
    .filter(([, url]) => url)
    .map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    .join('')

  return `
    <div class="wid-popup">
      ${avatarHtml(c, 48)}
      <div>
        <div class="wid-popup__name">${escapeHtml(fullName(c))}</div>
        <div class="wid-popup__inst">${escapeHtml(c.institution)}${c.country ? ', ' + escapeHtml(c.country) : ''}</div>
        <div class="wid-popup__roles">${roles(c).map((r) => `<span>${r}</span>`).join('')}</div>
        ${links ? `<div class="wid-popup__links">${links}</div>` : ''}
      </div>
    </div>`
}

function focus(c) {
  const marker = markers.get(fullName(c))
  if (!marker || !map) return
  active.value = fullName(c)
  cluster.zoomToShowLayer(marker, () => marker.openPopup())
}

onMounted(async () => {
  const L = (await import('leaflet')).default
  await import('leaflet.markercluster')
  await import('leaflet/dist/leaflet.css')
  await import('leaflet.markercluster/dist/MarkerCluster.css')

  map = L.map(mapEl.value, {
    scrollWheelZoom: false,
    worldCopyJump: true,
    minZoom: 2
  })
  // Enable wheel zoom only after the user interacts with the map
  map.once('focus click', () => map.scrollWheelZoom.enable())

  tiles = L.tileLayer(tileUrl(), {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
  }).addTo(map)

  // Swap basemap when the site theme changes
  observer = new MutationObserver(() => tiles.setUrl(tileUrl()))
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 55,
    iconCreateFunction: (cl) =>
      L.divIcon({
        className: '',
        html: `<span class="wid-cluster">${cl.getChildCount()}</span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
  })

  collaborators.forEach((c) => {
    const icon = L.divIcon({
      className: '',
      html: `<span class="wid-marker">${avatarHtml(c, 34)}</span>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -18]
    })
    const marker = L.marker([c.lat, c.lng], { icon, title: fullName(c), alt: fullName(c) })
      .bindPopup(popupHtml(c), { maxWidth: 280, closeButton: false })
      .on('popupopen', () => (active.value = fullName(c)))
    markers.set(fullName(c), marker)
    cluster.addLayer(marker)
  })

  map.addLayer(cluster)
  map.fitBounds(cluster.getBounds(), { padding: [40, 40], maxZoom: 4 })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  map?.remove()
})
</script>

<style>
.wid-map {
  background: rgb(var(--color-base-muted));
  z-index: 0;
}

.wid-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  object-fit: cover;
  color: #fff;
  font-weight: 600;
  font-family: inherit;
  flex-shrink: 0;
}

.wid-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(15, 27, 51, 0.35);
  transition: transform 0.15s ease;
}

.wid-marker:hover {
  transform: scale(1.12);
}

.wid-cluster {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #0f1b33;
  color: rgb(var(--color-secondary));
  font-weight: 700;
  font-size: 14px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(15, 27, 51, 0.35);
}

.wid-map .leaflet-popup-content-wrapper {
  border-radius: 14px;
  padding: 0;
  background: rgb(var(--color-base-foreground));
  color: rgb(var(--color-base-content));
}

.wid-map .leaflet-popup-tip {
  background: rgb(var(--color-base-foreground));
}

.wid-map .leaflet-popup-content {
  margin: 14px 16px;
}

.wid-popup {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-family: inherit;
  line-height: 1.3;
}

.wid-popup__name {
  font-weight: 600;
  font-size: 0.95rem;
}

.wid-popup__inst {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 2px;
}

.wid-popup__roles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.wid-popup__roles span {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: rgba(var(--color-primary), 0.12);
  color: rgb(var(--color-primary));
}

.dark .wid-popup__roles span {
  background: rgba(var(--color-secondary), 0.15);
  color: rgb(var(--color-secondary));
}

.wid-popup__links {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  font-size: 0.78rem;
}

.wid-popup__links a {
  color: rgb(var(--color-primary));
  font-weight: 500;
}

.dark .wid-popup__links a {
  color: rgb(var(--color-secondary));
}
</style>
