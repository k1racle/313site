<template>
  <div
    class="full-page h-[calc(100dvh-var(--mobile-dock-height))] w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth [scrollbar-width:none] desktop:h-dvh [&::-webkit-scrollbar]:hidden"
  >
    <slot />
  </div>
</template>

<style>
.full-page > * {
  min-height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
</style>
