<script setup lang="ts">
import { ArrowUpRight, ChevronRight } from 'lucide-vue-next'
import ShareBlogPost from '~/features/share-blog-post/ui/ShareBlogPost.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import type { BlogPublicList } from '~~/shared/types/blog'

const { data: blog } = await useFetch<BlogPublicList>('/api/blog', { default: () => ({ items: [] }) })

useSeoMeta({
  title: 'Блог — Студия 313',
  description: 'Материалы Studio 313 о записи подкастов, видеосъёмке, подготовке гостей и производстве контента.',
  ogTitle: 'Блог — Студия 313',
  ogDescription: 'Материалы Studio 313 о записи подкастов, видеосъёмке и производстве контента.',
  ogType: 'website',
})
useHead({ link: [{ rel: 'canonical', href: 'https://studio313.ru/blog' }] })

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value)) : ''
}
</script>

<template>
  <PageLongScreen as="main">
    <div class="min-h-[inherit] bg-page text-ink">
      <header class="border-b border-ink/10 bg-[#eaf4ff] px-6 dark:bg-[#10233d] sm:px-10 desktop:px-page">
        <div class="mx-auto max-w-[96rem] py-[clamp(3rem,8vw,7rem)]">
          <div class="flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] text-muted uppercase">
            <NuxtLink to="/" class="transition hover:text-accent">Studio 313</NuxtLink><ChevronRight class="size-3.5" /><span>Блог</span>
          </div>
          <div class="mt-[clamp(4rem,9vw,8rem)] grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)] lg:items-end">
            <AppHeading as="h1" size="hero" :accent="true">Блог</AppHeading>
            <p class="border-t border-ink/15 pt-5 text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-muted">Практические материалы о записи, съёмке и производстве контента — от подготовки идеи до готового выпуска.</p>
          </div>
        </div>
      </header>

      <section class="px-6 py-[clamp(3rem,7vw,6rem)] sm:px-10 desktop:px-page" aria-label="Статьи">
        <div v-if="blog.items.length" class="mx-auto max-w-[96rem] border-t border-ink/15">
          <article v-for="(post, index) in blog.items" :key="post.id" class="group relative grid border-b border-ink/15 md:grid-cols-[minmax(0,1fr)_minmax(18rem,42%)] md:items-stretch">
            <NuxtLink :to="`/blog/${post.slug}`" class="absolute inset-0 z-10" :aria-label="`Читать статью «${post.title}»`" />
            <div class="order-2 flex min-h-0 flex-col px-0 py-7 md:order-1 md:min-h-[25rem] md:py-[clamp(2rem,5vw,4rem)] md:pr-[clamp(2rem,6vw,6rem)]">
              <div class="flex items-center justify-between gap-4 text-xs font-bold tracking-[0.1em] text-muted uppercase"><time :datetime="post.publishedAt || undefined">{{ formatDate(post.publishedAt) }}</time><span>{{ String(index + 1).padStart(2, '0') }}</span></div>
              <AppHeading as="h2" size="section" :accent="true" class="mt-[clamp(2rem,5vw,4rem)] max-w-4xl transition group-hover:text-accent">{{ post.title }}</AppHeading>
              <p class="mt-5 line-clamp-2 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{{ post.excerpt }}</p>
              <div class="relative z-20 mt-7 flex items-end justify-between gap-5 md:mt-auto md:pt-8">
                <ShareBlogPost :title="post.title" :text="post.excerpt" :url="`/blog/${post.slug}`" />
                <span class="grid size-11 place-items-center border border-ink/15 transition group-hover:border-accent group-hover:bg-accent group-hover:text-white"><ArrowUpRight class="size-5" /></span>
              </div>
            </div>
            <div class="order-1 overflow-hidden bg-[#eaf4ff] dark:bg-[#10233d] md:order-2 md:my-[clamp(2rem,4vw,3rem)]">
              <img :src="post.cover.src" :alt="post.cover.alt" class="aspect-[4/3] size-full object-cover transition duration-500 group-hover:scale-[1.025] md:aspect-auto" loading="lazy">
            </div>
          </article>
        </div>
        <div v-else class="mx-auto grid min-h-72 max-w-[96rem] place-items-center border-y border-ink/15 text-center text-muted">Первые материалы скоро появятся.</div>
      </section>
    </div>
  </PageLongScreen>
</template>
