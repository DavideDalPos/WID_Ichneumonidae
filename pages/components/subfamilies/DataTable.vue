<script setup>
import { computed, ref } from 'vue';
import FilterDropdown from './FilterDropdown.vue';
import FilterRadios from './FilterRadios.vue';
import SearchForm from './SearchForm.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

// Search filter
const filters = ref({
  subfamily: ''
});

const list = computed(() =>
  props.items.filter((item) =>
    item.id.toLowerCase().includes(filters.value.subfamily.toLowerCase())
  )
);

// Status color mapping
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'complete':
      return 'bg-green-500';
    case 'in progress':
      return 'bg-yellow-400';
    case 'incomplete':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

// Status bar width
import { onMounted } from 'vue';
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const getStatusWidth = (status) => {
  if (!mounted.value) return '0%'; // start from 0 for animation
  switch (status.toLowerCase()) {
    case 'complete':
      return '100%';
    case 'in progress':
      return '60%';
    case 'incomplete':
      return '30%';
    default:
      return '0%';
  }
};


// Sorting
const sortKey = ref('');
const sortAsc = ref(true);

const sortBy = (key) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else sortKey.value = key;
  sortAsc.value = true;
};

// Sorted list
const sortedList = computed(() => {
  const arr = [...list.value];
  if (!sortKey.value) return arr;

  const order = ['Incomplete', 'In Progress', 'Complete'];

  return arr.sort((a, b) => {
    const aIndex = order.indexOf(a[sortKey.value]);
    const bIndex = order.indexOf(b[sortKey.value]);
    return sortAsc.value ? aIndex - bIndex : bIndex - aIndex;
  });
});
</script>

<template>  
  <div class="bg-base-foreground rounded-lg">
    <div class="flex items-center justify-between">
      <SearchForm v-model="filters.subfamily" />
      <div class="flex items-center justify-end text-sm font-semibold">
        <FilterDropdown />
        <FilterRadios />
      </div>
    </div>

<div class="overflow-x-hidden md:overflow-x-auto">
  <table class="w-full text-sm text-left text-gray-500 md:table-fixed">
    <thead class="text-xs text-base-content uppercase bg-base-background hidden md:table-header-group">
      <tr>
        <th class="px-4 py-3">Subfamily</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('numberGenera')">Genera</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('numberSpecies')">Species</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('distribution')">Distribution</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('citations')">Taxonomic History</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('type')">Original Type Series</th>
        <th class="px-4 py-3 cursor-pointer" @click="sortBy('biology')">Biological Association</th>
        <th class="px-4 py-3 text-left">Subfamily Pages</th>
      </tr>
    </thead>

   <tbody>
  <tr
    v-for="item in sortedList"
    :key="item.id"
    class="border-b border-base-muted block md:table-row mb-4 md:mb-0 bg-base-foreground rounded-lg p-4 md:p-0"
  >
    <!-- Subfamily -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Subfamily:</span>
      <span class="bg-green-50 text-center dark:bg-green-700 rounded text-base-content font-medium shadow-sm px-2 py-1">{{ item.id }}</span>
    </td>

    <!-- Number of Species -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Species:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.numberSpecies)"
          :style="{ width: getStatusWidth(item.numberSpecies) }"
          :title="item.numberSpecies"
        >
          {{ item.numberSpecies }}
        </div>
      </div>
    </td>

    <!-- Number of Genera -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Genera:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.numberGenera)"
          :style="{ width: getStatusWidth(item.numberGenera) }"
          :title="item.numberGenera"
        >
          {{ item.numberGenera }}
        </div>
      </div>
    </td>

    <!-- Distribution -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Distribution:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.distribution)"
          :style="{ width: getStatusWidth(item.distribution) }"
          :title="item.distribution"
        >
          {{ item.distribution }}
        </div>
      </div>
    </td>

    <!-- Taxonomic History -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Taxonomic History:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.citations)"
          :style="{ width: getStatusWidth(item.citations) }"
          :title="item.citations"
        >
          {{ item.citations }}
        </div>
      </div>
    </td>

    <!-- Original Type Series -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Original Type Series:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.type)"
          :style="{ width: getStatusWidth(item.type) }"
          :title="item.type"
        >
          {{ item.type }}
        </div>
      </div>
    </td>

    <!-- Biological Association -->
    <td class="block md:table-cell mb-2 md:mb-0">
      <span class="font-semibold md:hidden">Biological Association:</span>
      <div class="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
          :class="getStatusColor(item.biology)"
          :style="{ width: getStatusWidth(item.biology) }"
          :title="item.biology"
        >
          {{ item.biology }}
        </div>
      </div>
    </td>

    <!-- Links -->
    <td class="block md:table-cell">
      <span class="font-semibold md:hidden">Pages:</span>
      <div class="flex gap-2 mt-1 md:mt-0">
        <router-link
          :to="item.link || '#'"
          :class="[
            'inline-block px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200',
            item.link 
              ? 'bg-green-100 text-green-800 hover:bg-green-300'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
          ]"
        >
          View
        </router-link>

        <router-link
          :to="item.widLink || '#'"
          :class="[
            'inline-block px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200',
            item.widLink 
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-300'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
          ]"
        >
          WID
        </router-link>
      </div>
    </td>
  </tr>
</tbody>

  </table>
</div>


  </div>
</template>

<style scoped>
/* Ensure text wraps inside table cells */
.wrap-content {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 150px; /* Adjust as needed to prevent column stretching */
}

table {
  table-layout: fixed; /* Ensures columns don't stretch to fit content */
}

th, td {
  max-width: 150px; /* Limits the width of each column */
  overflow: hidden; /* Ensures overflow text wraps */
}
</style>
