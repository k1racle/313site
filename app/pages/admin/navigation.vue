<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { navigationItems } from '~/config/navigation'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AdminSaveBar from '~/shared/ui/admin/AdminSaveBar.vue'
import {
  createEmptyNavigationVisibility,
  type NavigationVisibility,
} from '~~/shared/types/navigation'

definePageMeta({ layout: 'admin' })

const { data } = await useFetch('/api/navigation', {
  default: () => ({ visibility: createEmptyNavigationVisibility() }),
})
const visibility = reactive<NavigationVisibility>({ ...data.value.visibility })
const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

async function save() {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''

  try {
    const result = await $fetch<{ visibility: NavigationVisibility }>('/api/admin/navigation', {
      method: 'PUT',
      body: { visibility },
    })
    Object.assign(visibility, result.visibility)
    await refreshNuxtData('site-navigation')
    saved.value = true
  }
  catch {
    errorMessage.value = 'Не удалось сохранить настройки. Попробуйте ещё раз.'
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="grid gap-7" @submit.prevent="save">
    <AdminPageHeader
      eyebrow="Навигация"
      title="Меню сайта"
      description="Включайте и выключайте пункты основного меню. Настройка одновременно применяется к полной и мобильной версиям."
    />

    <AdminPanel title="Видимость разделов">
      <div class="divide-y divide-ink/10 border-y border-ink/10">
          <label
            v-for="item in navigationItems"
            :key="item.to"
            class="flex cursor-pointer items-center justify-between gap-5 py-4"
          >
            <span class="flex min-w-0 items-center gap-4">
              <span class="grid size-11 shrink-0 place-items-center bg-accent/8 text-accent">
                <component :is="item.icon" class="size-5" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <strong class="block font-display text-sm font-extrabold uppercase text-ink">{{ item.label }}</strong>
                <small class="mt-1 block truncate text-xs text-muted">{{ item.to }}</small>
              </span>
            </span>

            <span class="relative shrink-0">
              <input v-model="visibility[item.to]" type="checkbox" class="peer sr-only">
              <span class="grid size-8 place-items-center border border-ink/25 bg-white text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
                <Check class="size-5" aria-hidden="true" />
              </span>
            </span>
          </label>
      </div>
    </AdminPanel>

    <AdminSaveBar
      label="Сохранить меню"
      :saving="isSaving"
      :success="saved ? 'Настройки сохранены.' : ''"
      :error="errorMessage"
    />
  </form>
</template>
