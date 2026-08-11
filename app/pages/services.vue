<script setup lang="ts">
import {
  featuredServices,
  pricingTimelineSection,
  servicePriceGroups,
  serviceSignalBars,
  serviceTimelineSections,
} from '~/entities/service/config/services'
import { useSectionNavigation } from '~/features/section-navigation/model/useSectionNavigation'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'
import ServicesPriceSheet from '~/widgets/services-price-sheet/ui/ServicesPriceSheet.vue'
import ServicesShowcase from '~/widgets/services-showcase/ui/ServicesShowcase.vue'

const pageSections = [...serviceTimelineSections, pricingTimelineSection]
const {
  activeIndex,
  scrollToSection,
  setFullscreenIndex,
} = useSectionNavigation(pageSections, {
  longSectionId: pricingTimelineSection.id,
  longSectionIndex: serviceTimelineSections.length,
})

useSeoMeta({
  title: 'Услуги студии — Studio 313',
  description: 'Аренда студии, производство подкаста под ключ, публикация выпусков, аудиозапись, видеомонтаж и упаковка контента.',
  ogTitle: 'Услуги Studio 313',
  ogDescription: 'Полный цикл производства подкастов: от аренды студии до готового релиза.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <div class="services-page bg-ink [--page-bottom-inset:3.75rem]">
    <ServicesShowcase
      :services="featuredServices"
      :signal-bars="serviceSignalBars"
      @active-change="setFullscreenIndex"
    />

    <ServicesPriceSheet :groups="servicePriceGroups" />

    <SectionTimeline
      :sections="pageSections"
      :active-index="activeIndex"
      fixed
      @select="scrollToSection"
    />
  </div>
</template>
