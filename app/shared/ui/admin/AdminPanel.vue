<script setup lang="ts">
import AppHeading from '~/shared/ui/AppHeading.vue'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="border border-ink/10 bg-white p-5 shadow-[0_1rem_3rem_rgb(7_16_31/0.06)] sm:p-6">
    <div v-if="title || description" class="mb-5 border-b border-ink/8 pb-4">
      <AppHeading v-if="title" as="h2" size="compact" :accent="false" class="text-lg text-ink">
        {{ title }}
      </AppHeading>
      <p v-if="description" class="mt-1 text-sm leading-relaxed text-muted">
        {{ description }}
      </p>
    </div>
    <slot />
  </section>
</template>
