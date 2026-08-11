<script setup lang="ts">
import { ArrowDown, ArrowUpRight, Check } from 'lucide-vue-next'
import type { FeaturedService } from '~/entities/service/model/types'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'

const props = defineProps<{
  service: FeaturedService
  index: number
  signalBars: readonly number[]
}>()

const sceneNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const headingTag = computed(() => props.index === 0 ? 'h1' : 'h2')
</script>

<template>
  <section
    :id="service.id"
    data-page-section
    class="relative isolate min-h-full overflow-hidden bg-ink"
  >
    <NuxtImg
      :src="service.image"
      :alt="service.imageAlt"
      class="absolute inset-0 -z-30 size-full object-cover transition-transform duration-[1200ms] ease-studio"
      :class="{
        'saturate-[.72] contrast-[1.08]': service.variant === 'production',
        'scale-[1.04] grayscale-[.25] saturate-[.7]': service.variant === 'distribution',
      }"
      sizes="100vw xl:80vw"
      :preload="index === 0"
      :loading="index === 0 ? 'eager' : 'lazy'"
    />
    <div
      class="absolute inset-0 -z-20 size-full"
      :class="{
        '[background:linear-gradient(90deg,rgba(4,12,25,.96)_0%,rgba(4,12,25,.84)_48%,rgba(4,12,25,.57)_100%),linear-gradient(180deg,rgba(7,16,31,.12),rgba(7,16,31,.76))]': service.variant === 'space',
        '[background:linear-gradient(112deg,rgba(0,36,90,.95)_0%,rgba(0,81,198,.76)_46%,rgba(4,14,31,.9)_100%),linear-gradient(180deg,transparent,rgba(7,16,31,.78))]': service.variant === 'production',
        '[background:radial-gradient(circle_at_80%_35%,rgba(0,105,254,.18),transparent_24rem),linear-gradient(105deg,rgba(5,14,29,.98)_4%,rgba(5,14,29,.89)_58%,rgba(5,14,29,.7))]': service.variant === 'distribution',
      }"
    />

    <div
      class="absolute right-[-4vw] bottom-[13%] -z-10 flex h-[17rem] w-[min(42vw,38rem)] skew-x-[-9deg] items-center gap-[clamp(.25rem,.7vw,.75rem)] opacity-[.13]"
      aria-hidden="true"
    >
      <i
        v-for="(height, barIndex) in signalBars"
        :key="barIndex"
        class="min-w-0.5 flex-1 bg-white"
        :class="{ 'bg-[#7eb4ff]': service.variant === 'production' }"
        :style="{ height: height + '%' }"
      />
    </div>

    <PageFullscreenContent
      class="service-fullscreen-content flex flex-col px-[clamp(1.5rem,5vw,5rem)] pt-[clamp(1.75rem,4vw,3.75rem)] max-[35rem]:px-5 max-[35rem]:pt-6"
    >
      <header class="flex items-center gap-[clamp(.75rem,2vw,2rem)] text-[.65rem] font-bold tracking-[.14em] text-white/48 uppercase">
        <span class="inline-flex items-center gap-2 text-white">
          <i class="size-2 rounded-full bg-accent shadow-[0_0_0_.25rem_rgba(0,105,254,.18)]" />
          REC
        </span>
        <span>{{ service.code }}</span>
        <span class="hidden desktop:inline">{{ service.camera }}</span>
        <span class="ml-auto">{{ sceneNumber }} / 03</span>
      </header>

      <div class="grid flex-1 content-end items-end gap-[clamp(2rem,4vw,4.5rem)] pt-[clamp(2.25rem,5vh,4.5rem)] desktop:grid-cols-2 desktop:content-start desktop:items-start max-[35rem]:gap-5 max-[35rem]:pt-5">
        <div>
          <p
            class="mb-3.5 text-[.68rem] font-extrabold tracking-[.16em] text-accent uppercase"
            :class="{ 'text-white': service.variant === 'production' }"
          >
            Большая услуга {{ sceneNumber }}
          </p>
          <component
            :is="headingTag"
            class="m-0 max-w-3xl font-display text-[clamp(2.8rem,12vw,5.25rem)] leading-[.82] font-extrabold tracking-[-.055em] text-white uppercase desktop:text-[clamp(3.15rem,7vw,7rem)]"
          >
            {{ service.title }}
            <em
              class="block not-italic text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.68)]"
              :class="{
                'text-white [-webkit-text-stroke:0]': service.variant === 'production',
                'text-accent [-webkit-text-stroke:0]': service.variant === 'distribution',
              }"
            >
              {{ service.titleAccent }}
            </em>
          </component>

          <p class="mt-[clamp(1.25rem,3vh,2rem)] max-w-lg text-[clamp(.95rem,1.6vw,1.15rem)] leading-[1.6] text-white/68 desktop:max-w-xl max-[35rem]:mt-3.5 max-[35rem]:line-clamp-2 max-[35rem]:text-xs max-[35rem]:leading-[1.45]">
            {{ service.description }}
          </p>

          <div class="mt-[clamp(1.25rem,3vh,2.25rem)] flex flex-wrap items-end gap-x-8 gap-y-5 max-[35rem]:mt-3.5 max-[35rem]:gap-x-4 max-[35rem]:gap-y-3">
            <div class="flex flex-col">
              <strong class="font-display text-[clamp(1.35rem,2.5vw,2.25rem)] leading-none font-extrabold text-white uppercase max-[35rem]:text-lg">
                {{ service.price }}
              </strong>
              <span class="mt-1.5 text-[.68rem] tracking-[.08em] text-white/40 uppercase max-[35rem]:text-[.56rem]">
                {{ service.priceUnit }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <NuxtLink
                :to="'/booking?service=' + encodeURIComponent(service.query)"
                class="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white bg-white px-5 font-display text-[.68rem] font-extrabold text-ink uppercase transition duration-200 ease-studio hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white max-[35rem]:min-h-10 max-[35rem]:px-3.5 max-[35rem]:text-[.58rem]"
              >
                {{ service.action }}
                <ArrowUpRight class="size-4" aria-hidden="true" />
              </NuxtLink>
              <a
                href="#service-pricing"
                class="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/28 bg-white/7 px-5 font-display text-[.68rem] font-extrabold text-white uppercase transition duration-200 ease-studio hover:-translate-y-0.5 hover:border-accent hover:bg-accent max-[35rem]:min-h-10 max-[35rem]:px-3.5 max-[35rem]:text-[.58rem]"
              >
                Прайс
                <ArrowDown class="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div class="w-full self-end border-y border-white/28 desktop:mt-10 desktop:max-w-2xl desktop:self-start">
          <div class="flex items-center justify-between border-b border-white/14 py-3 text-[.62rem] font-bold tracking-[.12em] text-white/42 uppercase max-[35rem]:py-2 max-[35rem]:text-[.56rem]">
            <span>Включено</span>
            <span>{{ String(service.features.length).padStart(2, '0') }} позиций</span>
          </div>
          <ol class="m-0 grid list-none grid-cols-2 p-0">
            <li
              v-for="(feature, featureIndex) in service.features"
              :key="feature"
              class="grid min-h-[clamp(2.65rem,5.6vh,3.65rem)] grid-cols-[1.3rem_minmax(0,1fr)_.9rem] items-center gap-2 border-b border-white/12 py-1.5 pr-3 odd:border-r even:pl-3 [&:nth-last-child(-n+2)]:border-b-0 max-[35rem]:min-h-9 max-[35rem]:grid-cols-[1rem_minmax(0,1fr)_.75rem] max-[35rem]:gap-1 max-[35rem]:pr-1.5 max-[35rem]:even:pl-1.5"
            >
              <span class="text-[.58rem] text-white/28 tabular-nums">
                {{ String(featureIndex + 1).padStart(2, '0') }}
              </span>
              <p class="m-0 text-[clamp(.68rem,1vw,.82rem)] leading-tight font-semibold text-white max-[35rem]:text-[.6rem]">
                {{ feature }}
              </p>
              <Check
                class="size-3.5 text-accent max-[35rem]:size-3"
                :class="{ 'text-white': service.variant === 'production' }"
                aria-hidden="true"
              />
            </li>
          </ol>
        </div>
      </div>
    </PageFullscreenContent>
  </section>
</template>

<style scoped>
.service-fullscreen-content {
  padding-bottom: calc(var(--page-content-safe-bottom, 2rem) + 0.2rem);
}

@media (max-width: 35rem) {
  .service-fullscreen-content {
    padding-bottom: calc(var(--page-content-safe-bottom, 2rem) + 0.5rem);
  }
}
</style>
