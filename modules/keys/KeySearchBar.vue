<template>
  <div class="relative w-full sm:w-96">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="border border-base-muted rounded-md pl-3 pr-9 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary/40"
    />
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-soft hover:text-base-content"
      title="Clear search"
    >✕</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search…' }
})
defineEmits(['update:modelValue'])
</script>