<template>
  <article
    class="group flex flex-col rounded-2xl bg-base-foreground ring-1 ring-base-border/40 hover:ring-primary-color/50 dark:hover:ring-secondary-color/50 hover:shadow-lg transition-all p-6"
  >
    <div
      v-if="date"
      class="flex items-center gap-2 text-xs font-medium text-base-content/55"
    >
      <IconCalendar class="h-3.5 w-3.5" />
      <time>{{ news.createdAt }}</time>
      <span
        v-if="news.type"
        class="ml-auto rounded-full bg-base-muted/60 px-2 py-0.5 text-[11px] uppercase tracking-wide"
        >{{ typeLabel(news.type) }}</span
      >
    </div>

    <h3 class="mt-3 text-lg font-semibold leading-snug text-base-content">
      <RouterLink
        :to="`/news/${news.id}`"
        class="hover:text-primary-color dark:hover:text-secondary-color"
        >{{ news.title }}</RouterLink
      >
    </h3>
    <div
      class="mt-2 text-sm leading-relaxed text-base-content/70 line-clamp-3 flex-grow"
      v-html="news.content"
    />
    <RouterLink
      :to="`/news/${news.id}`"
      class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-color dark:text-secondary-color"
    >
      Read more
      <span
        aria-hidden="true"
        class="transition-transform group-hover:translate-x-1"
        >→</span
      >
    </RouterLink>
  </article>
</template>

<script setup>
defineProps({
  news: {
    type: Object,
    required: true
  },

  date: {
    type: Boolean,
    default: true
  }
})

const typeLabel = (t) => String(t).replace(/([a-z])([A-Z])/g, '$1 $2')
</script>
