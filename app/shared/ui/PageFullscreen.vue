<script setup lang="ts">
import CameraFrame from '~/shared/ui/CameraFrame.vue'

const props = withDefaults(defineProps<{
  label?: string
  showFrame?: boolean
  handoff?: boolean
}>(), {
  label: 'Разделы страницы',
  showFrame: true,
  handoff: false,
})

const emit = defineEmits<{
  activeChange: [index: number]
}>()

const scroller = useTemplateRef<HTMLElement>('scroller')
const activeIndex = ref(0)
let observer: IntersectionObserver | undefined
let handoffLocked = false
let handoffTimer: ReturnType<typeof setTimeout> | undefined

function sectionElements() {
  return Array.from(scroller.value?.querySelectorAll<HTMLElement>(':scope > [data-page-section]') || [])
}

function scrollToSection(index: number) {
  const target = sectionElements()[index]
  if (!target) return

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function handoffToNextScreen(event: WheelEvent) {
  const root = scroller.value
  if (!props.handoff || !root || event.deltaY <= 0 || event.ctrlKey) return

  const distanceToBottom = root.scrollHeight - root.scrollTop - root.clientHeight
  if (distanceToBottom > 2) return

  const nextScreen = root.parentElement?.nextElementSibling
  if (!(nextScreen instanceof HTMLElement)) return

  event.preventDefault()
  if (handoffLocked) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  handoffLocked = true
  nextScreen.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  })

  handoffTimer = setTimeout(() => {
    handoffLocked = false
  }, reduceMotion ? 0 : 700)
}

defineExpose({ scrollToSection })

watch(activeIndex, index => emit('activeChange', index), { immediate: true })

onMounted(() => {
  const root = scroller.value
  if (!root) return

  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

    if (!visible) return
    const index = sectionElements().indexOf(visible.target as HTMLElement)
    if (index >= 0) activeIndex.value = index
  }, {
    root,
    threshold: [0.45, 0.6, 0.75],
  })

  sectionElements().forEach(section => observer?.observe(section))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (handoffTimer) clearTimeout(handoffTimer)
})
</script>

<template>
  <div
    class="page-fullscreen relative h-[calc(100dvh-var(--mobile-dock-height))] w-full overflow-hidden bg-ink text-white [--page-content-safe-bottom:calc(var(--page-bottom-inset,0rem)+var(--page-frame-inset)+var(--page-frame-corner-size)+var(--page-frame-content-gap))] [--page-frame-content-gap:.5rem] [--page-frame-corner-size:0rem] [--page-frame-inset:0rem] desktop:h-dvh"
    :class="{ '[--page-frame-corner-size:1.5rem] [--page-frame-inset:.75rem] desktop:[--page-frame-corner-size:clamp(1.75rem,3vw,3rem)] desktop:[--page-frame-inset:clamp(.75rem,1.6vw,1.5rem)]': showFrame }"
  >
    <div
      ref="scroller"
      class="size-full snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>[data-page-section]]:min-h-full [&>[data-page-section]]:snap-start [&>[data-page-section]]:[scroll-snap-stop:always]"
      :class="handoff ? '[overscroll-behavior-y:auto]' : '[overscroll-behavior-y:contain]'"
      :aria-label="label"
      @wheel="handoffToNextScreen"
    >
      <slot :active-index="activeIndex" />
    </div>

    <CameraFrame v-if="showFrame" />
  </div>
</template>
