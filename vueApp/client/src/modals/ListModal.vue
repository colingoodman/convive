<template>
  <modal
    name="listModal"
    :height="600"
    :width="360"
  >
    <div
      style="overflow-y: scroll; height: 600px;"
    >
      <form
        class="p-4"
      >
        <h1 class="text-xl font-bold mb-2 align-middle text-center">
          Edit List
        </h1>

        <label
          class="flex bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
          for="item"
        >
          <span class="flex-grow align-middle">List Name</span>
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
        >
          <span class="flex-grow align-middle">List's Aligned Goals</span>
          <button
            class="flex-shrink-0 text-black hover:text-red-500 rounded-sm"
            @click="$store.Item.goalID = null"
            @blur="saveChanges"
          >
            <x-icon />
          </button>
        </label>

        <div
          style="max-height: 180px; overflow-y: scroll;"
          class="block w-full p-1 border border-gray-500 rounded-sm"
        >
          <ol style="y-v">
            <li
              v-for="goal in goals.slice().reverse()"
              :key="goal._id"
              class="my-2"
            >
              <button
                class="p-2 bg-gray-200 border-yellow-600 text-gray-500 hover:text-yellow-600 hover:border-2"
                @click="setGoal(goal)"
              >
                <trending-up-icon />
              </button>
              {{ goal.name }}
            </li>
          </ol>
        </div>

        <span
          v-show="this.$store.Item.createdAt"
          class="bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
          for="createdAt"
        >
          Date of Creation
        </span>
        <p
          class="block w-full p-1 border border-gray-500 rounded-sm"
        >
          <span
            v-show="this.$store.Item.createdAt"
            class="block w-full rounded-sm"
          >
            {{ this.$store.Item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
          </span>
          <span
            v-show="this.$store.Item.createdAt"
            class="block w-full rounded-sm text-gray-500"
          >
            {{ this.$store.Item.createdAt | moment("from", "now") }}
          </span>
        </p>

        <div class="mt-4 flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm my-1"
            @click="saveClose"
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
    </div>
  </modal>
</template>

<script>
import axios from 'axios'
import { XIcon, TrashIcon, TrendingUpIcon } from 'vue-feather-icons'

import bus from '../bus.js'

export default {
  components: { XIcon, TrashIcon, TrendingUpIcon },
  data: () => ({
    register: false,
    item: '',
    goals: [],
  }),
  created() {
    this.fetchGoals()
  },
  methods: {
    setGoal(goal) {
      this.$store.Item.goalID = goal._id
      this.$store.Item.goalName = goal.name
      axios.patch(`/lists/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('listModal')
        })
    },
    hide() {
      this.$modal.hide('listModal')
    },
    fetchGoals() {
      axios.get('/goals').then(response => {
        this.goals = response.data
      })
    },
    saveChanges() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/lists/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteItem() {
      axios.delete(`/lists/${this.$store.Item._id}`)
        .then(() => {
          this.$modal.hide('listModal')
          bus.$emit('refreshLists')
        })
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/lists/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('listModal')
          bus.$emit('refreshLists')
        })
    },
  },
}
</script>
