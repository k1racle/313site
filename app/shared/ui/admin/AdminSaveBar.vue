<script setup lang="ts">
import { ArrowUp, LoaderCircle } from 'lucide-vue-next'
import AppButton from '~/shared/ui/AppButton.vue'

withDefaults(defineProps<{
  label?: string
  saving?: boolean
  disabled?: boolean
  success?: string
  error?: string
}>(), {
  label: 'Сохранить',
  saving: false,
  disabled: false,
  success: '',
  error: '',
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="sticky bottom-4 z-20 flex flex-wrap items-center gap-4 border border-ink/10 bg-white/95 p-4 shadow-panel backdrop-blur-xl">
    <AppButton type="submit" :disabled="disabled || saving">
      <LoaderCircle v-if="saving" class="size-5 animate-spin" aria-hidden="true" />
      {{ saving ? 'Сохраняем…' : label }}
    </AppButton>
    <p v-if="success" class="text-sm font-semibold text-emerald-700" role="status">{{ success }}</p>
    <p v-if="error" class="text-sm font-semibold text-red-600" role="alert">{{ error }}</p>
    <AppButton type="button" variant="secondary" class="ml-auto" @click="scrollToTop">
      <ArrowUp class="size-5" aria-hidden="true" />
      Наверх
    </AppButton>
  </div>
</template>
