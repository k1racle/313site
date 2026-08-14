<script setup lang="ts">
import { ArrowDown, ArrowUpRight, Check } from 'lucide-vue-next'
import type { FeaturedService } from '~/entities/service/model/types'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import { getDisplayNameSize, protectPrepositions } from '~/shared/lib/display-name'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'

const props = defineProps<{
  service: FeaturedService
  index: number
  signalBars: readonly number[]
}>()

const headingTag = computed<'h1' | 'h2'>(() => props.index === 0 ? 'h1' : 'h2')
const displayTitle = computed(() => protectPrepositions(props.service.title))
const titleSizeClass = computed(() => ({
  xl: 'text-[clamp(2.7rem,5vw,6rem)]',
  lg: 'text-[clamp(2.5rem,4.2vw,5rem)]',
  md: 'text-[clamp(2.25rem,3.7vw,4.3rem)]',
  sm: 'text-[clamp(2rem,3.2vw,3.7rem)]',
}[getDisplayNameSize(props.service.title)]))
</script>

<template>
  <section
    :id="service.id"
    data-page-section
    class="relative isolate min-h-full overflow-hidden bg-page text-ink"
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
    <div class="absolute inset-0 -z-20 size-full bg-[linear-gradient(90deg,rgba(255,255,255,.98)_0%,rgba(245,250,255,.94)_50%,rgba(234,244,255,.72)_100%)] dark:bg-[linear-gradient(90deg,rgba(11,22,39,.98)_0%,rgba(11,22,39,.94)_50%,rgba(19,35,58,.8)_100%)]" />

    <div
      class="absolute right-[-4vw] bottom-[13%] -z-10 flex h-[17rem] w-[min(42vw,38rem)] skew-x-[-9deg] items-center gap-[clamp(.25rem,.7vw,.75rem)] opacity-[.13]"
      aria-hidden="true"
    >
      <i
        v-for="(height, barIndex) in signalBars"
        :key="barIndex"
        class="min-w-0.5 flex-1 bg-accent"
        :style="{ height: height + '%' }"
      />
    </div>

    <PageFullscreenContent
      class="service-fullscreen-content flex flex-col px-[clamp(1.5rem,5vw,5rem)] pt-[clamp(1.75rem,4vw,3.75rem)] max-[35rem]:px-5 max-[35rem]:pt-6"
    >
      <div class="grid flex-1 content-end items-end gap-[clamp(2rem,4vw,4.5rem)] desktop:grid-cols-[minmax(0,0.85fr)_minmax(24rem,1.15fr)] desktop:content-start desktop:items-start max-[35rem]:gap-5">
        <div class="min-w-0">
          <AppHeading
            :as="headingTag"
            size="inherit"
            :accent="true"
            class="m-0 max-w-full leading-[0.88] tracking-[-0.045em] whitespace-pre-line"
            :class="titleSizeClass"
          >
            {{ displayTitle }}
          </AppHeading>

          <p class="mt-[clamp(1.25rem,3vh,2rem)] max-w-lg text-[clamp(.95rem,1.6vw,1.15rem)] leading-[1.6] text-muted desktop:max-w-xl max-[35rem]:mt-3.5 max-[35rem]:line-clamp-2 max-[35rem]:text-xs max-[35rem]:leading-[1.45]">
            {{ service.subtitle }}
          </p>

          <div class="mt-[clamp(1.25rem,3vh,2.25rem)] flex flex-wrap items-end gap-x-8 gap-y-5 max-[35rem]:mt-3.5 max-[35rem]:gap-x-4 max-[35rem]:gap-y-3">
            <div class="flex flex-col">
              <strong class="font-display text-[clamp(1.35rem,2.5vw,2.25rem)] leading-none font-extrabold text-accent uppercase max-[35rem]:text-lg">
                {{ service.price }}
              </strong>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <AppButton
                behaviour="link"
                :to="'/booking?service=' + encodeURIComponent(service.title.replace(/\s+/g, ' ').trim())"
                class="max-[35rem]:min-h-10 max-[35rem]:px-3.5 max-[35rem]:text-[.58rem]"
              >
                {{ service.actionLabel }}
                <ArrowUpRight class="size-4" aria-hidden="true" />
              </AppButton>
              <AppButton
                behaviour="link"
                variant="ghost"
                to="#service-pricing"
                class="max-[35rem]:min-h-10 max-[35rem]:px-3.5 max-[35rem]:text-[.58rem]"
              >
                Прайс
                <ArrowDown class="size-4" aria-hidden="true" />
              </AppButton>
            </div>
          </div>
        </div>

        <div class="w-full self-end border-y border-ink/20 desktop:mt-10 desktop:max-w-2xl desktop:self-start">
          <div class="flex items-center justify-between border-b border-ink/10 py-3 text-[.62rem] font-bold tracking-[.12em] text-muted uppercase max-[35rem]:py-2 max-[35rem]:text-[.56rem]">
            <span>Включено</span>
            <span>{{ String(service.features.length).padStart(2, '0') }} позиций</span>
          </div>
          <ol class="m-0 grid list-none grid-cols-2 p-0">
            <li
              v-for="(feature, featureIndex) in service.features"
              :key="feature"
              class="grid min-h-[clamp(2.65rem,5.6vh,3.65rem)] grid-cols-[1.3rem_minmax(0,1fr)_.9rem] items-center gap-2 border-b border-ink/10 py-1.5 pr-3 odd:border-r even:pl-3 [&:nth-last-child(-n+2)]:border-b-0 max-[35rem]:min-h-9 max-[35rem]:grid-cols-[1rem_minmax(0,1fr)_.75rem] max-[35rem]:gap-1 max-[35rem]:pr-1.5 max-[35rem]:even:pl-1.5"
            >
              <span class="text-[.58rem] text-ink/30 tabular-nums">
                {{ String(featureIndex + 1).padStart(2, '0') }}
              </span>
              <p class="m-0 text-[clamp(.68rem,1vw,.82rem)] leading-tight font-semibold text-ink max-[35rem]:text-[.6rem]">
                {{ feature }}
              </p>
              <Check
                class="size-3.5 text-accent max-[35rem]:size-3"
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
