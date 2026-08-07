<script setup lang="ts">
import ScreenFlow from '~/widgets/screen-flow/ui/ScreenFlow.vue'
import ScreenSlide from '~/widgets/screen-flow/ui/ScreenSlide.vue'

useSeoMeta({
  title: 'Студия 313 — студия подкастов в Краснодаре',
  description: 'Профессиональная студия для записи подкастов, интервью и видеопроизводства в Краснодаре.',
  ogTitle: 'Студия 313',
  ogDescription: 'Подкасты, интервью и видеопроизводство под ключ в Краснодаре.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <ScreenFlow>
    <ScreenSlide>
      <section class="relative flex min-h-full items-end overflow-hidden bg-ink px-6 py-10 text-white sm:px-10 desktop:min-h-screen desktop:px-page desktop:py-14">
        <NuxtImg
          src="/media/photos/studio/tild3238-3930-4561-a439-356237643439__333.png"
          alt="Съёмочная зона Studio 313 с камерой, светом и микрофонами"
          class="absolute inset-0 size-full object-cover"
          sizes="100vw desktop:calc(100vw - 320px)"
          preload
        />
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,31,0.05)_10%,rgba(7,16,31,0.9)_92%)]" />
        <div class="relative z-10 max-w-4xl pb-8 desktop:pb-0">
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
              <Icon name="lucide:calendar-check" class="size-5" aria-hidden="true" />
              Записаться
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 font-display text-sm font-extrabold uppercase text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Услуги
              <Icon name="lucide:arrow-up-right" class="size-5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </ScreenSlide>

    <ScreenSlide>
      <section class="grid min-h-full bg-white desktop:min-h-screen desktop:grid-cols-[minmax(0,0.9fr)_minmax(25rem,1.1fr)]">
        <div class="flex flex-col justify-center px-6 py-12 sm:px-10 desktop:px-page desktop:py-16">
          <p class="text-sm font-bold uppercase text-accent">О студии</p>
          <h2 class="mt-4 max-w-2xl font-display text-4xl leading-tight font-extrabold uppercase text-ink sm:text-5xl desktop:text-6xl">
            Всё для сильного разговора
          </h2>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Несколько выразительных зон, профессиональный свет, камеры 4K и чистый звук. Команда помогает подготовиться и уверенно провести запись.
          </p>
          <NuxtLink
            to="/about"
            class="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-ink/15 px-6 font-display text-sm font-extrabold uppercase text-ink transition hover:border-accent hover:text-accent"
          >
            О студии
            <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <NuxtImg
          src="/media/photos/studio/tild3738-3939-4665-a136-636165303436__7-7.jpg"
          alt="Интерьер съёмочного пространства Studio 313"
          class="h-72 w-full object-cover sm:h-96 desktop:h-full desktop:min-h-screen"
          sizes="100vw desktop:55vw"
          loading="lazy"
        />
      </section>
    </ScreenSlide>

    <ScreenSlide>
      <section class="flex min-h-full flex-col justify-center bg-ink px-6 py-12 text-white sm:px-10 desktop:min-h-screen desktop:px-page desktop:py-16">
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
          <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
        </NuxtLink>
      </section>
    </ScreenSlide>
  </ScreenFlow>
</template>
