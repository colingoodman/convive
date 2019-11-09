<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 32px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- journalbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-green-600">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-green-600"
        minimized-class="hover:text-green-600"
      >
        <edit-2-icon />
      </button-toggle-box>
      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Journals
      </span>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addJournal"
      >
        <input
          v-model="newJournal"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Journal"
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
        class="p-1 ml-1 border-2 border-green-500 bg-green-500 text-white hover:bg-green-400 rounded-sm flex-shrink-0"
      >
        <package-icon />
      </button>
    </div>

    <div
      class=""
      style="-webkit-column-break-inside: avoid;
          page-break-inside: avoid;
               break-inside: avoid;"
    >
      <ol v-show="(journals.length>0) && (expanded)">
        <li
          v-for="(journal, i) in journals.slice().reverse()"
          :key="journal._id"
          class="flex py-2 items-top bg-gray-100 text-left"
          :class="{ 'bg-gray-200': !(i % 2) }"
        >
          <button
            class="px-3 border-green-500 text-gray-500 hover:text-green-600"
            @click="writeJournalOpen = true"
          >
            <edit-icon />
          </button>

          <div />

          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <span
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
            >
              {{ journal.name }}
            </span>
          </div>

          <span
            class="text-gray-500"
          >
            {{ journal.lastEdited | moment("from", "now") }}
          </span>

          <duration-badge :value="journal.duration" />

          <div class="flex px-1">
            <button
              class="flex-shrink-0 text-gray-500 hover:text-blue-500 mx-1"
              @click="showItemModal(journal)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="journals.length==0"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The Journal Box is empty. Create a new Journal above!
        </p>
      </div>

      <write-journal-modal v-model="writeJournalOpen" />
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { PlusIcon, EditIcon, Edit2Icon, PackageIcon, MenuIcon } from 'vue-feather-icons'

import bus from './../bus.js'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import DurationBadge from './widgets/DurationBadge.vue'
import WriteJournalModal from '../modals/WriteJournalModal.vue'

export default {
  components: {
    ButtonToggleBox,
    PlusIcon,
    EditIcon,
    Edit2Icon,
    PackageIcon,
    DurationBadge,
    WriteJournalModal,
    MenuIcon,
  },
  data() {
    return {
      journalListKey: 0,
      colors: [],
      journals: [],
      newJournal: '',
      expanded: true,
      box: 'Journal',
      writeJournalOpen: false,
    }
  },
  created() {
    this.fetchJournals()
    this.listenToEvents()
  },
  methods: {
    addJournal() {
      let param = {
        name: this.newJournal,
      }
      axios
        .post('/journals', param)
        .then(() => {
          this.clearJournal()
          this.fetchJournals()
        })
    },
    clearJournal() {
      this.newJournal = ''
    },
    refreshJournals() {
      bus.$emit('refreshJournals')
    },
    fetchJournals() {
      axios.get('/journals').then(response => {
        this.journals = response.data
      })
    },
    changeJournalItem(journal) {
      let id = journal._id
      let it = journal.item
      axios
        .put(`/changeJournalItem/${id}/${it}`)
        .then(() => {
          this.fetchJournals()
        })
    },
    deleteJournal(id) {
      axios
        .get(`/deleteJournal/${id}`)
        .then(() => {
          this.fetchJournals()
        })
    },
    showWriteJournal(journal) {
      this.$store.Item = journal

      this.$modal.show('writeJournalModal',)
    },
    listenToEvents() {
      bus.$on('refreshJournals', () => {
        this.fetchJournals() // update journal
      })
    },
    showItemModal(journal) {
      this.$store.Item = journal

      this.$modal.show('itemModal',)
    },
  },
}

</script>
