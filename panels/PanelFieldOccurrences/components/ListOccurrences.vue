<template>
    <VCard>
      <VCardHeader>Field occurrences</VCardHeader>
      <VCardContent :class="isLoading && 'min-h-[6rem]'">
        <VSpinner v-if="isLoading" />

        <!-- Nothing recorded: explain instead of an empty card -->
        <div v-if="!isLoading && !list.length">
          <p class="text-sm text-base-content/80">
            No field occurrences have been recorded for this taxon yet. Field
            occurrences are observations made without keeping a specimen, such
            as sightings or photographs.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              :to="$route.path.replace(/field_occurrences\/?$/, 'specimen_records')"
              class="inline-flex items-center rounded-lg bg-primary-color px-3 py-1.5 text-xs font-semibold text-primary-content hover:opacity-90"
            >
              See specimen records
            </RouterLink>
            <RouterLink
              to="/help"
              class="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-base-content ring-1 ring-base-border hover:bg-base-muted/40"
            >
              Share an observation
            </RouterLink>
          </div>
        </div>

        <ul v-else>
          <li
            v-for="item in items"
            :key="item.id"
            class="flex flex-col text-sm px-2 py-4 gap-2 border-b first:pt-0 last:pb-0 last:border-none"
          >
            <div class="flex flex-col">
              <span>{{ item.typeStatus }}</span>
              <span v-html="item.label" />
            </div>
            <GalleryThumbnailList
              v-if="item.associatedMedia"
              :images="item.associatedMedia"
              class="lg:flex-row gap-2 flex-wrap"
              @select-index="
                (index) => emit('select', { images: item.associatedMedia, index })
              "
            />
          </li>
          <li
            v-if="!showAll && list.length > props.max"
            class="flex justify-start pt-4 px-2 cursor-pointer border-base-muted text-sm"
          >
            <div
              class="h-5 w-5 text-secondary-color opacity-60 mr-2 cursor-pointer"
              @click="() => (isExpanded = !isExpanded)"
            >
              <IconPlusCircle class="h-5 w-5" />
            </div>
            <span @click="() => (showAll = true)"
              >... Show all ... ({{ list.length }})</span
            >
          </li>
        </ul>
      </VCardContent>
    </VCard>
  </template>
  
  <script setup>
  import GalleryThumbnailList from '@/components/Gallery/GalleryThumbnailList.vue'
import { computed, ref } from 'vue'
  
  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    },
  
    isLoading: {
      type: Boolean,
      default: false
    },
  
    max: {
      type: Number,
      default: 2
    }
  })
  
  const emit = defineEmits(['select'])
  
  const showAll = ref(false)
  
  const items = computed(() =>
    showAll.value ? props.list : props.list.slice(0, props.max)
  )
  </script>