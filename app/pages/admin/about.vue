<script setup lang="ts">
import { GripVertical, ImagePlus, LoaderCircle, Plus, Trash2 } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import { createEmptyAboutContent, type AboutContent, type AboutImage, type AboutSection } from '~~/shared/types/about'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'О студии — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<AboutContent>('/api/about', { default: createEmptyAboutContent })
const sections = ref<AboutSection[]>(structuredClone(data.value.sections))
const draggedIndex = ref<number | null>(null)
const uploadingIndex = ref<number | null>(null)
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

function addSection() {
  sections.value.push({
    id: `section-${Date.now()}`,
    title: 'Новый раздел',
    text: '',
    image: { src: '/media/static/313.jpg', alt: 'Studio 313' },
  })
  saved.value = false
}

function removeSection(index: number) {
  if (sections.value.length === 1) return
  sections.value.splice(index, 1)
  saved.value = false
}

function moveSection(from: number, to: number) {
  if (to < 0 || to >= sections.value.length || from === to) return
  const [section] = sections.value.splice(from, 1)
  if (section) sections.value.splice(to, 0, section)
  saved.value = false
}

function handleDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleDrop(index: number) {
  const from = draggedIndex.value
  draggedIndex.value = null
  if (from !== null) moveSection(from, index)
}

async function uploadImage(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingIndex.value = index
  errorMessage.value = ''
  try {
    const formData = new FormData()
    formData.append('image', file)
    const image = await $fetch<AboutImage>('/api/admin/media/upload', { method: 'POST', body: formData })
    image.alt = file.name.replace(/\.[^.]+$/, '')
    sections.value[index]!.image = image
    saved.value = false
  }
  catch {
    errorMessage.value = 'Не удалось загрузить изображение. Допустимы JPG, PNG, WebP и AVIF до 12 МБ.'
  }
  finally {
    uploadingIndex.value = null
    input.value = ''
  }
}

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''
  try {
    const content = await $fetch<AboutContent>('/api/admin/about', {
      method: 'PUT',
      body: { sections: sections.value },
    })
    sections.value = structuredClone(content.sections)
    await refreshNuxtData('about-content')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить страницу. Проверьте поля и попробуйте ещё раз.'
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
      title="О студии"
      description="Каждая секция занимает отдельный экран: текст слева, фотография справа. Порядок здесь совпадает с порядком на сайте."
    />

    <AdminPanel title="Порядок разделов" description="Перетащите строку за маркер, чтобы изменить порядок разделов на странице.">
      <div class="grid gap-2">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          draggable="true"
          class="grid cursor-grab grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-3 border border-ink/10 bg-page px-4 py-3 active:cursor-grabbing"
          :class="draggedIndex === index ? 'opacity-45' : ''"
          @dragstart="handleDragStart(index, $event)"
          @dragend="draggedIndex = null"
          @dragover.prevent
          @drop.prevent="handleDrop(index)"
        >
          <GripVertical class="size-5 text-ink/30" aria-hidden="true" />
          <span class="text-xs font-bold text-muted tabular-nums">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="truncate text-sm font-bold text-ink">{{ section.title || 'Без заголовка' }}</span>
        </div>
      </div>
    </AdminPanel>

    <div class="grid gap-5">
      <AdminPanel
        v-for="(section, index) in sections"
        :key="section.id"
        :title="`Раздел ${String(index + 1).padStart(2, '0')}`"
      >
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <p class="text-sm font-semibold text-muted">{{ section.title || 'Без заголовка' }}</p>
          <div class="flex gap-2">
            <button type="button" class="grid size-9 place-items-center border border-red-200 bg-white text-red-600 disabled:opacity-30" :disabled="sections.length === 1" aria-label="Удалить раздел" @click="removeSection(index)"><Trash2 class="size-4" /></button>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="grid gap-5">
            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Заголовок</span>
              <input v-model="section.title" required maxlength="200" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none focus:border-accent">
            </label>
            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Текст</span>
              <textarea v-model="section.text" required rows="8" maxlength="30000" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-accent" />
            </label>
          </div>

          <div class="grid content-start gap-3">
            <img :src="section.image.src" :alt="section.image.alt" class="aspect-[4/3] w-full bg-[#eaf4ff] object-cover">
            <label class="flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-accent bg-white px-4 text-xs font-bold text-accent uppercase transition hover:bg-accent hover:text-white">
              <LoaderCircle v-if="uploadingIndex === index" class="size-4 animate-spin" />
              <ImagePlus v-else class="size-4" />
              {{ uploadingIndex === index ? 'Загружаем…' : 'Заменить фото' }}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="uploadingIndex !== null" @change="uploadImage(index, $event)">
            </label>
            <label class="grid gap-2">
              <span class="text-xs font-bold text-muted">Alt / описание</span>
              <input v-model="section.image.alt" maxlength="300" class="min-h-10 w-full border border-ink/15 bg-page px-3 text-sm text-ink outline-none focus:border-accent">
            </label>
          </div>
        </div>
      </AdminPanel>
    </div>

    <AppButton type="button" variant="secondary" class="w-fit" @click="addSection">
      <Plus class="size-5" />
      Добавить раздел
    </AppButton>

    <AdminSaveBar label="Сохранить страницу" :saving="isSaving" :disabled="uploadingIndex !== null" :success="saved ? 'Страница сохранена.' : ''" :error="errorMessage" />
  </form>
</template>
