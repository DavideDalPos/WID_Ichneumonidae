import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFooterStore } from '@/store'

const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')

/**
 * Citation for the page currently being viewed:
 *   <project authors> <taxon name, when on a taxon page> <project citation>.
 *   Retrieved on <date> at <url>
 * Shared by the footer and the taxon page "Cite" button.
 */
export function usePageCitation() {
  const { project_authors, project_citation, project_url, hash_mode } = __APP_ENV__
  const store = useFooterStore()
  const route = useRoute()
  const date = new Date().toISOString().split('T')[0]

  const url = computed(() => {
    const base = (project_url || '').replace(/\/$/, '')
    if (!base) return ''
    return hash_mode ? `${base}/#${route.fullPath}` : base + route.fullPath
  })

  const subjectHtml = computed(() => store.nextAuthor || '')

  const text = computed(() =>
    [
      project_authors,
      stripHtml(subjectHtml.value),
      `${project_citation}.`,
      `Retrieved on ${date}`,
      url.value ? `at ${url.value}` : ''
    ]
      .filter(Boolean)
      .join(' ')
  )

  return { authors: project_authors, citation: project_citation, subjectHtml, date, url, text }
}
