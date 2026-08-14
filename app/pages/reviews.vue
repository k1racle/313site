<script setup lang="ts">
import AppHeading from '~/shared/ui/AppHeading.vue'
import {
  createEmptyReviewsContent,
  type ReviewsContent,
} from '~~/shared/types/reviews'

const { data: reviews } = await useFetch<ReviewsContent>('/api/reviews', {
  default: createEmptyReviewsContent,
})

const REVIEWS_BATCH_SIZE = 6
const visibleCount = ref(REVIEWS_BATCH_SIZE)
const loadMoreSentinel = ref<HTMLElement | null>(null)
const loadedVideoIds = ref<Set<string>>(new Set())
const videosCanLoad = ref(false)
const visibleReviews = computed(() => reviews.value.items.slice(0, visibleCount.value))
const hasMoreReviews = computed(() => visibleCount.value < reviews.value.items.length)
let loadMoreObserver: IntersectionObserver | undefined

function loadMoreReviews() {
  visibleCount.value = Math.min(
    visibleCount.value + REVIEWS_BATCH_SIZE,
    reviews.value.items.length,
  )
}

function markVideoAsLoaded(reviewId: string) {
  if (loadedVideoIds.value.has(reviewId)) return
  loadedVideoIds.value = new Set(loadedVideoIds.value).add(reviewId)
}

onMounted(() => {
  videosCanLoad.value = true
  if (!loadMoreSentinel.value) return

  loadMoreObserver = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting && hasMoreReviews.value) loadMoreReviews()
  }, {
    rootMargin: '0px 0px 240px',
  })
  loadMoreObserver.observe(loadMoreSentinel.value)
})

onBeforeUnmount(() => loadMoreObserver?.disconnect())

useSeoMeta({
  title: 'Отзывы — Студия 313',
  description: 'Видеоотзывы клиентов о работе со Студией 313.',
  ogTitle: 'Отзывы — Студия 313',
  ogDescription: 'Видеоотзывы клиентов о работе со Студией 313.',
})
</script>

<template>
  <main class="reviews-page min-h-[calc(100dvh-var(--mobile-dock-height))] bg-page px-6 py-12 text-ink sm:px-10 sm:py-14 desktop:min-h-dvh desktop:px-page desktop:py-16">
    <header class="mx-auto max-w-[96rem] border-b border-ink/15 pb-8 sm:pb-10">
      <AppHeading as="h1" size="page" :accent="true">Отзывы</AppHeading>
      <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Люди, которые уже снимали подкасты, интервью и другие проекты в Studio 313.
      </p>
    </header>

    <section class="mx-auto mt-8 max-w-[96rem] sm:mt-10" aria-label="Видеоотзывы клиентов">
      <template v-if="reviews.items.length">
        <div class="grid gap-8 md:grid-cols-2 desktop:grid-cols-3 xl:gap-10 2xl:gap-12">
          <article
            v-for="review in visibleReviews"
            :key="review.id"
            class="relative min-w-0 overflow-hidden border border-ink/10 bg-panel shadow-[0_1.25rem_3.5rem_rgb(7_16_31/0.07)]"
            :aria-busy="!loadedVideoIds.has(review.id)"
          >
            <div class="aspect-video w-full overflow-hidden bg-ink">
              <iframe
                v-if="videosCanLoad"
                :src="review.videoUrl"
                :title="`Видеоотзыв — ${review.name}`"
                class="size-full border-0"
                loading="lazy"
                scrolling="no"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                @load="markVideoAsLoaded(review.id)"
              />
            </div>

            <div class="border-t border-ink/10 p-5 sm:p-6">
              <AppHeading as="h2" size="compact" :accent="false" class="text-xl text-ink">
                {{ review.name }}
              </AppHeading>
              <p v-if="review.subtitle" class="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                {{ review.subtitle }}
              </p>
            </div>

            <div
              v-if="!loadedVideoIds.has(review.id)"
              class="absolute inset-0 z-10 animate-pulse bg-panel"
              aria-hidden="true"
            >
              <div class="aspect-video w-full bg-[#e8f1ff] dark:bg-[#17304f]" />
              <div class="border-t border-ink/10 p-5 sm:p-6">
                <div class="h-6 w-3/5 bg-[#dbe9fb] dark:bg-[#1c3a5f]" />
                <div class="mt-3 h-4 w-4/5 bg-[#edf4fd] dark:bg-[#172d49]" />
                <div class="mt-2 h-4 w-2/5 bg-[#edf4fd] dark:bg-[#172d49]" />
              </div>
            </div>
          </article>
        </div>

        <div
          v-if="hasMoreReviews"
          ref="loadMoreSentinel"
          class="h-px w-full"
          aria-hidden="true"
        />
      </template>

      <div v-else class="grid min-h-64 place-items-center border border-ink/10 bg-panel px-6 text-center text-sm text-muted">
        Видеоотзывы скоро появятся.
      </div>
    </section>
  </main>
</template>
