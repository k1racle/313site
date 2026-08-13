<script setup lang="ts">
import type { PriceListItem } from '~/entities/service/model/types'
import AppHeading from '~/shared/ui/AppHeading.vue'

defineProps<{
  item: PriceListItem
}>()
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-ink/16 py-[clamp(1.25rem,2.5vw,1.75rem)] sm:grid-cols-[minmax(15rem,auto)_minmax(2rem,1fr)_auto] max-[35rem]:items-start">
    <div>
      <AppHeading as="h4" size="card" :accent="false" class="m-0 text-[clamp(1rem,2vw,1.35rem)]">
        {{ item.title }}
      </AppHeading>
      <p v-if="item.subtitle" class="mt-1.5 mb-0 text-[.78rem] leading-[1.45] text-muted max-[35rem]:max-w-52">
        {{ item.subtitle }}
      </p>
    </div>
    <span
      class="hidden h-px bg-[linear-gradient(90deg,rgba(7,16,31,.24)_33%,transparent_0%)] [background-position:bottom] [background-size:6px_1px] sm:block"
      aria-hidden="true"
    />
    <div v-if="item.price || item.unit" class="flex min-w-max flex-col items-end">
      <strong class="font-display text-[clamp(1rem,2vw,1.35rem)] leading-none font-extrabold text-accent uppercase">
        {{ item.price }}
      </strong>
      <span class="mt-2 text-[.62rem] tracking-[.08em] text-ink/42 uppercase">{{ item.unit }}</span>
    </div>
    <div v-else aria-hidden="true" />

    <div v-if="item.variations.length" class="col-span-2 mt-1 grid gap-2.5 border-t border-ink/8 pt-3 sm:col-span-3">
      <div
        v-for="variation in item.variations"
        :key="variation.id"
        class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 sm:grid-cols-[minmax(15rem,auto)_minmax(2rem,1fr)_auto]"
      >
        <strong class="font-display text-[.78rem] leading-tight font-extrabold text-ink uppercase sm:text-sm">
          {{ variation.title }}
        </strong>
        <span class="hidden h-px bg-[linear-gradient(90deg,rgba(7,16,31,.16)_33%,transparent_0%)] [background-position:bottom] [background-size:6px_1px] sm:block" aria-hidden="true" />
        <strong class="text-right font-display text-[.78rem] leading-tight font-extrabold text-accent uppercase sm:text-sm">
          {{ variation.price }}
        </strong>
      </div>
    </div>
  </div>
</template>
