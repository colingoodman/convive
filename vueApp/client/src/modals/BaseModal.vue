<template>
  <transition name="fade">
    <div
      v-show="value"
      class="z-50 fixed inset-0 flex p-4"
      style="background-color: rgba(0, 0, 0, .25)"
      @click.self="handleOutsideClick"
    >
      <div
        role="dialog"
        class="m-auto bg-white rounded shadow-md overflow-hidden"
        :style="{ width: `${width}px` }"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: Boolean,
    persistent: Boolean,
    width: {
      type: Number,
      default: 360,
    },
  },
  watch: {
    value(open) {
      if (open) this.autoFocus()
    },
  },
  methods: {
    handleOutsideClick() {
      if (this.persistent) return

      this.$emit('input', false)
    },
    autoFocus() {
      const element = this.$el.querySelector('[autofocus]')

      if (element) requestAnimationFrame(() => element.focus())
      else requestAnimationFrame(() => document.activeElement.blur())
    },
  },
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to {
  @apply opacity-0;
}
</style>
