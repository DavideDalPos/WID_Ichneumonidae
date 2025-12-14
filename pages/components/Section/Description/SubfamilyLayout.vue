<template>
  <section>
    <div class="mx-auto py-6 prose !container dark:prose-invert">

      <!-- Subfamily Heading -->
      <h1 class="text-center text-3xl font-bold mb-2">{{ data.subfamilyName }}</h1>
      <p class="text-center text-base-soft italic mb-6">
        Authors: <span class="font-semibold text-base-content">{{ data.authors }}</span>
      </p>
<p class="text-center mt-4">
  <RouterLink
    v-if="data.link"
    :to="data.link"
    class="inline-block px-6 py-3 bg-blue-200 text-blue-900 font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-blue-300 transition-all duration-300 no-underline"
  >
    Explore in WID
  </RouterLink>
</p>





      <!-- First row of summary cards -->
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-between">

        <!-- Species Card -->
        <VCard class="flex-1 rounded-lg shadow-lg p-6 bg-red-50 dark:bg-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow">
          <VCardContent>
            <div class="mb-2">
              <span class="text-3xl block mb-1">🐝</span>
              <p class="text-sm uppercase text-gray-500 tracking-wider">Species</p>
            </div>
            <p class="text-4xl font-extrabold text-transparent bg-clip-text bg-red-600 mt-2">{{ speciesCounter }}</p>
          </VCardContent>
        </VCard>

        <!-- Genera Card -->
        <VCard class="flex-1 rounded-lg shadow-lg p-6 bg-green-50 dark:bg-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow">
          <VCardContent>
            <div class="mb-2">
              <span class="text-3xl block mb-1">🔬</span>
              <p class="text-sm uppercase text-gray-500 tracking-wider">Genera</p>
            </div>
            <p class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mt-2">{{ generaCounter }}</p>
            <p class="text-xs italic text-gray-500 mt-1">{{ data.description.general.generaNote }}</p>
          </VCardContent>
        </VCard>

        <!-- Distribution Card -->
        <VCard class="flex-1 rounded-lg shadow-lg p-6 bg-blue-50 dark:bg-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow">
          <VCardContent>
            <div class="mb-2">
              <span class="text-3xl block mb-1">🌎</span>
              <p class="text-sm uppercase text-gray-500 tracking-wider">Distribution</p>
            </div>
            <p class="text-xs text-gray-500 mb-2 font-semibold">{{ data.description.general.distributionRegions.length }} region{{ data.description.general.distributionRegions.length > 1 ? 's' : '' }}</p>
            <p class="text-xs text-gray-500 mb-2">{{ data.description.general.distributionNote }}</p>

            <!-- Pill-shaped pastel regions with tooltips -->
            <div class="flex flex-wrap gap-2 justify-center mt-2">
              <span
                v-for="(region, index) in sortedRegions"
                :key="index"
                class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                :style="{ backgroundColor: pastelRegionColors[region], color: '#111' }"
                :title="'Region: ' + region"
              >
                {{ region }}
              </span>
            </div>
          </VCardContent>
        </VCard>

        <!-- Notes Card -->
        <VCard class="flex-1 rounded-lg shadow-lg p-6 bg-orange-50 dark:bg-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow">
          <VCardContent>
            <div class="mb-2">
              <span class="text-3xl block mb-1">📝</span>
              <p class="text-sm uppercase text-gray-500 tracking-wider">Notes</p>
            </div>
            <p class="text-xs italic text-gray-600 mt-2 text-justify" v-html="data.description.general.notes"></p>
          </VCardContent>
        </VCard>

      </div>

      <!-- Recognition Card -->
      <VCard class="bg-base-muted/20 rounded-lg shadow-sm p-4 sm:p-6 mt-4">
        <VCardContent>
          <h3 class="mt-0 mb-2 text-lg font-semibold">Recognition</h3>
          <p class="text-justify">{{ data.description.recognition }}</p>
        </VCardContent>
      </VCard>

      <!-- Systematics Card -->
      <VCard class="bg-base-muted/20 rounded-lg shadow-sm p-4 sm:p-6 mt-4">
        <VCardContent>
          <h3 class="mt-0 mb-2 text-lg font-semibold">Systematics</h3>
          <p class="text-justify">{{ data.description.systematics }}</p>
        </VCardContent>
      </VCard>

      <!-- Biology Card -->
      <VCard class="bg-base-muted/20 rounded-lg shadow-sm p-4 sm:p-6 mt-4">
        <VCardContent>
          <h3 class="mt-0 mb-2 text-lg font-semibold">Biology</h3>
          <p class="text-justify">{{ data.description.biology }}</p>
        </VCardContent>
      </VCard>

      <!-- References Card -->
      <VCard class="bg-base-muted/20 rounded-lg shadow-sm p-4 sm:p-6 mt-4">
        <VCardContent>
          <h3 class="mt-0 mb-2 text-lg font-semibold">References</h3>
          <ul class="list-disc ml-5">
            <li v-for="(ref, index) in data.description.references" :key="index">
              <span>{{ ref.text }}&nbsp;</span>
              <a :href="ref.link" target="_blank" class="text-amber-600 hover:underline">{{ ref.link }}</a>
            </li>
          </ul>
        </VCardContent>
      </VCard>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Subfamilies } from './SubfamilyData.js';

const props = defineProps({
  subfamilyKey: {
    type: String,
    required: true
  }
});

const data = Subfamilies[props.subfamilyKey];

// Sorted regions alphabetically
const sortedRegions = computed(() => {
  return [...data.description.general.distributionRegions].sort((a, b) => a.localeCompare(b));
});

// Pastel colors for regions (unchanged)
const pastelRegionColors = {
  Palearctic: '#fecaca',
  Nearctic: '#bfdbfe',
  Indomalayan: '#fdba74',
  Neotropical: '#bbf7d0',
  Australasian: '#e9d5ff',
  Afrotropical: '#fef08a',
  Pacific: '#d1d5db'
}

// Animated counting with ease-out
const speciesCounter = ref(0);
const generaCounter = ref(0);

const easeOutQuad = t => t * (2 - t);

const animateCounter = (target, setter, duration = 1500) => {
  const startTime = performance.now();
  const step = (currentTime) => {
    let progress = Math.min((currentTime - startTime) / duration, 1);
    setter(Math.floor(target * easeOutQuad(progress)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

onMounted(() => {
  animateCounter(data.description.general.speciesCount, val => speciesCounter.value = val);
  animateCounter(data.description.general.generaCount, val => generaCounter.value = val);
});
</script>
