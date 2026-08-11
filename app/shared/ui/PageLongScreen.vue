<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
}>(), {
  as: 'div',
})
</script>

<template>
  <component :is="as" class="page-long-screen">
    <slot />
  </component>
</template>

<style scoped>
.page-long-screen {
  min-height: calc(100dvh - var(--mobile-dock-height));
  background: var(--color-ink);
  color: white;
}

@media (min-width: 67.5rem) {
  .page-long-screen {
    min-height: 100dvh;
  }
}
</style>
