<template>
  <section class="container mx-auto px-4 py-16 sm:py-20">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
          {{ news.length ? 'News' : "What's new" }}
        </h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-base-content">
          {{ news.length ? 'Latest updates' : 'Recently added to WID' }}
        </p>
      </div>
      <RouterLink
        :to="news.length ? '/news' : '/RecentTaxa'"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-color dark:text-secondary-color hover:underline"
      >
        {{ news.length ? 'All news' : 'See everything new' }}
        <HomeIcon
          name="arrow"
          class="h-4 w-4"
        />
      </RouterLink>
    </div>

    <!-- Project news, when there is any -->
    <div
      v-if="news.length"
      class="mt-8 grid gap-5 md:grid-cols-3"
    >
      <NewsCard
        v-for="item in news"
        :key="item.id"
        :news="item"
      />
    </div>

    <!-- Otherwise: latest database activity -->
    <div
      v-else-if="loaded"
      class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      <div class="min-w-0 lg:col-span-7">
        <h3 class="mb-3 text-sm font-semibold text-base-content/70">Latest taxa</h3>
        <RecentTaxaList
          :per="6"
          compact
        />
      </div>
      <div class="min-w-0 lg:col-span-5">
        <h3 class="mb-3 text-sm font-semibold text-base-content/70">Latest references</h3>
        <RecentSourcesList
          :per="3"
          compact
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { News } from '@/modules/news/services/News'
import { makeNews } from '@/modules/news/adapters/makeNews'
import NewsCard from '@/modules/news/components/NewsCard.vue'
import RecentTaxaList from '../Recent/RecentTaxaList.vue'
import RecentSourcesList from '../Recent/RecentSourcesList.vue'
import HomeIcon from './HomeIcon.vue'

const { news_module = {} } = __APP_ENV__
const { widget: { news_count = 3 } = {} } = news_module

const news = ref([])
const loaded = ref(false)

onMounted(() => {
  News.where({ per: news_count })
    .then(({ data }) => {
      news.value = (data || []).map(makeNews)
    })
    .catch(() => {})
    .finally(() => {
      loaded.value = true
    })
})
</script>
