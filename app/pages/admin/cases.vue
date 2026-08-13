<script setup lang="ts">
import AdminIncompleteNotice from '~/shared/ui/admin/AdminIncompleteNotice.vue'
import AdminMockField from '~/shared/ui/admin/AdminMockField.vue'
import AdminPageHeader from '~/shared/ui/admin/AdminPageHeader.vue'
import AdminPanel from '~/shared/ui/admin/AdminPanel.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Кейсы — Админка Studio 313', robots: 'noindex, nofollow, noarchive' })

const cases = [
  { title: 'Подкаст для бренда', category: 'Подкасты', status: 'Опубликован' },
  { title: 'Интервью в студии', category: 'Интервью', status: 'Черновик' },
  { title: 'Выездная съёмка', category: 'Продакшн', status: 'Опубликован' },
]
</script>

<template>
  <div class="grid gap-7">
    <AdminIncompleteNotice text="Это болванка редактора кейсов. Категории, набор медиа, статусы и поля кейса ещё обсуждаются." />
    <AdminPageHeader
      eyebrow="Портфолио"
      title="Кейсы"
      description="Список проектов и рабочая форма выбранного кейса. На следующем этапе решим структуру галерей, видео и категорий."
      action-label="Добавить кейс"
    />

    <div class="grid items-start gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <AdminPanel title="Все кейсы" description="Черновой card-table список">
        <div class="grid gap-2">
          <article
            v-for="(item, index) in cases"
            :key="item.title"
            class="border p-4"
            :class="index === 0 ? 'border-accent bg-accent/6' : 'border-ink/10 bg-page'"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <AppHeading as="h3" size="compact" :accent="false" class="text-ink">{{ item.title }}</AppHeading>
                <p class="mt-1 text-xs text-muted">{{ item.category }}</p>
              </div>
              <span class="bg-ink/6 px-2 py-1 text-[0.62rem] font-bold text-muted uppercase">{{ item.status }}</span>
            </div>
          </article>
        </div>
      </AdminPanel>

      <div class="grid gap-5">
        <AdminPanel title="Основная информация">
          <div class="grid gap-5 md:grid-cols-2">
            <AdminMockField label="Название" value="Подкаст для бренда" />
            <AdminMockField label="Slug" value="podcast-for-brand" />
            <AdminMockField label="Категория" value="Подкасты" />
            <AdminMockField label="Статус" value="Опубликован" />
            <div class="md:col-span-2">
              <AdminMockField label="Краткое описание" value="Описание проекта, которое появится в карточке и в начале страницы кейса." multiline />
            </div>
          </div>
        </AdminPanel>

        <div class="grid gap-5 lg:grid-cols-2">
          <AdminPanel title="Медиа" description="Обложка, галерея или видео">
            <div class="grid min-h-40 place-items-center border border-dashed border-accent/30 bg-accent/4 p-6 text-center text-sm text-muted">
              Media picker будет спроектирован отдельно
            </div>
          </AdminPanel>
          <AdminPanel title="Публикация и SEO">
            <div class="grid gap-4">
              <AdminMockField label="SEO title" value="Подкаст для бренда — Studio 313" />
              <AdminMockField label="SEO description" value="Краткое описание проекта для поисковой выдачи" />
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  </div>
</template>
