<script setup lang="ts">
import { adminNavigation } from '~/config/admin-navigation'
import AppHeading from '~/shared/ui/AppHeading.vue'
import AdminIncompleteNotice from '~/shared/ui/admin/AdminIncompleteNotice.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Админка — Studio 313',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<template>
  <div class="grid gap-7">
    <AdminIncompleteNotice text="Обзор пока служит навигацией по разделам. Настройки меню и большие услуги уже сохраняются и подключены к публичному сайту." />
    <AdminPageHeader
      eyebrow="Рабочая область"
      title="Управление контентом"
      description="Выберите раздел сайта, который хотите изменить."
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="item in adminNavigation.slice(1)"
        :key="item.to"
        :to="item.to"
        class="group border border-ink/10 bg-white p-6 shadow-[0_1rem_3rem_rgb(7_16_31/0.05)] transition hover:-translate-y-1 hover:border-accent/35 hover:shadow-panel"
      >
        <div class="flex size-12 items-center justify-center bg-accent/8 text-accent transition group-hover:bg-accent group-hover:text-white">
          <component :is="item.icon" class="size-6" aria-hidden="true" />
        </div>
        <AppHeading as="h2" size="compact" :accent="false" class="mt-6 text-xl text-ink">{{ item.label }}</AppHeading>
        <p class="mt-2 text-sm text-muted">{{ item.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
