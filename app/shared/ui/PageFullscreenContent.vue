<template>
  <div class="page-fullscreen-content">
    <slot />
  </div>
</template>

<style scoped>
.page-fullscreen-content {
  padding-bottom: var(--page-content-safe-bottom, 2rem);
}
</style>
