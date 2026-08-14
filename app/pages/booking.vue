<script setup lang="ts">
import { createEmptySiteSettings, type SiteSettings } from '~~/shared/types/site-settings'

const { data: settings } = await useFetch<SiteSettings>('/api/settings', {
  default: createEmptySiteSettings,
})
const route = useRoute()

const widgetSrc = computed(() => {
  const source = settings.value.bookingWidget?.src
  const routeService = route.query.service
  const service = Array.isArray(routeService) ? routeService[0] : routeService

  if (!source || !service) return source

  const url = new URL(source)
  url.searchParams.set('service', service.slice(0, 300))
  return url.toString()
})

useSeoMeta({
  title: 'Записаться — Studio 313',
  description: 'Выберите удобную дату и время записи в Studio 313.',
  ogTitle: 'Записаться — Studio 313',
  ogDescription: 'Онлайн-запись на съёмку в Studio 313.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <main class="flex min-h-[calc(100dvh-var(--mobile-dock-height))] items-start justify-center bg-panel desktop:min-h-dvh">
    <iframe
      v-if="settings.bookingWidget && widgetSrc"
      :src="widgetSrc"
      :width="settings.bookingWidget.width"
      :height="settings.bookingWidget.height"
      title="Онлайн-запись Studio 313"
      class="max-w-full border-0 bg-white"
      loading="eager"
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </main>
</template>
