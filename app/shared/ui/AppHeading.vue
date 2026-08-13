<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'hero' | 'page' | 'section' | 'card' | 'compact' | 'inherit'

const props = withDefaults(defineProps<{
  as?: HeadingTag
  size?: HeadingSize
  accent: boolean
}>(), {
  as: 'h2',
  size: 'section',
})

const sizeClass = computed(() => ({
  hero: 'text-[clamp(3rem,9vw,8rem)] leading-[0.88] tracking-[-0.045em]',
  page: 'text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.04em]',
  section: 'text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em]',
  card: 'text-[clamp(1.25rem,2.4vw,2rem)] leading-tight',
  compact: 'text-sm leading-tight',
  inherit: '',
}[props.size]))

const headingElement = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)
const accentStyle = ref<CSSProperties>({ opacity: 0 })

let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
let animationFrame = 0

function updateAccentPosition() {
  const heading = headingElement.value
  const content = contentElement.value

  if (!props.accent || !heading || !content) {
    accentStyle.value = { opacity: 0 }
    return
  }

  const range = document.createRange()
  range.selectNodeContents(content)

  const rectangles = Array.from(range.getClientRects())
    .filter(rectangle => rectangle.width > 0.5 && rectangle.height > 0.5)

  if (!rectangles.length) {
    accentStyle.value = { opacity: 0 }
    return
  }

  const fontSize = Number.parseFloat(getComputedStyle(heading).fontSize)
  const lastBottom = Math.max(...rectangles.map(rectangle => rectangle.bottom))
  const sameLineTolerance = Math.max(2, fontSize * 0.08)
  const lastLineRectangles = rectangles.filter(rectangle => (
    Math.abs(rectangle.bottom - lastBottom) <= sameLineTolerance
  ))
  const lineLeft = Math.min(...lastLineRectangles.map(rectangle => rectangle.left))
  const lineRight = Math.max(...lastLineRectangles.map(rectangle => rectangle.right))
  const headingLeft = heading.getBoundingClientRect().left
  const leftInset = Math.max(2, fontSize * 0.06)
  const rightOverflow = Math.max(4, fontSize * 0.12)

  accentStyle.value = {
    left: `${lineLeft - headingLeft + leftInset}px`,
    width: `${Math.max(0, lineRight - lineLeft - leftInset + rightOverflow)}px`,
    opacity: 1,
  }
}

function scheduleAccentUpdate() {
  cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(updateAccentPosition)
}

onMounted(async () => {
  await nextTick()
  scheduleAccentUpdate()

  if (headingElement.value) {
    resizeObserver = new ResizeObserver(scheduleAccentUpdate)
    resizeObserver.observe(headingElement.value)
  }

  if (contentElement.value) {
    mutationObserver = new MutationObserver(scheduleAccentUpdate)
    mutationObserver.observe(contentElement.value, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  void document.fonts?.ready.then(scheduleAccentUpdate)
})

watch(() => props.accent, async () => {
  await nextTick()
  scheduleAccentUpdate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})
</script>

<template>
  <component
    :is="as"
    ref="headingElement"
    class="relative isolate break-normal font-display font-extrabold text-current uppercase"
    :class="sizeClass"
  >
    <span ref="contentElement" class="relative z-10"><slot /></span>
    <span
      v-if="accent"
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[0.04em] z-0 h-5 bg-accent transition-[left,width] duration-200 min-[60rem]:h-[1.875rem]"
      :style="accentStyle"
    />
  </component>
</template>
