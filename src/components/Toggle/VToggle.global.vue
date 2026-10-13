<template>
  <label
    class="tp-toggle inline-flex items-center gap-2 cursor-pointer select-none"
    :class="size === 'sm' ? 'text-sm' : 'text-base'"
  >
    <input
      v-model="model"
      type="checkbox"
      role="switch"
      class="sr-only peer"
      :disabled="disabled"
    />
    <span
      class="relative inline-flex flex-shrink-0 rounded-full transition-colors bg-base-muted peer-checked:bg-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/40"
      :class="size === 'sm' ? 'h-4 w-7' : 'h-5 w-9'"
      aria-hidden="true"
    >
      <span
        class="absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform"
        :class="[
          size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
          model ? (size === 'sm' ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0'
        ]"
      />
    </span>
    <span><slot /></span>
  </label>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false }
})

const model = defineModel({ type: Boolean, default: false })
</script>
