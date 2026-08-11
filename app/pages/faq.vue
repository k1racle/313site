<script setup lang="ts">
import { ArrowUpRight, ChevronRight, Plus } from 'lucide-vue-next'
import PageLongScreen from '~/shared/ui/PageLongScreen.vue'

const faqItems = [
  {
    question: 'Сколько длится съёмка?',
    answer: 'Обычно съёмка занимает 1-2 часа. Время зависит от формата и сложности проекта.',
  },
  {
    question: 'Можно ли приехать на рекогносцировку?',
    answer: 'Да, мы проводим бесплатные экскурсии по студии. Запишитесь заранее.',
  },
  {
    question: 'Что входит в стоимость аренды?',
    answer: 'В стоимость включены студийные помещения, базовый свет, звук и помощь ассистента.',
  },
] as const

useSeoMeta({
  title: 'FAQ — Студия 313',
  description: 'Ответы на частые вопросы о записи, аренде и подготовке к съёмке в Студии 313.',
  ogTitle: 'FAQ — Студия 313',
  ogDescription: 'Что входит в аренду, сколько длится запись и как посмотреть студию заранее.',
  ogImage: 'https://studio313.ru/media/static/313.jpg',
})
</script>

<template>
  <PageLongScreen>
    <div class="faq-page">
      <header class="faq-hero">
        <div class="faq-container">
          <div class="faq-breadcrumbs">
            <NuxtLink to="/">Studio 313</NuxtLink>
            <ChevronRight aria-hidden="true" />
            <span>FAQ</span>
          </div>

          <div class="faq-hero__content">
            <div>
              <p class="faq-kicker">FAQ <span>/</span> 03 ответа</p>
              <h1>Частые<br><em>вопросы</em></h1>
            </div>

            <p class="faq-lead">
              Самое важное о времени, подготовке и возможностях студии — коротко и без сложных условий.
            </p>
          </div>
        </div>
      </header>

      <section class="faq-body" aria-labelledby="faq-title">
        <div class="faq-container">
          <div class="faq-body__intro">
            <h2 id="faq-title">Перед записью</h2>
            <p>Выберите вопрос, чтобы увидеть ответ.</p>
          </div>

          <div class="faq-list">
            <details
              v-for="(item, index) in faqItems"
              :key="item.question"
              class="faq-item"
            >
              <summary>
                <span class="faq-item__number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="faq-item__question">{{ item.question }}</span>
                <span class="faq-item__toggle">
                  <Plus aria-hidden="true" />
                </span>
              </summary>
              <div class="faq-item__answer">
                <p>{{ item.answer }}</p>
              </div>
            </details>
          </div>

          <div class="faq-contact">
            <div>
              <p>Остался другой вопрос?</p>
              <strong>Расскажите о вашей задаче — мы подскажем подходящий формат.</strong>
            </div>
            <NuxtLink to="/contacts">
              Задать вопрос
              <ArrowUpRight aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </PageLongScreen>
</template>

<style scoped>
.faq-page {
  min-height: inherit;
  overflow: clip;
  background:
    radial-gradient(circle at 92% 4%, rgb(0 105 254 / 13%), transparent 24rem),
    #07101f;
}

.faq-container {
  width: min(calc(100% - 3rem), 78rem);
  margin-inline: auto;
}

