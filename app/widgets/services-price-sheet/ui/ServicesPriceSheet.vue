<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { ServicePriceGroup } from '~/entities/service/model/types'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import ServicePriceGroupView from './ServicePriceGroup.vue'

const props = defineProps<{
  groups: readonly ServicePriceGroup[]
}>()

const itemCount = computed(() => props.groups.reduce((total, group) => total + group.items.length, 0))
</script>

<template>
  <PageLongScreen as="section">
    <div id="service-pricing" class="min-h-[inherit] bg-page text-copy">
      <header class="[background:radial-gradient(circle_at_82%_20%,rgba(0,105,254,.24),transparent_24rem),#07101f] text-white">
        <div class="mx-auto w-[min(calc(100%-3rem),78rem)] sm:w-[min(calc(100%-5rem),78rem)] max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
          <div class="flex items-center justify-between pt-[clamp(2.5rem,5vw,4rem)] text-[.66rem] font-bold tracking-[.13em] text-white/42 uppercase">
            <span class="inline-flex items-center gap-2.5 text-white">
              <i class="size-2 rounded-full bg-accent shadow-[0_0_0_.25rem_rgba(0,105,254,.18)]" />
              Rate sheet / 2026
            </span>
            <span class="max-[35rem]:hidden">Studio 313 · Краснодар</span>
          </div>
          <div class="grid items-end gap-[clamp(2.5rem,7vw,7rem)] py-[clamp(5rem,11vw,9rem)] pb-[clamp(4rem,8vw,7rem)] sm:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.6fr)]">
            <h2 class="m-0 font-display text-[clamp(3.7rem,9vw,8.5rem)] leading-[.82] font-extrabold tracking-[-.055em] uppercase">
              Маленькие<br><em class="not-italic text-accent">услуги</em>
            </h2>
            <div class="max-w-md border-t border-white/18 pt-5">
              <p class="m-0 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.65] text-white/64">
                Соберите свой продакшн как монтажную линию: возьмите только те этапы, которые нужны именно сейчас.
              </p>
              <span class="mt-6 block text-[.7rem] font-extrabold tracking-[.12em] text-accent uppercase">
                {{ itemCount }} позиций в прайсе
              </span>
            </div>
          </div>
        </div>
      </header>

      <div class="mx-auto grid w-[min(calc(100%-3rem),78rem)] items-start gap-[clamp(3rem,7vw,7rem)] py-[clamp(4rem,9vw,8rem)] sm:w-[min(calc(100%-5rem),78rem)] desktop:grid-cols-[12rem_minmax(0,1fr)] max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
        <aside class="sticky top-8 hidden flex-col border-t border-ink/18 desktop:flex" aria-label="Разделы прайса">
          <p class="m-0 border-b border-ink/18 py-4 text-[.62rem] font-bold tracking-[.1em] text-ink/38 uppercase">
            Навигация по прайсу
          </p>
          <a
            v-for="group in groups"
            :key="group.id"
            :href="'#price-' + group.id"
            class="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 border-b border-ink/18 py-3.5 font-display text-[.68rem] leading-tight font-extrabold text-ink uppercase no-underline transition-colors duration-200 hover:text-accent"
          >
            <span class="font-body text-[.6rem] text-ink/32">{{ group.number }}</span>
            {{ group.title }}
          </a>
        </aside>

        <div class="min-w-0">
          <ServicePriceGroupView
            v-for="(group, groupIndex) in groups"
            :key="group.id"
            :group="group"
            :class="{ 'mt-[clamp(5rem,10vw,8rem)]': groupIndex > 0 }"
          />
        </div>
      </div>

      <footer class="bg-accent pt-[clamp(4rem,9vw,8rem)] pb-[5.75rem] text-white">
        <div class="mx-auto flex w-[min(calc(100%-3rem),78rem)] flex-col gap-10 sm:w-[min(calc(100%-5rem),78rem)] sm:flex-row sm:items-end sm:justify-between max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
          <div>
            <p class="mb-3 text-[.72rem] font-extrabold tracking-[.14em] text-white/70 uppercase">
              Не нашли точную комбинацию?
            </p>
            <h2 class="m-0 font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[.9] font-extrabold tracking-[-.045em] uppercase">
              Соберём смету<br>под вашу запись.
            </h2>
          </div>
          <NuxtLink
            to="/booking?service=Индивидуальный%20расчёт"
            class="inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-full bg-white px-6 font-display text-xs font-extrabold text-ink uppercase no-underline transition-transform duration-200 hover:-translate-y-0.5"
          >
            Рассчитать проект
            <ArrowRight class="size-4.5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="mx-auto mt-[clamp(4rem,8vw,7rem)] flex w-[min(calc(100%-3rem),78rem)] flex-col gap-2 border-t border-white/32 pt-5 text-[.68rem] leading-normal text-white/62 sm:w-[min(calc(100%-5rem),78rem)] sm:flex-row sm:justify-between max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
          <span>Все цены указаны в рублях.</span>
          <span>Финальная стоимость зависит от хронометража, состава команды и сроков.</span>
        </div>
      </footer>
    </div>
  </PageLongScreen>
</template>
