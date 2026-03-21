<template>
  <div class="family-taxonomy-page">
    <SetupDescendantsPage :otuId="659407" />
    <!-- Add info panels below or to the side -->
  </div>
</template>

<script setup>
import SetupDescendantsPage from './SetupDescendantsPage.vue';

const props = defineProps({
  otuId: {
    type: [String, Number],
    required: true
  }
})
</script>

<style scoped lang="scss">
.family-taxonomy-page {
  display: flex;
  flex-direction: column;
  align-items: center; /* center the tree card */
  gap: 24px;
  padding: 16px;

  /* Central v-card for the tree */
  .tree-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    width: 100%;
    max-width: 500px; /* makes it smaller than full column */
    text-align: center;
    
    font-size: 0.9rem; /* reduce all text inside the card */

    h2 {
      font-size: 1.25rem; /* smaller title */
      font-weight: 600;
      margin-bottom: 12px;
    }

    .tree {
      font-size: 0.875rem; /* smaller tree nodes */
      text-align: left; /* keep tree structure aligned left inside card */
      padding-left: 0;
      margin: 0;
      line-height: 1.4; /* optional: compact lines */
    }
  }

  /* Info panels below */
  .info-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 600px;

    .info-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);

      h3 { 
        margin-top: 0; 
        margin-bottom: 8px; 
      }
      p, ul { margin: 0; }
    }
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .family-taxonomy-page {
    .tree-card, .info-column {
      max-width: 100%;
    }
  }
}
</style>