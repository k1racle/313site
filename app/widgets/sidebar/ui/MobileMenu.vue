<script setup lang="ts">
import { contactItems, socialLinks } from '~/config/contacts'
import { bookingPage } from '~/config/navigation'
import { useSiteNavigation } from '~/features/navigation/model/useSiteNavigation'
import SocialBrandIcon from '~/shared/ui/SocialBrandIcon.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { isActive, navigationItems } = useSiteNavigation()
const menuRoot = useTemplateRef<HTMLElement>('menuRoot')

function focusableElements() {
  if (!menuRoot.value) return []
  return [...menuRoot.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (event.key !== 'Tab') return
  const elements = focusableElements()
  const first = elements[0]
  const last = elements.at(-1)
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  focusableElements()[0]?.focus()
})
</script>

<template>
  <section
    id="mobile-site-menu"
    ref="menuRoot"
    class="fixed inset-0 z-40 overflow-y-auto bg-[image:var(--gradient-studio)] bg-[length:240%_240%] px-5 pb-[calc(var(--mobile-dock-height)+1.5rem)] pt-7 text-white transition duration-400 ease-studio desktop:hidden motion-safe:animate-studio-flow"
    :class="open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-8 opacity-0 pointer-events-none'"
    :aria-hidden="!open"
    aria-label="Меню сайта"
    @keydown="handleKeydown"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_5%,rgba(255,255,255,0.12)_50%,transparent_82%)]" />
    <div class="relative z-10 mx-auto flex min-h-full w-full max-w-xl flex-col">
      <img src="/brand/logo-white.svg" alt="Studio 313" class="h-auto w-44">

      <nav class="mt-8 grid gap-1.5">
        <NuxtLink
          v-for="(item, index) in navigationItems"
          :key="item.to"
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="group flex min-h-13 items-center justify-between gap-4 border-b border-white/20 py-3 font-display text-xl font-extrabold uppercase text-white transition hover:border-white/60"
          :class="isActive(item.to) ? 'border-white' : ''"
          @click="$emit('close')"
        >
          <span class="flex min-w-0 items-center gap-3">
            <span class="w-6 font-body text-xs font-semibold text-white/50">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ item.label }}</span>
          </span>
          <component :is="item.icon" class="size-6 shrink-0 text-white/70 transition group-hover:text-white" aria-hidden="true" />
        </NuxtLink>
      </nav>

      <div class="mt-8 border-t border-white/20 pt-5">
        <div class="grid gap-3">
          <component
            :is="contact.href ? 'a' : 'span'"
            v-for="contact in contactItems"
            :key="contact.label"
            :href="contact.href"
            :aria-label="contact.label"
            class="flex items-start gap-3 text-white/85 transition hover:text-white"
          >
            <component :is="contact.icon" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>{{ contact.value }}</span>
          </component>
        </div>
        <div class="mt-4 flex gap-1" aria-label="Социальные сети">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            :title="social.label"
            class="grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <SocialBrandIcon :name="social.icon" class="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <NuxtLink
        :to="bookingPage.to"
        class="mt-6 flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-5 font-display text-sm font-extrabold uppercase text-ink shadow-accent transition hover:text-accent"
        @click="$emit('close')"
      >
        <component :is="bookingPage.icon" class="size-5" aria-hidden="true" />
        {{ bookingPage.label }}
      </NuxtLink>
    </div>
  </section>
</template>
