<template>
  <div class="space-y-3">
    <pre
      class="bg-gray-100 dark:bg-gray-200 p-4 rounded text-black text-sm overflow-x-auto"
    >
{{ citationText }}
    </pre>

    <p class="text-sm text-gray-600 dark:text-gray-400">
      Replace <em>[insert date here]</em> with the date you accessed the database.
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  year: {
    type: Number,
    default: new Date().getFullYear()
  }
})

const collaborators = ref([])

onMounted(async () => {
  const data = await import('/pages/components/Section/map/AboutMapData.js')
  collaborators.value = data.collaborators
})

const citationText = computed(() => {
  if (!collaborators.value.length) return 'Loading citation...'

  const formatName = c => `${c.last_name} ${c.first_name.charAt(0)}.`

  const filippo = collaborators.value.find(c => c.first_name === 'Filippo')
  const others = collaborators.value.filter(c => c.first_name !== 'Filippo')

  const names = [...others.map(formatName), formatName(filippo)].join('; ')

  return `${names} (${props.year}). World Ichneumonidae Database (WID). Accessed [insert date here]. URL: https://worldichneumonidae.com`
})
</script>
