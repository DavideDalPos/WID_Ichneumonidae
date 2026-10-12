<template>
  <header class="wid-page-header text-white">
    <div class="container mx-auto px-4 py-12 sm:py-16 box-border">
      <p
        v-if="eyebrow"
        class="text-xs font-semibold uppercase tracking-wider text-secondary-color"
      >
        {{ eyebrow }}
      </p>
      <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="mt-3 max-w-2xl text-lg text-white/75"
      >
        {{ subtitle }}
      </p>
      <div
        v-if="$slots.default"
        class="mt-6"
      >
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.wid-page-header {
  background:
    radial-gradient(50rem 20rem at 90% 0%, rgba(42, 98, 183, 0.45), transparent 60%),
    linear-gradient(180deg, #0f1b33 0%, #13223f 100%);
}
</style>
