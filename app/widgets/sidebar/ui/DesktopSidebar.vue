<script setup lang="ts">
import { useSiteNavigation } from '~/features/navigation/model/useSiteNavigation'
import { bookingPage } from '~/shared/config/navigation'
import { siteContact, socialLinks } from '~/shared/config/site'
import AppIconButton from '~/shared/ui/AppIconButton.vue'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()

const { isActive, navigationItems } = useSiteNavigation()
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-white/20 bg-[image:var(--gradient-studio)] bg-[length:240%_240%] text-white shadow-panel transition-[width] duration-400 ease-studio desktop:flex motion-safe:animate-studio-flow"
    :class="collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'"
    aria-label="Навигация сайта"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_10%,rgba(255,255,255,0.13)_48%,transparent_70%)] opacity-70" />

    <div
      class="relative z-10 flex min-h-0 flex-1 flex-col px-4 py-5"
      :class="collapsed ? 'items-center' : ''"
    >
      <div
        class="flex w-full items-center gap-3"
        :class="collapsed ? 'flex-col' : 'justify-between'"
      >
        <NuxtLink
          to="/"
          class="flex min-h-14 items-center justify-center"
          aria-label="Studio 313, на главную"
        >
          <img
            v-if="!collapsed"
            src="/brand/logo-white.svg"
            alt="Studio 313"
            class="h-auto w-36"
          >
          <img
            v-else
            src="/icons/favicon.png"
            alt="Studio 313"
            class="size-13 object-contain"
          >
        </NuxtLink>

        <AppIconButton
          :icon="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
          :label="collapsed ? 'Развернуть меню' : 'Свернуть меню'"
          class="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-white transition hover:bg-white/15"
          @click="$emit('toggle')"
        />
      </div>

      <nav
        class="mt-7 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto py-1 [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin]"
        :class="collapsed ? 'w-full items-center' : 'w-full pr-1'"
      >
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          :aria-label="collapsed ? item.label : undefined"
          class="group relative flex min-h-12 items-center border border-transparent font-display text-sm font-extrabold uppercase text-white transition duration-200 ease-studio hover:border-white/25 hover:bg-white/15"
          :class="[
            collapsed ? 'size-13 justify-center rounded-md px-0' : 'w-full justify-between rounded-md px-4',
            isActive(item.to) ? 'border-white/30 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : '',
          ]"
        >
          <span class="flex min-w-0 items-center gap-3">
            <Icon
              :name="item.icon"
              class="size-5 shrink-0"
              aria-hidden="true"
            />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </span>
          <Icon
            v-if="!collapsed"
            name="lucide:chevron-right"
            class="size-4 shrink-0 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            v-if="collapsed"
            class="pointer-events-none absolute left-[calc(100%+0.75rem)] z-50 hidden whitespace-nowrap rounded-sm bg-ink px-3 py-2 font-body text-xs font-semibold normal-case text-white shadow-panel group-hover:block group-focus-visible:block"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <div v-if="!collapsed" class="mt-4 w-full border-t border-white/20 pt-4">
        <div class="grid gap-2 text-sm font-semibold text-white/90">
          <a :href="`mailto:${siteContact.email}`" class="flex items-center gap-2 transition hover:text-white">
            <Icon name="lucide:mail" class="size-4 shrink-0" aria-hidden="true" />
            <span class="truncate">{{ siteContact.email }}</span>
          </a>
          <a :href="siteContact.phoneHref" class="flex items-center gap-2 transition hover:text-white">
            <Icon name="lucide:phone" class="size-4 shrink-0" aria-hidden="true" />
            <span>{{ siteContact.phone }}</span>
          </a>
          <span class="flex items-start gap-2 text-white/75">
            <Icon name="lucide:map-pin" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{{ siteContact.address }}</span>
          </span>
        </div>

        <div class="mt-3 flex items-center gap-1" aria-label="Социальные сети">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            :title="social.label"
            class="grid size-10 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <Icon :name="social.icon" class="size-5" aria-hidden="true" />
          </a>
        </div>

        <NuxtLink
          :to="bookingPage.to"
          class="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-4 font-display text-sm font-extrabold uppercase text-ink shadow-accent transition duration-200 hover:-translate-y-0.5 hover:text-accent"
        >
          <Icon :name="bookingPage.icon" class="size-5" aria-hidden="true" />
          {{ bookingPage.label }}
        </NuxtLink>
      </div>

      <NuxtLink
        v-else
        :to="bookingPage.to"
        :aria-label="bookingPage.label"
        :title="bookingPage.label"
        class="mt-4 grid size-13 shrink-0 place-items-center rounded-full bg-white text-ink shadow-accent transition hover:-translate-y-0.5 hover:text-accent"
      >
        <Icon :name="bookingPage.icon" class="size-6" aria-hidden="true" />
      </NuxtLink>
    </div>
  </aside>
</template>
