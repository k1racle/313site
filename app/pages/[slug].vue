<script setup lang="ts">
import { ArrowLeft, ChevronRight } from 'lucide-vue-next'
import { findPublicPage } from '~/config/navigation'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'

const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug)
const page = computed(() => findPublicPage(slug.value || ''))

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useSeoMeta({
  title: () => `${page.value?.label} — Студия 313`,
  description: () => page.value?.description,
  ogTitle: () => `${page.value?.label} — Студия 313`,
  ogDescription: () => page.value?.description,
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <PageFullscreen v-if="page" :label="page.label">
  <section :id="slug" data-page-section class="relative flex min-h-full items-end overflow-hidden bg-page px-6 pt-12 text-ink sm:px-10 desktop:px-page desktop:pt-16">
    <NuxtImg
      src="/media/photos/studio/tild3238-6165-4633-a230-336330613834__21.jpg"
      :alt="`${page.label} — Studio 313`"
      class="absolute inset-0 size-full object-cover"
      sizes="100vw xl:80vw"
      preload
    />
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(245,250,255,0.96))]" />
    <PageFullscreenContent class="relative z-10 max-w-4xl">
      <div class="mb-5 flex items-center gap-3 text-sm font-bold uppercase text-muted">
        <NuxtLink to="/" class="transition hover:text-accent">Studio 313</NuxtLink>
        <ChevronRight class="size-4" aria-hidden="true" />
        <span>{{ page.shortLabel }}</span>
      </div>
      <AppHeading as="h1" size="hero" :accent="true">
        {{ page.label }}
      </AppHeading>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-muted desktop:text-xl">
        {{ page.description }}
      </p>
      <AppButton
        behaviour="link"
        to="/"
        class="mt-8"
      >
        <ArrowLeft class="size-5" aria-hidden="true" />
        На главную
      </AppButton>
    </PageFullscreenContent>
  </section>
  </PageFullscreen>
</template>
