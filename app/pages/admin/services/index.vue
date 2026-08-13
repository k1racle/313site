<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import { createEmptyFeaturedService, type FeaturedService } from '~~/shared/types/featured-service'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Большие услуги — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<{ services: FeaturedService[] }>('/api/services', {
  default: () => ({ services: [] }),
})
const services = ref<FeaturedService[]>(structuredClone(data.value.services))
const expandedServiceId = ref<string | null>(null)
const draggedServiceIndex = ref<number | null>(null)
const draggedFeature = ref<{ serviceId: string, index: number } | null>(null)
const isSaving = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

watch(services, () => {
  statusMessage.value = ''
  errorMessage.value = ''
}, { deep: true, flush: 'sync' })

function toggleService(serviceId: string) {
  expandedServiceId.value = expandedServiceId.value === serviceId ? null : serviceId
}

function addService() {
  const id = `service-${Date.now()}`
  services.value.push({
    ...createEmptyFeaturedService(id),
    timelineLabel: 'Новая услуга',
    title: 'Новая услуга',
  })
  expandedServiceId.value = id
}

function removeService(index: number) {
  const service = services.value[index]
  if (!service || !window.confirm(`Удалить услугу «${service.title.replace(/\s+/g, ' ')}»?`)) return

  services.value.splice(index, 1)
  if (expandedServiceId.value === service.id) expandedServiceId.value = null
}

function moveService(from: number, to: number) {
  if (to < 0 || to >= services.value.length || from === to) return
  const [moved] = services.value.splice(from, 1)
  if (moved) services.value.splice(to, 0, moved)
}

