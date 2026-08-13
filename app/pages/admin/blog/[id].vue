<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, LoaderCircle, Plus, Trash2 } from 'lucide-vue-next'
import BlogTextEditor from '~/features/blog-editor/ui/BlogTextEditor.vue'
import AppButton from '~/shared/ui/AppButton.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import { slugify } from '~~/shared/lib/slugify'
import { createEmptyBlogPost, createEmptyTextDocument, type BlogImage, type BlogPost, type BlogPostInput } from '~~/shared/types/blog'

definePageMeta({ layout: 'admin' })
const route = useRoute()
const id = computed(() => String(route.params.id || 'new'))
const isNew = computed(() => id.value === 'new')
useSeoMeta({ title: () => `${isNew.value ? 'Новая статья' : 'Редактирование статьи'} — Админка Studio 313`, robots: 'noindex, nofollow, noarchive' })

const draft = reactive<BlogPostInput>(createEmptyBlogPost())
const loading = ref(!isNew.value)
const isSaving = ref(false)
const uploading = ref('')
const saved = ref(false)
const errorMessage = ref('')
const slugWasEdited = ref(false)
const adminAuthenticated = useState<boolean>('admin-authenticated')

function applyPost(post: BlogPost) {
  Object.assign(draft, {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover: { ...post.cover },
    status: post.status,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    publishedAt: post.publishedAt,
    sections: structuredClone(post.sections),
  })
  slugWasEdited.value = true
}

async function load() {
  if (isNew.value || !adminAuthenticated.value) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    applyPost(await $fetch<BlogPost>(`/api/admin/blog/${id.value}`))
  }
  catch {
    errorMessage.value = 'Не удалось загрузить статью.'
  }
  finally {
    loading.value = false
  }
}

watch(adminAuthenticated, load, { immediate: true })
watch(() => draft.title, (title) => {
  if (!slugWasEdited.value) draft.slug = slugify(title)
})

function addTextSection() {
  draft.sections.push({ id: `section-${Date.now()}`, type: 'text', content: createEmptyTextDocument() })
  saved.value = false
}

function addImageSection() {
  draft.sections.push({ id: `section-${Date.now()}`, type: 'image', image: { src: '/media/static/313.jpg', alt: 'Studio 313' }, caption: '' })
  saved.value = false
}

function moveSection(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= draft.sections.length) return
  const [section] = draft.sections.splice(index, 1)
  if (section) draft.sections.splice(target, 0, section)
  saved.value = false
}

function removeSection(index: number) {
  if (draft.sections.length === 1) return
  draft.sections.splice(index, 1)
  saved.value = false
}

async function uploadImage(target: 'cover' | number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = String(target)
  errorMessage.value = ''
  try {
    const formData = new FormData()
    formData.append('image', file)
    const image = await $fetch<BlogImage>('/api/admin/media/upload', { method: 'POST', body: formData })
    image.alt = file.name.replace(/\.[^.]+$/, '')
    if (target === 'cover') draft.cover = image
    else {
      const section = draft.sections[target]
      if (section?.type === 'image') section.image = image
    }
    saved.value = false
  }
  catch {
    errorMessage.value = 'Не удалось загрузить изображение. Допустимы JPG, PNG, WebP и AVIF до 12 МБ.'
  }
  finally {
    uploading.value = ''
    input.value = ''
  }
}

