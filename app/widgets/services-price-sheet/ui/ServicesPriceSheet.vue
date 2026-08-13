<script setup lang="ts">
import type { PriceList } from '~/entities/service/model/types'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'
import SiteCallToAction from '~/shared/ui/SiteCallToAction.vue'
import ServicePriceGroupView from './ServicePriceGroup.vue'

defineProps<{
  priceList: PriceList
}>()

</script>

<template>
  <PageLongScreen as="section">
    <div id="service-pricing" class="min-h-[inherit] bg-page text-copy">
      <header class="bg-[#eaf4ff] text-ink">
        <div class="mx-auto w-[min(calc(100%-3rem),78rem)] sm:w-[min(calc(100%-5rem),78rem)] max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
          <div class="grid items-end gap-[clamp(2.5rem,7vw,7rem)] py-[clamp(5rem,11vw,9rem)] pb-[clamp(4rem,8vw,7rem)] sm:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.6fr)]">
            <AppHeading as="h2" size="hero" :accent="true" class="m-0 whitespace-pre-line">{{ priceList.title }}</AppHeading>
            <div class="max-w-md border-t border-ink/15 pt-5">
              <p class="m-0 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.65] text-muted">
                {{ priceList.subtitle }}
              </p>
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
            v-for="(section, sectionIndex) in priceList.sections"
            :key="section.id"
            :href="'#price-' + section.id"
            class="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 border-b border-ink/18 py-3.5 font-display text-[.68rem] leading-tight font-extrabold text-ink uppercase no-underline transition-colors duration-200 hover:text-accent"
          >
            <span class="font-body text-[.6rem] text-ink/32">{{ String(sectionIndex + 1).padStart(2, '0') }}</span>
            {{ section.title }}
          </a>
        </aside>

        <div class="min-w-0">
          <ServicePriceGroupView
            v-for="(section, sectionIndex) in priceList.sections"
            :key="section.id"
            :section="section"
            :number="String(sectionIndex + 1).padStart(2, '0')"
            :class="{ 'mt-[clamp(5rem,10vw,8rem)]': sectionIndex > 0 }"
          />
        </div>
      </div>

      <footer class="bg-[#eaf4ff] pb-[5.75rem] text-ink">
        <SiteCallToAction
          :title="'Расскажите, что\nхотите записать.'"
          button-label="Связаться с нами"
          to="/contacts"
        />
        <div class="mx-auto flex w-[min(calc(100%-3rem),78rem)] flex-col gap-2 border-t border-ink/15 pt-5 text-[.68rem] leading-normal text-muted sm:w-[min(calc(100%-5rem),78rem)] sm:flex-row sm:justify-between max-[35rem]:w-[min(calc(100%-2rem),78rem)]">
          <span>Все цены указаны в рублях.</span>
          <span>Финальная стоимость зависит от хронометража, состава команды и сроков.</span>
        </div>
      </footer>
    </div>
  </PageLongScreen>
</template>
