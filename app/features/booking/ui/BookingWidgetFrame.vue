<script setup lang="ts">
import { createEmptySiteSettings, type SiteSettings } from '~~/shared/types/site-settings'

const props = withDefaults(defineProps<{
  service?: string
  loading?: 'eager' | 'lazy'
}>(), {
  service: '',
  loading: 'lazy',
})

const { data: settings } = await useFetch<SiteSettings>('/api/settings', {
  key: 'site-settings',
  default: createEmptySiteSettings,
})

const widgetFrame = ref<HTMLIFrameElement | null>(null)

const normalizedService = computed(() => props.service.trim().slice(0, 300))
const minWidgetHeight = computed(() => (
  settings.value.bookingWidget?.minHeight
  || settings.value.bookingWidget?.height
  || 760
))
const widgetHeight = ref(minWidgetHeight.value)

const widgetSrc = computed(() => {
  const source = settings.value.bookingWidget?.src
  if (!source) return source

  if (!normalizedService.value) return source

  const url = new URL(source)
  url.searchParams.set('service', normalizedService.value)
  return url.toString()
})

const widgetTitle = computed(() => settings.value.bookingWidget?.title || 'Онлайн-запись Studio 313')

watch([minWidgetHeight, widgetSrc], ([height]) => {
  widgetHeight.value = height
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
</script>

<template>
  <iframe
    v-if="settings.bookingWidget && widgetSrc"
    ref="widgetFrame"
    :src="widgetSrc"
    :title="widgetTitle"
    :style="{ minHeight: `${minWidgetHeight}px`, height: `${widgetHeight}px` }"
    class="block w-full overflow-hidden border-0 bg-white"
    :loading="loading"
    scrolling="no"
    referrerpolicy="strict-origin-when-cross-origin"
    @load="notifyWidgetReady"
  />
  <div
    v-else
    class="flex min-h-[18rem] items-center justify-center border border-ink/10 bg-white px-6 py-10 text-center text-sm leading-relaxed text-muted"
  >
    Виджет записи пока недоступен.
  </div>
</template>
