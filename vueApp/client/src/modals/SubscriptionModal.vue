<template>
  <modal
    name="subscriptionModal"
    :height="600"
    :width="360"
  >
    <div
      style="overflow-y: scroll; height: 600px;"
    >
      <form
        class="p-4"
        @submit.prevent="hide()"
      >
        <h1 class="text-xl font-bold mb-2 align-middle text-center">
          Edit Subscription
        </h1>

        <label
          class="flex bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
          for="item"
        >
          <span class="flex-grow align-middle">Subscription Name</span>
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
          <span class="flex-grow align-middle">Subscription Money Value</span>
          <button
            class="flex-shrink-0 text-black hover:text-red-500 rounded-sm"
            @click="$store.Item.valueMoney = null"
            @blur="saveChanges"
          >
            <x-icon />
          </button>
        </label>
        <input
          id="item"
          v-model="$store.Item.valueMoney"
          class="block w-full p-1 border border-gray-500 rounded-sm"
          type="number"
          autofocus
          @blur="saveChanges"
        >

        <label
          class="flex bg-gray-500 py-1 px-3 text-black rounded-sm mt-3 block"
        >
          <span class="flex-grow align-middle">Due Date</span>
          <button
            class="flex-shrink-0 text-black hover:text-red-500 rounded-sm"
            @click="$store.Item.dueDate = null"
            @blur="saveChanges"
          >
            <x-icon />
          </button>
        </label>
        <flat-pickr
          v-model="$store.Item.dueDate"
          class="block w-full p-1 border border-gray-500 rounded-sm"
          :config="{ enableTime: true,
                     inline: true,
                     onChange: saveChanges,
                     static: true,
          }"
        />

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
import { XIcon, TrashIcon } from 'vue-feather-icons'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import bus from '../bus.js'

export default {
  components: { XIcon, TrashIcon, FlatPickr },
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
      axios.patch(`/subscriptions/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('subscriptionModal')
        })
    },
    hide() {
      this.$modal.hide('subscriptionModal')
    },
    fetchGoals() {
      axios.get('/goals').then(response => {
        this.goals = response.data
      })
    },
    saveChanges() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/subscriptions/${this.$store.Item._id}`, this.$store.Item)
    },
    deleteItem() {
      axios.delete(`/subscriptions/${this.$store.Item._id}`)
        .then(() => {
          this.$modal.hide('subscriptionModal')
          bus.$emit('refreshSubscriptions')
        })
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/subscriptions/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('subscriptionModal')
          bus.$emit('refreshSubscriptions')
        })
    },
  },
}
</script>
