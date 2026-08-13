<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { findCaseCategory } from '~/entities/case-study/config/case-categories'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
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
    <header class="relative overflow-hidden bg-[#eaf4ff] px-5 pt-6 pb-9 text-ink sm:px-8 sm:pt-8 sm:pb-12 desktop:px-page desktop:pt-10 desktop:pb-16">
      <div class="absolute top-0 right-0 h-px w-1/3 bg-accent" />

      <AppButton
        behaviour="link"
        variant="ghost"
        to="/cases"
        class="group min-h-11 px-4 text-xs"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        Назад к кейсам
      </AppButton>

      <div class="mt-10 grid gap-7 sm:mt-14 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,24rem)] sm:items-end desktop:mt-20">
        <div>
          <AppHeading as="h1" size="hero" :accent="true">
            {{ category.title }}
          </AppHeading>
        </div>
        <div class="border-t border-ink/15 pt-4">
          <p class="text-base leading-relaxed text-muted">
            {{ category.description }}
          </p>
          <p class="mt-5 text-[0.625rem] font-bold tracking-[0.16em] text-muted uppercase">
            {{ String(category.projects.length).padStart(2, '0') }} selected projects
          </p>
        </div>
      </div>
    </header>

    <CaseProjectList :category="category" />

    <footer class="flex flex-col gap-5 border-t border-ink/15 bg-page px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 desktop:px-page desktop:py-12">
      <div>
        <p class="max-w-xl font-display text-2xl font-extrabold uppercase text-ink sm:text-3xl">
          Посмотреть другие форматы
        </p>
      </div>
      <AppButton
        behaviour="link"
        to="/cases"
        class="w-fit text-xs"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        Все кейсы
      </AppButton>
    </footer>
  </PageLongScreen>
</template>
