<template>
    <div class="h-full">
      <SectionLandscape />
      <SectionData />
      <hr class="border-base-muted" />
      <SectionDescription class="border-b"/>
      <SectionAnnouncements />
      <SectionTerms class="drop-shadow" />
    </div>
  </template>
  <script setup>
  import SectionAnnouncements from './components/Section/SectionAnnouncements.vue'
import SectionData from './components/Section/SectionData.vue'
import SectionDescription from './components/Section/SectionDescription.vue'
import SectionLandscape from './components/Section/SectionLandscape.vue'
import SectionTerms from './components/Section/SectionTerms.vue'
  </script>