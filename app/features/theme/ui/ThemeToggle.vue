<script setup lang="ts">
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import { useSiteTheme } from '~/features/theme/model/useSiteTheme'
import AppIconButton from '~/shared/ui/AppIconButton.vue'

const { cycleTheme, theme } = useSiteTheme()

const icon = computed(() => ({
  system: Monitor,
  light: Sun,
  dark: Moon,
}[theme.value]))

const label = computed(() => ({
  system: 'Тема: как в системе. Переключить на светлую',
  light: 'Тема: светлая. Переключить на тёмную',
  dark: 'Тема: тёмная. Переключить на системную',
}[theme.value]))
</script>

<template>
  <AppIconButton
    :icon="icon"
    :label="label"
    icon-class="size-5"
    class="grid size-11 shrink-0 cursor-pointer place-items-center border border-white/20 text-white transition hover:border-white/50 hover:bg-white/15"
    @click="cycleTheme"
  />
</template>
