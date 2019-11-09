<template>
  <span
    v-if="value"
    class="p-1 ml-1 border-2 text-white rounded-sm flex-shrink-0"
    :title="string"
    :class="{ 'border-red-400 bg-red-400': (value < 0),
              'border-gray-500 bg-gray-500': (value == 0),
              'border-green-400 bg-green-400': (value > 0) }"
  >
    {{ string }}
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  computed: {
    string() {
      if (this.value >= 0) { return `$${this.value}` }
      let absValue = Math.abs(this.value);
      return `-$${absValue}`
    }
  }
}
</script>
