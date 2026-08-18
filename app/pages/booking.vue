<script setup lang="ts">
import { createEmptySiteSettings, type SiteSettings } from '~~/shared/types/site-settings'

const { data: settings } = await useFetch<SiteSettings>('/api/settings', {
  default: createEmptySiteSettings,
})

const route = useRoute()
const widgetFrame = ref<HTMLIFrameElement | null>(null)

const minWidgetHeight = computed(() => (
  settings.value.bookingWidget?.minHeight
  || settings.value.bookingWidget?.height
  || 760
))

const widgetHeight = ref(minWidgetHeight.value)

const widgetSrc = computed(() => {
  const source = settings.value.bookingWidget?.src
  const routeService = route.query.service
  const service = Array.isArray(routeService) ? routeService[0] : routeService

  if (!source || !service) return source

  const url = new URL(source)
  url.searchParams.set('service', service.slice(0, 300))
  return url.toString()
})

const widgetTitle = computed(() => settings.value.bookingWidget?.title || 'Онлайн-запись Studio 313')

watch(minWidgetHeight, (value) => {
  widgetHeight.value = value
}, { immediate: true })

function notifyWidgetReady() {
  widgetFrame.value?.contentWindow?.postMessage({
    type: 'studio313:widget-parent-ready',
  }, '*')
}

function handleWidgetMessage(event: MessageEvent) {
  const iframe = widgetFrame.value
  if (!iframe || event.source !== iframe.contentWindow) return

  const payload = event.data
  if (!payload || typeof payload !== 'object') return

  const message = payload as { type?: unknown, height?: unknown }
  if (message.type !== 'studio313:widget-resize') return
  if (typeof message.height !== 'number' || !Number.isFinite(message.height) || message.height <= 0) return

  widgetHeight.value = Math.max(minWidgetHeight.value, Math.ceil(message.height))
}

onMounted(() => {
  window.addEventListener('message', handleWidgetMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleWidgetMessage)
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
      <iframe
        v-if="settings.bookingWidget && widgetSrc"
        ref="widgetFrame"
        :src="widgetSrc"
        :title="widgetTitle"
        :style="{ minHeight: `${minWidgetHeight}px`, height: `${widgetHeight}px` }"
        class="block w-full overflow-hidden border-0 bg-white"
        loading="lazy"
        scrolling="no"
        referrerpolicy="strict-origin-when-cross-origin"
        @load="notifyWidgetReady"
      />
    </div>
  </main>
</template>
