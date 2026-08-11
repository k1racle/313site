<script setup lang="ts">
import { caseCategories } from '~/entities/case-study/config/case-categories'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import CasesCatalog from '~/widgets/cases-catalog/ui/CasesCatalog.vue'

useSeoMeta({
  title: 'Кейсы — Studio 313',
  description: 'Видео, фотогалерея и подкасты, созданные в Studio 313.',
  ogTitle: 'Кейсы Studio 313',
  ogDescription: 'Избранные видео, фотографии и подкаст-записи Studio 313.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <PageFullscreen label="Категории кейсов" :show-frame="false">
    <section
      id="cases"
      data-page-section
      class="relative flex min-h-full flex-col overflow-hidden bg-ink px-4 py-5 text-white sm:px-7 sm:py-7 desktop:px-page desktop:py-[clamp(2rem,4vh,3.5rem)]"
    >
      <div class="pointer-events-none absolute top-0 right-0 h-px w-1/3 bg-accent" />

      <header class="mb-5 grid shrink-0 gap-3 sm:mb-7 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,23rem)] sm:items-end desktop:mb-[clamp(1.5rem,3vh,2.75rem)]">
        <div>
          <p class="text-[0.625rem] font-bold tracking-[0.18em] text-accent uppercase sm:text-xs">
            Selected work / 03 направления
          </p>
          <h1 class="mt-2 font-display text-4xl leading-[0.88] font-extrabold uppercase sm:text-6xl desktop:text-[clamp(4.5rem,8vw,8.5rem)]">
            Кейсы
          </h1>
        </div>
        <p class="hidden border-t border-white/20 pt-3 text-sm leading-relaxed text-white/55 sm:block desktop:text-base">
          Выберите формат — внутри собраны отдельные проекты, кадры и выпуски Studio 313.
        </p>
      </header>

      <CasesCatalog :categories="caseCategories" class="flex-1" />

      <div class="mt-4 flex shrink-0 items-center justify-between text-[0.625rem] font-bold tracking-[0.14em] text-white/35 uppercase sm:mt-5">
        <span>Краснодар / Studio 313</span>
        <span class="flex items-center gap-2"><i class="size-1.5 rounded-full bg-accent" /> Выберите раздел</span>
      </div>
    </section>
  </PageFullscreen>
</template>
