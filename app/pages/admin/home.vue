<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import { createEmptyHomeContent, type HomeContent } from '~~/shared/types/home'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Главная — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<HomeContent>('/api/home', { default: createEmptyHomeContent })
const draft = reactive<HomeContent>({ ...data.value, marquee: { ...data.value.marquee } })
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''
  try {
    const result = await $fetch<HomeContent>('/api/admin/home', { method: 'PUT', body: draft })
    draft.introText = result.introText
    Object.assign(draft.marquee, result.marquee)
    await refreshNuxtData('home-content')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить главную страницу.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Главная страница"
      title="Первый экран"
      description="Логотип и кнопки заданы дизайном. Здесь редактируются описание и бегущая строка первого экрана."
    />

    <div class="grid items-start gap-5 xl:grid-cols-2">
      <AdminPanel title="Описание под логотипом">
        <label class="grid gap-2">
          <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Текст</span>
          <textarea v-model="draft.introText" required rows="7" maxlength="2000" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" />
        </label>
      </AdminPanel>

      <AdminPanel title="Бегущая строка" description="Располагается внизу первого экрана главной.">
        <div class="grid gap-5">
          <label class="flex cursor-pointer items-center justify-between gap-5 border border-ink/10 bg-page p-4">
            <span>
              <strong class="block text-sm font-bold text-ink">Показывать строку</strong>
              <small class="mt-1 block text-xs text-muted">При выключении блок полностью исчезнет</small>
            </span>
            <span class="relative shrink-0">
              <input v-model="draft.marquee.enabled" type="checkbox" class="peer sr-only">
              <span class="grid size-8 place-items-center border border-ink/25 bg-white text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
                <Check class="size-5" aria-hidden="true" />
              </span>
            </span>
          </label>
          <label class="grid gap-2">
            <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Текст строки</span>
            <textarea v-model="draft.marquee.text" rows="5" maxlength="2000" :disabled="!draft.marquee.enabled" class="w-full resize-y border border-ink/15 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none transition disabled:opacity-45 focus:border-accent focus:ring-4 focus:ring-accent/10" />
          </label>
        </div>
      </AdminPanel>
    </div>

    <AdminSaveBar label="Сохранить главную" :saving="isSaving" :success="saved ? 'Главная сохранена.' : ''" :error="errorMessage" />
  </form>
</template>
