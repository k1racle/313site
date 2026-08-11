import { navigationItems } from '~/config/navigation'

export function useSiteNavigation() {
  const route = useRoute()

  function isActive(to: string) {
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  return {
    isActive,
    navigationItems,
  }
}
