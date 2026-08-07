<script setup lang="ts">
withDefaults(defineProps<{
  icon: string
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
    <Icon
      :name="icon"
      :class="iconClass"
      aria-hidden="true"
    />
  </button>
</template>
