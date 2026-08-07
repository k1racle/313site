<script setup lang="ts">
import { findPublicPage } from '~/shared/config/navigation'

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
  <section v-if="page" class="relative flex min-h-[calc(100dvh-var(--mobile-dock-height))] items-end overflow-hidden bg-ink px-6 py-12 text-white sm:px-10 desktop:min-h-screen desktop:px-page desktop:py-16">
    <NuxtImg
      src="/media/photos/studio/tild3238-6165-4633-a230-336330613834__21.jpg"
      :alt="`${page.label} — Studio 313`"
      class="absolute inset-0 size-full object-cover"
      sizes="100vw desktop:calc(100vw - 320px)"
      preload
    />
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,31,0.18),rgba(7,16,31,0.94))]" />
    <div class="relative z-10 max-w-4xl pb-8 desktop:pb-0">
      <div class="mb-5 flex items-center gap-3 text-sm font-bold uppercase text-white/60">
        <NuxtLink to="/" class="transition hover:text-white">Studio 313</NuxtLink>
        <Icon name="lucide:chevron-right" class="size-4" aria-hidden="true" />
        <span>{{ page.shortLabel }}</span>
      </div>
      <h1 class="font-display text-5xl leading-none font-extrabold uppercase text-white sm:text-6xl desktop:text-8xl">
        {{ page.label }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 desktop:text-xl">
        {{ page.description }}
      </p>
      <NuxtLink
        to="/"
        class="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-display text-sm font-extrabold uppercase text-ink transition hover:-translate-y-0.5 hover:text-accent"
      >
        <Icon name="lucide:arrow-left" class="size-5" aria-hidden="true" />
        На главную
      </NuxtLink>
    </div>
  </section>
</template>
