<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { findCaseCategory } from '~/entities/case-study/config/case-categories'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import CaseProjectList from '~/widgets/case-project-list/ui/CaseProjectList.vue'

const route = useRoute()
const categoryId = computed(() => Array.isArray(route.params.category) ? route.params.category[0] : route.params.category)
const category = computed(() => findCaseCategory(categoryId.value))

if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Раздел кейсов не найден',
  })
}

useSeoMeta({
  title: () => `${category.value?.title} — Кейсы Studio 313`,
  description: () => category.value?.description,
  ogTitle: () => `${category.value?.title} — Studio 313`,
  ogDescription: () => category.value?.description,
  ogImage: () => `https://studio313.ru${category.value?.image}`,
})
</script>

<template>
  <PageLongScreen v-if="category" as="main" class="case-category-page bg-page text-copy">
    <header class="relative overflow-hidden bg-ink px-5 pt-6 pb-9 text-white sm:px-8 sm:pt-8 sm:pb-12 desktop:px-page desktop:pt-10 desktop:pb-16">
      <div class="absolute top-0 right-0 h-px w-1/3 bg-accent" />

      <NuxtLink
        to="/cases"
        class="group inline-flex min-h-11 items-center gap-3 text-xs font-bold tracking-[0.12em] text-white/60 uppercase transition hover:text-white"
      >
        <span class="grid size-9 place-items-center rounded-full border border-white/25 transition group-hover:border-accent group-hover:bg-accent">
          <ArrowLeft class="size-4" aria-hidden="true" />
        </span>
        Назад к кейсам
      </NuxtLink>

      <div class="mt-10 grid gap-7 sm:mt-14 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,24rem)] sm:items-end desktop:mt-20">
        <div>
          <p class="text-[0.625rem] font-bold tracking-[0.18em] text-accent uppercase sm:text-xs">
            Cases / {{ category.eyebrow }}
          </p>
          <h1 class="mt-3 font-display text-5xl leading-[0.88] font-extrabold uppercase sm:text-7xl desktop:text-[clamp(5.5rem,10vw,10rem)]">
            {{ category.title }}
          </h1>
        </div>
        <div class="border-t border-white/20 pt-4">
          <p class="text-base leading-relaxed text-white/60">
            {{ category.description }}
          </p>
          <p class="mt-5 text-[0.625rem] font-bold tracking-[0.16em] text-white/35 uppercase">
            {{ String(category.projects.length).padStart(2, '0') }} selected projects
          </p>
        </div>
      </div>
    </header>

    <CaseProjectList :category="category" />

    <footer class="flex flex-col gap-5 border-t border-ink/15 bg-page px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 desktop:px-page desktop:py-12">
      <div>
        <p class="text-[0.625rem] font-bold tracking-[0.16em] text-accent uppercase">Следующий шаг</p>
        <p class="mt-2 max-w-xl font-display text-2xl font-extrabold uppercase text-ink sm:text-3xl">
          Посмотреть другие форматы
        </p>
      </div>
      <NuxtLink
        to="/cases"
        class="inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-ink px-6 font-display text-xs font-extrabold uppercase text-white transition hover:-translate-y-0.5 hover:bg-accent"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        Все кейсы
      </NuxtLink>
    </footer>
  </PageLongScreen>
</template>
