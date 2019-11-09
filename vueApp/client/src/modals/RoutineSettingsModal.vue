<template>
  <form
    class="p-4"
    @submit.prevent="hide()"
  >
    <h1 class="text-xl font-bold mb-2 align-middle text-center">
      Routine Box Settings
    </h1>

    <div
      class="flex"
    >
      <input
        id="showDeleteItemButton"
        class="block p-1 border border-gray-500 rounded-sm flex-shrink"
        type="checkbox"
        autofocus
        @blur="saveChanges"
      >
      <label
        class="block flex-grow"
        for="showDeleteItemButton"
      >
        Show Delete Item Button
      </label>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm"
        @click="hide"
      >
        Done
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    register: false,
    item: '',
    goals: [],
  }),
  methods: {
    hide() {
      this.$modal.hide('routineSettingsModal')
    },
    saveChanges() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/routines/${this.$store.Item._id}`, this.$store.Item)
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/routines/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.hide()
        })
    },
  },
}
</script>
