<template>
  <base-modal
    :value="value"
    :width="800"
    @input="$emit('input', $event)"
  >
    <form
      class="p-4"
      @submit.prevent=""
    >
      <h1
        class="text-xl mb-2 align-middle text-center"
      >
        Edit Reward
      </h1>

      <label
        class="flex bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
        for="item"
      >
        <span class="flex-grow align-middle">Reward Name</span>
        <button
          class="flex-shrink-0 text-black hover:text-red-500 rounded-sm"
          @click="$store.Item.item = null"
          @blur="saveChanges"
        >
          <x-icon />
        </button>
      </label>
      <input
        id="item"
        v-model="$store.Item.item"
        class="block w-full p-1 border border-gray-500 rounded-sm"
        type="text"
        autofocus
        @blur="saveChanges"
      >

      <label
        class="flex bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
        for="item"
      >
        <span class="flex-grow align-middle">Reward Cost</span>
        <button
          class="flex-shrink-0 text-black hover:text-red-500 rounded-sm"
          @click="$store.Item.cost = null"
          @blur="saveChanges"
        >
          <x-icon />
        </button>
      </label>
      <input
        id="item"
        v-model="$store.Item.cost"
        class="block w-full p-1 border border-gray-500 rounded-sm"
        type="number"
        autofocus
        @blur="saveChanges"
      >

      <div class="mt-4 flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm"
          @click="hide"
        >
          Done
        </button>

        <button
          class="bg-red-500 hover:bg-red-600 py-1 px-3 text-white rounded-sm"
          @click="hide"
        >
          Cancel
        </button>
      </div>
    </form>
  </base-modal>
</template>

<script>
import axios from 'axios'

import { XIcon } from 'vue-feather-icons'

import BaseModal from './BaseModal.vue'

export default {
  components: {
    BaseModal,
    XIcon,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    register: false,
    item: '',
  }),
  methods: {
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/rewards/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.hide()
        })
    },
    hide() {
      this.$emit('input', false)
    },
    saveChanges() {
      axios.patch(`/rewards/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteItem() {
      axios.delete(`/rewards/${this.$store.Item._id}`)
      this.hide()
    },
  },
}
</script>