const publishedDate = computed({
  get: () => draft.publishedAt ? new Date(draft.publishedAt).toISOString().slice(0, 10) : '',
  set: value => { draft.publishedAt = value ? `${value}T00:00:00.000Z` : null },
})

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''
  try {
    const post = await $fetch<BlogPost>(isNew.value ? '/api/admin/blog' : `/api/admin/blog/${id.value}`, {
      method: isNew.value ? 'POST' : 'PUT',
      body: draft,
    })
    applyPost(post)
    saved.value = true
    if (isNew.value) await navigateTo(`/admin/blog/${post.id}`, { replace: true })
  }
  catch (error: unknown) {
    const requestError = error as { data?: { statusMessage?: string } }
    errorMessage.value = requestError.data?.statusMessage || 'Не удалось сохранить статью. Проверьте обязательные поля.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="grid min-h-96 place-items-center text-muted"><LoaderCircle class="size-8 animate-spin" /></div>
  <form v-else class="grid gap-7" @submit.prevent="save">
    <NuxtLink to="/admin/blog" class="flex w-fit items-center gap-2 text-sm font-bold text-muted transition hover:text-accent"><ArrowLeft class="size-4" />К списку статей</NuxtLink>
    <AdminPageHeader
      eyebrow="Материал"
      :title="isNew ? 'Новая статья' : draft.title || 'Статья без названия'"
      description="Соберите статью из текстовых и графических секций. Финальный блок записи добавится на сайте автоматически."
    />

    <div class="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div class="grid gap-5">
        <AdminPanel title="Основное">
          <div class="grid gap-5">
            <label class="grid gap-2"><span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Заголовок</span><input v-model="draft.title" required maxlength="220" class="min-h-12 border border-ink/15 bg-page px-4 text-ink outline-none focus:border-accent"></label>
            <label class="grid gap-2"><span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Slug</span><div class="flex items-center border border-ink/15 bg-page focus-within:border-accent"><span class="pl-4 text-sm text-muted">/blog/</span><input v-model="draft.slug" required maxlength="160" class="min-h-12 min-w-0 flex-1 bg-transparent px-1 pr-4 text-sm text-ink outline-none" @input="slugWasEdited = true"></div></label>
            <label class="grid gap-2"><span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Анонс</span><textarea v-model="draft.excerpt" required rows="4" maxlength="500" class="resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-accent" placeholder="Две короткие строки для карточки и поисковой выдачи." /></label>
          </div>
        </AdminPanel>

        <AdminPanel title="Содержание статьи" description="Меняйте порядок секций стрелками. Заголовок H1 создаётся из названия статьи, поэтому внутри доступны H2 и H3.">
          <div class="grid gap-5">
            <section v-for="(section, index) in draft.sections" :key="section.id" class="border border-ink/10 bg-white">
              <header class="flex items-center justify-between gap-3 border-b border-ink/10 bg-[#eaf4ff] px-4 py-3">
                <p class="text-xs font-bold tracking-[0.1em] text-ink uppercase">{{ String(index + 1).padStart(2, '0') }} · {{ section.type === 'text' ? 'Текст' : 'Изображение' }}</p>
                <div class="flex gap-1">
                  <button type="button" class="grid size-9 place-items-center border border-ink/10 bg-white text-ink disabled:opacity-25" :disabled="index === 0" aria-label="Поднять секцию" @click="moveSection(index, -1)"><ArrowUp class="size-4" /></button>
                  <button type="button" class="grid size-9 place-items-center border border-ink/10 bg-white text-ink disabled:opacity-25" :disabled="index === draft.sections.length - 1" aria-label="Опустить секцию" @click="moveSection(index, 1)"><ArrowDown class="size-4" /></button>
                  <button type="button" class="grid size-9 place-items-center border border-red-200 bg-white text-red-600 disabled:opacity-25" :disabled="draft.sections.length === 1" aria-label="Удалить секцию" @click="removeSection(index)"><Trash2 class="size-4" /></button>
                </div>
              </header>
              <div class="p-4">
                <ClientOnly v-if="section.type === 'text'">
                  <BlogTextEditor v-model="section.content" @update:model-value="saved = false" />
                  <template #fallback><div class="min-h-64 animate-pulse bg-page" /></template>
                </ClientOnly>
                <div v-else class="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
                  <img :src="section.image.src" :alt="section.image.alt" class="aspect-[4/3] w-full bg-[#eaf4ff] object-cover">
                  <div class="grid content-start gap-4">
                    <label class="flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-accent bg-white px-4 text-xs font-bold text-accent uppercase transition hover:bg-accent hover:text-white"><LoaderCircle v-if="uploading === String(index)" class="size-4 animate-spin" /><ImagePlus v-else class="size-4" />{{ uploading === String(index) ? 'Загружаем…' : 'Заменить изображение' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="Boolean(uploading)" @change="uploadImage(index, $event)"></label>
                    <label class="grid gap-2"><span class="text-xs font-bold text-muted">Alt / описание</span><input v-model="section.image.alt" required maxlength="300" class="min-h-10 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"></label>
                    <label class="grid gap-2"><span class="text-xs font-bold text-muted">Подпись (необязательно)</span><input v-model="section.caption" maxlength="500" class="min-h-10 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"></label>
                  </div>
                </div>
              </div>
            </section>
            <div class="flex flex-wrap gap-3">
              <AppButton type="button" variant="secondary" @click="addTextSection"><Plus class="size-4" />Текст</AppButton>
              <AppButton type="button" variant="secondary" @click="addImageSection"><ImagePlus class="size-4" />Изображение</AppButton>
            </div>
          </div>
        </AdminPanel>
      </div>

      <div class="grid gap-5 xl:sticky xl:top-24">
        <AdminPanel title="Обложка">
          <div class="grid gap-3">
            <img :src="draft.cover.src" :alt="draft.cover.alt" class="aspect-[4/3] w-full bg-[#eaf4ff] object-cover">
            <label class="flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-accent text-xs font-bold text-accent uppercase transition hover:bg-accent hover:text-white"><LoaderCircle v-if="uploading === 'cover'" class="size-4 animate-spin" /><ImagePlus v-else class="size-4" />{{ uploading === 'cover' ? 'Загружаем…' : 'Заменить' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="Boolean(uploading)" @change="uploadImage('cover', $event)"></label>
            <label class="grid gap-2"><span class="text-xs font-bold text-muted">Alt / описание</span><input v-model="draft.cover.alt" required maxlength="300" class="min-h-10 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"></label>
          </div>
        </AdminPanel>
        <AdminPanel title="Публикация">
          <div class="grid gap-4">
            <label class="grid gap-2"><span class="text-xs font-bold text-muted">Статус</span><select v-model="draft.status" class="min-h-11 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"><option value="draft">Черновик</option><option value="published">Опубликовано</option></select></label>
            <label class="grid gap-2"><span class="text-xs font-bold text-muted">Дата публикации</span><input v-model="publishedDate" type="date" class="min-h-11 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"></label>
          </div>
        </AdminPanel>
        <AdminPanel title="SEO">
          <div class="grid gap-4">
            <label class="grid gap-2"><span class="text-xs font-bold text-muted">SEO title</span><input v-model="draft.seoTitle" maxlength="220" :placeholder="draft.title || 'Заголовок статьи'" class="min-h-11 border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent"></label>
            <label class="grid gap-2"><span class="text-xs font-bold text-muted">Meta description</span><textarea v-model="draft.seoDescription" rows="4" maxlength="500" :placeholder="draft.excerpt || 'Короткое описание статьи'" class="resize-y border border-ink/15 bg-page px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
          </div>
        </AdminPanel>
      </div>
    </div>

    <AdminSaveBar label="Сохранить статью" :saving="isSaving" :disabled="Boolean(uploading)" :success="saved ? 'Статья сохранена.' : ''" :error="errorMessage" />
  </form>
</template>
