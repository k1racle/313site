const STORAGE_KEY = 'studio313:sidebar-collapsed'

export function useSidebar() {
  const route = useRoute()
  const isCollapsed = useState('studio313:sidebar-collapsed', () => false)
  const isMobileOpen = useState('studio313:mobile-menu-open', () => false)
  let previousOverflow = ''

  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value
  }

  function toggleMobileMenu() {
    isMobileOpen.value = !isMobileOpen.value
  }

  function closeMobileMenu() {
    isMobileOpen.value = false
  }

  onMounted(() => {
    isCollapsed.value = localStorage.getItem(STORAGE_KEY) === 'true'
    previousOverflow = document.documentElement.style.overflow
  })

  watch(isCollapsed, (value) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, String(value))
    }
  })

  watch(isMobileOpen, (isOpen) => {
    if (!import.meta.client) return
    document.documentElement.style.overflow = isOpen ? 'hidden' : previousOverflow
  })

  watch(() => route.fullPath, closeMobileMenu)

  onBeforeUnmount(() => {
    if (import.meta.client) {
      document.documentElement.style.overflow = previousOverflow
    }
  })

  return {
    closeMobileMenu,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobileMenu,
  }
}
