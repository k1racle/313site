<script setup lang="ts">
import type { ServicePriceItem } from '~/entities/service/model/types'

defineProps<{
  item: ServicePriceItem
}>()
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-ink/16 py-[clamp(1.25rem,2.5vw,1.75rem)] sm:grid-cols-[minmax(15rem,auto)_minmax(2rem,1fr)_auto] max-[35rem]:items-start">
    <div>
      <h4 class="m-0 font-display text-[clamp(1rem,2vw,1.35rem)] leading-tight font-extrabold text-ink uppercase">
        {{ item.title }}
      </h4>
      <p class="mt-1.5 mb-0 text-[.78rem] leading-[1.45] text-muted max-[35rem]:max-w-52">
        {{ item.detail }}
      </p>
    </div>
    <span
      class="hidden h-px bg-[linear-gradient(90deg,rgba(7,16,31,.24)_33%,transparent_0%)] [background-position:bottom] [background-size:6px_1px] sm:block"
      aria-hidden="true"
    />
    <div class="flex min-w-max flex-col items-end">
      <strong class="font-display text-[clamp(1rem,2vw,1.35rem)] leading-none font-extrabold text-accent uppercase">
        {{ item.price }}
      </strong>
      <span class="mt-2 text-[.62rem] tracking-[.08em] text-ink/42 uppercase">{{ item.unit }}</span>
    </div>
  </div>
</template>
