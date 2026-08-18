<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useBookingModal } from '~/features/booking/model/useBookingModal'
import AppHeading from '~/shared/ui/AppHeading.vue'
import BookingWidgetFrame from './BookingWidgetFrame.vue'

const { isOpen, selectedService, closeBookingModal } = useBookingModal()

const modalRoot = useTemplateRef<HTMLElement>('modalRoot')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

let previousActiveElement: HTMLElement | null = null
let previousDocumentOverflow = ''

function focusableElements() {
  if (!modalRoot.value) return []
  return [...modalRoot.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')]
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeBookingModal()
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
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(isOpen, async (open) => {
  if (import.meta.server) return

  if (open) {
    previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousDocumentOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    closeButton.value?.focus()
    return
  }

  document.documentElement.style.overflow = previousDocumentOverflow
  await nextTick()
  previousActiveElement?.focus()
})

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = previousDocumentOverflow
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[80] bg-[rgba(16,35,61,0.4)] px-3 py-3 backdrop-blur-sm sm:px-6 sm:py-6"
      @click.self="closeBookingModal"
    >
      <section
        ref="modalRoot"
        class="mx-auto flex h-full w-full max-w-[96rem] flex-col overflow-hidden border border-accent/20 bg-panel shadow-panel"
        aria-modal="true"
        aria-label="Окно записи"
        role="dialog"
        @keydown="handleKeydown"
      >
        <header class="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-7 sm:py-5">
          <div class="min-w-0">
            <AppHeading as="h2" size="card" :accent="false" class="m-0 text-ink">
              Запись в Studio 313
            </AppHeading>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              <template v-if="selectedService">
                Услуга: {{ selectedService }}
              </template>
              <template v-else>
                Выберите удобное время и оставьте заявку.
              </template>
            </p>
          </div>

          <button
            ref="closeButton"
            type="button"
            class="grid size-11 shrink-0 place-items-center border border-ink/12 bg-white text-ink transition hover:border-accent hover:text-accent"
            aria-label="Закрыть окно записи"
            @click="closeBookingModal"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <BookingWidgetFrame :service="selectedService" loading="eager" />
        </div>
      </section>
    </div>
  </Teleport>
</template>
