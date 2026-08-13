<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  MessageSquareQuote,
  Plus,
  Trash2,
} from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import {
  createEmptyReviewsContent,
  type Review,
  type ReviewsContent,
} from '~~/shared/types/reviews'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Отзывы — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<ReviewsContent>('/api/reviews', {
  default: createEmptyReviewsContent,
})

const draft = reactive<ReviewsContent>({
  items: data.value.items.map(item => ({ ...item })),
})
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

function createReview(): Review {
  return {
    id: globalThis.crypto?.randomUUID?.() || `review-${Date.now()}`,
    videoUrl: '',
    name: '',
    subtitle: '',
  }
}

function addReview() {
  draft.items.push(createReview())
  saved.value = false
}

function removeReview(index: number) {
  draft.items.splice(index, 1)
  saved.value = false
}

function moveReview(index: number, direction: -1 | 1) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= draft.items.length) return
  const [review] = draft.items.splice(index, 1)
  if (review) draft.items.splice(targetIndex, 0, review)
  saved.value = false
}

function applyContent(content: ReviewsContent) {
  draft.items.splice(0, draft.items.length, ...content.items.map(item => ({ ...item })))
}

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''

  try {
    const content = await $fetch<ReviewsContent>('/api/admin/reviews', {
      method: 'PUT',
      body: draft,
    })
    applyContent(content)
    await refreshNuxtData('/api/reviews')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить отзывы. Проверьте имена и ссылки VK Video.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Страница сайта"
      title="Отзывы"
      description="Добавляйте видеоотзывы из VK Video, подписи к ним и настраивайте порядок карточек."
    />

    <div class="flex flex-wrap items-center gap-4">
      <p class="text-sm text-muted">
        Всего отзывов: <strong class="text-ink">{{ draft.items.length }}</strong>
      </p>
    </div>

    <div v-if="draft.items.length" class="grid gap-5 xl:grid-cols-2">
      <AdminPanel
        v-for="(review, index) in draft.items"
        :key="review.id"
        :title="review.name || `Новый отзыв ${index + 1}`"
        :description="`Карточка ${String(index + 1).padStart(2, '0')}`"
      >
        <div class="grid gap-5">
          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Ссылка VK Video</span>
            <input
              v-model="review.videoUrl"
              required
              type="url"
              inputmode="url"
              class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="https://vkvideo.ru/video… или video_ext.php…"
              @input="saved = false"
            >
            <small class="text-xs leading-relaxed text-muted">
              Можно вставить ссылку на страницу ролика или значение src из кода для встраивания VK.
            </small>
          </label>

          <div class="grid gap-5 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Имя и фамилия</span>
              <input
                v-model="review.name"
                required
                maxlength="160"
                class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                placeholder="Сергей Симаков"
                @input="saved = false"
              >
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Подзаголовок</span>
              <input
                v-model="review.subtitle"
                maxlength="300"
                class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                placeholder="Идущий к реке"
                @input="saved = false"
              >
            </label>
          </div>

          <div class="flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <div class="flex gap-2">
              <button
                type="button"
                class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                :disabled="index === 0"
                :aria-label="`Поднять отзыв ${review.name || index + 1}`"
                @click="moveReview(index, -1)"
              >
                <ArrowUp class="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                :disabled="index === draft.items.length - 1"
                :aria-label="`Опустить отзыв ${review.name || index + 1}`"
                @click="moveReview(index, 1)"
              >
                <ArrowDown class="size-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              class="flex min-h-10 items-center gap-2 border border-red-200 bg-white px-3 text-sm font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50"
              @click="removeReview(index)"
            >
              <Trash2 class="size-4" aria-hidden="true" />
              Удалить
            </button>
          </div>
        </div>
      </AdminPanel>
    </div>

    <div v-else class="grid min-h-72 place-items-center border border-dashed border-ink/15 bg-white p-8 text-center">
      <div>
        <span class="mx-auto grid size-14 place-items-center bg-accent/8 text-accent">
          <MessageSquareQuote class="size-7" aria-hidden="true" />
        </span>
        <p class="mt-5 font-display text-lg font-extrabold uppercase text-ink">Отзывов пока нет</p>
        <p class="mt-2 text-sm text-muted">Добавьте первую видеокарточку.</p>
        <AppButton type="button" class="mt-5" @click="addReview">
          <Plus class="size-5" aria-hidden="true" />
          Добавить отзыв
        </AppButton>
      </div>
    </div>

    <div v-if="draft.items.length" class="flex justify-end">
      <AppButton type="button" variant="secondary" @click="addReview">
        <Plus class="size-5" aria-hidden="true" />
        Добавить отзыв
      </AppButton>
    </div>

    <AdminSaveBar label="Сохранить отзывы" :saving="isSaving" :success="saved ? 'Отзывы сохранены.' : ''" :error="errorMessage" />
  </form>
</template>
