<template>
  <base-modal
    :value="value"
    :width="800"
    @input="$emit('input', $event)"
  >
    <form
      class="p-4"
      @submit.prevent="hide()"
    >
      <h1
        class="text-xl mb-2 align-middle text-center"
      >
        New Journal Entry to <b> {{ this.$store.Item.name }} </b>
      </h1>

      <textarea
        id="item"
        v-model="$store.Item.item"
        style="min-height: 50vh;"
        class="block w-full h-full p-1 border border-gray-500 rounded-sm"
        type="text"
        autofocus
        @blur="saveChanges"
      />

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

import BaseModal from './BaseModal.vue'

export default {
  components: {
    BaseModal,
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
      axios.patch(`/journals/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('journalModal')
        })
    },
    hide() {
      this.$emit('input', false)
    },
    saveChanges() {
      axios.patch(`/journals/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteItem() {
      axios.delete(`/journals/${this.$store.Item._id}`)
      this.$modal.hide('writeJournalModal')
    },
  },
}
</script>
