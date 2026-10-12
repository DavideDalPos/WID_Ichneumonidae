<template>
  <div class="grid gap-5">
    <article
      v-for="item in news"
      :key="item.id"
      class="wid-pinned relative overflow-hidden rounded-2xl p-8 sm:p-10 text-white"
    >
      <p class="text-xs font-semibold uppercase tracking-wider text-secondary-color">
        Featured
        <template v-if="date">· {{ item.createdAt }}</template>
      </p>
      <h2 class="mt-3 text-2xl sm:text-3xl font-bold leading-tight max-w-3xl">
        {{ item.title }}
      </h2>
      <div
        class="mt-4 max-w-3xl leading-relaxed text-white/80 line-clamp-3"
        v-html="item.content"
      />
      <RouterLink
        :to="`/news/${item.id}`"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary-color px-5 py-2.5 text-sm font-semibold text-secondary-content hover:brightness-105"
      >
        Read more →
      </RouterLink>
    </article>
  </div>
</template>

<script setup>
defineProps({
  news: {
    type: Array,
    required: true
  },

  date: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.wid-pinned {
  background:
    radial-gradient(40rem 20rem at 100% 0%, rgba(42, 98, 183, 0.55), transparent 70%),
    linear-gradient(135deg, #13223f 0%, #1b3466 100%);
}
</style>
