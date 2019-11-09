<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 32px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- routinebox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-blue-500">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-blue-500"
        minimized-class="hover:text-blue-500"
      >
        <copy-icon />
      </button-toggle-box>

      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Routines
      </span>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addRoutine"
      >
        <input
          v-model="newRoutine"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Routine"
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
        class="p-1 ml-1 border-2 border-blue-500 bg-blue-500 text-white hover:bg-blue-400 rounded-sm flex-shrink-0"
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
      <ol v-show="(routines.length>0) && (expanded)">
        <li
          v-for="(routine, i) in $store.routines.slice().reverse()"
          :key="routine._id"
          class="border-gray-500 border-t-2 flex items-top bg-gray-100 text-left p-1"
          :class="{ 'bg-gray-200': !(i % 2), 'bg-blue-200': ($store.highlightRoutineID === routine._id), 'bg-gray-400': routine.completion }"
        >
          <button
            v-show="routine.completion==false"
            class="border-gray-500 border-2 px-1 text-gray-500 hover:text-yellow-600 hover:border-yellow-600 rounded-sm"
            @click="completeRoutine(routine)"
          >
            <check-icon />
          </button>

          <button
            v-show="routine.completion==true"
            class="border-2 px-1 border-gray-500 text-gray-500 hover:text-red-500 hover:border-red-500 rounded-sm"
            @click="uncompleteRoutine(routine)"
          >
            <x-icon />
          </button>

          <button
            class="border-2 mx-1 px-1 border-gray-500 text-gray-500 hover:text-yellow-500 hover:border-yellow-500 rounded-sm"
            @click="routineGenerateTask(routine)"
          >
            <plus-icon />
          </button>

          <div />

          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <input
              v-model="routine.item"
              type="text"
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
              :class="{
                'line-through text-gray-600': routine.completion,
                'text-gray-900': !routine.completion
              }"
              @keyup.enter="changeRoutineItem(routine)"
            >
          </div>

          <div
            v-show="routine.goalID"
            class="text-gray-500 hover:text-teal-400 p-1 mr-1 flex"
            :class="{
              'line-through text-gray-500': routine.completion,
              'text-teal-500': !routine.completion
            }"
            :title="`${routine.goalName}`"
          >
            <trending-up-icon />
          </div>

          <div
            v-show="routine.completions"
            class="flex p-1 border-2 border-gray-500 rounded-sm hover:text-blue-400 hover:border-blue-400 text-gray-500"
            :title="`${routine.completions} completions`"
          >
            <copy-icon />
            <span>{{ routine.completions }}</span>
          </div>

          <duration-badge :value="Number(routine.duration)" />

          <money-value-badge :value="Number(routine.valueMoney)" />

          <div class="flex">
            <button
              class="border-gray-500 ml-1 border-2 flex-shrink-0 text-gray-500 hover:text-blue-500 hover:border-blue-500 p-1 rounded-sm"
              @click="showRoutineModal(routine)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="routines.length==0 && expanded"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The Routine Box is empty. Create a new Routine above!
        </p>
      </div>

      <modal
        name="routineModal"
        height="600px"
        width="400px"
      >
        <routine-modal />
      </modal>

      <modal
        name="routineSettingsModal"
        height="600px"
        width="400px"
      >
        <routine-settings-modal />
      </modal>
    </div>
  </div>
</template>

<script>
import { addDays } from 'date-fns'
import axios from 'axios'
import { CopyIcon, PackageIcon, PlusIcon, MenuIcon, TrendingUpIcon, CheckIcon, XIcon } from 'vue-feather-icons'

import bus from './../bus.js'

import Timer from './widgets/Timer.vue'
import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import RoutineModal from '../modals/RoutineModal.vue'
import RoutineSettingsModal from '../modals/RoutineSettingsModal.vue'
import DurationBadge from './widgets/DurationBadge.vue'
import MoneyValueBadge from './widgets/MoneyValueBadge.vue'

