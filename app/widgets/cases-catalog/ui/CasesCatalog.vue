<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { CaseCategory } from '~/entities/case-study/model/types'

defineProps<{
  categories: readonly CaseCategory[]
}>()

const cardLayout: Record<CaseCategory['id'], string> = {
  video: 'desktop:col-span-5',
  gallery: 'desktop:col-span-3',
  podcasts: 'desktop:col-span-4',
}
</script>

<template>
  <nav
    aria-label="Разделы кейсов"
    class="grid min-h-0 gap-2 sm:grid-cols-3 desktop:grid-cols-12 desktop:gap-3"
  >
    <NuxtLink
      v-for="(category, index) in categories"
      :key="category.id"
      :to="`/cases/${category.id}`"
      class="group relative min-h-28 overflow-hidden border border-white/15 bg-white/5 text-white sm:min-h-48 desktop:min-h-[clamp(14rem,34vh,21rem)]"
      :class="cardLayout[category.id]"
    >
      <NuxtImg
        :src="category.image"
        :alt="category.imageAlt"
        class="absolute inset-0 size-full object-cover transition duration-700 ease-studio group-hover:scale-[1.035]"
        :class="category.id === 'gallery' ? 'object-[58%_center]' : 'object-center'"
        sizes="100vw sm:33vw xl:28vw"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :preload="index === 0"
      />
      <span class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,31,0.04)_10%,rgba(7,16,31,0.94)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(7,16,31,0.02)_10%,rgba(7,16,31,0.84)_100%)]" />

      <span class="absolute top-3 left-3 text-[0.625rem] font-bold tracking-[0.16em] text-white/60 uppercase sm:top-5 sm:left-5">
        {{ String(index + 1).padStart(2, '0') }} / 03
      </span>
      <span class="absolute top-3 right-3 grid size-8 place-items-center rounded-full border border-white/25 bg-ink/20 backdrop-blur-sm transition duration-300 group-hover:border-accent group-hover:bg-accent sm:top-5 sm:right-5 sm:size-10">
        <ArrowUpRight class="size-4" aria-hidden="true" />
      </span>

      <span class="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
        <span class="hidden text-[0.625rem] font-bold tracking-[0.14em] text-white/55 uppercase sm:block">
          {{ category.eyebrow }}
        </span>
        <span class="mt-1 block font-display text-xl leading-none font-extrabold uppercase sm:text-2xl desktop:text-[clamp(1.6rem,2.5vw,2.75rem)]">
          {{ category.title }}
        </span>
        <span class="mt-2 hidden max-w-sm text-xs leading-relaxed text-white/65 desktop:block">
          {{ category.description }}
        </span>
      </span>
    </NuxtLink>
  </nav>
</template>
