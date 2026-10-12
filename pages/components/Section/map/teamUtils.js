// Helpers shared by the About page map and team list.

export const fullName = (c) => `${c.first_name} ${c.last_name}`.trim()

export const initials = (c) =>
  ((c.first_name?.[0] || '') + (c.last_name?.replace(/^(van|de|di|dal|dos)\s+/i, '')?.[0] || '')).toUpperCase()

// Deterministic, theme-friendly avatar colour per person
const AVATAR_COLORS = ['#2a62b7', '#0f766e', '#7c3aed', '#b45309', '#be123c', '#0369a1', '#4d7c0f', '#a21caf']
export function avatarColor(c) {
  const s = fullName(c)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function roles(c) {
  const out = []
  if (c.leader === 'yes') out.push('Founder')
  if (c.administrator === 'yes') out.push('Administrator')
  out.push('Curator')
  return out
}

export const isCoordinator = (c) => c.leader === 'yes' || c.administrator === 'yes'

const CONTINENT = {
  USA: 'North America',
  Canada: 'North America',
  Mexico: 'North America',
  Brazil: 'South America',
  Chile: 'South America',
  Argentina: 'South America',
  Colombia: 'South America',
  'South Africa': 'Africa',
  'Hong Kong': 'Asia',
  China: 'Asia',
  Japan: 'Asia',
  Australia: 'Oceania'
}
export const continentOf = (country) => CONTINENT[country] || 'Europe'

export function sortTeam(list) {
  const top = list.filter(isCoordinator)
  const rest = list
    .filter((c) => !isCoordinator(c))
    .sort((a, b) => (a.last_name || '').localeCompare(b.last_name || ''))
  return [...top, ...rest]
}

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
