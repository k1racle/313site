<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
import { contactDetails } from '~/config/contacts'
import ThemeToggle from '~/features/theme/ui/ThemeToggle.vue'

defineProps<{
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()

const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')

defineExpose({
  focusMenuButton: () => menuButton.value?.focus(),
})
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-50 flex min-h-[var(--mobile-dock-height)] items-start overflow-hidden border-t border-accent-700 bg-accent px-4 pt-3 text-white shadow-[0_-18px_50px_rgba(7,16,31,0.12)] desktop:hidden"
    aria-label="Мобильная навигация"
  >
    <div class="relative z-10 flex w-full items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex min-h-12 min-w-0 items-center"
        aria-label="Studio 313, на главную"
      >
        <img src="/brand/logo-white.svg" alt="Studio 313" class="h-auto w-28 max-w-[38vw] sm:w-36 sm:max-w-[52vw]">
      </NuxtLink>

      <div class="flex shrink-0 items-center gap-1">
        <ThemeToggle class="size-12 border-0" />
        <a
          :href="contactDetails.phone.href"
          class="grid size-12 place-items-center text-white transition hover:bg-white/15"
          aria-label="Позвонить в Studio 313"
          title="Позвонить"
        >
          <component :is="contactDetails.phone.icon" class="size-6" aria-hidden="true" />
        </a>
        <button
          ref="menuButton"
          type="button"
          class="grid size-12 cursor-pointer place-items-center text-white transition hover:bg-white/15"
          :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
          :title="open ? 'Закрыть меню' : 'Открыть меню'"
          :aria-expanded="open"
          aria-controls="mobile-site-menu"
          @click="$emit('toggle')"
        >
          <component :is="open ? X : Menu" class="size-7" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
