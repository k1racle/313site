<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
import { contactDetails } from '~/config/contacts'

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
    class="fixed inset-x-0 bottom-0 z-50 flex min-h-[var(--mobile-dock-height)] items-start overflow-hidden border-t border-white/20 bg-[image:var(--gradient-studio)] bg-[length:240%_240%] px-4 pt-3 text-white shadow-[0_-18px_50px_rgba(7,16,31,0.18)] desktop:hidden motion-safe:animate-studio-flow"
    aria-label="Мобильная навигация"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_10%,rgba(255,255,255,0.14)_50%,transparent_80%)]" />
    <div class="relative z-10 flex w-full items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex min-h-12 min-w-0 items-center"
        aria-label="Studio 313, на главную"
      >
        <img src="/brand/logo-white.svg" alt="Studio 313" class="h-auto w-36 max-w-[52vw]">
      </NuxtLink>

      <div class="flex shrink-0 items-center gap-1">
        <a
          :href="contactDetails.phone.href"
          class="grid size-12 place-items-center rounded-full text-white transition hover:bg-white/15"
          aria-label="Позвонить в Studio 313"
          title="Позвонить"
        >
          <component :is="contactDetails.phone.icon" class="size-6" aria-hidden="true" />
        </a>
        <button
          ref="menuButton"
          type="button"
          class="grid size-12 cursor-pointer place-items-center rounded-full text-white transition hover:bg-white/15"
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
