import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://studio313.ru'
const siteName = 'Студия 313'
const siteDescription = 'Профессиональная студия для записи подкастов и интервью под ключ в Краснодаре, профессиональный ведущий, качественная картинка и звук, доступная цена.'
const siteKeywords = 'Студия подкастов, видеоподкасты, записать подкаст, видеосъемка, видеозапись, ведущий подкаста, интервьюер, подкаст под ключ, студия 313, подкаст в Краснодаре, съемка подкастов'
const ogImage = `${siteUrl}/media/static/313.jpg`

export default defineNuxtConfig({
  compatibilityDate: '2026-08-06',
  srcDir: 'app',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
    host: '127.0.0.1',
  },
  site: {
    url: siteUrl,
    name: siteName,
    defaultLocale: 'ru',
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/app.css'],
  ogImage: {
    enabled: false,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: siteName,
      script: [{
        innerHTML: `(function(){try{var theme=localStorage.getItem('studio313-theme')||'system';var dark=theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.dataset.theme=theme}catch(_){}})()`,
        tagPosition: 'head',
      }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteDescription },
        { name: 'keywords', content: siteKeywords },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: siteName },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteName },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [{ rel: 'icon', href: '/icons/favicon.png' }],
    },
  },
  routeRules: {
    '/admin': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
      robots: false,
    },
    '/admin/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
      robots: false,
    },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || '313',
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'studio313-change-this-secret',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramAdminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
    dataDir: process.env.DATA_DIR || '',
  },
})
