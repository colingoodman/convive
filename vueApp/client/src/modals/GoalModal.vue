<template>
  <form
    class="p-4"
    @submit.prevent="hide()"
  >
    <h1 class="text-xl font-bold mb-2 align-middle text-center">
      Edit Item
    </h1>

    <label
      class="block"
      for="item"
    >
      Item
    </label>
    <input
      id="item"
      v-model="$store.Item.item"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="text"
      autofocus
      @blur="saveChanges"
    >

    <span
      v-show="this.$store.Item.createdAt"
      class="block mt-3"
      for="createdAt"
    >
      Date of Creation
    </span>
    <span
      v-show="this.$store.Item.createdAt"
      class="ml-2 block w-full p-1 rounded-sm"
    >
      {{ this.$store.Item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
    </span>
    <span
      v-show="this.$store.Item.createdAt"
      class="ml-2 block w-full p-1 rounded-sm text-gray-500"
    >
      {{ this.$store.Item.createdAt | moment("from", "now") }}
    </span>

    <label
      v-show="this.$store.Item.difficulty"
      class="block mt-3"
      for="difficulty"
    >
      Difficulty
    </label>
    <input
      v-show="this.$store.Item.difficulty"
      name="difficulty"
      min="1"
      max="5"
      type="range"
    >
    <div class="mt-4 flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm"
        @click="hide"
      >
        Done
      </button>

      <button
        class="flex-shrink-0 text-gray-500 hover:text-red-500"
        @click="deleteItem"
      >
        <trash-icon />
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import { TrashIcon } from 'vue-feather-icons'

import bus from '../bus.js'

export default {
  components: { TrashIcon },
  data: () => ({
    register: false,
    item: '',
  }),
  methods: {
    hide() {
      this.$modal.hide('goalModal')
    },
    saveChanges() {
      axios.patch(`/goals/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteItem() {
      axios.delete(`/goals/${this.$store.Item._id}`)
        .then(() => {
          this.$modal.hide('goalModal')
          bus.$emit('refreshGoals')
        })
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/goals/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('goalModal')
        })
    },
  },
}
</script>