.faq-hero {
  border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.faq-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding-top: clamp(2rem, 5vw, 4rem);
  color: rgb(255 255 255 / 42%);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.faq-breadcrumbs a {
  color: inherit;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.faq-breadcrumbs a:hover {
  color: white;
}

.faq-breadcrumbs svg {
  width: 0.875rem;
  height: 0.875rem;
}

.faq-hero__content {
  display: grid;
  gap: clamp(3rem, 7vw, 6rem);
  align-items: end;
  padding-block: clamp(5rem, 12vw, 10rem) clamp(5rem, 10vw, 8rem);
}

.faq-kicker {
  margin: 0 0 1.25rem;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.faq-kicker span {
  margin-inline: 0.45rem;
  color: rgb(255 255 255 / 24%);
}

.faq-hero h1 {
  margin: 0;
  color: white;
  font-family: var(--font-display);
  font-size: clamp(3.75rem, 9vw, 7.5rem);
  font-style: normal;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.88;
  text-transform: uppercase;
}

.faq-hero h1 em {
  color: var(--color-accent);
  font-style: normal;
}

.faq-lead {
  max-width: 28rem;
  margin: 0;
  padding-top: 1.4rem;
  color: rgb(255 255 255 / 62%);
  border-top: 1px solid rgb(255 255 255 / 18%);
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.65;
}

.faq-body {
  padding-block: clamp(5rem, 9vw, 8rem);
}

.faq-body__intro {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
}

.faq-body__intro h2 {
  margin: 0;
  color: white;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  text-transform: uppercase;
}

.faq-body__intro p {
  margin: 0;
  color: rgb(255 255 255 / 42%);
  font-size: 0.9rem;
}

.faq-list {
  border-top: 1px solid rgb(255 255 255 / 18%);
}

.faq-item {
  border-bottom: 1px solid rgb(255 255 255 / 18%);
}

.faq-item summary {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 2.75rem;
  gap: clamp(1rem, 3vw, 2.5rem);
  align-items: center;
  padding-block: clamp(1.5rem, 3.5vw, 2.25rem);
  list-style: none;
  cursor: pointer;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item__number {
  color: rgb(255 255 255 / 28%);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  transition: color var(--duration-base) var(--ease-standard);
}

.faq-item__question {
  color: rgb(255 255 255 / 88%);
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.4vw, 1.75rem);
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
  transition: color var(--duration-base) var(--ease-standard);
}

.faq-item__toggle {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  color: white;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 50%;
  transition:
    color var(--duration-base) var(--ease-standard),
    background-color var(--duration-base) var(--ease-standard),
    border-color var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}

.faq-item__toggle svg {
  width: 1.1rem;
  height: 1.1rem;
}

.faq-item summary:hover .faq-item__question,
.faq-item[open] .faq-item__question {
  color: white;
}

.faq-item summary:hover .faq-item__toggle {
  border-color: rgb(255 255 255 / 50%);
}

.faq-item[open] .faq-item__number {
  color: var(--color-accent);
}

.faq-item[open] .faq-item__toggle {
  background: var(--color-accent);
  border-color: var(--color-accent);
  transform: rotate(45deg);
}

.faq-item__answer {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 2.75rem;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding-bottom: clamp(1.75rem, 4vw, 3rem);
}

.faq-item__answer::before {
  content: "";
}

.faq-item__answer p {
  max-width: 44rem;
  margin: 0;
  color: rgb(255 255 255 / 58%);
  font-size: clamp(0.95rem, 1.7vw, 1.1rem);
  line-height: 1.7;
}

.faq-contact {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: clamp(5rem, 10vw, 8rem);
  padding-block: 2rem;
  border-top: 1px solid rgb(255 255 255 / 18%);
  border-bottom: 1px solid rgb(255 255 255 / 18%);
}

.faq-contact p {
  margin: 0 0 0.5rem;
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.faq-contact strong {
  display: block;
  max-width: 42rem;
  color: white;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  line-height: 1.5;
}

.faq-contact a {
  display: inline-flex;
  min-height: 3.25rem;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-inline: 1.5rem;
  color: white;
  background: var(--color-accent);
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.faq-contact a:hover {
  background: var(--color-accent-600);
  transform: translateY(-2px);
}

.faq-contact a svg {
  width: 1.1rem;
  height: 1.1rem;
}

@media (min-width: 48rem) {
  .faq-container {
    width: min(calc(100% - 5rem), 78rem);
  }

  .faq-hero__content {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 25rem);
  }

  .faq-body__intro,
  .faq-contact {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

@media (max-width: 30rem) {
  .faq-container {
    width: min(calc(100% - 2rem), 78rem);
  }

  .faq-item summary,
  .faq-item__answer {
    grid-template-columns: 1.5rem minmax(0, 1fr) 2.5rem;
    gap: 0.75rem;
  }

  .faq-item__toggle {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
