<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 16px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- listbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-indigo-600">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-indigo-600"
        minimized-class="hover:text-indigo-600"
      >
        <list-icon />
      </button-toggle-box>
      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Lists
      </span>
      <button
        class="text-gray-600 hover:text-indigo-600 align-middle float-right"
      >
        <settings-icon />
      </button>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addList"
      >
        <input
          v-model="newList"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New List"
        >
        <button
          type="submit"
          class="border-2 p-1 border-gray-500 text-gray-500 hover:text-yellow-500 hover:border-yellow-500 rounded-sm"
        >
          <plus-icon />
        </button>
      </form>
      <button
        type="submit"
        class="p-1 ml-1 border-2 border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-400 rounded-sm flex-shrink-0"
      >
        <package-icon />
      </button>
    </div>

    <div
      class=""
      style="-webkit-column-break-inside: avoid;
          page-break-inside: avoid;
               break-inside: avoid;
               overflow-y: scroll;
               max-height: 70vh;"
    >
      <ol v-show="(lists.length>0) && (expanded)">
        <li
          v-for="(list, i) in lists.slice().reverse()"
          :key="list._id"
          class="border-gray-500 border-t-2 flex items-top bg-gray-100 text-left p-1"
          :class="{ 'bg-gray-200': !(i % 2) }"
          @mouseleave="changeHighlight(list)"
          @mouseenter="changeHighlight(list)"
        >
          <button
            class="border-gray-500 border-2 px-1 text-gray-500 hover:text-yellow-600 hover:border-yellow-600 rounded-sm"
            @click="showWriteListModal(list)"
          >
            <list-icon />
          </button>

          <div />

          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <input
              v-model="list.item"
              type="text"
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
              :class="{
                'line-through text-gray-600': list.completion,
                'text-gray-900': !list.completion
              }"
              @keyup.enter="saveChanges(list)"
            >
          </div>

          <div class="flex">
            <button
              class="border-gray-500 ml-1 border-2 flex-shrink-0 text-gray-500 hover:text-blue-500 hover:border-blue-500 p-1 rounded-sm"
              @click="showListModal(list)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="lists.length==0"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The List Box is empty. Create a new List above!
        </p>
      </div>

      <write-list-modal style="overflow-y: scroll;" />
      <list-modal style="overflow-y: scroll;" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ListIcon, SettingsIcon, PlusIcon, PackageIcon, MenuIcon } from 'vue-feather-icons'

import bus from './../bus.js'

import ListModal from '../modals/ListModal.vue'
import WriteListModal from '../modals/WriteListModal.vue'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'

export default {
  components: {
    ListIcon,
    SettingsIcon,
    PlusIcon,
    PackageIcon,
    MenuIcon,
    WriteListModal,
    ButtonToggleBox,
    ListModal,
  },
  data() {
    return {
      listListKey: 0,
      colors: [],
      lists: [],
      newList: '',
      expanded: true,
      box: 'List',
    }
  },
  created() {
    this.fetchLists()
    this.listenToEvents()
  },
  methods: {
    changeHighlight(list) {
      if (this.$store.highlightRoutineID === list.routineID) { this.$store.highlightRoutineID = null } else { this.$store.highlightRoutineID = list.routineID }
      if (this.$store.highlightGoalID === list.goalID) {
        this.$store.highlightGoalID = null
      } else { this.$store.highlightGoalID = list.goalID }
    },
    addList() {
      let param = {
        item: this.newList,
      }
      axios
        .post('/lists', param)
        .then(() => {
          this.clearList()
          this.fetchLists()
        })
    },
    clearList() {
      this.newList = ''
    },
    fetchLists() {
      axios.get('/lists').then(response => {
        this.lists = response.data
      })
    },
    toggleListCompletion(list) {
      let id = list._id
      if (list.completion) {
        axios
          .patch(`/lists/${id}`, { completion: false })
          .then(() => {
            list.completion = false
          })
      } else {
        axios
          .patch(`/lists/${id}`, { completion: true, focus: false })
          .then(() => {
            list.completion = true
            list.focus = false
            this.fetchLists()
          })
      }
    },
    toggleListFocus(list) {
      let id = list._id
      if (list.focus) {
        axios
          .patch(`/lists/${id}`, { focus: false })
          .then(() => {
            list.focus = false
            this.fetchLists()
          })
      } else {
        axios
          .patch(`/lists/${id}`, { focus: true })
          .then(() => {
            list.focus = true
            this.fetchLists()
          })
      }
    },
    saveChanges(list) {
      list.lastEdited = new Date()
      axios
        .patch(`/lists/${list._id}`, list)
        .then(() => {
          this.fetchLists()
        })
    },
    deleteList(list) {
      axios
        .delete(`/lists/${list._id}`)
        .then(() => {
          bus.$emit('refreshLists')
        })
    },
    anyChangeTimer(item) {
      if (item.timer) {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/false`)
          .then(() => {
            this.fetchLists()
          })
      } else {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/true`)
          .then(() => {
            this.fetchLists()
          })
      }
    },
    showWriteListModal(list) {
      this.$store.Item = list

      this.$modal.show('writeListModal',)
    },
    showListModal(list) {
      this.$store.Item = list

      this.$modal.show('listModal',)
    },
    showListSettingsModal() {
      this.$modal.show('listSettingsModal',)
    },
    listenToEvents() {
      bus.$on('refreshLists', () => {
        this.fetchLists() // update list
      })
    },
  },
}

</script>
