<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type ButtonBehaviour = 'button' | 'link'
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const props = withDefaults(defineProps<{
  behaviour?: ButtonBehaviour
  variant?: ButtonVariant
  to?: RouteLocationRaw
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), {
  behaviour: 'button',
  variant: 'primary',
  to: undefined,
  type: 'button',
  disabled: false,
})

const component = computed(() => props.behaviour === 'link' ? resolveComponent('NuxtLink') : 'button')
const variantClass = computed(() => ({
  primary: 'border border-accent bg-accent text-white shadow-accent hover:border-accent-600 hover:bg-accent-600',
  secondary: 'border border-accent bg-panel text-ink hover:bg-accent hover:text-white',
  ghost: 'border border-ink/20 bg-transparent text-ink hover:border-accent hover:text-accent',
}[props.variant]))
</script>

<template>
  <component
    :is="component"
    class="btn"
    :class="[variantClass, disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '']"
    :to="behaviour === 'link' ? to : undefined"
    :type="behaviour === 'button' ? type : undefined"
    :disabled="behaviour === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot />
  </component>
</template>
