<script setup lang="ts">
import BookingWidgetFrame from '~/features/booking/ui/BookingWidgetFrame.vue'

const route = useRoute()
const routeService = computed(() => {
  const service = route.query.service
  return Array.isArray(service) ? service[0] || '' : service || ''
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
  <main class="min-h-[calc(100dvh-var(--mobile-dock-height))] bg-panel px-5 py-6 sm:px-8 sm:py-8 desktop:min-h-dvh desktop:px-page">
    <div class="mx-auto w-full max-w-[96rem]">
      <BookingWidgetFrame :service="routeService" />
    </div>
  </main>
</template>
