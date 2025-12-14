<template>
  <DataTableIntro />
  <VCard class="m-8">
    <DataTable :items="subfamilyData" />
  </VCard>
</template>

<script setup>
import DataTable from './components/subfamilies/DataTable.vue';
import DataTableIntro from './components/subfamilies/DataTableIntro.vue';
import subfamilyData from './components/subfamilies/subfamiliesData.js';
</script>