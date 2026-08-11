<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'

withDefaults(defineProps<{
  icon: LucideIcon
  label: string
  iconClass?: string
}>(), {
  iconClass: 'size-6',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const button = useTemplateRef<HTMLButtonElement>('button')

defineExpose({
  focus: () => button.value?.focus(),
})
</script>

<template>
  <button
    ref="button"
    type="button"
    :aria-label="label"
    :title="label"
    @click="$emit('click', $event)"
  >
    <component
      :is="icon"
      :class="iconClass"
      aria-hidden="true"
    />
  </button>
</template>
