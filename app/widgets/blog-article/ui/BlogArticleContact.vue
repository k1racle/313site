<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { useSiteSocials } from '~/features/socials/model/useSiteSocials'
import SocialBrandIcon from '~/shared/ui/SocialBrandIcon.vue'

const { socialLinks } = useSiteSocials()
</script>

<template>
  <aside class="bg-accent px-6 py-[clamp(2rem,5vw,3.5rem)] text-white sm:px-10 desktop:px-page" aria-labelledby="blog-contact-title">
    <div class="mx-auto grid max-w-[78rem] gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <img src="/brand/logo-white.svg" alt="Studio 313" class="h-auto w-24 sm:w-28">
        <h2 id="blog-contact-title" class="mt-7 max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] font-extrabold uppercase">
          Обсудим ваш проект
        </h2>
        <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
          Расскажите, что хотите снять или записать — предложим подходящий формат.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 md:justify-end">
        <nav v-if="socialLinks.length" class="flex items-center gap-2" aria-label="Социальные сети Studio 313">
          <a
            v-for="social in socialLinks"
            :key="social.id"
            :href="social.href"
            :target="social.href === '#' ? undefined : '_blank'"
            :rel="social.href === '#' ? undefined : 'noopener noreferrer'"
            class="grid size-11 place-items-center border border-white/30 text-white transition hover:border-white hover:bg-white hover:text-accent"
            :aria-label="social.label"
          >
            <SocialBrandIcon :name="social.icon" class="size-5" aria-hidden="true" />
          </a>
        </nav>

        <NuxtLink
          to="/contacts"
          class="flex min-h-11 cursor-pointer items-center gap-3 border border-white bg-white px-5 font-display text-xs font-extrabold text-ink uppercase transition hover:border-ink hover:bg-ink hover:text-white"
        >
          Контакты
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
