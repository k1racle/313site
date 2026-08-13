<script setup lang="ts">
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import {
  createEmptyPriceListItem,
  createEmptyPriceListSection,
  createEmptyPriceListVariation,
  type PriceList,
} from '~~/shared/types/price-list'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Прайс-лист — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<{ priceList: PriceList }>('/api/price-list', {
  key: 'admin-price-list',
  default: () => ({ priceList: { id: 'main', title: 'Прайс-лист', subtitle: '', sections: [] } }),
})
const form = reactive<PriceList>(structuredClone(data.value.priceList))
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length || from === to) return
  const [item] = items.splice(from, 1)
  if (item !== undefined) items.splice(to, 0, item)
}

function addSection() {
  const section = createEmptyPriceListSection(createId('price-section'))
  section.title = 'Новая секция'
  form.sections.push(section)
}

function removeSection(index: number) {
  const section = form.sections[index]
  if (section && window.confirm(`Удалить секцию «${section.title}» вместе со всеми позициями?`)) {
    form.sections.splice(index, 1)
  }
}

function addItem(sectionIndex: number) {
  const section = form.sections[sectionIndex]
  if (!section) return
  const item = createEmptyPriceListItem(createId(`${section.id}-item`))
  item.title = 'Новая позиция'
  section.items.push(item)
}

function removeItem(sectionIndex: number, itemIndex: number) {
  const section = form.sections[sectionIndex]
  const item = section?.items[itemIndex]
  if (section && item && window.confirm(`Удалить позицию «${item.title}»?`)) section.items.splice(itemIndex, 1)
}

function addVariation(sectionIndex: number, itemIndex: number) {
  const item = form.sections[sectionIndex]?.items[itemIndex]
  if (!item) return
  item.variations.push(createEmptyPriceListVariation(createId(`${item.id}-variation`)))
}

function removeVariation(sectionIndex: number, itemIndex: number, variationIndex: number) {
  form.sections[sectionIndex]?.items[itemIndex]?.variations.splice(variationIndex, 1)
}

