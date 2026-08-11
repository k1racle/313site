<script setup lang="ts">
import CameraFrame from '~/shared/ui/CameraFrame.vue'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'

interface TimelineSection {
  id: string
  label: string
  waveform?: readonly number[]
}

withDefaults(defineProps<{
  sections: readonly TimelineSection[]
  label?: string
  showFrame?: boolean
  handoff?: boolean
}>(), {
  label: 'Разделы страницы',
  showFrame: true,
  handoff: false,
})

const scroller = useTemplateRef<HTMLElement>('scroller')
const activeIndex = ref(0)
let observer: IntersectionObserver | undefined

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

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    class="page-fullscreen"
    :class="{
      'page-fullscreen--with-frame': showFrame,
      'page-fullscreen--handoff': handoff,
      'page-fullscreen--with-timeline': sections.length > 1,
    }"
  >
    <div ref="scroller" class="page-fullscreen__scroller" :aria-label="label">
      <slot :active-index="activeIndex" />
    </div>

    <CameraFrame v-if="showFrame" />
    <SectionTimeline
      v-if="sections.length > 1"
      :sections="sections"
      :active-index="activeIndex"
      @select="scrollToSection"
    />
  </div>
</template>

<style>
.page-fullscreen {
  --page-timeline-height: 0rem;
  --page-frame-inset: 0rem;
  --page-frame-corner-size: 0rem;
  --page-frame-content-gap: 0.5rem;
  --page-content-safe-bottom: calc(
    var(--page-timeline-height)
    + var(--page-frame-inset)
    + var(--page-frame-corner-size)
    + var(--page-frame-content-gap)
  );
  position: relative;
  width: 100%;
  height: calc(100dvh - var(--mobile-dock-height));
  overflow: hidden;
  background: var(--color-ink);
  color: white;
}

.page-fullscreen--with-timeline {
  --page-timeline-height: 3.75rem;
}

.page-fullscreen--with-frame {
  --page-frame-inset: 0.75rem;
  --page-frame-corner-size: 1.5rem;
}

.page-fullscreen__scroller {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.page-fullscreen--handoff .page-fullscreen__scroller {
  overscroll-behavior-y: auto;
}

.page-fullscreen__scroller::-webkit-scrollbar {
  display: none;
}

.page-fullscreen__scroller > [data-page-section] {
  min-height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

@media (min-width: 67.5rem) {
  .page-fullscreen {
    height: 100dvh;
  }

  .page-fullscreen--with-frame {
    --page-frame-inset: clamp(0.75rem, 1.6vw, 1.5rem);
    --page-frame-corner-size: clamp(1.75rem, 3vw, 3rem);
  }
}
</style>
