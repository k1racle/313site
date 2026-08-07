<script setup lang="ts">
const emit = defineEmits<{
  'update:activeScreen': [index: number]
}>()

const flow = useTemplateRef<HTMLElement>('flow')
const activeScreen = ref(0)
const screenCount = ref(0)
let animationFrame = 0

function slides() {
  return flow.value ? [...flow.value.querySelectorAll<HTMLElement>(':scope > [data-screen-slide]')] : []
}

function updateActiveScreen() {
  if (!flow.value || flow.value.clientWidth === 0) return
  const nextIndex = Math.max(0, Math.min(screenCount.value - 1, Math.round(flow.value.scrollLeft / flow.value.clientWidth)))
  if (nextIndex === activeScreen.value) return
  activeScreen.value = nextIndex
  emit('update:activeScreen', nextIndex)
}

function handleScroll() {
  cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(updateActiveScreen)
}

function scrollToScreen(index: number) {
  const target = slides()[index]
  target?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'start',
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollToScreen(Math.min(activeScreen.value + 1, screenCount.value - 1))
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollToScreen(Math.max(activeScreen.value - 1, 0))
  }
}

onMounted(() => {
  screenCount.value = slides().length
  window.addEventListener('resize', updateActiveScreen)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', updateActiveScreen)
})
</script>

<template>
  <div class="relative">
    <div
      ref="flow"
      class="flex h-[calc(100dvh-var(--mobile-dock-height))] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden desktop:block desktop:h-auto desktop:overflow-visible"
      tabindex="0"
      aria-label="Экраны страницы"
      @scroll.passive="handleScroll"
      @keydown="handleKeydown"
    >
      <slot />
    </div>

    <div
      v-if="screenCount > 1"
      class="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 desktop:hidden"
      aria-hidden="true"
    >
      <button
        v-for="index in screenCount"
        :key="index"
        type="button"
        class="pointer-events-auto h-1.5 cursor-pointer rounded-full bg-white/55 shadow-sm transition-[width,background-color]"
        :class="index - 1 === activeScreen ? 'w-8 bg-white' : 'w-3'"
        :tabindex="-1"
        @click="scrollToScreen(index - 1)"
      />
    </div>
  </div>
</template>