async function save() {
  saved.value = false
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'Укажите заголовок прайс-листа.'
    return
  }
  if (form.sections.some(section => !section.title.trim())) {
    errorMessage.value = 'Укажите заголовок каждой секции.'
    return
  }
  if (form.sections.some(section => section.items.some(item => !item.title.trim()))) {
    errorMessage.value = 'Укажите заголовок каждой позиции.'
    return
  }
  if (form.sections.some(section => section.items.some(item => item.variations.some(variation => !variation.title.trim() || !variation.price.trim())))) {
    errorMessage.value = 'Укажите название и цену каждой вариации.'
    return
  }

  isSaving.value = true
  try {
    const result = await $fetch<{ priceList: PriceList }>('/api/admin/price-list', {
      method: 'PUT',
      body: { priceList: form },
    })
    Object.assign(form, structuredClone(result.priceList))
    data.value.priceList = structuredClone(result.priceList)
    await refreshNuxtData('price-list')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить прайс-лист. Проверьте поля и попробуйте ещё раз.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Контент сайта"
      title="Прайс-лист"
      description="Создавайте секции прайса, добавляйте позиции с произвольной ценой и единицей измерения, а при необходимости — отдельные тарифы и вариации."
    />

    <AdminPanel title="Заголовок прайс-листа" description="Эти тексты открывают прайс на публичной странице услуг.">
      <div class="grid gap-5 lg:grid-cols-2">
        <label class="grid gap-2">
          <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Заголовок</span>
          <textarea v-model="form.title" required rows="3" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 font-display text-lg font-extrabold text-ink uppercase outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Прайс-лист" />
        </label>
        <label class="grid gap-2">
          <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Подзаголовок</span>
          <textarea v-model="form.subtitle" rows="3" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Коротко расскажите, как пользоваться прайсом" />
        </label>
      </div>
    </AdminPanel>

    <section class="grid gap-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <AppHeading as="h2" size="compact" :accent="false" class="text-xl text-ink">Секции прайс-листа</AppHeading>
          <p class="mt-2 text-sm text-muted">Например: «Аудио», «Видео и монтаж», «Продакшн».</p>
        </div>
        <AppButton type="button" variant="secondary" @click="addSection">
          <Plus class="size-5" aria-hidden="true" />
          Добавить секцию
        </AppButton>
      </div>

      <article v-for="(section, sectionIndex) in form.sections" :key="section.id" class="border border-ink/10 bg-white p-5 shadow-[0_1rem_3rem_rgb(7_16_31/0.06)] sm:p-6">
        <header class="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs font-bold tracking-[0.12em] text-accent uppercase">Секция {{ String(sectionIndex + 1).padStart(2, '0') }}</p>
            <AppHeading as="h3" size="compact" :accent="false" class="mt-1 text-lg text-ink">{{ section.title || 'Без названия' }}</AppHeading>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="sectionIndex === 0" aria-label="Поднять секцию" @click="move(form.sections, sectionIndex, sectionIndex - 1)">
              <ArrowUp class="size-4" aria-hidden="true" />
            </button>
            <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="sectionIndex === form.sections.length - 1" aria-label="Опустить секцию" @click="move(form.sections, sectionIndex, sectionIndex + 1)">
              <ArrowDown class="size-4" aria-hidden="true" />
            </button>
            <button type="button" class="grid size-10 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white" aria-label="Удалить секцию" @click="removeSection(sectionIndex)">
              <Trash2 class="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div class="mt-5 grid gap-5 lg:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Заголовок секции</span>
            <input v-model="section.title" required type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Аудио">
          </label>
          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Подзаголовок секции</span>
            <input v-model="section.subtitle" type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Запись, чистка и подготовка голоса к эфиру">
          </label>
        </div>

        <div class="mt-7 grid gap-4">
          <div class="flex items-center justify-between gap-4">
            <AppHeading as="h4" size="compact" :accent="false" class="text-base text-ink">Позиции</AppHeading>
            <AppButton type="button" variant="secondary" class="min-h-10 px-4 text-xs" @click="addItem(sectionIndex)">
              <Plus class="size-4" aria-hidden="true" />
              Добавить позицию
            </AppButton>
          </div>

          <div v-if="!section.items.length" class="border border-dashed border-ink/20 p-7 text-center text-sm text-muted">В секции пока нет позиций.</div>

          <article v-for="(item, itemIndex) in section.items" :key="item.id" class="border border-ink/10 bg-page p-4 sm:p-5">
            <header class="flex items-center justify-between gap-4">
              <p class="font-display text-sm font-extrabold text-ink uppercase">{{ item.title || `Позиция ${itemIndex + 1}` }}</p>
              <div class="flex items-center gap-1.5">
                <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="itemIndex === 0" aria-label="Поднять позицию" @click="move(section.items, itemIndex, itemIndex - 1)">
                  <ArrowUp class="size-4" aria-hidden="true" />
                </button>
                <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="itemIndex === section.items.length - 1" aria-label="Опустить позицию" @click="move(section.items, itemIndex, itemIndex + 1)">
                  <ArrowDown class="size-4" aria-hidden="true" />
                </button>
                <button type="button" class="grid size-9 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white" aria-label="Удалить позицию" @click="removeItem(sectionIndex, itemIndex)">
                  <Trash2 class="size-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div class="mt-4 grid gap-4 lg:grid-cols-2">
              <label class="grid gap-2">
                <span class="text-xs font-bold text-muted">Заголовок</span>
                <input v-model="item.title" required type="text" class="min-h-11 w-full border border-ink/15 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" placeholder="Запись аудиоформата">
              </label>
              <label class="grid gap-2">
                <span class="text-xs font-bold text-muted">Подзаголовок</span>
                <input v-model="item.subtitle" type="text" class="min-h-11 w-full border border-ink/15 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" placeholder="До 4 микрофонов, работа звукорежиссёра">
              </label>
              <label class="grid gap-2">
                <span class="text-xs font-bold text-muted">Цена — свободный текст</span>
                <input v-model="item.price" type="text" class="min-h-11 w-full border border-ink/15 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" placeholder="от 3 000 ₽">
              </label>
              <label class="grid gap-2">
                <span class="text-xs font-bold text-muted">Единица измерения</span>
                <input v-model="item.unit" type="text" class="min-h-11 w-full border border-ink/15 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" placeholder="час / за час / ролик">
              </label>
            </div>

            <div class="mt-5 border-t border-ink/10 pt-4">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-xs font-bold tracking-[0.08em] text-ink uppercase">Вариации</p>
                  <p class="mt-1 text-xs text-muted">Опциональные тарифы, которые выводятся под названием и основной ценой.</p>
                </div>
                <AppButton type="button" variant="secondary" class="min-h-9 px-3 text-xs" @click="addVariation(sectionIndex, itemIndex)">
                  <Plus class="size-4" aria-hidden="true" />
                  Добавить вариацию
                </AppButton>
              </div>

              <div v-if="item.variations.length" class="mt-3 grid gap-2">
                <div v-for="(variation, variationIndex) in item.variations" :key="variation.id" class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,.45fr)_auto]">
                  <input v-model="variation.title" required type="text" class="min-h-10 w-full border border-ink/15 bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-accent" placeholder="Reels LITE">
                  <input v-model="variation.price" required type="text" class="min-h-10 w-full border border-ink/15 bg-white px-3 text-sm font-semibold text-accent outline-none transition focus:border-accent" placeholder="1 500 ₽">
                  <button type="button" class="grid size-10 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white" aria-label="Удалить вариацию" @click="removeVariation(sectionIndex, itemIndex, variationIndex)">
                    <Trash2 class="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </article>

      <div v-if="!form.sections.length" class="border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-muted">Секций пока нет. Добавьте первую секцию прайс-листа.</div>
    </section>

    <AdminSaveBar label="Сохранить прайс-лист" :saving="isSaving" :success="saved ? 'Прайс-лист сохранён.' : ''" :error="errorMessage" />
  </form>
</template>
