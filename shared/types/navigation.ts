export const publicNavigationPaths = [
  '/about',
  '/services',
  '/cases',
  '/prices',
  '/blog',
  '/team',
  '/equipment',
  '/clients',
  '/reviews',
  '/faq',
  '/contacts',
] as const

export type PublicNavigationPath = typeof publicNavigationPaths[number]
export type NavigationVisibility = Record<PublicNavigationPath, boolean>

export function createEmptyNavigationVisibility(): NavigationVisibility {
  return Object.fromEntries(publicNavigationPaths.map(path => [path, false])) as NavigationVisibility
}
