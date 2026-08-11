<script setup lang="ts">
import type { FeaturedService } from '~/entities/service/model/types'
import PageFullscreen from '~/shared/ui/PageFullscreen.vue'
import ServiceScene from './ServiceScene.vue'

defineProps<{
  services: readonly FeaturedService[]
  signalBars: readonly number[]
}>()

const emit = defineEmits<{
  activeChange: [index: number]
}>()
</script>

<template>
  <PageFullscreen
    label="Главные услуги Studio 313"
    handoff
    @active-change="emit('activeChange', $event)"
  >
    <ServiceScene
      v-for="(service, index) in services"
      :key="service.id"
      :service="service"
      :index="index"
      :signal-bars="signalBars"
    />
  </PageFullscreen>
</template>
