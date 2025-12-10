<template>
  <section>
    <div class="mx-auto py-6 prose !container dark:prose-invert">
      <h1 class="px-4 sm:px-0 text-center text-amber-400">Collaborators</h1>
      <span class="text-base-soft text-center block mb-6">Curators, Administrators & Project Coordinators</span>

      <div class="flex gap-4 flex-col">
        <VCard>
          <VCardContent>
            <p>
              The World Ichneumonidae Database (WID) benefits from a global team of collaborators who help curate, manage, and update the dataset.
              Below is an interactive map displaying our contributors across the world.
            </p>
          </VCardContent>
        </VCard>

        <VCard>
          <VCardContent>
            <div id="collaborators-map" class="rounded-lg shadow-md" style="height: 500px;"></div>
          </VCardContent>
        </VCard>

        <VCard>
          <VCardContent>
            <h3 class="mt-2 mb-0">Legend</h3>
            <p>
              Amber markers represent individual collaborators. Zoom in or click on a marker to see details.
            </p>
          </VCardContent>
        </VCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const data = await import('/pages/components/Section/map/AboutMapData.js')
  const collaborators = data.collaborators

  const L = (await import('leaflet')).default
  await import('leaflet.markercluster')
  await import('leaflet/dist/leaflet.css')
  await import('leaflet.markercluster/dist/MarkerCluster.css')
  await import('leaflet.markercluster/dist/MarkerCluster.Default.css')

  // ------------------- Map Setup -------------------
  const collaboratorsMap = L.map('collaborators-map').setView([28.6023, -81.2003], 3)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(collaboratorsMap)

  // ------------------- Marker Icon -------------------
  const collaboratorIcon = L.divIcon({
    className: '',
    html: '<div style="width:12px;height:12px;background-color:#2a9d8f;border-radius:50%;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })

  // ------------------- Popups -------------------
  const collaboratorsCluster = L.markerClusterGroup()
  collaborators.forEach(c => {
    const imageSrc = c.image || 'https://via.placeholder.com/60?text=NA'

    const roles = []
    if (c.leader === 'yes') roles.push({ name: 'Founder', bg: '#facc15', text: '#111' }) // amber-400
    if (c.administrator === 'yes') roles.push({ name: 'Admin', bg: '#9ca3af', text: '#1f2937' }) // gray-400/600
    roles.push({ name: 'Curator', bg: '#bbf7d0', text: '#111' }) // green-200 / dark amber-700

    const roleBadges = roles.map(r => `<span style="background:${r.bg};color:${r.text};font-size:0.7rem;padding:1px 4px;margin-right:2px;border-radius:3px;">${r.name}</span>`).join('')

    const popupContent = `
      <div style="display:flex; align-items:center; font-family:sans-serif; width:220px; line-height:1.1;">
        <img src="${imageSrc}" alt="${c.first_name} ${c.last_name}" 
             style="width:60px; height:60px; border-radius:50%; border:1px solid #ccc; margin-right:8px;" />
        <div style="flex:1;">
          <div style="font-weight:bold; font-size:0.9rem;">${c.first_name} ${c.last_name}</div>
          <div style="font-size:0.8rem; color:#555;">${c.institution || ''}${c.institution && c.country ? ', ' : ''}${c.country || ''}</div>
          <div style="margin-top:2px;">${roleBadges}</div>
        </div>
      </div>
    `

    const marker = L.marker([c.lat, c.lng], { icon: collaboratorIcon }).bindPopup(popupContent, { maxWidth: 220 })
    collaboratorsCluster.addLayer(marker)
  })

  collaboratorsMap.addLayer(collaboratorsCluster)

  // Fit map bounds
  const coords = collaborators.map(c => [c.lat, c.lng])
  if (coords.length) collaboratorsMap.fitBounds(coords)
})
</script>

<style>
#collaborators-map {
  width: 100%;
  height: 500px;
}

/* Riduce spazio sopra e sotto i popup */
.leaflet-popup-content-wrapper {
  padding: 3px 5px !important;
}
.leaflet-popup-content {
  margin: 0 !important;
}
.leaflet-popup-tip {
  margin-top: 0 !important;
}
</style>
