import type { CaseCategory, CaseCategoryId } from '~/entities/case-study/model/types'

export const caseCategories = [
  {
    id: 'video',
    title: 'Видео',
    shortTitle: 'Видео',
    eyebrow: 'Motion / Interview / Reels',
    description: 'Съёмки, интервью, экспертные ролики и вертикальные форматы.',
    image: '/media/photos/studio/tild3238-6165-4633-a230-336330613834__21.jpg',
    imageAlt: 'Интервью в синей зоне Studio 313',
    projects: [
      {
        title: 'Интервью в синей зоне',
        description: 'Студийная видеосъёмка разговора в выразительной синей сцене.',
        image: '/media/photos/studio/tild3238-6165-4633-a230-336330613834__21.jpg',
        imageAlt: 'Интервью в синей зоне Studio 313',
        layout: 'feature',
      },
      {
        title: 'Экспертный выпуск',
        description: 'Спокойный разговорный формат с фокусом на герое и содержании.',
        image: '/media/photos/studio/tild3537-3266-4565-a432-636664383637__15.jpg',
        imageAlt: 'Съёмка экспертного выпуска в Studio 313',
        layout: 'portrait',
      },
      {
        title: 'Reels для бренда',
        description: 'Короткие вертикальные эпизоды, собранные в единую серию.',
        image: '/media/photos/studio/tild3333-3863-4339-b566-653361613737__22.jpg',
        imageAlt: 'Съёмка вертикального видео для бренда',
        layout: 'wide',
      },
    ],
  },
  {
    id: 'gallery',
    title: 'Галерея',
    shortTitle: 'Фото',
    eyebrow: 'Space / Light / Details',
    description: 'Фотографии студии, локаций, света и рабочих зон.',
    image: '/media/photos/studio/tild3238-3930-4561-a439-356237643439__333.png',
    imageAlt: 'Рабочая сцена и оборудование Studio 313',
    projects: [
      {
        title: 'Зона записи',
        description: 'Пространство для разговорных форматов, подкастов и интервью.',
        image: '/media/photos/studio/tild3037-3233-4434-b932-353762623636__23.jpg',
        imageAlt: 'Зона записи Studio 313',
        layout: 'feature',
      },
      {
        title: 'Синий зал',
        description: 'Контрастная локация для выразительного портрета и видео.',
        image: '/media/photos/studio/tild3137-3062-4466-b565-373238343666__29.jpg',
        imageAlt: 'Синий зал Studio 313',
        layout: 'portrait',
      },
      {
        title: 'Рабочая сцена',
        description: 'Свет, камеры и детали пространства перед началом записи.',
        image: '/media/photos/studio/tild3238-3930-4561-a439-356237643439__333.png',
        imageAlt: 'Подготовленная рабочая сцена Studio 313',
        layout: 'wide',
      },
    ],
  },
  {
    id: 'podcasts',
    title: 'Подкасты',
    shortTitle: 'Подкасты',
    eyebrow: 'Talk / Guest / Episode',
    description: 'Подкаст-записи, разговорные шоу и интервью.',
    image: '/media/photos/studio/tild3665-6438-4663-b836-356532326537__20.jpg',
    imageAlt: 'Запись подкаста в Studio 313',
    projects: [
      {
        title: 'Большой разговор',
        description: 'Разговорный выпуск с вниманием к интонации, свету и крупным планам.',
        image: '/media/photos/studio/tild3665-6438-4663-b836-356532326537__20.jpg',
        imageAlt: 'Запись проекта «Большой разговор»',
        layout: 'feature',
      },
      {
        title: 'Подкаст с гостем',
        description: 'Классическая беседа в студии с несколькими визуальными планами.',
        image: '/media/photos/studio/tild3732-6661-4435-a536-666664643032__21.jpg',
        imageAlt: 'Запись подкаста с гостем в Studio 313',
        layout: 'portrait',
      },
      {
        title: 'Запись за столом',
        description: 'Камерный формат для беседы, интервью или авторского выпуска.',
        image: '/media/photos/studio/tild3037-3233-4434-b932-353762623636__23.jpg',
        imageAlt: 'Запись подкаста за столом',
        layout: 'wide',
      },
    ],
  },
] as const satisfies readonly CaseCategory[]

export function findCaseCategory(id: string | undefined) {
  return caseCategories.find(category => category.id === id)
}

export function isCaseCategoryId(id: string): id is CaseCategoryId {
  return caseCategories.some(category => category.id === id)
}
