<script setup lang="ts">
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { contactItems } from '~/config/contacts'
import { bookingPage } from '~/config/navigation'
import { useSiteNavigation } from '~/features/navigation/model/useSiteNavigation'
import { useSiteSocials } from '~/features/socials/model/useSiteSocials'
import ThemeToggle from '~/features/theme/ui/ThemeToggle.vue'
import AppButton from '~/shared/ui/AppButton.vue'
import AppIconButton from '~/shared/ui/AppIconButton.vue'
import SocialBrandIcon from '~/shared/ui/SocialBrandIcon.vue'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()

const { isActive, navigationItems } = useSiteNavigation()
const { socialLinks } = useSiteSocials()
</script>

<template>
  <aside
    class="group/sidebar fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-accent-700 bg-accent text-white shadow-panel transition-[width] duration-400 ease-studio desktop:flex"
    :class="collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'"
    aria-label="Навигация сайта"
  >
    <div
      class="relative z-10 flex min-h-0 flex-1 flex-col px-4 py-5"
      :class="collapsed ? 'items-center' : ''"
    >
      <div
        class="flex w-full items-center gap-3"
        :class="collapsed ? 'flex-col' : 'justify-between'"
      >
        <div class="group relative flex min-h-14 items-center justify-center">
          <NuxtLink
            to="/"
            class="flex min-h-14 items-center justify-center transition"
            :class="collapsed ? 'group-hover/sidebar:opacity-20' : ''"
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

          <button
            v-if="collapsed"
            type="button"
            class="pointer-events-none absolute inset-0 z-10 grid cursor-pointer place-items-center bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover/sidebar:pointer-events-auto group-hover/sidebar:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
            aria-label="Развернуть меню"
            title="Развернуть меню"
            @click="$emit('toggle')"
          >
            <PanelLeftOpen class="size-7" aria-hidden="true" />
          </button>
        </div>

        <AppIconButton
          v-if="!collapsed"
          :icon="PanelLeftClose"
          label="Свернуть меню"
          class="grid size-11 shrink-0 cursor-pointer place-items-center text-white transition hover:bg-white/15"
          @click="$emit('toggle')"
        />
      </div>

      <nav
        class="mt-7 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            collapsed ? 'size-13 justify-center px-0' : 'w-full justify-between px-4',
            isActive(item.to) ? 'border-white/30 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : '',
          ]"
        >
          <span class="flex min-w-0 items-center gap-3">
            <component
              :is="item.icon"
              class="size-5 shrink-0"
              aria-hidden="true"
            />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </span>
          <ChevronRight
            v-if="!collapsed"
            class="size-4 shrink-0 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            v-if="collapsed"
            class="pointer-events-none absolute left-[calc(100%+0.75rem)] z-50 hidden whitespace-nowrap bg-ink px-3 py-2 font-body text-xs font-semibold normal-case text-white shadow-panel group-hover:block group-focus-visible:block"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <div v-if="!collapsed" class="mt-4 w-full border-t border-white/20 pt-4">
        <div class="grid gap-2 text-sm font-semibold text-white/90">
          <component
            :is="contact.href ? 'a' : 'span'"
            v-for="contact in contactItems"
            :key="contact.label"
            :href="contact.href"
            :aria-label="contact.label"
            class="flex items-start gap-2 transition hover:text-white"
            :class="contact.href ? '' : 'text-white/75'"
          >
            <component :is="contact.icon" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span class="min-w-0 truncate">{{ contact.value }}</span>
          </component>
        </div>

        <div class="mt-3 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1" aria-label="Социальные сети">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              :target="social.href === '#' ? undefined : '_blank'"
              :rel="social.href === '#' ? undefined : 'noopener noreferrer'"
              :aria-label="social.label"
              :title="social.label"
              class="grid size-10 place-items-center text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <SocialBrandIcon :name="social.icon" class="size-5" aria-hidden="true" />
            </a>
          </div>
          <ThemeToggle />
        </div>

        <AppButton
          behaviour="link"
          variant="secondary"
          :to="bookingPage.to"
          class="mt-3 w-full px-4"
        >
          <component :is="bookingPage.icon" class="size-5" aria-hidden="true" />
          {{ bookingPage.label }}
        </AppButton>
      </div>

      <template v-else>
        <ThemeToggle class="mt-4" />
        <NuxtLink
          :to="bookingPage.to"
          :aria-label="bookingPage.label"
          :title="bookingPage.label"
          class="mt-2 grid size-13 shrink-0 place-items-center bg-panel text-ink shadow-accent transition hover:-translate-y-0.5 hover:text-accent"
        >
          <component :is="bookingPage.icon" class="size-6" aria-hidden="true" />
        </NuxtLink>
      </template>
    </div>
  </aside>
</template>
