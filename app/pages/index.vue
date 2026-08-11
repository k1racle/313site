<script setup lang="ts">
import { ArrowRight, ArrowUpRight, CalendarCheck } from 'lucide-vue-next'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'

const homeSections = [
  {
    id: 'intro',
    label: 'Главная',
    waveform: [34, 58, 44, 76, 52, 88, 64, 40, 72, 48, 82, 36],
  },
  {
    id: 'studio',
    label: 'О студии',
    waveform: [62, 38, 78, 48, 86, 56, 32, 70, 44, 80, 58, 40],
  },
  {
    id: 'production',
    label: 'Продакшн',
    waveform: [38, 74, 54, 30, 68, 90, 48, 78, 42, 62, 84, 50],
  },
] as const

const activeSectionIndex = ref(0)

function scrollToSection(index: number) {
  const section = homeSections[index]
  const target = section ? document.getElementById(section.id) : null
  if (!target) return

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

useSeoMeta({
  title: 'Студия 313 — студия подкастов в Краснодаре',
  description: 'Профессиональная студия для записи подкастов, интервью и видеопроизводства в Краснодаре.',
  ogTitle: 'Студия 313',
  ogDescription: 'Подкасты, интервью и видеопроизводство под ключ в Краснодаре.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <div class="relative [--page-bottom-inset:3.75rem]">
    <PageFullscreen
      label="Экраны главной страницы"
      @active-change="activeSectionIndex = $event"
    >
    <section id="intro" data-page-section class="relative flex min-h-full items-end overflow-hidden bg-ink px-6 pt-10 text-white sm:px-10 desktop:px-page desktop:pt-14">
        <NuxtImg
          src="/media/uploads/1782386093597-a5806b7b9cbd7.jpg"
          alt="Съёмочная зона Studio 313 с камерой, светом и микрофонами"
          class="absolute inset-0 size-full object-cover"
          sizes="100vw xl:80vw"
          preload
        />
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,31,0.05)_10%,rgba(7,16,31,0.9)_92%)]" />
        <PageFullscreenContent class="relative z-10 max-w-4xl">
          <p class="mb-4 text-sm font-bold uppercase text-white/70">Подкасты · интервью · видео</p>
          <h1 class="font-display text-5xl leading-[0.94] font-extrabold uppercase text-white sm:text-6xl desktop:text-8xl">
            Студия 313
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 desktop:text-xl">
            Пространство и команда для записи сильного контента: от идеи и света до чистового монтажа.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink
              to="/booking"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 font-display text-sm font-extrabold uppercase text-white shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-600"
            >
              <CalendarCheck class="size-5" aria-hidden="true" />
              Записаться
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 font-display text-sm font-extrabold uppercase text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Услуги
              <ArrowUpRight class="size-5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </PageFullscreenContent>
    </section>

    <section id="studio" data-page-section class="grid min-h-full bg-[#0b1a2f] text-white desktop:grid-cols-[minmax(0,0.9fr)_minmax(25rem,1.1fr)]">
        <div class="flex flex-col justify-center px-6 py-12 sm:px-10 desktop:px-page desktop:py-16">
          <p class="text-sm font-bold uppercase text-accent">О студии</p>
          <h2 class="mt-4 max-w-2xl font-display text-4xl leading-tight font-extrabold uppercase text-white sm:text-5xl desktop:text-6xl">
            Всё для сильного разговора
          </h2>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            Несколько выразительных зон, профессиональный свет, камеры 4K и чистый звук. Команда помогает подготовиться и уверенно провести запись.
          </p>
          <NuxtLink
            to="/about"
            class="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-white/20 px-6 font-display text-sm font-extrabold uppercase text-white transition hover:border-accent hover:text-accent"
          >
            О студии
            <ArrowRight class="size-5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <NuxtImg
          src="/media/photos/studio/tild3738-3939-4665-a136-636165303436__7-7.jpg"
          alt="Интерьер съёмочного пространства Studio 313"
          class="h-72 w-full object-cover sm:h-96 desktop:h-full desktop:min-h-full"
          sizes="100vw xl:55vw"
          loading="lazy"
        />
    </section>

    <section id="production" data-page-section class="flex min-h-full flex-col justify-center bg-[#07101f] px-6 py-12 text-white sm:px-10 desktop:px-page desktop:py-16">
        <p class="text-sm font-bold uppercase text-accent">Услуги</p>
        <h2 class="mt-4 max-w-4xl font-display text-4xl leading-tight font-extrabold uppercase sm:text-5xl desktop:text-6xl">
          Производство под ключ
        </h2>
        <div class="mt-8 max-w-5xl border-t border-white/20">
          <div class="grid gap-2 border-b border-white/20 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm text-white/45">01</span>
            <h3 class="font-display text-2xl font-extrabold uppercase">Подкасты и интервью</h3>
            <span class="text-sm text-white/60">до 4 камер</span>
          </div>
          <div class="grid gap-2 border-b border-white/20 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm text-white/45">02</span>
            <h3 class="font-display text-2xl font-extrabold uppercase">Reels и экспертные видео</h3>
            <span class="text-sm text-white/60">вертикальный формат</span>
          </div>
          <div class="grid gap-2 border-b border-white/20 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm text-white/45">03</span>
            <h3 class="font-display text-2xl font-extrabold uppercase">Монтаж и упаковка</h3>
            <span class="text-sm text-white/60">готово к публикации</span>
          </div>
        </div>
        <NuxtLink
          to="/services"
          class="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 font-display text-sm font-extrabold uppercase text-ink transition hover:-translate-y-0.5 hover:text-accent"
        >
          Все услуги
          <ArrowRight class="size-5" aria-hidden="true" />
        </NuxtLink>
    </section>
    </PageFullscreen>

    <SectionTimeline
      :sections="homeSections"
      :active-index="activeSectionIndex"
      @select="scrollToSection"
    />
  </div>
</template>
