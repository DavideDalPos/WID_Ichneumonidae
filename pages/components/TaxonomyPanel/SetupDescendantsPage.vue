<template>
  <div v-if="taxonomy" class="tree-card">
    <h2>{{ taxonomy.name }} (Family level)</h2>
    <ul class="tree">
      <!-- Pass a copy of taxonomy with synonyms removed -->
      <DescendantsTreeNoSynonyms :taxonomy="taxonomyNoSynonyms" />
    </ul>
  </div>
  <div v-else>
    Loading taxonomy...
  </div>
</template>

<script setup>
import TaxonWorks from '@/modules/otus/services/TaxonWorks'
import { computed, onMounted, ref } from 'vue'
import DescendantsTreeNoSynonyms from './DescendantsTreeNoSynonyms.vue'

const props = defineProps({
  otuId: {
    type: [String, Number],
    required: true
  }
})

const taxonomy = ref(null)

// Create a computed copy without synonyms
const taxonomyNoSynonyms = computed(() => {
  if (!taxonomy.value) return null

  // Deep copy of taxonomy
  const copy = JSON.parse(JSON.stringify(taxonomy.value))

  // Remove all synonyms recursively
  const removeSynonyms = (node) => {
    node.nomenclatural_synonyms = []
    if (node.descendants && node.descendants.length) {
      node.descendants.forEach(removeSynonyms)
    }
  }
  removeSynonyms(copy)
  return copy
})

onMounted(async () => {
  try {
    const { data } = await TaxonWorks.getTaxonomy(props.otuId, {
      params: { max_descendants_depth: 1 }
    })
    taxonomy.value = data
  } catch (err) {
    console.error('Error loading taxonomy:', err)
  }
})
</script>

<style scoped lang="scss">
.tree-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;

  h2 {
    margin-bottom: 12px;
  }

  .tree {
    text-align: left;
    padding-left: 0;
    margin: 0;
  }
}
</style>