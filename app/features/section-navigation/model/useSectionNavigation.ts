interface NavigableSection {
  id: string
}

interface SectionNavigationOptions {
  longSectionId: string
  longSectionIndex: number
}

export function useSectionNavigation(
  sections: readonly NavigableSection[],
  options: SectionNavigationOptions,
) {
  const fullscreenActiveIndex = ref(0)
  const longSectionIsActive = ref(false)
  const activeIndex = computed(() => longSectionIsActive.value
    ? options.longSectionIndex
    : fullscreenActiveIndex.value)

  let longSectionObserver: IntersectionObserver | undefined

  function setFullscreenIndex(index: number) {
    fullscreenActiveIndex.value = index
  }

  function scrollToSection(index: number) {
    const section = sections[index]
    const target = section ? document.getElementById(section.id) : null
    if (!target) return

    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  onMounted(() => {
    const longSection = document.getElementById(options.longSectionId)
    if (!longSection) return

    longSectionObserver = new IntersectionObserver(([entry]) => {
      longSectionIsActive.value = Boolean(entry?.isIntersecting)
    }, { threshold: 0.01 })

    longSectionObserver.observe(longSection)
  })

  onBeforeUnmount(() => longSectionObserver?.disconnect())

  return {
    activeIndex: readonly(activeIndex),
    scrollToSection,
    setFullscreenIndex,
  }
}
