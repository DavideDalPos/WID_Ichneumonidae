<template>
  <div class="wid-home bg-base-background">
    <VSpinner
      v-if="isLoading"
      full-screen
    />

    <header class="wid-news-header text-white">
      <div class="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
        <RouterLink
          to="/news"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
        >
          ← All news
        </RouterLink>
        <h1
          v-if="news"
          class="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
        >
          {{ news.title }}
        </h1>
        <p
          v-if="news && (show_author || show_date)"
          class="mt-3 text-white/70"
        >
          <template v-if="show_author && news.creator">{{ news.creator }}</template>
          <template v-if="show_author && news.creator && show_date"> · </template>
          <template v-if="show_date">{{ news.createdAt }}</template>
        </p>
        <h1
          v-if="!isLoading && !news"
          class="mt-4 text-3xl font-bold"
        >
          News item not found
        </h1>
      </div>
    </header>

    <section
      v-if="news"
      class="container mx-auto px-4 max-w-4xl -mt-6 pb-16 relative z-10"
    >
      <article class="rounded-2xl bg-base-foreground ring-1 ring-base-border/40 shadow-xl shadow-black/5 p-6 sm:p-10">
        <div
          class="prose max-w-none dark:prose-invert leading-relaxed"
          v-html="news.content"
        />
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { News } from '../services/News'
import { useRoute } from 'vue-router'
import { makeNews } from '../adapters/makeNews'

const route = useRoute()
const newsId = route.params.id
const news = ref(null)
const isLoading = ref(true)

const { news_module = {} } = __APP_ENV__

const { news_page: { show_author = true, show_date = true } = {} } = news_module

News.find(newsId)
  .then(({ data }) => {
    news.value = makeNews(data)
  })
  .catch(() => {})
  .finally(() => {
    isLoading.value = false
  })
</script>

<style scoped>
.wid-news-header {
  background:
    radial-gradient(50rem 20rem at 90% 0%, rgba(42, 98, 183, 0.45), transparent 60%),
    linear-gradient(180deg, #0f1b33 0%, #13223f 100%);
}
</style>
