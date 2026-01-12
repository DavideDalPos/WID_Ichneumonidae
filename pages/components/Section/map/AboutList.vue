<template>
  <section class="container max-w-screen-xl mx-auto py-10 px-4 sm:px-10 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg mt-12 mb-10">
    <h1 class="text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight relative inline-block mb-8">
      Meet the Team
      <span class="absolute left-0 -bottom-1 h-[3px] w-16 bg-amber-400 rounded" aria-hidden="true"></span>
    </h1>

    <div class="flex justify-center">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-fit mx-auto">
        <div
          v-for="c in sortedCollaborators"
          :key="c.last_name || c.first_name"
          class="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Collaborator image / initials -->
          <div v-if="!c.image" class="w-28 h-28 rounded-full bg-gray-400 flex items-center justify-center text-xl font-semibold text-white mb-4">
            {{ (c.first_name[0] || '') + (c.last_name[0] || '') }}
          </div>
          <img
            v-else
            :src="c.image"
            :alt="c.first_name + ' ' + c.last_name"
            class="w-28 h-28 rounded-full object-cover border-2 border-gray-300 mb-4"
          />

          <!-- Name -->
          <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {{ c.first_name }} {{ c.last_name }}
          </h4>

          <!-- Institution + Country -->
          <p v-if="c.institution || c.country" class="text-sm text-gray-500 dark:text-gray-300 mb-2">
            {{ c.institution }} ({{ c.country }})
          </p>

          <!-- Badges line -->
          <div class="flex flex-wrap justify-center gap-2 mb-2">
            <span
              v-if="c.leader === 'yes'"
              class="text-xs font-medium uppercase px-2 py-0.5 bg-yellow-400 text-gray-900 rounded"
            >
              Founder
            </span>
            <span
              v-if="c.administrator === 'yes'"
              class="text-xs font-medium uppercase px-2 py-0.5 bg-red-200 dark:bg-red-800 text-gray-800 dark:text-gray-200 rounded"
            >
              Admin
            </span>
            <span
              class="text-xs font-medium uppercase px-2 py-0.5 bg-green-200 dark:bg-amber-700 text-gray-900 dark:text-gray-100 rounded"
            >
              Curator
            </span>
          </div>

          <!-- Links -->
          <div class="flex gap-4 mb-1">
            <!-- ORCID -->
            <a
              :href="c.orcid || '#'"
              :class="c.orcid ? 'text-[#A6CE39] hover:text-[#7AA32C]' : 'text-gray-400 cursor-not-allowed'"
              target="_blank"
              rel="noopener noreferrer"
            >
              <OrcidIcon />
            </a>

            <!-- ResearchGate -->
            <a
              :href="c.researchgate || '#'"
              :class="c.researchgate ? 'text-[#00CCBB] hover:text-[#009988]' : 'text-gray-400 cursor-not-allowed'"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ResearchGateIcon />
            </a>

            <!-- Google Scholar -->
            <a
              :href="c.googlescholar || '#'"
              :class="c.googlescholar ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GoogleScholarIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import GoogleScholarIcon from '../Icons/GoogleScholarIcon.vue'
import OrcidIcon from '../Icons/OrcidIcon.vue'
import ResearchGateIcon from '../Icons/ResearchGateIcon.vue'

const defaultImage = 'https://via.placeholder.com/112?text=Photo'
const collaborators = ref([])

onMounted(async () => {
  const data = await import('/pages/components/Section/map/AboutMapData.js')
  collaborators.value = data.collaborators
})

// Sort collaborators: Founder/Admin first, others alphabetically by last_name
const sortedCollaborators = computed(() => {
  const top = collaborators.value.filter(c => c.leader === 'yes' || c.administrator === 'yes')
  const rest = collaborators.value
    .filter(c => c.leader !== 'yes' && c.administrator !== 'yes')
    .sort((a, b) => {
      const lastA = a.last_name?.toLowerCase() || ''
      const lastB = b.last_name?.toLowerCase() || ''
      return lastA.localeCompare(lastB)
    })
  return [...top, ...rest]
})
</script>

<style scoped>
/* Tailwind handles colors and hover effects */
</style>
