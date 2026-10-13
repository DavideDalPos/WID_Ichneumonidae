<template>
  <nav aria-label="Breadcrumb">
  <ul class="breadcrumb inline-flex items-center flex-wrap">
    <li
      v-for="([item], key, index) in list"
      :key="item.id"
      class="inline-flex items-center"
    >
      <IconArrowRight
        v-if="index"
        class="w-3 h-3 mx-1 opacity-40"
      />
      <RouterLink
        class="inline-flex items-center text-sm font-normal text-white/60 hover:text-white transition-colors"
        :to="{ name: 'otus-id', params: { id: item.id } }"
      >
        {{ key }}
      </RouterLink>
    </li>
    <li class="inline-flex items-center ml-0 text-sm text-white/90">
      <IconArrowRight class="w-3 h-3 mx-1 opacity-40" />
      <span v-html="current.full_name_tag" />
    </li>
  </ul>
  </nav>
</template>

<script setup>
defineProps({
  list: {
    type: Object,
    default: () => ({})
  },

  current: {
    type: Object,
    required: true
  }
})
</script>
