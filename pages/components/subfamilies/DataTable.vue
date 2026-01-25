<script setup>
import { computed, onMounted, ref } from 'vue';
import SearchForm from './SearchForm.vue';

/* ---------------------------
   Abbreviation dictionary
--------------------------- */
const ABBR = {
  V: { label: 'Valid names', description: 'Names that are currently considered valid in the taxonomic literature.' },
  S: { label: 'Synonyms', description: 'Names that are synonyms, homonyms, or otherwise unavailable/invalid.' },
  R: { label: 'References', description: 'Main references supporting taxonomic decisions or original descriptions.' },
  C: { label: 'Citations', description: 'Full taxonomic history citations, including subsequent changes and corrections.' },
  T: { label: 'Type species', description: 'Status of type species designation for the genus or subfamily.' },
  P: { label: 'Photographs', description: 'Availability of specimen photographs.' },
  D: { label: 'Geographic distribution', description: 'Known geographic range of the taxon.' },
  B: { label: 'Biological association', description: 'Known biological traits, hosts, or ecological associations.' },
  O: { label: 'Original Type Series', description: 'Information about the original type specimens (e.g., repository, number of specimens).' }
};


/* ---------------------------
   Abbreviation popup logic
--------------------------- */
const activeAbbr = ref(null);
const openAbbr = (key) => (activeAbbr.value = key);
const closeAbbr = () => (activeAbbr.value = null);

/* ---------------------------
   Props
--------------------------- */
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

/* ---------------------------
   Search
--------------------------- */
const filters = ref({ subfamily: '' });

const filteredList = computed(() =>
  props.items.filter(item =>
    item.id.toLowerCase().includes(filters.value.subfamily.toLowerCase())
  )
);

/* ---------------------------
   Progress + Status
--------------------------- */
const computeProgress = (item) => {
  const tasks = [
    ...Object.values(item.genera),
    ...Object.values(item.typeSpecies),
    ...Object.values(item.species),
    ...Object.values(item.otus),
    ...Object.values(item.biology)
  ];

  const completed = tasks.reduce((sum, t) => {
    if (t === true) return sum + 1;            // fully complete
    if (t === 'in-progress') return sum + 0.5; // half credit for in-progress
    return sum;                               // false or undefined
  }, 0);

  return Math.round((completed / tasks.length) * 100);
};


const overallProgress = computed(() => {
  if (!props.items.length) return 0;

  let totalTasks = 0;
  let completedTasks = 0;

  props.items.forEach(item => {
    const tasks = [
      ...Object.values(item.genera),
      ...Object.values(item.typeSpecies),
      ...Object.values(item.species),
      ...Object.values(item.otus),
      ...Object.values(item.biology)
    ];

    totalTasks += tasks.length;
    completedTasks += tasks.reduce((sum, t) => {
      if (t === true) return sum + 1;
      if (t === 'in-progress') return sum + 0.5;
      return sum;
    }, 0);
  });

  return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
});



const computeStatus = (item) => {
  const progress = computeProgress(item);
  if (progress === 100) return 'Complete';
  if (progress === 0) return 'Not started';
  return 'In progress'; // can stay the same
};


