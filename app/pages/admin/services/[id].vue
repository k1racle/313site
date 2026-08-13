<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import type { FeaturedService } from '~~/shared/types/featured-service'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const serviceId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
const { data } = await useFetch<{ services: FeaturedService[] }>('/api/services', {
  default: () => ({ services: [] }),
})
const serviceIndex = data.value.services.findIndex(service => service.id === serviceId.value)
const sourceService = data.value.services[serviceIndex]

if (!sourceService) {
  throw createError({ statusCode: 404, statusMessage: 'Услуга не найдена' })
}

const form = reactive<FeaturedService>(structuredClone(sourceService))
const draggedFeatureIndex = ref<number | null>(null)
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

useSeoMeta({
  title: () => `${form.title.replace(/\s+/g, ' ')} — Большие услуги`,
  robots: 'noindex, nofollow, noarchive',
})

function addFeature() {
  form.features.push('')
}

function removeFeature(index: number) {
  form.features.splice(index, 1)
}

function moveFeature(from: number, to: number) {
  if (to < 0 || to >= form.features.length || from === to) return
  const [moved] = form.features.splice(from, 1)
  if (moved === undefined) return
  form.features.splice(to, 0, moved)
}

function handleFeatureDragStart(index: number, event: DragEvent) {
  draggedFeatureIndex.value = index
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleFeatureDrop(index: number) {
  const from = draggedFeatureIndex.value
  draggedFeatureIndex.value = null
  if (from !== null) moveFeature(from, index)
}

async function save() {
  saved.value = false
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'Укажите заголовок услуги.'
    return
  }

  isSaving.value = true
  try {
    form.title = form.title.trim()
    form.timelineLabel = form.title.split(/\r?\n/).find(Boolean)?.trim().slice(0, 80) || 'Услуга'
    form.features = form.features.map(item => item.trim()).filter(Boolean)

    const nextServices = structuredClone(data.value.services)
    nextServices[serviceIndex] = structuredClone(toRaw(form))
    const result = await $fetch<{ services: FeaturedService[] }>('/api/admin/services', {
      method: 'PUT',
      body: { services: nextServices },
    })
    data.value.services = result.services
    const savedService = result.services.find(service => service.id === form.id)
    if (savedService) Object.assign(form, structuredClone(savedService))
    await refreshNuxtData('featured-services')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить услугу. Попробуйте ещё раз.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <div>
      <AppButton behaviour="link" variant="ghost" to="/admin/services" class="min-h-10 px-4 text-xs">
        <ArrowLeft class="size-4" aria-hidden="true" />
        К списку услуг
      </AppButton>
    </div>

    <AdminPageHeader
      eyebrow="Большие услуги"
      title="Редактирование услуги"
      description="Перенос строки в заголовке сохраняется на публичной странице. Размер длинных строк подбирается автоматически."
    />

    <div class="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div class="grid gap-5">
        <AdminPanel title="Тексты и стоимость">
          <div class="grid gap-5">
            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Заголовок</span>
              <textarea v-model="form.title" required rows="4" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 font-display text-lg font-extrabold text-ink uppercase outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Аренда&#10;студии" />
              <small class="text-xs leading-relaxed text-muted">Нажмите Enter, чтобы явно перенести часть заголовка на новую строку.</small>
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Подзаголовок</span>
              <textarea v-model="form.subtitle" rows="4" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Коротко опишите услугу" />
            </label>

            <div class="grid gap-5 md:grid-cols-2">
              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Стоимость</span>
                <input v-model="form.price" type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="от 5 000 ₽ / час">
              </label>
              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Название основной кнопки</span>
                <input v-model="form.actionLabel" type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Забронировать студию">
              </label>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Позиции" description="Перетащите строку за маркер или используйте стрелки для изменения порядка.">
          <div class="grid gap-2">
            <div
              v-for="(feature, index) in form.features"
              :key="index"
              draggable="true"
              class="grid cursor-grab grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border border-ink/10 bg-page p-2 active:cursor-grabbing sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              :class="draggedFeatureIndex === index ? 'opacity-45' : ''"
              @dragstart="handleFeatureDragStart(index, $event)"
              @dragend="draggedFeatureIndex = null"
              @dragover.prevent
              @drop.prevent="handleFeatureDrop(index)"
            >
              <GripVertical class="size-5 text-ink/30" aria-hidden="true" />
              <input v-model="form.features[index]" type="text" class="min-h-11 w-full border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" :placeholder="`Позиция ${index + 1}`">
              <div class="col-span-2 flex items-center gap-1 sm:col-span-1">
                <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="index === 0" aria-label="Поднять позицию" @click="moveFeature(index, index - 1)">
                  <ArrowUp class="size-4" aria-hidden="true" />
                </button>
                <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="index === form.features.length - 1" aria-label="Опустить позицию" @click="moveFeature(index, index + 1)">
                  <ArrowDown class="size-4" aria-hidden="true" />
                </button>
                <button type="button" class="grid size-9 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white" aria-label="Удалить позицию" @click="removeFeature(index)">
                  <Trash2 class="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <AppButton type="button" variant="secondary" class="mt-4 min-h-10 px-4 text-xs" @click="addFeature">
            <Plus class="size-4" aria-hidden="true" />
            Добавить позицию
          </AppButton>
        </AdminPanel>
      </div>

      <AdminPanel title="Сводка" description="Изменения появятся на странице услуг сразу после сохранения.">
        <div class="grid gap-4">
          <dl class="grid gap-3 text-xs">
            <div>
              <dt class="font-bold text-muted uppercase">ID</dt>
              <dd class="mt-1 break-all font-mono text-ink">{{ form.id }}</dd>
            </div>
            <div>
              <dt class="font-bold text-muted uppercase">Позиций</dt>
              <dd class="mt-1 text-ink">{{ form.features.length }}</dd>
            </div>
          </dl>
        </div>
      </AdminPanel>
    </div>

    <AdminSaveBar label="Сохранить услугу" :saving="isSaving" :success="saved ? 'Услуга сохранена.' : ''" :error="errorMessage" />
  </form>
</template>
