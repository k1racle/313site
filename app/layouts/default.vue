<script setup lang="ts">
import SidebarWrapper from '~/widgets/sidebar/ui/SidebarWrapper.vue'
import MaintenancePage from '~/widgets/maintenance-page/ui/MaintenancePage.vue'
import { createEmptySiteSettings, type SiteSettings } from '~~/shared/types/site-settings'

const { data: siteSettings } = await useFetch<SiteSettings>('/api/settings', {
  key: 'site-settings',
  default: createEmptySiteSettings,
})
const { data: adminSession } = await useFetch('/api/admin/session', {
  key: 'public-admin-session',
  default: () => ({ authenticated: false }),
})

const showMaintenancePage = computed(() => (
  siteSettings.value.maintenanceModeEnabled && !adminSession.value.authenticated
))
</script>

<template>
  <MaintenancePage v-if="showMaintenancePage" />
  <SidebarWrapper v-else>
    <slot />
  </SidebarWrapper>
</template>
