<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'

withDefaults(defineProps<{
  title: string
  buttonLabel: string
  to: RouteLocationRaw
  description?: string
}>(), {
  description: '',
})
</script>

<template>
  <section class="flex items-center bg-[#eaf4ff] py-[clamp(4rem,9vw,8rem)] text-ink">
    <div class="mx-auto flex w-[min(calc(100%-3rem),78rem)] flex-col gap-10 sm:w-[min(calc(100%-5rem),78rem)] sm:flex-row sm:items-end sm:justify-between max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
      <div class="max-w-4xl">
        <AppHeading as="h2" size="page" :accent="true" class="m-0 whitespace-pre-line [word-spacing:0.12em]">
          {{ title }}
        </AppHeading>
        <p v-if="description" class="mt-6 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.65] text-muted">
          {{ description }}
        </p>
      </div>

      <AppButton behaviour="link" :to="to" class="min-h-14 w-fit shrink-0 text-xs">
        {{ buttonLabel }}
        <ArrowRight class="size-4.5" aria-hidden="true" />
      </AppButton>
    </div>
  </section>
</template>
