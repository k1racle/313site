<script setup lang="ts">
import { contactPageSections } from '~/config/contacts'
import SectionTimeline from '~/shared/ui/SectionTimeline.vue'
import ContactsShowcase from '~/widgets/contacts-showcase/ui/ContactsShowcase.vue'

const activeSectionIndex = ref(0)

function scrollToSection(index: number) {
  const section = contactPageSections[index]
  const target = section ? document.getElementById(section.id) : null
  if (!target) return

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

useSeoMeta({
  title: 'Контакты — Studio 313',
  description: 'Телефон, электронная почта, адрес и социальные сети Studio 313. Найдите студию на карте Краснодара.',
  ogTitle: 'Контакты Studio 313',
  ogDescription: 'Свяжитесь со Studio 313 или постройте маршрут до студии в Краснодаре.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <div class="contacts-page relative bg-page [--page-bottom-inset:3.75rem]">
    <ContactsShowcase @active-change="activeSectionIndex = $event" />

    <SectionTimeline
      :sections="contactPageSections"
      :active-index="activeSectionIndex"
      @select="scrollToSection"
    />
  </div>
</template>
