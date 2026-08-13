<script setup lang="ts">
import { ArrowRight, ExternalLink, LockKeyhole, LogOut, Menu, X } from 'lucide-vue-next'
import { adminNavigation } from '~/config/admin-navigation'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'

const route = useRoute()
const mobileNavigationOpen = ref(false)
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { data: session } = await useFetch('/api/admin/session', {
  default: () => ({ authenticated: false }),
})
const adminAuthenticated = useState('admin-authenticated', () => false)
watchEffect(() => {
  adminAuthenticated.value = session.value.authenticated
})

const currentSection = computed(() => {
  return [...adminNavigation]
    .reverse()
    .find(item => item.to === '/admin'
      ? route.path === item.to
      : route.path.startsWith(item.to)) || adminNavigation[0]
})

function isActiveNavigationItem(to: string) {
  return to === '/admin' ? route.path === to : route.path.startsWith(to)
}

async function login() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const result = await $fetch<{ authenticated: boolean }>('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })

    session.value = result
    password.value = ''
  }
  catch {
    errorMessage.value = 'Неверный пароль'
  }
  finally {
    isSubmitting.value = false
  }
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  session.value = { authenticated: false }
  mobileNavigationOpen.value = false
}

watch(() => route.path, () => {
  mobileNavigationOpen.value = false
})
</script>

<template>
  <main v-if="!session.authenticated" class="relative grid min-h-screen place-items-center overflow-hidden bg-[#eaf4ff] px-5 py-10 text-copy">

    <form
      class="relative z-10 w-full max-w-md border border-ink/10 bg-white p-7 shadow-panel sm:p-9"
      @submit.prevent="login"
    >
      <div class="mb-8 flex size-14 items-center justify-center bg-accent text-white shadow-accent">
        <LockKeyhole class="size-7" aria-hidden="true" />
      </div>

      <AppHeading as="h1" size="section" :accent="false" class="mt-3">Вход в админку</AppHeading>
      <p class="mt-4 text-sm leading-relaxed text-muted">
        Введите пароль администратора, чтобы перейти к управлению контентом сайта.
      </p>

      <label class="mt-8 block">
        <span class="mb-2 block text-xs font-bold tracking-[0.14em] text-ink uppercase">Пароль</span>
        <input
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          autofocus
          required
          class="min-h-13 w-full border border-ink/15 bg-page px-4 text-ink transition outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
          placeholder="Введите пароль"
        >
      </label>

      <p v-if="errorMessage" class="mt-3 text-sm font-semibold text-red-600" role="alert">
        {{ errorMessage }}
      </p>

      <AppButton
        type="submit"
        :disabled="isSubmitting"
        class="mt-6 min-h-13 w-full"
      >
        {{ isSubmitting ? 'Проверяем…' : 'Войти' }}
        <ArrowRight v-if="!isSubmitting" class="size-5" aria-hidden="true" />
      </AppButton>
    </form>
  </main>

  <div v-else class="min-h-screen bg-page text-copy">
    <div
      v-if="mobileNavigationOpen"
      class="fixed inset-0 z-40 bg-ink/65 backdrop-blur-sm desktop:hidden"
      @click="mobileNavigationOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col border-r border-accent-700 bg-accent text-white transition-transform duration-300 desktop:translate-x-0"
      :class="mobileNavigationOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex min-h-24 items-center justify-between border-b border-white/10 px-6">
        <div>
          <p class="font-display text-2xl font-extrabold uppercase">Studio 313</p>
          <p class="mt-1 text-[0.65rem] font-bold tracking-[0.2em] text-white/45 uppercase">Content management</p>
        </div>
        <button
          type="button"
          class="grid size-10 place-items-center border border-white/15 text-white/70 desktop:hidden"
          aria-label="Закрыть меню"
          @click="mobileNavigationOpen = false"
        >
          <X class="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 py-6" aria-label="Разделы админки">
        <p class="px-3 text-[0.65rem] font-bold tracking-[0.18em] text-white/35 uppercase">Контент сайта</p>
        <div class="mt-3 grid gap-1.5">
          <NuxtLink
            v-for="item in adminNavigation"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 px-3 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            :class="isActiveNavigationItem(item.to) ? 'bg-white !text-ink hover:!bg-white hover:!text-ink' : ''"
          >
            <component :is="item.icon" class="size-5 shrink-0" aria-hidden="true" />
            <span>
              <strong class="block font-display text-sm font-extrabold uppercase">{{ item.label }}</strong>
              <small class="mt-0.5 block text-[0.68rem] text-current opacity-55">{{ item.description }}</small>
            </span>
          </NuxtLink>
        </div>
      </nav>

      <div class="border-t border-white/10 p-4">
        <button
          type="button"
          class="flex min-h-11 w-full items-center gap-3 px-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
          @click="logout"
        >
          <LogOut class="size-4" aria-hidden="true" />
          Выйти
        </button>
      </div>
    </aside>

    <div class="desktop:pl-[18rem]">
      <header class="sticky top-0 z-30 border-b border-ink/10 bg-white/92 px-5 py-4 backdrop-blur-xl sm:px-7">
        <div class="flex items-center justify-between gap-5">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid size-11 shrink-0 place-items-center border border-ink/12 bg-white text-ink desktop:hidden"
              aria-label="Открыть меню"
              @click="mobileNavigationOpen = true"
            >
              <Menu class="size-5" aria-hidden="true" />
            </button>
            <div class="min-w-0">
              <p class="truncate font-display text-base font-extrabold uppercase text-ink">{{ currentSection.label }}</p>
              <p class="truncate text-xs text-muted">{{ currentSection.description }}</p>
            </div>
          </div>

          <AppButton
            behaviour="link"
            variant="ghost"
            to="/"
            target="_blank"
            class="min-h-11 shrink-0 px-4 text-sm normal-case"
          >
            <span class="hidden sm:inline">Открыть сайт</span>
            <ExternalLink class="size-4" aria-hidden="true" />
          </AppButton>
        </div>
      </header>

      <div class="mx-auto max-w-[100rem] px-5 py-7 sm:px-7 sm:py-9">
        <slot />
      </div>
    </div>
  </div>
</template>
