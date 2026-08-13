<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value?: string
  hint?: string
  multiline?: boolean
}>(), {
  value: '',
  hint: '',
  multiline: false,
})
</script>

<template>
  <label class="grid gap-2">
    <span class="text-xs font-bold tracking-[0.1em] text-ink uppercase">{{ label }}</span>
    <textarea
      v-if="multiline"
      :value="value"
      readonly
      rows="5"
      class="w-full resize-none border border-ink/12 bg-page px-4 py-3 text-sm leading-relaxed text-ink outline-none"
    />
    <input
      v-else
      :value="value"
      readonly
      class="min-h-12 w-full border border-ink/12 bg-page px-4 text-sm text-ink outline-none"
    >
    <small v-if="hint" class="text-xs leading-relaxed text-muted">{{ hint }}</small>
  </label>
</template>
