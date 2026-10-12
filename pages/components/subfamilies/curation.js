// Curation checklist used on the Subfamilies page.
// Values in data/*.js are: true (complete), 'in-progress', or false (not started).

export const CURATION_GROUPS = [
  {
    key: 'genera',
    label: 'Genera',
    items: {
      valid: 'Valid names',
      synonyms: 'Synonyms, homonyms & unavailable names',
      literature: 'Primary literature reviewed'
    }
  },
  {
    key: 'typeSpecies',
    label: 'Type species',
    items: {
      present: 'Designations recorded',
      references: 'References',
      photo: 'Photographs'
    }
  },
  {
    key: 'species',
    label: 'Species',
    items: {
      valid: 'Valid names',
      synonyms: 'Synonyms, homonyms & unavailable names',
      references: 'Main references',
      citations: 'Full taxonomic history'
    }
  },
  {
    key: 'otus',
    label: 'Distribution & types',
    items: {
      distribution: 'Geographic distribution',
      originaltypeinfo: 'Original type series',
      photographs: 'Photographs'
    }
  },
  {
    key: 'biology',
    label: 'Biology',
    items: {
      biology: 'Biological associations',
      references: 'References',
      citations: 'Citations'
    }
  }
]

export function taskScore(value) {
  if (value === true) return 1
  if (value === 'in-progress') return 0.5
  return 0
}

export function taskState(value) {
  if (value === true) return 'done'
  if (value === 'in-progress') return 'progress'
  return 'todo'
}

export function groupProgress(item, group) {
  const values = Object.keys(group.items).map((k) => item?.[group.key]?.[k])
  if (!values.length) return 0
  return Math.round((values.reduce((s, v) => s + taskScore(v), 0) / values.length) * 100)
}

export function itemProgress(item) {
  let total = 0
  let done = 0
  CURATION_GROUPS.forEach((group) => {
    Object.keys(group.items).forEach((k) => {
      total++
      done += taskScore(item?.[group.key]?.[k])
    })
  })
  return total ? Math.round((done / total) * 100) : 0
}

export function statusFromProgress(p) {
  if (p >= 100) return 'Complete'
  if (p <= 0) return 'Not started'
  return 'In progress'
}
