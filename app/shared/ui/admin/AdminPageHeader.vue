<script setup lang="ts">
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'

defineProps<{
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
}>()
</script>

<template>
  <header class="flex flex-col gap-5 border-b border-ink/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
    <div class="max-w-3xl">
      <AppHeading as="h1" size="section" :accent="false">
        {{ title }}
      </AppHeading>
      <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {{ description }}
      </p>
    </div>

    <AppButton
      v-if="actionLabel"
      disabled
      class="shrink-0"
    >
      {{ actionLabel }}
    </AppButton>
  </header>
</template>
