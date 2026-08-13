<script setup lang="ts">
import { Radio } from 'lucide-vue-next'
import type { PriceListSection } from '~/entities/service/model/types'
import AppHeading from '~/shared/ui/AppHeading.vue'
import ServicePriceRow from './ServicePriceRow.vue'

defineProps<{
  section: PriceListSection
  number: string
}>()
</script>

<template>
  <section :id="'price-' + section.id" class="scroll-mt-8">
    <header class="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-start gap-[clamp(1rem,3vw,2.5rem)] border-b-2 border-ink pb-[clamp(1.75rem,4vw,3rem)]">
      <span class="pt-2 text-[.7rem] font-extrabold text-accent">{{ number }}</span>
      <div>
        <AppHeading as="h3" size="section" :accent="true" class="m-0">
          {{ section.title }}
        </AppHeading>
        <p v-if="section.subtitle" class="mt-3 mb-0 max-w-lg text-sm leading-normal text-muted">{{ section.subtitle }}</p>
      </div>
      <Radio class="size-8 text-accent" aria-hidden="true" />
    </header>

    <div>
      <ServicePriceRow v-for="item in section.items" :key="item.id" :item="item" />
    </div>
  </section>
</template>
