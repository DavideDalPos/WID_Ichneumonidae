<template>
  <section class="container mx-auto px-4 py-14 sm:py-16">
    <h2 class="text-sm font-semibold uppercase tracking-wider text-primary-color dark:text-secondary-color">
      Meet the team
    </h2>
    <p class="mt-2 text-3xl font-bold tracking-tight text-base-content">
      Coordinators
    </p>

    <div class="mt-6 grid gap-5 md:grid-cols-2">
      <article
        v-for="c in coordinators"
        :key="fullName(c)"
        class="flex gap-5 rounded-2xl bg-base-foreground p-6 ring-1 ring-base-border/40"
      >
        <Avatar
          :person="c"
          :size="88"
        />
        <div class="min-w-0">
          <h3 class="text-lg font-semibold text-base-content">{{ fullName(c) }}</h3>
          <p class="text-sm text-base-content/60">{{ c.institution }}, {{ c.country }}</p>
          <RoleBadges
            :person="c"
            class="mt-3"
          />
          <ProfileLinks
            :person="c"
            class="mt-4"
          />
        </div>
      </article>
    </div>

    <p class="mt-12 text-3xl font-bold tracking-tight text-base-content">Curators</p>
    <p class="mt-2 text-base-content/65 max-w-2xl">
      Specialists who curate names, literature and data for their groups of
      expertise.
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="c in curators"
        :key="fullName(c)"
        class="flex items-center gap-4 rounded-xl bg-base-foreground p-4 ring-1 ring-base-border/40"
      >
        <Avatar
          :person="c"
          :size="52"
        />
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-base-content truncate">{{ fullName(c) }}</h3>
          <p class="text-sm text-base-content/60 truncate">{{ c.institution }}</p>
          <p class="text-xs text-base-content/45">{{ c.country }}</p>
        </div>
        <ProfileLinks
          :person="c"
          compact
        />
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, h } from 'vue'
import { collaborators } from './AboutMapData.js'
import { avatarColor, fullName, initials, isCoordinator, roles, sortTeam } from './teamUtils.js'
import OrcidIcon from '../Icons/OrcidIcon.vue'
import ResearchGateIcon from '../Icons/ResearchGateIcon.vue'
import GoogleScholarIcon from '../Icons/GoogleScholarIcon.vue'

const team = sortTeam(collaborators)
const coordinators = computed(() => team.filter(isCoordinator))
const curators = computed(() => team.filter((c) => !isCoordinator(c)))

const Avatar = (p) => {
  const style = { width: `${p.size}px`, height: `${p.size}px` }
  return p.person.image
    ? h('img', {
        src: p.person.image,
        alt: fullName(p.person),
        class: 'rounded-full object-cover flex-shrink-0 ring-4 ring-base-background',
        style
      })
    : h(
        'span',
        {
          class: 'rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white ring-4 ring-base-background',
          style: { ...style, background: avatarColor(p.person), fontSize: `${Math.round(p.size / 2.8)}px` },
          'aria-hidden': 'true'
        },
        initials(p.person)
      )
}
Avatar.props = ['person', 'size']

const ROLE_CLASS = {
  Founder: 'bg-secondary-color/20 text-amber-800 dark:text-secondary-color',
  Administrator: 'bg-primary-color/10 text-primary-color dark:bg-primary-color/30 dark:text-blue-200',
  Curator: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
}

const RoleBadges = (p) =>
  h(
    'div',
    { class: 'flex flex-wrap gap-1.5' },
    roles(p.person).map((r) =>
      h('span', { class: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_CLASS[r]}` }, r)
    )
  )
RoleBadges.props = ['person']

const LINKS = [
  { key: 'orcid', label: 'ORCID', icon: OrcidIcon, cls: 'text-[#A6CE39]' },
  { key: 'researchgate', label: 'ResearchGate', icon: ResearchGateIcon, cls: 'text-[#00CCBB]' },
  { key: 'googlescholar', label: 'Google Scholar', icon: GoogleScholarIcon, cls: 'text-blue-500' }
]

const ProfileLinks = (p) => {
  const items = LINKS.filter((l) => p.person[l.key])
  if (!items.length) return null
  return h(
    'div',
    { class: 'flex flex-wrap items-center gap-2' },
    items.map((l) =>
      h(
        'a',
        {
          href: p.person[l.key],
          target: '_blank',
          rel: 'noopener noreferrer',
          title: `${fullName(p.person)} on ${l.label}`,
          'aria-label': `${fullName(p.person)} on ${l.label}`,
          class: `inline-flex items-center gap-1.5 hover:opacity-80 transition ${l.cls} ${
            p.compact ? '' : 'rounded-lg ring-1 ring-base-border/50 px-2.5 py-1.5'
          }`
        },
        [
          h(l.icon, { style: { width: '20px', height: '20px' } }),
          p.compact ? null : h('span', { class: 'text-xs font-medium text-base-content/80' }, l.label)
        ]
      )
    )
  )
}
ProfileLinks.props = ['person', 'compact']
</script>
