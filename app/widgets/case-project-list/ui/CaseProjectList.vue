<script setup lang="ts">
import type { CaseCategory, CaseProject } from '~/entities/case-study/model/types'

defineProps<{
  category: CaseCategory
}>()

const cardLayout: Record<CaseProject['layout'], string> = {
  feature: 'desktop:col-span-7',
  portrait: 'desktop:col-span-5',
  wide: 'desktop:col-span-12 desktop:grid desktop:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]',
}

const imageLayout: Record<CaseProject['layout'], string> = {
  feature: 'aspect-[16/11]',
  portrait: 'aspect-[4/3] desktop:aspect-[4/5]',
  wide: 'aspect-[16/10] desktop:aspect-[16/9]',
}
</script>

<template>
  <section aria-labelledby="case-list-title" class="grid gap-px bg-ink/15 desktop:grid-cols-12">
    <h2 id="case-list-title" class="sr-only">Проекты раздела {{ category.title }}</h2>

    <article
      v-for="(project, index) in category.projects"
      :key="project.title"
      class="group bg-page"
      :class="cardLayout[project.layout]"
    >
      <div class="relative overflow-hidden bg-ink" :class="imageLayout[project.layout]">
        <NuxtImg
          :src="project.image"
          :alt="project.imageAlt"
          class="size-full object-cover transition duration-700 ease-studio group-hover:scale-[1.025]"
          sizes="100vw desktop:60vw"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :preload="index === 0"
        />
        <div class="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(7,16,31,0.52))]" />
        <p class="absolute top-4 left-4 text-[0.625rem] font-bold tracking-[0.16em] text-white/70 uppercase sm:top-6 sm:left-6">
          {{ category.eyebrow.split(' / ')[0] }} · {{ String(index + 1).padStart(2, '0') }}
        </p>
      </div>

      <div class="flex min-h-36 flex-col justify-between gap-5 p-5 sm:p-7 desktop:min-h-44 desktop:p-8">
        <div>
          <p class="text-[0.625rem] font-bold tracking-[0.16em] text-accent uppercase">Studio 313 / Case</p>
          <h3 class="mt-2 max-w-2xl font-display text-2xl leading-[1.04] font-extrabold uppercase text-ink sm:text-3xl desktop:text-[clamp(2rem,3.3vw,3.75rem)]">
            {{ project.title }}
          </h3>
        </div>
        <p class="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {{ project.description }}
        </p>
      </div>
    </article>
  </section>
</template>
