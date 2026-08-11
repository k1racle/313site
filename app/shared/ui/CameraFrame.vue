<template>
  <div
    class="camera-frame pointer-events-none absolute top-[var(--page-frame-inset)] right-[var(--page-frame-inset)] bottom-[calc(var(--page-bottom-inset,0rem)+var(--page-frame-inset))] left-[var(--page-frame-inset)] z-20"
    aria-hidden="true"
  >
    <span class="absolute top-0 left-0 h-[var(--page-frame-corner-size)] w-[var(--page-frame-corner-size)] border-t border-l border-white/58 opacity-[.72] [filter:drop-shadow(0_.125rem_.75rem_rgba(7,16,31,.35))] desktop:opacity-100" />
    <span class="absolute top-0 right-0 h-[var(--page-frame-corner-size)] w-[var(--page-frame-corner-size)] border-t border-r border-white/58 opacity-[.72] [filter:drop-shadow(0_.125rem_.75rem_rgba(7,16,31,.35))] desktop:opacity-100" />
    <span class="absolute bottom-0 left-0 h-[var(--page-frame-corner-size)] w-[var(--page-frame-corner-size)] border-b border-l border-white/58 opacity-[.72] [filter:drop-shadow(0_.125rem_.75rem_rgba(7,16,31,.35))] desktop:opacity-100" />
    <span class="absolute right-0 bottom-0 h-[var(--page-frame-corner-size)] w-[var(--page-frame-corner-size)] border-r border-b border-white/58 opacity-[.72] [filter:drop-shadow(0_.125rem_.75rem_rgba(7,16,31,.35))] desktop:opacity-100" />
  </div>
</template>
