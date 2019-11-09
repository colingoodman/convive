<template>
  <span
    v-show="value"
    class="p-1 ml-1 border-2 border-red-500 bg-red-500 text-white rounded-sm flex-shrink-0"
    :title="`Due in ${dueDateDistance(value)}`"
  >
    {{ dueDateDistance(value) }}
  </span>
</template>

<script>

import formatDistance from 'date-fns/formatDistance'

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  methods: {
    dueDateDistance(date) {
      return formatDistance(new Date(date), new Date())
    },
  },
}
</script>
