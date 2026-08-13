<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { contactDetails, contactItems } from '~/config/contacts'
import { useSiteSocials } from '~/features/socials/model/useSiteSocials'
import AppHeading from '~/shared/ui/AppHeading.vue'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import PageFullscreenContent from '~/shared/ui/PageFullscreenContent.vue'
import SocialBrandIcon from '~/shared/ui/SocialBrandIcon.vue'
import YandexStudioMap from '~/widgets/contacts-showcase/ui/YandexStudioMap.vue'

defineEmits<{
  activeChange: [index: number]
}>()

const { socialLinks } = useSiteSocials()
</script>

<template>
  <PageFullscreen
    label="Разделы страницы контактов"
    @active-change="$emit('activeChange', $event)"
  >
    <section
      id="contacts"
      data-page-section
      class="grid min-h-full bg-page text-ink desktop:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]"
    >
      <div class="flex min-h-0 flex-col justify-between px-6 pt-9 sm:px-10 desktop:px-page desktop:pt-14">
        <PageFullscreenContent>
          <div>
            <AppHeading as="h1" size="page" :accent="true" class="max-w-3xl">
              Контакты
            </AppHeading>
          </div>

          <address class="mt-8 grid not-italic sm:mt-10 desktop:mt-12">
            <component
              :is="contact.href ? 'a' : 'div'"
              v-for="(contact, index) in contactItems"
              :key="contact.label"
              :href="contact.href"
              class="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-ink/15 py-4 transition-colors last:border-b hover:border-accent sm:grid-cols-[3rem_minmax(0,1fr)] desktop:py-5"
            >
              <span class="pt-1 font-body text-[0.625rem] font-bold text-ink/35">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="min-w-0">
                <span class="block text-[0.625rem] font-bold tracking-[0.14em] text-ink/45 uppercase">{{ contact.label }}</span>
                <span class="mt-1 flex items-start justify-between gap-4 font-display text-[clamp(1.15rem,3vw,2.25rem)] leading-tight font-extrabold uppercase transition-colors group-hover:text-accent">
                  <span>{{ contact.value }}</span>
                  <ArrowUpRight v-if="contact.href" class="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                </span>
              </span>
            </component>
          </address>
        </PageFullscreenContent>
      </div>

      <div class="relative flex min-h-0 flex-col justify-between overflow-hidden bg-[#eaf4ff] px-6 pt-8 text-ink sm:px-10 desktop:px-page desktop:pt-14">
        <div class="pointer-events-none absolute -right-24 -bottom-28 font-display text-[18rem] leading-none font-extrabold text-accent/[0.06]" aria-hidden="true">
          313
        </div>

        <PageFullscreenContent class="relative flex min-h-full flex-col">
          <div class="flex items-start justify-between gap-5">
            <div>
              <AppHeading as="h2" size="section" :accent="true">
                Мы в сети
              </AppHeading>
            </div>
            <span class="font-body text-[0.625rem] font-bold tracking-[0.12em] text-muted uppercase">Online</span>
          </div>

          <nav class="mt-7 grid flex-1 content-center" aria-label="Социальные сети Studio 313">
            <a
              v-for="(social, index) in socialLinks"
              :key="social.label"
              :href="social.href"
              :target="social.href === '#' ? undefined : '_blank'"
              :rel="social.href === '#' ? undefined : 'noopener noreferrer'"
              class="group grid grid-cols-[2.5rem_2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-ink/15 py-3.5 text-ink transition hover:border-accent last:border-b desktop:py-5"
            >
              <span class="text-[0.625rem] font-bold text-muted">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="grid size-10 place-items-center border border-ink/20 transition group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <SocialBrandIcon :name="social.icon" class="size-5" aria-hidden="true" />
              </span>
              <span class="font-display text-xl font-extrabold uppercase sm:text-2xl">{{ social.label }}</span>
              <ArrowUpRight class="size-5 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" aria-hidden="true" />
            </a>
          </nav>

          <p class="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Новости студии, новые выпуски и рабочие моменты со съёмок.
          </p>
        </PageFullscreenContent>
      </div>
    </section>

    <YandexStudioMap :address="contactDetails.address.value" />
  </PageFullscreen>
</template>
