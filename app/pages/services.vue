<script setup lang="ts">
import {
  pricingTimelineSection,
  serviceSignalBars,
} from '~/entities/service/config/services'
import type { FeaturedService, PriceList } from '~/entities/service/model/types'
import { useSectionNavigation } from '~/features/section-navigation/model/useSectionNavigation'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'
import ServicesPriceSheet from '~/widgets/services-price-sheet/ui/ServicesPriceSheet.vue'
import ServicesShowcase from '~/widgets/services-showcase/ui/ServicesShowcase.vue'

const { data: servicesData } = await useFetch<{ services: FeaturedService[] }>('/api/services', {
  key: 'featured-services',
  default: () => ({ services: [] }),
})
const featuredServiceItems = computed(() => servicesData.value.services)
const { data: priceListData } = await useFetch<{ priceList: PriceList }>('/api/price-list', {
  key: 'price-list',
  default: () => ({ priceList: { id: 'main', title: 'Прайс-лист', subtitle: '', sections: [] } }),
})
const serviceTimelineSections = computed(() => featuredServiceItems.value.map(({ id, timelineLabel, waveform }) => ({
  id,
  label: timelineLabel,
  waveform,
})))
const pageSections = computed(() => [...serviceTimelineSections.value, pricingTimelineSection])
const {
  activeIndex,
  scrollToSection,
  setFullscreenIndex,
} = useSectionNavigation(pageSections.value, {
  longSectionId: pricingTimelineSection.id,
  longSectionIndex: serviceTimelineSections.value.length,
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
  <div class="services-page bg-page [--page-bottom-inset:3.75rem]">
    <ServicesShowcase
      :services="featuredServiceItems"
      :signal-bars="serviceSignalBars"
      @active-change="setFullscreenIndex"
    />

    <ServicesPriceSheet :price-list="priceListData.priceList" />

    <SectionTimeline
      :sections="pageSections"
      :active-index="activeIndex"
      fixed
      @select="scrollToSection"
    />
  </div>
</template>
