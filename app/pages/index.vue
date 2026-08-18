<script setup lang="ts">
import { ArrowRight, ArrowUpRight, CalendarCheck } from 'lucide-vue-next'
import { useBookingModal } from '~/features/booking/model/useBookingModal'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'
import { createEmptyHomeContent, type HomeContent } from '~~/shared/types/home'

const { data: home } = await useFetch<HomeContent>('/api/home', {
  key: 'home-content',
  default: createEmptyHomeContent,
})
const showMarquee = computed(() => home.value.marquee.enabled && home.value.marquee.text.trim().length > 0)

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
const { openBookingModal } = useBookingModal()

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
      :show-frame="false"
      @active-change="activeSectionIndex = $event"
    >
    <section id="intro" data-page-section class="flex min-h-full flex-col overflow-hidden bg-page text-ink">
        <div class="mx-auto grid min-h-0 w-full max-w-[96rem] flex-1 grid-rows-[auto_minmax(12rem,1fr)] desktop:grid-cols-[minmax(0,.9fr)_minmax(25rem,1.1fr)] desktop:grid-rows-1">
          <div class="flex min-w-0 flex-col items-start justify-center px-6 py-8 text-left sm:px-10 desktop:px-page desktop:py-12">
            <h1 class="sr-only">Studio 313</h1>
            <img src="/brand/logo-black.svg" alt="Studio 313" class="h-auto w-[min(68vw,25rem)] dark:hidden desktop:w-[min(30vw,26rem)]">
            <img src="/brand/logo-white.svg" alt="" class="hidden h-auto w-[min(68vw,25rem)] dark:block desktop:w-[min(30vw,26rem)]" aria-hidden="true">
            <p class="mt-[clamp(1.5rem,4vh,3rem)] max-w-xl text-base leading-relaxed text-muted sm:text-lg desktop:text-xl">
              {{ home.introText }}
            </p>
            <div class="mt-7 flex flex-wrap gap-3">
              <AppButton
                @click="openBookingModal()"
              >
                <CalendarCheck class="size-5" aria-hidden="true" />
                Записаться
              </AppButton>
              <AppButton
                behaviour="link"
                variant="secondary"
                to="/services"
              >
                Услуги
                <ArrowUpRight class="size-5" aria-hidden="true" />
              </AppButton>
            </div>
          </div>

          <div class="flex min-h-0 items-center justify-center px-6 py-8 sm:px-10 desktop:px-page desktop:py-12">
            <img
              src="/media/uploads/1782386093597-a5806b7b9cbd7.jpg"
              alt="Съёмочная зона Studio 313 с камерой, светом и микрофонами"
              class="aspect-[44/29] w-full max-w-[55rem] border-[clamp(.25rem,.7vw,.625rem)] border-accent object-cover"
              fetchpriority="high"
            >
          </div>
        </div>

        <div v-if="showMarquee" class="hidden h-[3.75rem] shrink-0 overflow-hidden border-y border-accent-700 bg-accent text-white desktop:mb-[3.75rem] desktop:block" aria-label="Информация студии">
          <p class="sr-only">{{ home.marquee.text }}</p>
          <div class="flex h-full w-max animate-[home-marquee_24s_linear_infinite] items-center motion-reduce:animate-none" aria-hidden="true">
            <div v-for="group in 2" :key="group" class="flex shrink-0 items-center">
              <span v-for="repeat in 4" :key="repeat" class="flex shrink-0 items-center gap-8 pr-8 font-display text-sm font-extrabold tracking-[0.12em] whitespace-nowrap uppercase sm:text-base">
                {{ home.marquee.text }}
                <i class="block size-2 rotate-45 bg-white" />
              </span>
            </div>
          </div>
        </div>
    </section>

    <section id="studio" data-page-section class="relative isolate flex min-h-full overflow-hidden bg-panel text-ink">
        <NuxtImg
          src="/media/photos/studio/tild3738-3939-4665-a136-636165303436__7-7.jpg"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 -z-20 size-full object-cover"
          sizes="100vw"
          loading="lazy"
        />
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,.97)_0%,rgba(245,250,255,.9)_58%,rgba(234,244,255,.78)_100%)] dark:bg-[linear-gradient(90deg,rgba(11,22,39,.97)_0%,rgba(11,22,39,.92)_58%,rgba(19,35,58,.82)_100%)]" />

        <div class="mx-auto grid min-h-full w-full max-w-[96rem] desktop:grid-cols-[minmax(0,0.9fr)_minmax(25rem,1.1fr)]">
          <div class="flex flex-col justify-center px-6 py-12 sm:px-10 desktop:px-page desktop:py-16">
            <AppHeading as="h2" size="section" :accent="true" class="max-w-2xl">
              Всё для сильного разговора
            </AppHeading>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Несколько выразительных зон, профессиональный свет, камеры 4K и чистый звук. Команда помогает подготовиться и уверенно провести запись.
            </p>
            <AppButton
              behaviour="link"
              variant="ghost"
              to="/about"
              class="mt-8 w-fit"
            >
              О студии
              <ArrowRight class="size-5" aria-hidden="true" />
            </AppButton>
          </div>
          <figure class="flex min-h-72 items-center justify-center px-6 py-8 sm:px-10 desktop:min-h-0 desktop:px-page desktop:py-16">
            <NuxtImg
              src="/media/photos/studio/tild3738-3939-4665-a136-636165303436__7-7.jpg"
              alt="Интерьер съёмочного пространства Studio 313"
              class="aspect-[44/29] w-full max-w-[55rem] border-[clamp(.25rem,.7vw,.625rem)] border-accent object-cover shadow-panel"
              sizes="100vw xl:48vw"
              loading="lazy"
            />
          </figure>
        </div>
    </section>

    <section id="production" data-page-section class="flex min-h-full flex-col justify-center bg-[#eaf4ff] px-6 py-12 text-ink dark:bg-[#10233d] sm:px-10 desktop:px-page desktop:py-16">
      <div class="mx-auto w-full max-w-[96rem]">
        <AppHeading as="h2" size="section" :accent="true" class="max-w-4xl">
          Производство под ключ
        </AppHeading>
        <div class="mt-8 max-w-5xl border-t border-ink/15">
          <div class="grid gap-2 border-b border-ink/15 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm font-bold text-accent">01</span>
            <AppHeading as="h3" size="card" :accent="false">Подкасты и интервью</AppHeading>
            <span class="text-sm text-muted">до 4 камер</span>
          </div>
          <div class="grid gap-2 border-b border-ink/15 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm font-bold text-accent">02</span>
            <AppHeading as="h3" size="card" :accent="false">Reels и экспертные видео</AppHeading>
            <span class="text-sm text-muted">вертикальный формат</span>
          </div>
          <div class="grid gap-2 border-b border-ink/15 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
            <span class="text-sm font-bold text-accent">03</span>
            <AppHeading as="h3" size="card" :accent="false">Монтаж и упаковка</AppHeading>
            <span class="text-sm text-muted">готово к публикации</span>
          </div>
        </div>
        <div class="mt-8 flex flex-wrap gap-3">
          <AppButton
            behaviour="link"
            to="/services"
          >
            Все услуги
            <ArrowRight class="size-5" aria-hidden="true" />
          </AppButton>
          <AppButton
            behaviour="link"
            variant="secondary"
            to="/services#service-pricing"
          >
            Прайс-лист
            <ArrowUpRight class="size-5" aria-hidden="true" />
          </AppButton>
        </div>
      </div>
    </section>
    </PageFullscreen>

    <SectionTimeline
      :sections="homeSections"
      :active-index="activeSectionIndex"
      @select="scrollToSection"
    />
  </div>
</template>
