<template>
  <section class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="mx-auto max-w-5xl prose dark:prose-invert">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">How to Cite</h2>

      <div class="flex flex-col gap-6">

        <!-- Database Status -->
        <VCard class="shadow-md hover:shadow-lg transition-shadow duration-200">
          <VCardContent class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 class="text-lg font-semibold mb-2 sm:mb-0">Current Database Status</h3>
              <time class="text-sm italic text-gray-500 dark:text-gray-400">
                Updated: {{ todayFormatted }}
              </time>
            </div>
            <p class="mb-2">
              The <strong>World Ichneumonidae Database (WID)</strong> is <strong>a work in progress</strong>. 
              Not all subfamilies are fully covered, and taxa are still being verified.
            </p>
            <p>
              Before using WID data in publications, please check the 
              <RouterLink to="subfamilies" class="text-red-600 hover:underline transition">
                Subfamilies
              </RouterLink> 
              page for current completeness status.
            </p>
          </VCardContent>
        </VCard>

        <!-- Citation Guidance -->
        <VCard class="shadow-md hover:shadow-lg transition-shadow duration-200">
          <VCardContent class="p-6">
            <h3 class="text-lg font-semibold mb-4">How to Cite WID</h3>
            <p class="mb-3">
              While a formal data paper is not yet available, you can cite WID in your work using the following format:
            </p>

            <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-black text-sm overflow-x-auto mb-4">
{{ citationText }}
            </pre>

            <p class="mb-4">
              Replace <em>[insert date here]</em> with the date you accessed the database to reflect the exact version you used.
            </p>

            <h4 class="text-md font-semibold mb-2">Contact for Questions or Collaboration</h4>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li>
                <address-maker class="font-medium" :items="['davide.dalpos', 'ucf', 'edu']" />
              </li>
              <li>
                <address-maker class="font-medium" :items="['filippod', 'unisiena', 'edu']" />
              </li>
            </ul>
          </VCardContent>
        </VCard>

      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const todayFormatted = ref('')
const collaborators = ref([]) // reactive array for collaborators

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  todayFormatted.value = formatDate(new Date())
  
  // Dynamically import collaborators
  const data = await import('/pages/components/Section/map/AboutMapData.js')
  collaborators.value = data.collaborators
})

// Generate citation dynamically in "LastName FirstInitial." format
const citationText = computed(() => {
  if (!collaborators.value.length) return 'Loading citation...'

  // Separate Filippo
  const others = collaborators.value.filter(c => c.first_name !== 'Filippo')
  const filippo = collaborators.value.find(c => c.first_name === 'Filippo')

  // Map to "LastName FirstInitial."
  const formatName = c => `${c.last_name} ${c.first_name.charAt(0)}.`

  const names = [...others.map(formatName), formatName(filippo)].join('; ')

  return `${names} (2025). World Ichneumonidae Database (WID). Accessed [insert date here]. URL: https://worldichneumonidae.org`
})
</script>



