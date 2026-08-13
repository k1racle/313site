import { createEmptySocialsContent, type SocialsContent } from '~~/shared/types/socials'

export function useSiteSocials() {
  const { data } = useFetch<SocialsContent>('/api/socials', {
    key: 'site-socials',
    default: createEmptySocialsContent,
  })

  return {
    socialLinks: computed(() => data.value.items),
  }
}
