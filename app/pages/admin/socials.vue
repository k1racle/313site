<script setup lang="ts">
import { ArrowDown, ArrowUp, Check, Plus, Share2, Trash2 } from 'lucide-vue-next'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import AppButton from '~/shared/ui/AppButton.vue'
import {
  createEmptySocialsContent,
  socialIconNames,
  type SocialLink,
  type SocialsContent,
} from '~~/shared/types/socials'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Соцсети — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<SocialsContent>('/api/admin/socials', {
  default: createEmptySocialsContent,
})
const draft = reactive<SocialsContent>({
  items: data.value.items.map(item => ({ ...item })),
})
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

function createId(prefix: string) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}`
}

function createSocial(): SocialLink {
  const usedIcons = new Set(draft.items.map(item => item.icon))
  const icon = socialIconNames.find(icon => !usedIcons.has(icon)) || 'telegram'

  return {
    id: createId('social'),
    label: '',
    href: '',
    icon,
    visible: true,
  }
}

function addSocial() {
  draft.items.push(createSocial())
  saved.value = false
}

function removeSocial(index: number) {
  draft.items.splice(index, 1)
  saved.value = false
}

function moveSocial(index: number, direction: -1 | 1) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= draft.items.length) return
  const [item] = draft.items.splice(index, 1)
  if (item) draft.items.splice(targetIndex, 0, item)
  saved.value = false
}

function applyContent(content: SocialsContent) {
  draft.items.splice(0, draft.items.length, ...content.items.map(item => ({ ...item })))
}

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''
  try {
    const content = await $fetch<SocialsContent>('/api/admin/socials', {
      method: 'PUT',
      body: draft,
    })
    applyContent(content)
    await refreshNuxtData('/api/socials')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить соцсети. Проверьте названия, ссылки и выбранные иконки.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Внешние каналы"
      title="Социальные сети"
      description="Настраивайте ссылки, подписи, видимость и порядок. Изменения применяются на странице контактов и в меню сайта."
    />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-sm text-muted">
        Всего ссылок: <strong class="text-ink">{{ draft.items.length }}</strong>
      </p>
      <AppButton type="button" variant="secondary" @click="addSocial">
        <Plus class="size-5" aria-hidden="true" />
        Добавить ссылку
      </AppButton>
    </div>

    <div v-if="draft.items.length" class="grid gap-5 xl:grid-cols-2">
      <AdminPanel
        v-for="(social, index) in draft.items"
        :key="social.id"
        :title="social.label || `Новая ссылка ${index + 1}`"
        :description="`Позиция ${String(index + 1).padStart(2, '0')}`"
      >
        <div class="grid gap-5">
          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Название</span>
            <input
              v-model="social.label"
              required
              maxlength="80"
              class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="Telegram"
              @input="saved = false"
            >
          </label>

          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">HTTPS-ссылка</span>
            <input
              v-model="social.href"
              required
              type="text"
              inputmode="url"
              maxlength="1000"
              class="min-h-12 w-full border border-ink/15 bg-page px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="https://t.me/studio313"
              @input="saved = false"
            >
            <small class="text-xs leading-relaxed text-muted">Символ # можно оставить как временную заглушку до появления настоящего адреса.</small>
          </label>

          <label class="flex cursor-pointer items-center justify-between gap-5 border border-ink/10 bg-page p-4">
            <span>
              <strong class="block text-sm font-bold text-ink">Показывать на сайте</strong>
              <small class="mt-1 block text-xs text-muted">Скрытая ссылка остаётся в админке.</small>
            </span>
            <span class="relative shrink-0">
              <input v-model="social.visible" type="checkbox" class="peer sr-only" @change="saved = false">
              <span class="grid size-8 place-items-center border border-ink/25 bg-white text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
                <Check class="size-5" aria-hidden="true" />
              </span>
            </span>
          </label>

          <div class="flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <div class="flex gap-2">
              <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="index === 0" :aria-label="`Поднять ${social.label || 'ссылку'}`" @click="moveSocial(index, -1)">
                <ArrowUp class="size-4" aria-hidden="true" />
              </button>
              <button type="button" class="grid size-10 place-items-center border border-ink/15 bg-white text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30" :disabled="index === draft.items.length - 1" :aria-label="`Опустить ${social.label || 'ссылку'}`" @click="moveSocial(index, 1)">
                <ArrowDown class="size-4" aria-hidden="true" />
              </button>
            </div>
            <button type="button" class="flex min-h-10 items-center gap-2 border border-red-200 bg-white px-3 text-sm font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50" @click="removeSocial(index)">
              <Trash2 class="size-4" aria-hidden="true" />
              Удалить
            </button>
          </div>
        </div>
      </AdminPanel>
    </div>

    <div v-else class="grid min-h-72 place-items-center border border-dashed border-ink/15 bg-white p-8 text-center">
      <div>
        <span class="mx-auto grid size-14 place-items-center bg-accent/8 text-accent"><Share2 class="size-7" aria-hidden="true" /></span>
        <p class="mt-5 font-display text-lg font-extrabold uppercase text-ink">Ссылок пока нет</p>
        <p class="mt-2 text-sm text-muted">Добавьте первую социальную сеть или мессенджер.</p>
        <AppButton type="button" class="mt-5" @click="addSocial"><Plus class="size-5" aria-hidden="true" />Добавить ссылку</AppButton>
      </div>
    </div>

    <AdminSaveBar label="Сохранить соцсети" :saving="isSaving" :success="saved ? 'Соцсети сохранены.' : ''" :error="errorMessage" />
  </form>
</template>
