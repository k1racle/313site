<script setup lang="ts">
import { ArrowLeft, ChevronRight } from 'lucide-vue-next'
import BlogRichText from '~/entities/blog/ui/BlogRichText'
import ShareBlogPost from '~/features/share-blog-post/ui/ShareBlogPost.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import BlogArticleContact from '~/widgets/blog-article/ui/BlogArticleContact.vue'
import type { BlogPost } from '~~/shared/types/blog'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const { data: post, error } = await useFetch<BlogPost>(() => `/api/blog/${slug.value}`, { key: `blog-${slug.value}` })
if (error.value || !post.value) throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })

const canonicalUrl = computed(() => `https://studio313.ru/blog/${post.value!.slug}`)
const imageUrl = computed(() => new URL(post.value!.cover.src, 'https://studio313.ru').toString())

useSeoMeta({
  title: () => post.value!.seoTitle || `${post.value!.title} — Студия 313`,
  description: () => post.value!.seoDescription || post.value!.excerpt,
  ogTitle: () => post.value!.seoTitle || post.value!.title,
  ogDescription: () => post.value!.seoDescription || post.value!.excerpt,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: imageUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value!.seoTitle || post.value!.title,
  twitterDescription: () => post.value!.seoDescription || post.value!.excerpt,
  twitterImage: imageUrl,
  articlePublishedTime: () => post.value!.publishedAt || undefined,
  articleModifiedTime: () => post.value!.updatedAt,
})
useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.value!.title,
      description: post.value!.seoDescription || post.value!.excerpt,
      image: imageUrl.value,
      datePublished: post.value!.publishedAt,
      dateModified: post.value!.updatedAt,
      mainEntityOfPage: canonicalUrl.value,
      author: { '@type': 'Organization', name: 'Студия 313', url: 'https://studio313.ru' },
      publisher: { '@type': 'Organization', name: 'Студия 313', logo: { '@type': 'ImageObject', url: 'https://studio313.ru/brand/logo-black.svg' } },
    }),
  }],
})

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : ''
}
</script>

<template>
  <PageLongScreen as="main">
    <article class="min-h-[inherit] bg-page text-ink">
      <header class="px-6 pb-[clamp(3rem,7vw,6rem)] pt-[clamp(2rem,5vw,4rem)] sm:px-10 desktop:px-page">
        <div class="mx-auto max-w-[78rem]">
          <nav class="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.1em] text-muted uppercase" aria-label="Хлебные крошки"><NuxtLink to="/" class="hover:text-accent">Studio 313</NuxtLink><ChevronRight class="size-3.5" /><NuxtLink to="/blog" class="hover:text-accent">Блог</NuxtLink><ChevronRight class="size-3.5" /><span class="max-w-56 truncate">{{ post!.title }}</span></nav>
          <time :datetime="post!.publishedAt || undefined" class="mt-[clamp(4rem,8vw,7rem)] block text-xs font-extrabold tracking-[0.16em] text-accent uppercase">{{ formatDate(post!.publishedAt) }}</time>
          <AppHeading as="h1" size="page" :accent="true" class="mt-5 max-w-6xl">{{ post!.title }}</AppHeading>
          <p class="mt-7 max-w-3xl text-[clamp(1.1rem,2vw,1.4rem)] leading-relaxed text-muted">{{ post!.excerpt }}</p>
          <ShareBlogPost class="mt-8" :title="post!.title" :text="post!.excerpt" :url="canonicalUrl" />
        </div>
      </header>

      <figure class="mx-auto max-w-[96rem] px-0 sm:px-10 desktop:px-page">
        <img :src="post!.cover.src" :alt="post!.cover.alt" class="aspect-[16/9] w-full bg-[#eaf4ff] object-cover dark:bg-[#10233d]" fetchpriority="high">
      </figure>

      <div class="mx-auto grid max-w-[78rem] gap-[clamp(3rem,7vw,6rem)] px-6 py-[clamp(4rem,9vw,8rem)] sm:px-10">
        <template v-for="section in post!.sections" :key="section.id">
          <div
            v-if="section.type === 'text'"
            class="mx-auto w-full max-w-[48rem] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.8] text-copy [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-6 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[clamp(1.75rem,3vw,2.75rem)] [&_h2]:leading-tight [&_h2]:font-extrabold [&_h2]:text-ink [&_h2]:uppercase [&_h2:first-child]:mt-0 [&_h3]:mb-4 [&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-[clamp(1.4rem,3vw,2.2rem)] [&_h3]:leading-tight [&_h3]:font-extrabold [&_h3]:text-ink [&_h3]:uppercase [&_li]:my-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-6 [&_strong]:font-bold [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7"
          >
            <BlogRichText :node="section.content" />
          </div>
          <figure v-else class="w-full">
            <img :src="section.image.src" :alt="section.image.alt" class="max-h-[50rem] w-full bg-[#eaf4ff] object-cover dark:bg-[#10233d]" loading="lazy">
            <figcaption v-if="section.caption" class="mt-3 text-sm leading-relaxed text-muted">{{ section.caption }}</figcaption>
          </figure>
        </template>
        <div class="mx-auto flex w-full max-w-[48rem] flex-wrap items-center justify-between gap-5 border-t border-ink/15 pt-7">
          <NuxtLink to="/blog" class="flex min-h-11 cursor-pointer items-center gap-3 border border-ink/20 bg-panel px-4 font-display text-xs font-extrabold text-ink uppercase transition hover:border-accent hover:bg-accent hover:text-white"><ArrowLeft class="size-4" />Вернуться в блог</NuxtLink>
          <ShareBlogPost :title="post!.title" :text="post!.excerpt" :url="canonicalUrl" />
        </div>
      </div>
    </article>
    <BlogArticleContact />
  </PageLongScreen>
</template>
