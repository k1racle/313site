<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex items-start gap-4 border border-amber-400/40 bg-amber-50 px-5 py-4 text-amber-950">
    <span class="shrink-0 bg-amber-400 px-2.5 py-1 font-display text-xs font-extrabold tracking-[0.12em] uppercase">
      Не сделано
    </span>
    <p class="pt-0.5 text-sm leading-relaxed">
      {{ text || 'Это только визуальная болванка. Структура данных, сохранение и связь с публичным сайтом ещё не определены.' }}
    </p>
  </div>
</template>
