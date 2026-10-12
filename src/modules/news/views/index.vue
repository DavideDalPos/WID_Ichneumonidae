<template>
  <div class="wid-home bg-base-background">
    <PageHeader
      eyebrow="News"
      title="News & announcements"
      subtitle="Project updates from the WID team, followed by the latest names and references added to the database."
    />

    <section class="container mx-auto px-4 py-10 sm:py-12">
      <PinnedNews
        v-if="store.pinnedNews.length"
        class="mb-8"
        :news="store.pinnedNews"
        :date="show_date"
      />

      <div
        v-if="store.isLoading && !store.news.length"
        class="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="h-48 rounded-2xl bg-base-foreground ring-1 ring-base-border/40 animate-pulse"
        />
      </div>

      <div
        v-else-if="store.news.length"
        class="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <NewsCard
          v-for="item in store.news"
          :key="item.id"
          :news="item"
          :date="show_date"
        />
      </div>

      <div
        v-else-if="!store.pinnedNews.length"
        class="rounded-2xl bg-base-foreground ring-1 ring-base-border/40 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6"
      >
        <span
          class="flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-color/10 text-primary-color dark:bg-secondary-color/10 dark:text-secondary-color"
        >
          <IconCalendar class="h-7 w-7" />
        </span>
        <div>
          <h2 class="text-lg font-semibold text-base-content">No announcements yet</h2>
          <p class="mt-1 text-base-content/65">
            Project news will appear here. In the meantime, here is what has
            been added to the database most recently.
          </p>
        </div>
      </div>

      <div
        v-if="store.pagination && store.pagination.total > store.pagination.per"
        class="flex justify-center mt-8"
      >
        <VPagination
          v-model="store.pagination.page"
          :total="store.pagination.total"
          :per="store.pagination.per"
          @update:modelValue="(page) => store.loadNews(page, per)"
        />
      </div>
    </section>

    <section class="border-t border-base-border/30 bg-base-foreground">
      <div class="container mx-auto px-4 py-12 sm:py-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div class="min-w-0 lg:col-span-7">
          <div class="flex items-end justify-between gap-3 mb-4">
            <h2 class="text-xl font-semibold text-base-content">Latest taxa</h2>
            <RouterLink
              to="/RecentTaxa"
              class="text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
              >See all</RouterLink
            >
          </div>
          <RecentTaxaList
            :per="8"
            compact
          />
        </div>
        <div class="min-w-0 lg:col-span-5">
          <div class="flex items-end justify-between gap-3 mb-4">
            <h2 class="text-xl font-semibold text-base-content">Latest references</h2>
            <RouterLink
              to="/RecentReferences"
              class="text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
              >See all</RouterLink
            >
          </div>
          <RecentSourcesList
            :per="4"
            compact
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PinnedNews from '../components/PinnedNews.vue'
import NewsCard from '../components/NewsCard.vue'
import useNewsStore from '../store/news.js'
import PageHeader from '~/pages/components/Home/PageHeader.vue'
import RecentTaxaList from '~/pages/components/Recent/RecentTaxaList.vue'
import RecentSourcesList from '~/pages/components/Recent/RecentSourcesList.vue'

const { news_module = {} } = __APP_ENV__
const {
  index_page: { pinned_news_id = [], news_per_page = 10, show_date = true } = {}
} = news_module

const per = news_per_page || 5

const pinnedNewsId = computed(() => {
  return [pinned_news_id].flat().filter(Boolean)
})

const store = useNewsStore()

async function init() {
  if (pinnedNewsId.value.length) {
    await store.loadPinnedNews(pinnedNewsId.value)
  }
  await store.loadNews(1, per)
}

init()
</script>
