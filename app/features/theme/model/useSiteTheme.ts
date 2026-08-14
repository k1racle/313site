export type SiteTheme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'studio313-theme'
const themeOrder: SiteTheme[] = ['system', 'light', 'dark']

function isSiteTheme(value: string | null): value is SiteTheme {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function useSiteTheme() {
  const theme = useState<SiteTheme>('site-theme', () => 'system')
  const resolvedTheme = useState<'light' | 'dark'>('site-resolved-theme', () => 'light')
  let systemTheme: MediaQueryList | undefined

  function applyTheme() {
    if (!import.meta.client) return

    const dark = theme.value === 'dark'
      || (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    resolvedTheme.value = dark ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.dataset.theme = theme.value
  }

  function setTheme(value: SiteTheme) {
    theme.value = value
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, value)
    applyTheme()
  }

  function cycleTheme() {
    const currentIndex = themeOrder.indexOf(theme.value)
    setTheme(themeOrder[(currentIndex + 1) % themeOrder.length] || 'system')
  }

  function handleSystemThemeChange() {
    if (theme.value === 'system') applyTheme()
  }

  onMounted(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    theme.value = isSiteTheme(storedTheme) ? storedTheme : 'system'
    systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.addEventListener('change', handleSystemThemeChange)
    applyTheme()
  })

  onBeforeUnmount(() => systemTheme?.removeEventListener('change', handleSystemThemeChange))

  return {
    cycleTheme,
    resolvedTheme: readonly(resolvedTheme),
    setTheme,
    theme: readonly(theme),
  }
}
