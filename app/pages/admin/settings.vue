<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import { createEmptySiteSettings, type SiteSettings } from '~~/shared/types/site-settings'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Настройки — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const { data } = await useFetch<SiteSettings>('/api/settings', { default: createEmptySiteSettings })
const draft = reactive({
  bookingWidgetCode: data.value.bookingWidgetCode,
  maintenanceModeEnabled: data.value.maintenanceModeEnabled,
})
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

watch([() => draft.bookingWidgetCode, () => draft.maintenanceModeEnabled], () => {
  saved.value = false
  errorMessage.value = ''
})

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''

  try {
    const result = await $fetch<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: draft,
    })
    draft.bookingWidgetCode = result.bookingWidgetCode
    draft.maintenanceModeEnabled = result.maintenanceModeEnabled
    await refreshNuxtData()
    saved.value = true
  }
  catch (error) {
    const statusMessage = error && typeof error === 'object' && 'data' in error
      ? (error.data as { statusMessage?: string } | undefined)?.statusMessage
      : undefined
    errorMessage.value = statusMessage || 'Не удалось сохранить настройки.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow=""
      title="Настройки"
      description="Общие параметры сайта и внешние интеграции. Изменения применяются сразу после сохранения."
    />

    <AdminPanel
      title="Заглушка сайта"
      description="Когда режим включён, вместо всех публичных страниц показываются только логотип и актуальные контакты. Админка остаётся доступной."
      class="max-w-4xl"
    >
      <label class="flex cursor-pointer items-center justify-between gap-5 border border-ink/10 bg-page p-4 sm:p-5">
        <span>
          <strong class="block text-sm font-bold text-ink">Показывать заглушку</strong>
          <small class="mt-1 block text-xs leading-relaxed text-muted">После сохранения посетители не увидят основные страницы сайта.</small>
        </span>
        <span class="relative shrink-0">
          <input v-model="draft.maintenanceModeEnabled" type="checkbox" class="peer sr-only">
          <span class="grid size-8 place-items-center border border-ink/25 bg-white text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
            <Check class="size-5" aria-hidden="true" />
          </span>
        </span>
      </label>
    </AdminPanel>

    <AdminPanel
      title="Виджет CRM"
      description="Вставьте код виджета из CRM целиком: можно iframe, можно div + iframe + script. Сайт возьмёт iframe, растянет его по контейнеру страницы и поддержит авто-высоту через postMessage."
      class="max-w-4xl"
    >
      <label class="grid gap-2">
        <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">Код виджета</span>
        <textarea
          v-model="draft.bookingWidgetCode"
          rows="10"
          maxlength="10000"
          spellcheck="false"
          class="w-full resize-y border border-ink/15 bg-page px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10"
          placeholder='<div style="width:100%;max-width:1180px;"><iframe src="https://crm.ideawinemaker.ru/api/booking/widget/" title="Виджет записи Studio 313" style="display:block;width:100%;min-height:760px;border:0;overflow:hidden;"></iframe></div>'
        />
      </label>
      <p class="mt-3 text-xs leading-relaxed text-muted">
        Если оставить поле пустым, блок виджета на странице записи будет скрыт.
      </p>
    </AdminPanel>

    <AdminSaveBar
      label="Сохранить настройки"
      :saving="isSaving"
      :success="saved ? 'Настройки сохранены.' : ''"
      :error="errorMessage"
    />
  </form>
</template>
