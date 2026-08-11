<script setup lang="ts">
import { ArrowUpRight, MapPin } from 'lucide-vue-next'

const props = defineProps<{
  address: string
}>()

const encodedAddress = computed(() => encodeURIComponent(props.address))
const mapEmbedUrl = computed(() => `https://yandex.ru/map-widget/v1/?mode=search&text=${encodedAddress.value}&z=16`)
const mapPageUrl = computed(() => `https://yandex.ru/maps/?text=${encodedAddress.value}`)
</script>

<template>
  <section
    id="map"
    data-page-section
    class="yandex-studio-map grid min-h-full bg-ink pb-[var(--page-content-safe-bottom,3.75rem)] text-white desktop:grid-cols-[minmax(17rem,0.38fr)_minmax(0,1fr)]"
  >
    <div class="relative flex flex-col justify-between overflow-hidden border-b border-white/15 px-6 py-9 sm:px-10 desktop:border-r desktop:border-b-0 desktop:px-page desktop:py-14">
      <div class="pointer-events-none absolute -top-20 -left-28 size-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <div class="relative">
        <p class="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <span class="size-2 rounded-full bg-accent shadow-[0_0_1rem_rgba(0,105,254,.9)]" aria-hidden="true" />
          Studio 313 · Краснодар
        </p>
        <h2 class="mt-4 max-w-md font-display text-4xl leading-[0.95] font-extrabold uppercase sm:text-5xl desktop:text-6xl">
          Найти студию
        </h2>
      </div>

      <div class="relative mt-8 border-t border-white/15 pt-5 desktop:mt-12">
        <div class="flex items-start gap-3">
          <MapPin class="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <p class="max-w-sm text-base leading-relaxed text-white/80 sm:text-lg">
            {{ address }}
          </p>
        </div>
        <a
          :href="mapPageUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-white/35 font-display text-xs font-extrabold uppercase transition hover:border-accent hover:text-accent"
        >
          Открыть в Яндекс Картах
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>

    <div class="relative min-h-[22rem] bg-page desktop:min-h-0">
      <iframe
        :src="mapEmbedUrl"
        title="Studio 313 на Яндекс Картах"
        class="absolute inset-0 size-full border-0"
        loading="lazy"
        allowfullscreen
      />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink/20 to-transparent" aria-hidden="true" />
      <p class="pointer-events-none absolute top-5 right-5 bg-ink/85 px-3 py-2 text-[0.625rem] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
        Яндекс Карты
      </p>
    </div>
  </section>
</template>
