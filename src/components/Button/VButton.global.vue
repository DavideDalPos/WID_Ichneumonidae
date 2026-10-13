<template>
  <button
    type="button"
    :class="['tp-button', 'inline-flex items-center justify-center gap-1.5 font-medium transition', sizeClass, shapeClass, colorClass]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Supports both the legacy boolean API (`primary`, `secondary`) and the newer
// `variant` / `size` / `ghost` API used by the project's custom panels.
const props = defineProps({
  primary: { type: Boolean, default: false },
  secondary: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  variant: { type: String, default: '' },
  size: { type: String, default: 'md' },
  ghost: { type: Boolean, default: false }
})

const resolvedVariant = computed(() => {
  if (props.variant) return props.variant
  if (props.primary) return 'primary'
  if (props.secondary) return 'secondary'
  return ''
})

const sizeClass = computed(() =>
  props.size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1'
)

const shapeClass = computed(() => (props.circle ? 'rounded-full' : 'rounded-md'))

const colorClass = computed(() => {
  const v = resolvedVariant.value
  if (!v) return 'hover:bg-opacity-80'

  if (props.ghost) {
    return 'bg-transparent text-base-content/75 ring-1 ring-inset ring-base-border/60 hover:bg-base-muted/40 hover:text-base-content'
  }

  if (v === 'primary') return 'bg-primary-color text-primary-content hover:bg-opacity-90'
  // "secondary" in the panels means the UI accent (blue in light mode)
  return 'bg-secondary text-white hover:bg-opacity-90'
})
</script>
