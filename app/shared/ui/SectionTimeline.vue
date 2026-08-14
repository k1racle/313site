<script setup lang="ts">
interface TimelineSection {
  id: string
  label: string
  waveform?: readonly number[]
}

const props = defineProps<{
  sections: readonly TimelineSection[]
  activeIndex: number
  fixed?: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

const mobileTrack = useTemplateRef<HTMLElement>('mobileTrack')

const fallbackWaveforms = [
  [26, 54, 38, 72, 48, 84, 58, 36, 68, 44, 76, 30],
  [60, 32, 74, 46, 86, 52, 30, 66, 42, 78, 56, 34],
  [34, 72, 52, 28, 64, 88, 46, 76, 38, 58, 82, 48],
] as const

function waveformFor(section: TimelineSection, index: number) {
  return section.waveform?.length ? section.waveform : fallbackWaveforms[index % fallbackWaveforms.length]
}

function selectSection(index: number) {
  emit('select', index)
}

watch(() => props.activeIndex, async (index) => {
  await nextTick()
  const activeButton = mobileTrack.value?.querySelector<HTMLElement>(`[data-timeline-index="${index}"]`)
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  activeButton?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
})
</script>

<template>
  <nav
    class="section-timeline z-30 border-t border-ink/10 bg-panel/95 text-ink shadow-[0_-1rem_3rem_rgba(7,16,31,.08)] backdrop-blur-[1.25rem]"
    :class="fixed
      ? 'fixed inset-x-0 bottom-[var(--mobile-dock-height)] desktop:bottom-0 desktop:left-[var(--layout-sidebar-width,var(--sidebar-width))] desktop:transition-[left] desktop:duration-[var(--duration-slow)] desktop:ease-studio'
      : 'absolute inset-x-0 bottom-0'"
    aria-label="Навигация по разделам страницы"
  >
    <div class="hidden h-[3.75rem] desktop:flex">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="grid min-w-0 flex-1 cursor-pointer grid-rows-[auto_1fr] overflow-hidden border-0 border-r border-ink/10 bg-panel px-4 pt-[.45rem] pb-[.4rem] text-muted transition-[flex-grow,color,background-color] duration-[var(--duration-slow)] ease-studio last:border-r-0 hover:bg-soft hover:text-ink"
        :class="{ '[flex-grow:1.14] bg-soft !text-accent': index === activeIndex }"
        :aria-current="index === activeIndex ? 'step' : undefined"
        :aria-label="`Перейти к разделу ${section.label}`"
        @click="selectSection(index)"
      >
        <span class="flex min-w-0 items-center gap-[.55rem] font-display text-xs font-extrabold uppercase">
          <span class="font-body text-[.625rem]" :class="index === activeIndex ? 'text-accent' : 'text-ink/30'">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ section.label }}</span>
        </span>
        <span class="flex h-5 items-end gap-[clamp(.125rem,.45vw,.375rem)] pt-1" aria-hidden="true">
          <i
            v-for="(height, barIndex) in waveformFor(section, index)"
            :key="barIndex"
            class="h-[20%] min-w-px max-w-[1.15rem] flex-1 opacity-28 transition-[height,opacity,background-color] duration-[var(--duration-slow)] ease-studio"
            :class="index === activeIndex ? 'bg-accent opacity-80' : 'bg-current'"
            :style="index === activeIndex ? { height: `${height}%` } : undefined"
          />
        </span>
      </button>
    </div>

    <div
      ref="mobileTrack"
      class="flex h-[3.75rem] overflow-x-auto [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden desktop:hidden"
    >
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="relative min-w-max flex-none cursor-pointer border-0 bg-transparent px-4 font-display text-[.6875rem] font-extrabold text-muted uppercase transition-colors duration-[var(--duration-base)] ease-studio after:absolute after:right-4 after:bottom-0 after:left-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-[var(--duration-base)] after:ease-studio after:content-['']"
        :class="{ 'text-accent after:scale-x-100': index === activeIndex }"
        :data-timeline-index="index"
        :aria-current="index === activeIndex ? 'step' : undefined"
        @click="selectSection(index)"
      >
        <span class="mr-[.35rem] font-body text-[.625rem]" :class="index === activeIndex ? 'text-accent' : 'text-ink/30'">{{ String(index + 1).padStart(2, '0') }}</span>
        {{ section.label }}
      </button>
    </div>
  </nav>
</template>
