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

    <!-- Table Content -->
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-base-content uppercase bg-base-background">
        <tr>
          <th class="px-4 py-3">Subfamily</th>
          <th class="px-4 py-3 cursor-pointer" @click="sortBy('numberSpecies')">
            Species
          </th>
          <th class="px-4 py-3 cursor-pointer" @click="sortBy('distribution')">
            Distribution
          </th>
          <th class="px-4 py-3 cursor-pointer" @click="sortBy('citations')">
            Taxonomic History
          </th>
          <th class="px-4 py-3 cursor-pointer" @click="sortBy('type')">
            Original Type Series
          </th>
          <th class="px-4 py-3 cursor-pointer" @click="sortBy('biology')">
            Biological Association
          </th>
 <th class="px-4 py-3 text-left">Subfamily Pages
  <span class="sr-only">Link</span>
</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in sortedList"
          :key="item.id"
          class="border-b border-base-muted"
        >
          <!-- Subfamily Name -->
        <td class="px-4 py-3 wrap-content bg-green-50 rounded text-base-content font-medium shadow-sm">{{ item.id }}</td>


          <!-- Number of Species -->
          <td class="px-4 py-3 wrap-content">
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

          <!-- Distribution -->
          <td class="px-4 py-3 wrap-content">
<div class="w-full bg-gray-200 rounded-full h-6 relative">
  <div
    class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
                :class="getStatusColor(item.distribution)"
                :style="{ width: getStatusWidth(item.distribution) }"
                :title="item.distribution"
              >    {{ item.distribution }}</div>
            </div>
          </td>

          <!-- Taxonomic History (Citations) -->
          <td class="px-4 py-3 wrap-content">
<div class="w-full bg-gray-200 rounded-full h-6 relative">
  <div
    class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
                :class="getStatusColor(item.citations)"
                :style="{ width: getStatusWidth(item.citations) }"
                :title="item.citations"
              >    {{ item.citations }}</div>
            </div>
          </td>

          <!-- Primary Type -->
          <td class="px-4 py-3 wrap-content">
<div class="w-full bg-gray-200 rounded-full h-6 relative">
  <div
    class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
                :class="getStatusColor(item.type)"
                :style="{ width: getStatusWidth(item.type) }"
                :title="item.type"
              >{{ item.type }}</div>
            </div>
          </td>

          <!-- Biological Association -->
          <td class="px-4 py-3 wrap-content">
<div class="w-full bg-gray-200 rounded-full h-6 relative">
  <div
    class="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs text-white font-semibold"
                :class="getStatusColor(item.biology)"
                :style="{ width: getStatusWidth(item.biology) }"
                :title="item.biology"
              >{{ item.biology }}</div>
            </div>
          </td>

          <!-- Taxa Page Link -->
<!-- Taxa Page Link -->
<td class="px-4 py-3 text-end flex gap-2 justify-left">
  <!-- Main subfamily page -->
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

  <!-- WID link -->
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
</td>







        </tr>
      </tbody>
    </table>
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
