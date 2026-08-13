<script setup lang="ts">
import { contactItems } from '~/config/contacts'
import { bookingPage } from '~/config/navigation'
import { useSiteNavigation } from '~/features/navigation/model/useSiteNavigation'
import { useSiteSocials } from '~/features/socials/model/useSiteSocials'
import AppButton from '~/shared/ui/AppButton.vue'
import SocialBrandIcon from '~/shared/ui/SocialBrandIcon.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { isActive, navigationItems } = useSiteNavigation()
const { socialLinks } = useSiteSocials()
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
    class="fixed inset-0 z-40 overflow-y-auto bg-accent px-5 pb-[calc(var(--mobile-dock-height)+1.5rem)] pt-7 text-white transition duration-400 ease-studio desktop:hidden"
    :class="open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-8 opacity-0 pointer-events-none'"
    :aria-hidden="!open"
    aria-label="Меню сайта"
    @keydown="handleKeydown"
  >
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
            :target="social.href === '#' ? undefined : '_blank'"
            :rel="social.href === '#' ? undefined : 'noopener noreferrer'"
            :aria-label="social.label"
            :title="social.label"
            class="grid size-11 place-items-center text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <SocialBrandIcon :name="social.icon" class="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <AppButton
        behaviour="link"
        variant="secondary"
        :to="bookingPage.to"
        class="mt-6 min-h-13"
        @click="$emit('close')"
      >
        <component :is="bookingPage.icon" class="size-5" aria-hidden="true" />
        {{ bookingPage.label }}
      </AppButton>
    </div>
  </section>
</template>
