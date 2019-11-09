<template>
  <button
    class="px-1 text-gray-600 align-middle"
    :class="value ? expandedClass : minimizedClass"
    @click="toggleExpanded"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    value: Boolean,
    expandedClass: {
      type: String,
      required: true,
    },
    minimizedClass: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleExpanded() {
      this.$emit('input', !this.value)
    },
  },
}
</script>
