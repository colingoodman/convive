<template>
  <form
    class="p-4"
    @submit.prevent="hide()"
  >
    <h1 class="text-xl font-bold mb-2 align-middle text-center">
      Edit Routine
    </h1>

    <label
      class="block"
      for="item"
    >
      Routine Name:
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
      class="bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
      for="item"
    >
      Routine Duration
    </label>
    <input
      id="item"
      v-model="$store.Item.duration"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="number"
      autofocus
      @blur="saveChanges"
    >

    <label
      class="bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
      for="item"
    >
      Task Money Value
    </label>
    <input
      id="item"
      v-model="$store.Item.valueMoney"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="number"
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
    <div style="max-height: 180px; overflow-y: scroll;">
      <ol>
        <li
          v-for="goal in $store.goals.slice().reverse()"
          :key="goal._id"
          class="my-2"
        >
          <button
            class="p-2 bg-gray-200 border-yellow-600 text-gray-500 hover:text-yellow-600 hover:border-2"
            @click="setGoal(goal)"
          >
            <check-icon />
          </button>
          {{ goal.name }}
        </li>
      </ol>
    </div>

    <div />

    <div class="mt-4 flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm"
        @click="hide"
      >
        Done
      </button>

      <button
        class="flex-shrink-0 text-gray-500 hover:text-red-500"
        @click="deleteRoutine"
      >
        <trash-icon />
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import { TrashIcon, CheckIcon } from 'vue-feather-icons'

import bus from '../bus.js'

export default {
  components: { TrashIcon, CheckIcon },
  data: () => ({
    register: false,
    item: '',
  }),
  methods: {
    setGoal(goal) {
      this.$store.Item.goalID = goal._id
      this.$store.Item.goalName = goal.name
      this.saveChanges()
    },
    hide() {
      this.$modal.hide('routineModal')
    },
    saveChanges() {
      axios.patch(`/routines/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteRoutine() {
      axios.delete(`/routines/${this.$store.Item._id}`)
        .then(() => {
          this.$modal.hide('routineModal')
          bus.$emit('refreshRoutines')
        })
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/routines/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('routineModal')
          bus.$emit('refreshRoutines')
        })
    },
  },
}
</script>
