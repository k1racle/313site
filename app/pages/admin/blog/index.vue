<script setup lang="ts">
import { Archive, Edit3, LoaderCircle, Plus, Send, Trash2 } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import type { BlogAdminList, BlogPostStatus } from '~~/shared/types/blog'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Блог — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const data = ref<BlogAdminList>({ items: [] })
const loading = ref(false)
const errorMessage = ref('')
const actionError = ref('')
const pendingPostId = ref('')
const adminAuthenticated = useState<boolean>('admin-authenticated')

async function load() {
  if (!adminAuthenticated.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    data.value = await $fetch<BlogAdminList>('/api/admin/blog')
  }
  catch {
    errorMessage.value = 'Не удалось загрузить статьи.'
  }
  finally {
    loading.value = false
  }
}

async function remove(id: string, title: string) {
  if (!window.confirm(`Удалить статью «${title}»? Отменить это действие нельзя.`)) return
  await $fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
  await load()
}

async function updateStatus(id: string, status: BlogPostStatus) {
  pendingPostId.value = id
  actionError.value = ''
  try {
    await $fetch(`/api/admin/blog/${id}`, { method: 'PATCH', body: { status } })
    await load()
  }
  catch (error: unknown) {
    const requestError = error as { data?: { statusMessage?: string } }
    actionError.value = requestError.data?.statusMessage || 'Не удалось изменить статус статьи.'
  }
  finally {
    pendingPostId.value = ''
  }
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : 'Дата не задана'
}

watch(adminAuthenticated, load, { immediate: true })
</script>

<template>
  <div class="grid gap-7">
    <AdminPageHeader
      eyebrow="Редакция"
      title="Блог"
      description="Создавайте статьи из текстовых и графических секций, сохраняйте черновики и публикуйте материалы по готовности."
    />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-sm text-muted">Материалов: <strong class="text-ink">{{ data.items.length }}</strong></p>
      <AppButton behaviour="link" to="/admin/blog/new">
        <Plus class="size-5" aria-hidden="true" />
        Добавить статью
      </AppButton>
    </div>

    <div v-if="loading" class="grid min-h-64 place-items-center border border-ink/10 bg-white text-muted">
      <LoaderCircle class="size-7 animate-spin" aria-label="Загрузка" />
    </div>
    <p v-else-if="errorMessage" class="border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700" role="alert">{{ errorMessage }}</p>
    <div v-else-if="data.items.length" class="grid gap-4">
      <p v-if="actionError" class="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">{{ actionError }}</p>
      <article v-for="post in data.items" :key="post.id" class="grid gap-4 border border-ink/10 bg-white p-4 shadow-[0_1rem_3rem_rgb(7_16_31/0.05)] sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center">
        <img :src="post.cover.src" :alt="post.cover.alt" class="aspect-[4/3] w-full bg-[#eaf4ff] object-cover">
        <div class="min-w-0">
          <div class="mb-2 flex flex-wrap items-center gap-3 text-[0.68rem] font-bold uppercase">
            <span :class="post.status === 'published' ? 'text-emerald-700' : 'text-amber-700'">{{ post.status === 'published' ? 'Опубликовано' : 'Черновик' }}</span>
            <span class="text-muted">{{ formatDate(post.publishedAt) }}</span>
          </div>
          <h2 class="font-display text-xl leading-tight font-extrabold text-ink uppercase">{{ post.title }}</h2>
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{{ post.excerpt }}</p>
          <p class="mt-2 truncate text-xs text-ink/40">/blog/{{ post.slug }}</p>
        </div>
        <div class="flex items-center gap-2">
          <AppButton
            type="button"
            :variant="post.status === 'published' ? 'ghost' : 'primary'"
            :disabled="pendingPostId === post.id"
            @click="updateStatus(post.id, post.status === 'published' ? 'draft' : 'published')"
          >
            <LoaderCircle v-if="pendingPostId === post.id" class="size-4 animate-spin" aria-hidden="true" />
            <Archive v-else-if="post.status === 'published'" class="size-4" aria-hidden="true" />
            <Send v-else class="size-4" aria-hidden="true" />
            {{ post.status === 'published' ? 'Архивировать' : 'Опубликовать' }}
          </AppButton>
          <NuxtLink :to="`/admin/blog/${post.id}`" class="grid size-11 shrink-0 place-items-center border border-accent text-accent transition hover:bg-accent hover:text-white" :aria-label="`Редактировать ${post.title}`"><Edit3 class="size-4" /></NuxtLink>
          <button type="button" class="grid size-11 shrink-0 place-items-center border border-red-200 text-red-600 transition hover:border-red-600 hover:bg-red-50" :aria-label="`Удалить ${post.title}`" @click="remove(post.id, post.title)"><Trash2 class="size-4" /></button>
        </div>
      </article>
    </div>
    <div v-else class="grid min-h-64 place-items-center border border-dashed border-ink/15 bg-white p-8 text-center">
      <div>
        <p class="font-display text-xl font-extrabold text-ink uppercase">Статей пока нет</p>
        <p class="mt-2 text-sm text-muted">Создайте первый материал и сохраните его как черновик.</p>
      </div>
    </div>
  </div>
</template>
