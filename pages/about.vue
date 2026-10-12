<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="About"
      title="The people behind WID"
      subtitle="The World Ichneumonidae Database is curated by an international team of specialists who manage, check and update the data for their groups of expertise."
    />
    <AboutMap />
    <AboutList />
  </div>
</template>

<script setup>
import PageHeader from './components/Home/PageHeader.vue'
import AboutList from './components/Section/map/AboutList.vue'
import AboutMap from './components/Section/map/AboutMap.vue'
</script>
