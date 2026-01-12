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
<!-- Citation Guidance -->
<VCard class="shadow-md hover:shadow-lg transition-shadow duration-200">
  <VCardContent class="p-6">
    <h3 class="text-lg font-semibold mb-4">How to Cite WID</h3>

    <p class="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
      A formal data paper for WID is currently in preparation.
    </p>

    <p class="mb-3">
      While the data paper is not yet available, you can cite WID in your work using the following format:
    </p>

    <p class="mb-4">
      <CitationBlock />
    </p>

    <h4 class="text-md font-semibold mb-2">Contact for Questions or Collaboration</h4>
    <ul class="list-disc pl-5 text-sm space-y-1">
      <li>
        Davide Dal Pos - <address-maker class="font-medium" :items="['daveliga', 'gmail', 'com']" />
      </li>
      <li>
        Filippo Di Giovanni - <address-maker class="font-medium" :items="['aphelocheirus', 'gmail', 'come']" />
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

import CitationBlock from './CitationBlock.vue';

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


</script>



