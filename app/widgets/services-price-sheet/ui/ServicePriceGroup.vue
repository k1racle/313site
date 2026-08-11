<script setup lang="ts">
import { Radio } from 'lucide-vue-next'
import type { ServicePriceGroup } from '~/entities/service/model/types'
import ServicePriceRow from './ServicePriceRow.vue'

defineProps<{
  group: ServicePriceGroup
}>()
</script>

<template>
  <section :id="'price-' + group.id" class="scroll-mt-8">
    <header class="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-start gap-[clamp(1rem,3vw,2.5rem)] border-b-2 border-ink pb-[clamp(1.75rem,4vw,3rem)]">
      <span class="pt-2 text-[.7rem] font-extrabold text-accent">{{ group.number }}</span>
      <div>
        <h3 class="m-0 font-display text-[clamp(2rem,5vw,4rem)] leading-none font-extrabold tracking-[-.035em] text-ink uppercase">
          {{ group.title }}
        </h3>
        <p class="mt-3 mb-0 max-w-lg text-sm leading-normal text-muted">{{ group.note }}</p>
      </div>
      <Radio class="size-8 text-accent" aria-hidden="true" />
    </header>

    <div>
      <ServicePriceRow v-for="item in group.items" :key="item.title" :item="item" />
    </div>
  </section>
</template>
