<script setup lang="ts">
import { ArrowDown, ArrowUp, Check, CircleHelp, Plus, Trash2 } from 'lucide-vue-next'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import AppButton from '~/shared/ui/AppButton.vue'
import { createEmptyFaqContent, type FaqContent, type FaqItem, type FaqSection } from '~~/shared/types/faq'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'FAQ — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<FaqContent>('/api/admin/faq', { default: createEmptyFaqContent })
const draft = reactive<FaqContent>({
  sections: data.value.sections.map(section => ({
    ...section,
    items: section.items.map(item => ({ ...item })),
  })),
})
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

function createId(prefix: string) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createQuestion(): FaqItem {
  return { id: createId('faq'), question: '', answer: '', visible: true }
}

function createSection(): FaqSection {
  return { id: createId('faq-section'), title: '', items: [createQuestion()] }
}

function addSection() {
  draft.sections.push(createSection())
  saved.value = false
}

function removeSection(index: number) {
  draft.sections.splice(index, 1)
  saved.value = false
}

function moveSection(index: number, direction: -1 | 1) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= draft.sections.length) return
  const [section] = draft.sections.splice(index, 1)
  if (section) draft.sections.splice(targetIndex, 0, section)
  saved.value = false
}

function addQuestion(section: FaqSection) {
  section.items.push(createQuestion())
  saved.value = false
}

function removeQuestion(section: FaqSection, index: number) {
  section.items.splice(index, 1)
  saved.value = false
}

function moveQuestion(section: FaqSection, index: number, direction: -1 | 1) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= section.items.length) return
  const [item] = section.items.splice(index, 1)
  if (item) section.items.splice(targetIndex, 0, item)
  saved.value = false
}

function applyContent(content: FaqContent) {
  draft.sections.splice(0, draft.sections.length, ...content.sections.map(section => ({
    ...section,
    items: section.items.map(item => ({ ...item })),
  })))
}

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''
  try {
    const content = await $fetch<FaqContent>('/api/admin/faq', { method: 'PUT', body: draft })
    applyContent(content)
    await refreshNuxtData('/api/faq')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить FAQ. Заполните названия разделов, вопросы и ответы.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Помощь посетителям"
      title="FAQ"
      description="Собирайте вопросы по разделам, меняйте порядок и управляйте публикацией на странице частых вопросов."
    />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-sm text-muted">
        Разделов: <strong class="text-ink">{{ draft.sections.length }}</strong>
        <span class="mx-2 text-ink/20">/</span>
        Вопросов: <strong class="text-ink">{{ draft.sections.reduce((count, section) => count + section.items.length, 0) }}</strong>
      </p>
      <AppButton type="button" variant="secondary" @click="addSection">
        <Plus class="size-5" aria-hidden="true" />
        Добавить раздел
      </AppButton>
    </div>

    <div v-if="draft.sections.length" class="grid gap-6">
      <AdminPanel
        v-for="(section, sectionIndex) in draft.sections"
        :key="section.id"
        :title="section.title || `Новый раздел ${sectionIndex + 1}`"
        :description="`Раздел ${String(sectionIndex + 1).padStart(2, '0')} · вопросов ${section.items.length}`"
      >
        <div class="grid gap-5">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Название раздела</span>
              <input v-model="section.title" required maxlength="160" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Перед записью" @input="saved = false">
            </label>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="grid size-12 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="sectionIndex === 0" :aria-label="`Поднять раздел ${section.title || sectionIndex + 1}`" @click="moveSection(sectionIndex, -1)"><ArrowUp class="size-4" aria-hidden="true" /></button>
              <button type="button" class="grid size-12 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="sectionIndex === draft.sections.length - 1" :aria-label="`Опустить раздел ${section.title || sectionIndex + 1}`" @click="moveSection(sectionIndex, 1)"><ArrowDown class="size-4" aria-hidden="true" /></button>
              <button type="button" class="flex min-h-12 items-center gap-2 border border-red-200 bg-white px-4 text-sm font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50" @click="removeSection(sectionIndex)"><Trash2 class="size-4" aria-hidden="true" />Удалить раздел</button>
            </div>
          </div>

          <div class="grid gap-4 border-t border-ink/10 pt-5">
            <article v-for="(item, itemIndex) in section.items" :key="item.id" class="grid gap-4 border border-ink/10 bg-page p-4 sm:p-5">
              <div class="flex items-center justify-between gap-3">
                <strong class="text-sm font-bold text-ink">Вопрос {{ String(itemIndex + 1).padStart(2, '0') }}</strong>
                <span class="text-xs font-semibold" :class="item.visible ? 'text-accent' : 'text-muted'">{{ item.visible ? 'Опубликован' : 'Скрыт' }}</span>
              </div>

              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Вопрос</span>
                <input v-model="item.question" required maxlength="500" class="min-h-12 w-full border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Сколько длится съёмка?" @input="saved = false">
              </label>

              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Ответ</span>
                <textarea v-model="item.answer" required rows="5" maxlength="10000" class="w-full resize-y border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Полный ответ для посетителя…" @input="saved = false" />
              </label>

              <div class="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
                <label class="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
                  <span class="relative shrink-0">
                    <input v-model="item.visible" type="checkbox" class="peer sr-only" @change="saved = false">
                    <span class="grid size-8 place-items-center border border-ink/25 bg-white text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white"><Check class="size-5" aria-hidden="true" /></span>
                  </span>
                  Показывать вопрос
                </label>
                <div class="flex gap-2">
                  <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="itemIndex === 0" :aria-label="`Поднять вопрос ${item.question || itemIndex + 1}`" @click="moveQuestion(section, itemIndex, -1)"><ArrowUp class="size-4" aria-hidden="true" /></button>
                  <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="itemIndex === section.items.length - 1" :aria-label="`Опустить вопрос ${item.question || itemIndex + 1}`" @click="moveQuestion(section, itemIndex, 1)"><ArrowDown class="size-4" aria-hidden="true" /></button>
                  <button type="button" class="grid size-10 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-50" :aria-label="`Удалить вопрос ${item.question || itemIndex + 1}`" @click="removeQuestion(section, itemIndex)"><Trash2 class="size-4" aria-hidden="true" /></button>
                </div>
              </div>
            </article>

            <div v-if="!section.items.length" class="border border-dashed border-ink/15 p-6 text-center text-sm text-muted">В этом разделе пока нет вопросов.</div>
            <AppButton type="button" variant="secondary" class="w-fit" @click="addQuestion(section)"><Plus class="size-5" aria-hidden="true" />Добавить вопрос</AppButton>
          </div>
        </div>
      </AdminPanel>
    </div>

    <div v-else class="grid min-h-72 place-items-center border border-dashed border-ink/15 bg-white p-8 text-center">
      <div>
        <span class="mx-auto grid size-14 place-items-center bg-accent/8 text-accent"><CircleHelp class="size-7" aria-hidden="true" /></span>
        <p class="mt-5 font-display text-lg font-extrabold uppercase text-ink">FAQ пока пуст</p>
        <p class="mt-2 text-sm text-muted">Создайте первый раздел и добавьте в него вопросы.</p>
        <AppButton type="button" class="mt-5" @click="addSection"><Plus class="size-5" aria-hidden="true" />Добавить раздел</AppButton>
      </div>
    </div>

    <AdminSaveBar label="Сохранить FAQ" :saving="isSaving" :success="saved ? 'FAQ сохранён.' : ''" :error="errorMessage" />
  </form>
</template>
