<template>
  <modal
    name="writeListModal"
    :height="600"
    :width="360"
  >
    <form
      class="p-4"
      @submit.prevent="hide()"
    >
      <h1
        class="text-xl mb-2 align-middle text-center"
      >
        <b> {{ this.$store.Item.item }} </b>
      </h1>

      <div
        id="item"
        style="min-height: 50vh;"
        class="block w-full h-full border border-gray-500 rounded-sm"
        autofocus
        @blur="saveChanges"
      >
        <div
          class="flex p-1"
        >
          <form
            class="flex flex-grow"
            @submit.prevent="addListItem"
          >
            <input
              v-model="newListItem"
              class="flex-grow px-1 outline-none"
              type="text"
              placeholder="New List Item"
            >
            <button
              type="submit"
              class="border-2 p-1 border-gray-500 text-gray-500 hover:text-yellow-500 hover:border-yellow-500 rounded-sm"
              @click="addListItem"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </form>
        </div>
        <ol>
          <li
            v-for="(it, i) in this.$store.Item.items"
            :key="i"
            class="border-gray-500 flex items-top bg-gray-100 text-left p-1"
            :class="{ 'bg-gray-200': !(i % 2) }"
          >
            {{ it.item }}
          </li>
        </ol>
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
  </modal>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    items: [],
    newListItem: '',
  }),
  methods: {
    addListItem() {
      this.$store.Item.items.push({ 'item': this.newListItem })
      this.newListItem = ''
      this.saveChanges()
      this.fetchListItems()
    },
    fetchListItems() {
      this.items = this.$store.Item.items
    },
    saveClose() {
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/lists/${this.$store.Item._id}`, this.$store.Item)
        .then(() => {
          this.$modal.hide('writeListModal')
        })
    },
    hide() {
      this.$modal.hide('writeListModal')
    },
    saveChanges() {
      axios.patch(`/lists/${this.$store.Item._id}`, this.$store.Item)
    },
  },
}
</script>
