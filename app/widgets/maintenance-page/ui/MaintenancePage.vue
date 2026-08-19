<script setup lang="ts">
import { Mail, MapPin, Phone } from 'lucide-vue-next'
import { createDefaultSiteContacts, type SiteContacts } from '~~/shared/types/contacts'

const { data: contacts } = await useFetch<SiteContacts>('/api/contacts', {
  key: 'site-contacts',
  default: createDefaultSiteContacts,
})
</script>

<template>
  <main class="min-h-screen bg-page text-copy">
    <div class="mx-auto grid min-h-screen w-full max-w-[90rem] items-stretch lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
      <section class="flex min-h-[42vh] items-center border-b border-ink/10 bg-white px-6 py-14 sm:px-10 lg:min-h-screen lg:border-r lg:border-b-0 lg:px-[clamp(3rem,7vw,8rem)]">
        <img
          src="/brand/logo-black.svg"
          alt="Студия 313"
          class="h-auto w-full max-w-[28rem]"
        >
      </section>

      <section class="flex items-center bg-[#eaf4ff] px-6 py-12 sm:px-10 lg:px-[clamp(3rem,6vw,6rem)]">
        <address class="grid w-full max-w-xl gap-3 not-italic">
          <a
            :href="`tel:${contacts.phoneHref}`"
            class="group flex min-h-24 items-center gap-5 border border-ink/10 bg-white px-5 py-4 text-ink shadow-[0_1rem_3rem_rgb(7_16_31/0.05)] transition hover:border-accent sm:px-6"
          >
            <span class="grid size-11 shrink-0 place-items-center bg-accent text-white">
              <Phone class="size-5" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <span class="block text-xs font-bold tracking-[0.1em] text-muted uppercase">Телефон</span>
              <span class="mt-1 block break-words font-display text-xl font-extrabold text-ink sm:text-2xl">{{ contacts.phone }}</span>
            </span>
          </a>

          <a
            :href="`mailto:${contacts.email}`"
            class="group flex min-h-24 items-center gap-5 border border-ink/10 bg-white px-5 py-4 text-ink shadow-[0_1rem_3rem_rgb(7_16_31/0.05)] transition hover:border-accent sm:px-6"
          >
            <span class="grid size-11 shrink-0 place-items-center bg-accent text-white">
              <Mail class="size-5" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <span class="block text-xs font-bold tracking-[0.1em] text-muted uppercase">Почта</span>
              <span class="mt-1 block break-all font-display text-xl font-extrabold text-ink sm:text-2xl">{{ contacts.email }}</span>
            </span>
          </a>

          <div class="flex min-h-24 items-center gap-5 border border-ink/10 bg-white px-5 py-4 text-ink shadow-[0_1rem_3rem_rgb(7_16_31/0.05)] sm:px-6">
            <span class="grid size-11 shrink-0 place-items-center bg-accent text-white">
              <MapPin class="size-5" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <span class="block text-xs font-bold tracking-[0.1em] text-muted uppercase">Адрес</span>
              <span class="mt-1 block font-display text-xl leading-tight font-extrabold text-ink sm:text-2xl">{{ contacts.address }}</span>
            </span>
          </div>
        </address>
      </section>
    </div>
  </main>
</template>
