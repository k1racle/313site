<script setup lang="ts">
interface TimelineSection {
  id: string
  label: string
  waveform?: readonly number[]
}

const props = defineProps<{
  sections: readonly TimelineSection[]
  activeIndex: number
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
  activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
})
</script>

<template>
  <nav class="section-timeline" aria-label="Навигация по разделам страницы">
    <div class="section-timeline__desktop">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="section-timeline__segment"
        :class="{ 'is-active': index === activeIndex }"
        :aria-current="index === activeIndex ? 'step' : undefined"
        :aria-label="`Перейти к разделу ${section.label}`"
        @click="selectSection(index)"
      >
        <span class="section-timeline__heading">
          <span class="section-timeline__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="section-timeline__label">{{ section.label }}</span>
        </span>
        <span class="section-timeline__wave" aria-hidden="true">
          <i
            v-for="(height, barIndex) in waveformFor(section, index)"
            :key="barIndex"
            :style="index === activeIndex ? { height: `${height}%` } : undefined"
          />
        </span>
      </button>
    </div>

    <div ref="mobileTrack" class="section-timeline__mobile">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="section-timeline__mobile-item"
        :class="{ 'is-active': index === activeIndex }"
        :data-timeline-index="index"
        :aria-current="index === activeIndex ? 'step' : undefined"
        @click="selectSection(index)"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ section.label }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.section-timeline {
  position: absolute;
  z-index: 30;
  right: 0;
  bottom: 0;
  left: 0;
  color: white;
  background: rgb(5 14 29 / 92%);
  border-top: 1px solid rgb(255 255 255 / 15%);
  box-shadow: 0 -1rem 3rem rgb(2 8 20 / 26%);
  backdrop-filter: blur(1.25rem);
}

.section-timeline__desktop {
  display: none;
}

.section-timeline__mobile {
  display: flex;
  height: var(--page-timeline-height);
  overflow-x: auto;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}

.section-timeline__mobile::-webkit-scrollbar {
  display: none;
}

.section-timeline__mobile-item {
  position: relative;
  flex: 0 0 auto;
  min-width: max-content;
  padding: 0 1rem;
  border: 0;
  color: rgb(255 255 255 / 55%);
  background: transparent;
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: color var(--duration-base) var(--ease-standard);
}

.section-timeline__mobile-item::after {
  position: absolute;
  right: 1rem;
  bottom: 0;
  left: 1rem;
  height: 2px;
  content: "";
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-standard);
}

.section-timeline__mobile-item span {
  margin-right: 0.35rem;
  color: rgb(255 255 255 / 30%);
  font-family: var(--font-body);
  font-size: 0.625rem;
}

.section-timeline__mobile-item.is-active {
  color: white;
}

.section-timeline__mobile-item.is-active::after {
  transform: scaleX(1);
}

@media (min-width: 67.5rem) {
  .section-timeline__desktop {
    display: flex;
    height: var(--page-timeline-height);
  }

  .section-timeline__mobile {
    display: none;
  }

  .section-timeline__segment {
    display: grid;
    flex: 1 1 0;
    grid-template-rows: auto 1fr;
    min-width: 0;
    padding: 0.45rem 1rem 0.4rem;
    overflow: hidden;
    color: rgb(255 255 255 / 56%);
    background: rgb(10 27 52 / 42%);
    border: 0;
    border-right: 1px solid rgb(255 255 255 / 12%);
    cursor: pointer;
    transition:
      flex-grow var(--duration-slow) var(--ease-standard),
      color var(--duration-base) var(--ease-standard),
      background-color var(--duration-base) var(--ease-standard);
  }

  .section-timeline__segment:last-child {
    border-right: 0;
  }

  .section-timeline__segment:hover {
    color: white;
    background: rgb(19 52 96 / 52%);
  }

  .section-timeline__segment.is-active {
    flex-grow: 1.14;
    color: white;
    background: linear-gradient(110deg, rgb(0 79 196 / 52%), rgb(7 31 65 / 62%));
  }

  .section-timeline__heading {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.55rem;
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .section-timeline__number {
    color: rgb(255 255 255 / 30%);
    font-family: var(--font-body);
    font-size: 0.625rem;
  }

  .section-timeline__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-timeline__wave {
    display: flex;
    height: 1.25rem;
    align-items: end;
    gap: clamp(0.125rem, 0.45vw, 0.375rem);
    padding-top: 0.25rem;
  }

  .section-timeline__wave i {
    flex: 1 1 0;
    height: 20%;
    min-width: 1px;
    max-width: 1.15rem;
    background: currentColor;
    opacity: 0.28;
    transition:
      height var(--duration-slow) var(--ease-standard),
      opacity var(--duration-base) var(--ease-standard);
  }

  .section-timeline__segment.is-active .section-timeline__wave i {
    opacity: 0.8;
  }
}
</style>
