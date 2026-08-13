import { navigationItems } from '~/config/navigation'
import { createEmptyNavigationVisibility } from '~~/shared/types/navigation'

export function useSiteNavigation() {
  const route = useRoute()
  const { data: settings } = useFetch('/api/navigation', {
    key: 'site-navigation',
    default: () => ({ visibility: createEmptyNavigationVisibility() }),
  })

  const visibleNavigationItems = computed(() => navigationItems.filter((item) => {
    return settings.value.visibility[item.to] === true
  }))

  function isActive(to: string) {
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  return {
    isActive,
    navigationItems: visibleNavigationItems,
  }
}