const getStatusColor = (status) => {
  switch (status) {
    case 'Complete': return 'bg-green-500';
    case 'In progress': return 'bg-yellow-400';
    case 'Not started': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const overallStatus = computed(() => {
  if (overallProgress.value === 100) return 'Complete';
  if (overallProgress.value === 0) return 'Not started';
  return 'In progress';
});


/* ---------------------------
   Progress bar animation
--------------------------- */
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const getProgressWidth = (value) => (!mounted.value ? '0%' : `${value}%`);

/* ---------------------------
   Sorting
--------------------------- */
const sortKey = ref('');
const sortAsc = ref(true);
const sortBy = (key) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else { sortKey.value = key; sortAsc.value = true; }
};

const sortedList = computed(() => {
  const arr = [...filteredList.value];
  if (!sortKey.value) return arr;

  return arr.sort((a, b) => {
    const aVal = sortKey.value === 'progress' ? computeProgress(a) : computeStatus(a);
    const bVal = sortKey.value === 'progress' ? computeProgress(b) : computeStatus(b);
    return sortAsc.value ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });
});
</script>

<template>
<div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4">
  <!-- Search form -->
  <div class="flex-1">
    <SearchForm v-model="filters.subfamily" />
  </div>

  <!-- Overall progress -->
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-700 dark:text-gray-300">Overall Project Progress:</span>
<div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden flex items-center">
  <div
    class="h-5 flex items-center justify-center text-white text-[10px] transition-all duration-500"
    :class="getStatusColor(overallStatus)"
    :style="{ width: getProgressWidth(overallProgress) }"
  >
    {{ overallProgress }}%
  </div>
</div>

  </div>
</div>




    <div class="overflow-x-auto">
      <table class="w-full text-xs text-left table-fixed">
        <thead class="uppercase bg-base-background">
          <tr>
            <th class="px-3 py-2">Subfamily</th>

            <th class="px-3 py-2">
              Genera<br>
            </th>

            <th class="px-3 py-2">
              Type species<br>
            </th>

            <th class="px-3 py-2">
              Species<br>
            </th>

            <th class="px-3 py-2">
              OTU Data<br>
            </th>

            <th class="px-3 py-2">
              Biology<br>
            </th>

            <th class="px-3 py-2 cursor-pointer" @click="sortBy('progress')">Progress</th>
            <th class="px-3 py-2 cursor-pointer" @click="sortBy('status')">Status</th>
            <th class="px-3 py-2">Links</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedList" :key="item.id" class="border-b border-base-muted">
            <td class="px-3 py-2 text-gray-800 dark:text-white font-semibold">
  <span class="bg-red-100 dark:bg-red-800 px-2 py-1 rounded">
    {{ item.id }}
  </span>
</td>


            <!-- Genera -->
<td class="px-3 py-2 flex gap-2">
  <div class="flex flex-col items-center w-4">
    <button class="abbr-btn text-[10px]" @click="openAbbr('V')">V</button>
    <span :class="item.genera.valid ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
      {{ item.genera.valid === true ? '✔' : item.genera.valid === 'in-progress' ? '⏳' : '✘' }}
    </span>
  </div>
  <div class="flex flex-col items-center w-4">
    <button class="abbr-btn text-[10px]" @click="openAbbr('S')">S</button>
    <span :class="item.genera.synonyms ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
      {{ item.genera.synonyms === true ? '✔' : item.genera.synonyms === 'in-progress' ? '⏳' : '✘' }}
    </span>
  </div>
  <div class="flex flex-col items-center w-4">
    <button class="abbr-btn text-[10px]" @click="openAbbr('R')">R</button>
    <span :class="item.genera.literature ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
      {{ item.genera.literature === true ? '✔' : item.genera.literature === 'in-progress' ? '⏳' : '✘' }}
    </span>
  </div>
</td>


            <!-- Type species -->
<!-- Type species -->
<td class="px-3 py-2">
  <div class="flex gap-2">
    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('T')">T</button>
      <span
        :class="item.typeSpecies.present ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.typeSpecies.present === true ? '✔' : item.typeSpecies.present === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('R')">R</button>
      <span
        :class="item.typeSpecies.references ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.typeSpecies.references === true ? '✔' : item.typeSpecies.references === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('P')">P</button>
      <span
        :class="item.typeSpecies.photo ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.typeSpecies.photo === true ? '✔' : item.typeSpecies.photo === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>
  </div>
</td>


<!-- Species -->
<td class="px-3 py-2">
  <div class="flex gap-2">
    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('V')">V</button>
      <span
        :class="item.species.valid ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
{{ item.species.valid === true ? '✔' : item.species.valid === 'in-progress' ? '⏳' : '✘' }}

      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('S')">S</button>
      <span
        :class="item.species.synonyms ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.species.synonyms === true ? '✔' : item.species.synonyms === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('R')">R</button>
      <span
        :class="item.species.references ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.species.references === true ? '✔' : item.species.references === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('C')">C</button>
      <span
        :class="item.species.citations ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'"
      >
        {{ item.species.citations === true ? '✔' : item.species.citations === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

  </div>
</td>


<!-- OTUS -->
<td class="px-3 py-2">
  <div class="flex gap-2">
    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('D')">D</button>
      <span :class="item.otus.distribution ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.otus.distribution === true ? '✔' : item.otus.distribution === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('O')">O</button>
      <span :class="item.otus.originaltypeinfo ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.otus.originaltypeinfo === true ? '✔' : item.otus.originaltypeinfo === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('P')">P</button>
      <span :class="item.otus.photographs ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.otus.photographs === true ? '✔' : item.otus.photographs === 'in-progress' ? '⏳' : '✘' }}
      </span>
    </div>
  </div>
</td>

<!-- Biology -->
<td class="px-3 py-2">
  <div class="flex gap-2">
    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('B')">B</button>
      <span :class="item.biology.biology ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.biology.biology ? '✔' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('R')">R</button>
      <span :class="item.biology.references ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.biology.references ? '✔' : '✘' }}
      </span>
    </div>

    <div class="flex flex-col items-center w-4">
      <button class="abbr-btn text-[10px]" @click="openAbbr('C')">C</button>
      <span :class="item.biology.citations ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'">
        {{ item.biology.citations ? '✔' : '✘' }}
      </span>
    </div>
  </div>
</td>


            <!-- Progress -->
            <td class="px-3 py-2">
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="h-4 rounded-full text-[10px] text-white text-center transition-all duration-500"
                  :class="getStatusColor(computeStatus(item))"
                  :style="{ width: getProgressWidth(computeProgress(item)) }"
                >
                  {{ computeProgress(item) }}%
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-3 py-2 text-gray-700 dark:text-white font-semibold">{{ computeStatus(item) }}</td>


            <!-- Links -->
<!-- Links -->
<td class="px-3 py-2 gap-3 flex-wrap">
  <!-- View button -->
  <router-link
    v-if="item.link"
    :to="item.link"
    class="rounded-full px-2 bg-green-100 text-green-700 hover:bg-green-200"
  >
    View
  </router-link>
  <span
    v-else
    class="rounded-full px-2 bg-gray-200 text-gray-400 cursor-not-allowed"
    title="No link available"
  >
    View
  </span>

  <!-- WID button -->
  <router-link
    v-if="item.widLink"
    :to="item.widLink"
    class="rounded-full bg-blue-100 px-2 text-blue-700 hover:bg-blue-200"
  >
    WID
  </router-link>
  <span
    v-else
    class="rounded-full px-2 bg-gray-200 text-gray-400 cursor-not-allowed"
    title="No WID link"
  >
    WID
  </span>
</td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Abbreviation popup -->
    <div
      v-if="activeAbbr"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="closeAbbr"
    >
      <div class="bg-white dark:bg-base-background rounded-lg shadow-lg p-6 max-w-sm w-full">
<h3 class="text-lg font-semibold mb-2">{{ activeAbbr }} — {{ ABBR[activeAbbr].label }}</h3>
<p class="text-sm mb-4">{{ ABBR[activeAbbr].description }}</p>

        <div class="text-right">
          <button
            @click="closeAbbr"
            class="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>

</template>

<style scoped>
table { table-layout: fixed; }
th, td { word-wrap: break-word; }
.abbr-btn {
  font-weight: 600;
  color: rgb(117, 117, 117);
  cursor: pointer;
  padding: 0 3px;
  border-radius: 3px;
}
.abbr-btn:hover { background-color: rgba(58, 58, 58, 0.13); }
</style>