export default {
  components: {
    CopyIcon,
    PackageIcon,
    PlusIcon,
    MenuIcon,
    TrendingUpIcon,
    CheckIcon,
    XIcon,
    Timer,
    ButtonToggleBox,
    RoutineModal,
    RoutineSettingsModal,
    DurationBadge,
    MoneyValueBadge,
  },
  data() {
    return {
      routines: [],
      newRoutine: '',
      expanded: true,
      box: 'Routine',
    }
  },
  created() {
    this.fetchRoutines()
    this.listenToEvents()
  },
  methods: {
    showRoutineSettingsModal() {
      this.$modal.show('routineSettingsModal',)
    },
    addRoutine() {
      let param = {
        item: this.newRoutine,
      }
      axios
        .post('/routines', param)
        .then(() => {
          this.clearRoutine()
          this.fetchRoutines()
        })
    },
    clearRoutine() {
      this.newRoutine = ''
    },
    refreshRoutines() {
      bus.$emit('refreshRoutines')
    },
    fetchRoutines() {
      axios.get('/routines').then(response => {
        this.routines = response.data
        var now = new Date()
        for (var i = 0; i < this.routines.length; i++) {
          if (now >= new Date(this.routines[i].refreshDate)) {
            this.routineGenerateTask(this.routines[i])
            this.uncompleteRoutine(this.routines[i])
            // this.routines[i].refreshDate.setTime(this.routines[i].refreshDate.getTime() + this.routines[i].refreshRateHours * 1000 * 60 * 60)
            // this.routines[i].refreshDate.setTime(now + 3000)
            // this.routines[i].refreshDate.setHours(0)

            var newRefreshDate = new Date()
            newRefreshDate.setHours(0)
            newRefreshDate.setMinutes(0)
            newRefreshDate.setSeconds(0)
            newRefreshDate = addDays(newRefreshDate, 1)
            // newRefreshDate.setTime(now.getTime() + 6000)
            var id = this.routines[i]._id
            axios
              .patch(`/routines/${id}`, { refreshDate: newRefreshDate })
          }
        }
      })
    },
    completeRoutine(routine) {
      let id = routine._id
      let newCompletions = routine.completions + 1
      routine.editing = false
      axios
        .patch(`/routines/${id}`, { completion: true, completions: newCompletions })
        .then(() => {
          routine.completion = true
          routine.completions += 1
        })
    },
    uncompleteRoutine(routine) {
      let id = routine._id
      let newCompletions = routine.completions - 1
      routine.editing = false
      axios
        .patch(`/routines/${id}`, { completion: false, completions: newCompletions })
        .then(() => {
          routine.completion = false
          routine.completions -= 1
        })
    },
    changeRoutineItem(routine) {
      let id = routine._id
      let it = routine.item
      axios
        .put(`/changeRoutineItem/${id}/${it}`)
        .then(() => {
          this.fetchRoutines()
        })
    },
    deleteRoutine(id) {
      axios
        .get(`/deleteRoutine/${id}`)
        .then(() => {
          this.fetchRoutines()
        })
    },
    showRoutineModal(routine) {
      this.$store.Item = routine

      this.$modal.show('routineModal',)
    },
    listenToEvents() {
      bus.$on('refreshRoutines', () => {
        this.fetchRoutines() // update routine
      })
    },
    routineGenerateTask(routine) {
      if (event) event.preventDefault()
      let param = {
        item: routine.item,
        priority: routine.priority,
        difficulty: routine.difficulty,
        goalID: routine.goalID,
        duration: routine.duration,
        valueMoney: routine.valueMoney,
      }
      axios
        .post(`/routineGenerateTask/${routine._id}`, param)
        .then(() => {
          this.clearRoutine()
          this.refreshTasks()
        })
    },
    refreshTasks() {
      bus.$emit('refreshTasks')
    },
  },
}

</script>
