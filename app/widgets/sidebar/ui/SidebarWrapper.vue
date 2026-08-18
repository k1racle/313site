<script setup lang="ts">
import BookingWidgetModal from '~/features/booking/ui/BookingWidgetModal.vue'
import { useSidebar } from '~/widgets/sidebar/model/useSidebar'
import DesktopSidebar from '~/widgets/sidebar/ui/DesktopSidebar.vue'
import MobileDock from '~/widgets/sidebar/ui/MobileDock.vue'
import MobileMenu from '~/widgets/sidebar/ui/MobileMenu.vue'

const {
  closeMobileMenu,
  isCollapsed,
  isMobileOpen,
  toggleCollapsed,
  toggleMobileMenu,
} = useSidebar()

const mobileDock = useTemplateRef<{ focusMenuButton: () => void }>('mobileDock')

watch(isMobileOpen, async (open, wasOpen) => {
  if (open || !wasOpen) return
  await nextTick()
  mobileDock.value?.focusMenuButton()
})
</script>

<template>
  <div class="site-theme min-h-screen bg-page text-copy transition-colors duration-300">
    <DesktopSidebar :collapsed="isCollapsed" @toggle="toggleCollapsed" />

    <main
      class="min-h-screen pb-[var(--mobile-dock-height)] transition-[padding] duration-400 ease-studio desktop:pb-0"
      :class="isCollapsed ? 'desktop:pl-sidebar-collapsed' : 'desktop:pl-sidebar'"
      :style="{ '--layout-sidebar-width': isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }"
    >
      <slot />
    </main>

    <MobileMenu :open="isMobileOpen" @close="closeMobileMenu" />
    <MobileDock ref="mobileDock" :open="isMobileOpen" @toggle="toggleMobileMenu" />
    <BookingWidgetModal />
  </div>
</template>
