<script setup lang="ts">
import { ArrowUpRight, ChevronRight, Plus } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import { createEmptyFaqContent, type FaqContent } from '~~/shared/types/faq'

const { data: faq } = await useFetch<FaqContent>('/api/faq', {
  key: 'faq-content',
  default: createEmptyFaqContent,
})

function questionNumber(sectionIndex: number, itemIndex: number) {
  const previousItems = faq.value.sections
    .slice(0, sectionIndex)
    .reduce((count, section) => count + section.items.length, 0)
  return String(previousItems + itemIndex + 1).padStart(2, '0')
}

useSeoMeta({
  title: 'FAQ — Студия 313',
  description: 'Ответы на частые вопросы о записи, аренде и подготовке к съёмке в Студии 313.',
  ogTitle: 'FAQ — Студия 313',
  ogDescription: 'Что входит в аренду, сколько длится запись и как посмотреть студию заранее.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <PageLongScreen>
    <div class="min-h-[inherit] overflow-clip bg-page text-ink">
      <header class="border-b border-ink/10 bg-[#eaf4ff]">
        <div class="mx-auto w-[min(calc(100%-3rem),78rem)] sm:w-[min(calc(100%-5rem),78rem)] max-[30rem]:w-[min(calc(100%-2rem),78rem)]">
          <div class="flex items-center gap-2.5 pt-[clamp(2rem,5vw,4rem)] text-xs font-bold tracking-[0.12em] text-muted uppercase">
            <NuxtLink to="/" class="transition hover:text-accent">Studio 313</NuxtLink>
            <ChevronRight class="size-3.5" aria-hidden="true" />
            <span>FAQ</span>
          </div>

          <div class="grid items-end gap-[clamp(3rem,7vw,6rem)] py-[clamp(5rem,12vw,10rem)] sm:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)]">
            <AppHeading as="h1" size="hero" :accent="true">Частые<br>вопросы</AppHeading>
            <p class="max-w-md border-t border-ink/15 pt-5 text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-muted">
              Самое важное о времени, подготовке и возможностях студии — коротко и без сложных условий.
            </p>
          </div>
        </div>
      </header>

      <section class="py-[clamp(5rem,9vw,8rem)]">
        <div class="mx-auto w-[min(calc(100%-3rem),78rem)] sm:w-[min(calc(100%-5rem),78rem)] max-[30rem]:w-[min(calc(100%-2rem),78rem)]">
          <div v-if="faq.sections.length" class="grid gap-[clamp(4rem,8vw,7rem)]">
            <section v-for="(section, sectionIndex) in faq.sections" :key="section.id" :aria-labelledby="`faq-section-${section.id}`">
              <div class="mb-[clamp(2.5rem,5vw,4.5rem)] flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <AppHeading :id="`faq-section-${section.id}`" as="h2" size="section" :accent="true">{{ section.title }}</AppHeading>
                <p class="text-sm text-muted">Выберите вопрос, чтобы увидеть ответ.</p>
              </div>

              <div class="border-t border-ink/15">
                <details v-for="(item, itemIndex) in section.items" :key="item.id" class="group border-b border-ink/15">
                  <summary class="grid cursor-pointer list-none grid-cols-[1.5rem_minmax(0,1fr)_2.75rem] items-center gap-[clamp(0.75rem,3vw,2.5rem)] py-[clamp(1.5rem,3.5vw,2.25rem)] [&::-webkit-details-marker]:hidden">
                    <span class="text-xs font-bold tracking-[0.08em] text-muted group-open:text-accent">{{ questionNumber(sectionIndex, itemIndex) }}</span>
                    <AppHeading as="h3" size="card" :accent="false" class="text-ink">{{ item.question }}</AppHeading>
                    <span class="grid size-11 place-items-center border border-ink/20 text-ink transition group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                      <Plus class="size-4.5" aria-hidden="true" />
                    </span>
                  </summary>
                  <div class="grid grid-cols-[1.5rem_minmax(0,1fr)_2.75rem] gap-[clamp(0.75rem,3vw,2.5rem)] pb-[clamp(1.75rem,4vw,3rem)]">
                    <span />
                    <p class="max-w-2xl whitespace-pre-line text-[clamp(0.95rem,1.7vw,1.1rem)] leading-relaxed text-muted">{{ item.answer }}</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <div v-else class="border-y border-ink/15 py-[clamp(3rem,7vw,5rem)] text-center">
            <AppHeading id="faq-title" as="h2" size="section" :accent="true">Вопросы скоро появятся</AppHeading>
            <p class="mt-4 text-muted">Пока вы можете написать нам напрямую.</p>
          </div>

          <div class="mt-[clamp(5rem,10vw,8rem)] flex flex-col gap-8 border-y border-ink/15 py-8 sm:flex-row sm:items-end sm:justify-between">
            <strong class="block max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-normal font-semibold text-ink">Расскажите о вашей задаче — мы подскажем подходящий формат.</strong>
            <AppButton behaviour="link" to="/contacts" class="w-fit shrink-0">
              Задать вопрос
              <ArrowUpRight class="size-4.5" aria-hidden="true" />
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  </PageLongScreen>
</template>
