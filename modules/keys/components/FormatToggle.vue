<template>
  <div class="inline-flex rounded-md border overflow-hidden text-sm" :style="{ borderColor: C.border }">
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      type="button"
      class="px-3 py-1 font-medium transition-colors"
      :class="i > 0 ? 'border-l' : ''"
      :style="segStyle(opt.value)"
      @click="$emit('update:modelValue', opt.value)"
      @mouseenter="hover = opt.value"
      @mouseleave="hover = null"
    >{{ opt.label }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])

const options = [
  { value: 'guided', label: 'Guided' },
  { value: 'full', label: 'Full key' }
]

// Pastel-green selected state. Active = soft green fill with deep green text;
// inactive = muted, tinting faintly on hover so it still reads as clickable.
const C = {
  activeBg: '#d8efe4',   // pastel green fill (selected)
  activeText: '#0F6E56', // deep green text on the pastel (stays readable)
  border: '#9FE1CB',     // soft green border around the whole control
  inactiveText: '#6b7280', // muted grey (unselected label)
  inactiveHover: '#eef7f2' // very faint green tint on hover
}

const hover = ref(null)

function segStyle(value) {
  const isActive = props.modelValue === value
  if (isActive) {
    return { backgroundColor: C.activeBg, color: C.activeText }
  }
  return {
    backgroundColor: hover.value === value ? C.inactiveHover : 'transparent',
    color: C.inactiveText
  }
}
</script>