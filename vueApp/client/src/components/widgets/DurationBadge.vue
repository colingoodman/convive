<template>
  <span
    v-show="value"
    class="p-1 ml-1 border-2 border-gray-500 bg-gray-500 text-white rounded-sm flex-shrink-0"
    :title="`${value} Minutes`"
  >
    {{ value }}
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
}
</script>