function handleServiceDragStart(index: number, event: DragEvent) {
  draggedServiceIndex.value = index
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleServiceDrop(index: number) {
  const from = draggedServiceIndex.value
  draggedServiceIndex.value = null
  if (from !== null) moveService(from, index)
}

function addFeature(service: FeaturedService) {
  service.features.push('')
}

function removeFeature(service: FeaturedService, index: number) {
  service.features.splice(index, 1)
}

function moveFeature(service: FeaturedService, from: number, to: number) {
  if (to < 0 || to >= service.features.length || from === to) return
  const [moved] = service.features.splice(from, 1)
  if (moved !== undefined) service.features.splice(to, 0, moved)
}

function handleFeatureDragStart(serviceId: string, index: number, event: DragEvent) {
  draggedFeature.value = { serviceId, index }
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleFeatureDrop(service: FeaturedService, index: number) {
  const dragged = draggedFeature.value
  draggedFeature.value = null
  if (dragged?.serviceId === service.id) moveFeature(service, dragged.index, index)
}

function getSaveErrorMessage(error: unknown) {
  const requestError = error as {
    status?: number
    statusCode?: number
    statusMessage?: string
    message?: string
    data?: {
      statusCode?: number
      statusMessage?: string
      message?: string
    }
    response?: { status?: number }
  }
  const statusCode = requestError.data?.statusCode
    || requestError.statusCode
    || requestError.status
    || requestError.response?.status
  const message = requestError.data?.statusMessage
    || requestError.statusMessage
    || requestError.data?.message
    || requestError.message

  if (!message) return 'Не удалось сохранить услуги. Сервер не сообщил причину ошибки.'
  return statusCode ? `Ошибка ${statusCode}: ${message}` : message
}

async function save() {
  statusMessage.value = ''
  errorMessage.value = ''

  const serviceWithoutTitle = services.value.find(service => !service.title.trim())
  if (serviceWithoutTitle) {
    expandedServiceId.value = serviceWithoutTitle.id
    errorMessage.value = 'Укажите заголовок у каждой услуги.'
    return
  }

  isSaving.value = true
  try {
    const normalizedServices = services.value.map(service => ({
      ...structuredClone(toRaw(service)),
      title: service.title.trim(),
      timelineLabel: service.title.split(/\r?\n/).find(Boolean)?.trim().slice(0, 80) || 'Услуга',
      features: service.features.map(item => item.trim()).filter(Boolean),
    }))
    const result = await $fetch<{ services: FeaturedService[] }>('/api/admin/services', {
      method: 'PUT',
      body: { services: normalizedServices },
    })
    services.value = structuredClone(result.services)
    data.value.services = structuredClone(result.services)
    await refreshNuxtData('featured-services')
    statusMessage.value = 'Услуги сохранены.'
  }
  catch (error: unknown) {
    errorMessage.value = getSaveErrorMessage(error)
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
      title="Большие услуги"
      description="Раскрывайте услуги прямо в списке, изменяйте содержание полноэкранных блоков и их порядок на публичной странице."
    />

    <AdminPanel title="Список услуг" description="Нажмите «Изменить», чтобы раскрыть поля. Перетащите услугу за маркер или используйте стрелки для изменения порядка.">
      <div class="grid gap-3">
        <article
          v-for="(service, index) in services"
          :key="service.id"
          class="border bg-page transition"
          :class="[
            expandedServiceId === service.id ? 'border-accent/40 shadow-[0_1rem_3rem_rgb(7_16_31/0.06)]' : 'border-ink/10',
            draggedServiceIndex === index ? 'opacity-45' : '',
          ]"
          @dragover.prevent
          @drop.prevent="handleServiceDrop(index)"
        >
          <div class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
            <button
              type="button"
              draggable="true"
              class="grid size-10 cursor-grab place-items-center text-ink/30 active:cursor-grabbing"
              aria-label="Перетащить услугу"
              @dragstart="handleServiceDragStart(index, $event)"
              @dragend="draggedServiceIndex = null"
            >
              <GripVertical class="size-5" aria-hidden="true" />
            </button>

            <button type="button" class="min-w-0 text-left" :aria-expanded="expandedServiceId === service.id" :aria-controls="`service-editor-${service.id}`" @click="toggleService(service.id)">
              <p class="text-xs font-bold text-muted">{{ String(index + 1).padStart(2, '0') }}</p>
              <AppHeading as="h2" size="compact" :accent="false" class="mt-1 whitespace-pre-line text-ink">{{ service.title || 'Без названия' }}</AppHeading>
              <p class="mt-1 truncate text-xs text-muted">{{ service.subtitle || 'Без подзаголовка' }}</p>
            </button>

            <div class="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1">
              <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="index === 0 || isSaving" aria-label="Поднять услугу" @click="moveService(index, index - 1)">
                <ArrowUp class="size-4" aria-hidden="true" />
              </button>
              <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="index === services.length - 1 || isSaving" aria-label="Опустить услугу" @click="moveService(index, index + 1)">
                <ArrowDown class="size-4" aria-hidden="true" />
              </button>
              <AppButton type="button" variant="secondary" class="min-h-10 px-4 text-xs" :aria-expanded="expandedServiceId === service.id" :aria-controls="`service-editor-${service.id}`" @click="toggleService(service.id)">
                <Pencil class="size-4" aria-hidden="true" />
                {{ expandedServiceId === service.id ? 'Свернуть' : 'Изменить' }}
                <ChevronUp v-if="expandedServiceId === service.id" class="size-4" aria-hidden="true" />
                <ChevronDown v-else class="size-4" aria-hidden="true" />
              </AppButton>
              <button type="button" class="grid size-10 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-30" :disabled="isSaving" aria-label="Удалить услугу" @click="removeService(index)">
                <Trash2 class="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div v-if="expandedServiceId === service.id" :id="`service-editor-${service.id}`" class="grid gap-6 border-t border-ink/10 bg-white p-4 sm:p-6">
            <section class="grid gap-5">
              <AppHeading as="h3" size="compact" :accent="false" class="text-lg text-ink">Тексты и стоимость</AppHeading>

              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Заголовок</span>
                <textarea v-model="service.title" required rows="4" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 font-display text-lg font-extrabold text-ink uppercase outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Аренда&#10;студии" />
                <small class="text-xs leading-relaxed text-muted">Нажмите Enter, чтобы явно перенести часть заголовка на новую строку.</small>
              </label>

              <label class="grid gap-2">
                <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Подзаголовок</span>
                <textarea v-model="service.subtitle" rows="4" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Коротко опишите услугу" />
              </label>

              <div class="grid gap-5 md:grid-cols-2">
                <label class="grid gap-2">
                  <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Стоимость</span>
                  <input v-model="service.price" type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="от 5 000 ₽ / час">
                </label>
                <label class="grid gap-2">
                  <span class="text-xs font-bold tracking-[0.12em] text-ink uppercase">Название основной кнопки</span>
                  <input v-model="service.actionLabel" type="text" class="min-h-12 w-full border border-ink/15 bg-page px-4 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" placeholder="Забронировать студию">
                </label>
              </div>
            </section>

            <section class="grid gap-4 border-t border-ink/10 pt-6">
              <div>
                <AppHeading as="h3" size="compact" :accent="false" class="text-lg text-ink">Позиции</AppHeading>
                <p class="mt-1 text-xs text-muted">Перетащите строку за маркер или используйте стрелки для изменения порядка.</p>
              </div>

              <div class="grid gap-2">
                <div
                  v-for="(feature, featureIndex) in service.features"
                  :key="featureIndex"
                  class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border border-ink/10 bg-page p-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  :class="draggedFeature?.serviceId === service.id && draggedFeature.index === featureIndex ? 'opacity-45' : ''"
                  @dragover.prevent
                  @drop.prevent="handleFeatureDrop(service, featureIndex)"
                >
                  <button
                    type="button"
                    draggable="true"
                    class="grid size-9 cursor-grab place-items-center text-ink/30 active:cursor-grabbing"
                    aria-label="Перетащить позицию"
                    @dragstart="handleFeatureDragStart(service.id, featureIndex, $event)"
                    @dragend="draggedFeature = null"
                  >
                    <GripVertical class="size-5" aria-hidden="true" />
                  </button>
                  <input v-model="service.features[featureIndex]" type="text" class="min-h-11 w-full border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-accent" :placeholder="`Позиция ${featureIndex + 1}`">
                  <div class="col-span-2 flex items-center gap-1 sm:col-span-1">
                    <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="featureIndex === 0" aria-label="Поднять позицию" @click="moveFeature(service, featureIndex, featureIndex - 1)">
                      <ArrowUp class="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" class="grid size-9 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:opacity-30" :disabled="featureIndex === service.features.length - 1" aria-label="Опустить позицию" @click="moveFeature(service, featureIndex, featureIndex + 1)">
                      <ArrowDown class="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" class="grid size-9 place-items-center border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white" aria-label="Удалить позицию" @click="removeFeature(service, featureIndex)">
                      <Trash2 class="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <AppButton type="button" variant="secondary" class="w-fit min-h-10 px-4 text-xs" @click="addFeature(service)">
                <Plus class="size-4" aria-hidden="true" />
                Добавить позицию
              </AppButton>
            </section>

            <dl class="grid gap-3 border-t border-ink/10 pt-5 text-xs sm:grid-cols-2">
              <div>
                <dt class="font-bold text-muted uppercase">ID</dt>
                <dd class="mt-1 break-all font-mono text-ink">{{ service.id }}</dd>
              </div>
              <div>
                <dt class="font-bold text-muted uppercase">Позиций</dt>
                <dd class="mt-1 text-ink">{{ service.features.length }}</dd>
              </div>
            </dl>
          </div>
        </article>

        <div v-if="!services.length" class="border border-dashed border-ink/20 p-8 text-center text-sm text-muted">Больших услуг пока нет.</div>
      </div>

      <div class="mt-6 border-t border-ink/10 pt-6">
        <AppButton type="button" :disabled="isSaving" @click="addService">
          <Plus class="size-5" aria-hidden="true" />
          Добавить услугу
        </AppButton>
      </div>
    </AdminPanel>

    <AdminSaveBar label="Сохранить услуги" :saving="isSaving" :success="statusMessage" :error="errorMessage" />
  </form>
</template>
