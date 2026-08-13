<script setup lang="ts">
import AppHeading from '~/shared/ui/AppHeading.vue'
import { getDisplayNameSize } from '~/shared/lib/display-name'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'
import SiteCallToAction from '~/shared/ui/SiteCallToAction.vue'
import { createEmptyAboutContent, type AboutContent } from '~~/shared/types/about'

const { data: about } = await useFetch<AboutContent>('/api/about', {
  key: 'about-content',
  default: createEmptyAboutContent,
})
const activeSectionIndex = ref(0)
const timelineSections = computed(() => [
  ...about.value.sections.map((section, index) => ({
    id: section.id,
    label: section.title,
    waveform: index % 2
      ? [62, 38, 78, 48, 86, 56, 32, 70, 44, 80, 58, 40]
      : [34, 58, 44, 76, 52, 88, 64, 40, 72, 48, 82, 36],
  })),
  {
    id: 'about-booking',
    label: 'Записаться',
    waveform: [44, 72, 36, 82, 58, 90, 64, 42, 76, 52, 86, 48],
  },
])
const seoDescription = computed(() => about.value.sections.map(section => section.text).join(' ').replace(/\s+/g, ' ').trim().slice(0, 160))

function titleSizeClass(title: string) {
  return {
    xl: 'text-[clamp(2.75rem,7vw,6.5rem)]',
    lg: 'text-[clamp(2.55rem,6vw,5.5rem)]',
    md: 'text-[clamp(2.3rem,5vw,4.75rem)]',
    sm: 'text-[clamp(2.05rem,4.2vw,4rem)]',
  }[getDisplayNameSize(title)]
}

function scrollToSection(index: number) {
  const section = timelineSections.value[index]
  const target = section ? document.getElementById(section.id) : null
  if (!target) return
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

useSeoMeta({
  title: 'О студии — Studio 313',
  description: seoDescription,
  ogTitle: 'О студии — Studio 313',
  ogDescription: seoDescription,
  ogImage: () => about.value.sections[0]?.image.src || 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <div class="relative bg-page [--page-bottom-inset:3.75rem]">
    <PageFullscreen label="О студии" @active-change="activeSectionIndex = $event">
      <section
        v-for="(section, index) in about.sections"
        :id="section.id"
        :key="section.id"
        data-page-section
        class="grid min-h-full text-ink desktop:grid-cols-[minmax(0,0.9fr)_minmax(25rem,1.1fr)]"
        :class="index % 2 ? 'bg-[#eaf4ff]' : 'bg-white'"
      >
        <div class="flex min-h-0 flex-col justify-center px-6 pt-10 sm:px-10 desktop:px-page desktop:pt-14">
          <PageFullscreenContent class="flex flex-col justify-center">
            <AppHeading
              :as="index === 0 ? 'h1' : 'h2'"
              size="inherit"
              :accent="true"
              class="max-w-[15ch] leading-[0.9] tracking-[-0.04em] whitespace-pre-line [word-spacing:0.12em]"
              :class="titleSizeClass(section.title)"
            >
              {{ section.title }}
            </AppHeading>
            <p class="mt-7 max-w-xl border-t border-ink/15 pt-6 text-[clamp(1rem,1.55vw,1.2rem)] leading-[1.7] text-muted">
              {{ section.text }}
            </p>
          </PageFullscreenContent>
        </div>

        <figure class="flex min-h-64 items-center justify-center px-6 py-8 sm:px-10 desktop:min-h-0 desktop:px-page desktop:pt-14 desktop:pb-[calc(var(--page-content-safe-bottom)+1rem)]">
          <img
            :src="section.image.src"
            :alt="section.image.alt"
            class="aspect-[44/29] w-full max-w-[55rem] object-contain"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
          >
        </figure>
      </section>

      <SiteCallToAction
        id="about-booking"
        data-page-section
        :title="'Готовы записать\nсвой проект?'"
        description="Расскажите о задаче — мы поможем выбрать формат и подготовиться к записи."
        button-label="Записаться"
        to="/booking"
        class="min-h-full pb-[calc(var(--page-content-safe-bottom)+clamp(4rem,9vw,8rem))]"
      />
    </PageFullscreen>

    <SectionTimeline
      :sections="timelineSections"
      :active-index="activeSectionIndex"
      @select="scrollToSection"
    />
  </div>
</template>
