<template>
  <div class="camera-frame" aria-hidden="true">
    <span class="camera-frame__corner camera-frame__corner--top-left" />
    <span class="camera-frame__corner camera-frame__corner--top-right" />
    <span class="camera-frame__corner camera-frame__corner--bottom-left" />
    <span class="camera-frame__corner camera-frame__corner--bottom-right" />
  </div>
</template>

<style scoped>
.camera-frame {
  position: absolute;
  z-index: 20;
  inset: var(--page-frame-inset);
  bottom: calc(var(--page-timeline-height, 0rem) + var(--page-frame-inset));
  pointer-events: none;
}

.camera-frame__corner {
  position: absolute;
  width: var(--page-frame-corner-size);
  height: var(--page-frame-corner-size);
  border-color: rgb(255 255 255 / 58%);
  filter: drop-shadow(0 0.125rem 0.75rem rgb(7 16 31 / 35%));
}

.camera-frame__corner--top-left {
  top: 0;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-left-width: 1px;
  border-left-style: solid;
}

.camera-frame__corner--top-right {
  top: 0;
  right: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-right-width: 1px;
  border-right-style: solid;
}

.camera-frame__corner--bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-left-width: 1px;
  border-left-style: solid;
}

.camera-frame__corner--bottom-right {
  right: 0;
  bottom: 0;
  border-right-width: 1px;
  border-right-style: solid;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

@media (max-width: 67.499rem) {
  .camera-frame__corner {
    opacity: 0.72;
  }
}
</style>
