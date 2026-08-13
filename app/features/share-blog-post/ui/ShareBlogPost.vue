<script setup lang="ts">
import { Check, Share2 } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  text: string
  url: string
}>()

const copied = ref(false)

async function share() {
  const absoluteUrl = new URL(props.url, window.location.origin).toString()
  try {
    if (navigator.share) {
      await navigator.share({ title: props.title, text: props.text, url: absoluteUrl })
      return
    }
    await navigator.clipboard.writeText(absoluteUrl)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 2_000)
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    const temporary = document.createElement('textarea')
    temporary.value = absoluteUrl
    temporary.style.position = 'fixed'
    temporary.style.opacity = '0'
    document.body.appendChild(temporary)
    temporary.select()
    document.execCommand('copy')
    temporary.remove()
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 2_000)
  }
}
</script>

<template>
  <button
    type="button"
    class="group/share relative z-20 flex min-h-10 w-fit cursor-pointer items-center gap-2 text-xs font-bold tracking-[0.08em] text-muted uppercase transition hover:text-accent"
    :aria-label="copied ? 'Ссылка скопирована' : `Поделиться статьёй «${title}»`"
    @click="share"
  >
    <span class="grid size-9 place-items-center border border-ink/15 transition group-hover/share:border-accent group-hover/share:bg-accent group-hover/share:text-white">
      <Check v-if="copied" class="size-4" aria-hidden="true" />
      <Share2 v-else class="size-4" aria-hidden="true" />
    </span>
    {{ copied ? 'Ссылка скопирована' : 'Поделиться' }}
  </button>
</template>
