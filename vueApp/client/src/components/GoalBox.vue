<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 32px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <h2 class="p-2 bg-gray-200 border-b-2 border-teal-500">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-teal-500"
        minimized-class="hover:text-teal-500"
      >
        <trending-up-icon />
      </button-toggle-box>
      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Goals
      </span>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addGoal"
      >
        <input
          v-model="newGoal"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Goal"
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
        class="p-1 ml-1 border-2 border-teal-500 bg-teal-500 text-white hover:bg-teal-400 rounded-sm flex-shrink-0"
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
      <ol v-show="($store.goals.length>0) && (expanded)">
        <li
          v-for="(goal, i) in $store.goals.slice().reverse()"
          :key="goal._id"
          class="flex py-2 items-top bg-gray-100 text-left"
          :class="{ 'bg-gray-200': !(i % 2), 'bg-blue-200': ($store.highlightGoalID === goal._id) }"
        >
          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <span
              class="truncate flex-grow pl-3 bg-transparent border-gray-500 h-full w-full"
            >
              {{ goal.name }}
            </span>
          </div>

          <div class="flex px-1">
            <button
              class="flex-shrink-0 text-gray-500 hover:text-blue-500 mx-1"
              @click="showGoalModal(goal)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="$store.goals.length==0"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The Goal Box is empty. Create a new Goal above!
        </p>
      </div>

      <modal
        name="goalModal"
        height="auto"
        width="400px"
      >
        <goal-modal />
      </modal>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { PlusIcon, TrendingUpIcon, PackageIcon, MenuIcon } from 'vue-feather-icons'
import 'vue-swatches/dist/vue-swatches.min.css'

import bus from './../bus.js'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import GoalModal from '../modals/GoalModal.vue'

export default {
  components: {
    PlusIcon,
    TrendingUpIcon,
    PackageIcon,
    MenuIcon,
    ButtonToggleBox,
    GoalModal,
  },
  data() {
    return {
      goalListKey: 0,
      color: '',
      newGoal: '',
      expanded: true,
      box: 'Goal',
    }
  },
  created() {
    this.listenToEvents()
  },
  methods: {
    addGoal() {
      let param = {
        name: this.newGoal,
      }
      axios
        .post('/goals', param)
        .then(() => {
          this.clearGoal()
          this.fetchGoals()
        })
    },
    clearGoal() {
      this.newGoal = ''
    },
    refreshGoals() {
      bus.$emit('refreshGoals')
    },
    changeGoalItem(goal) {
      let id = goal._id
      let it = goal.item
      axios
        .put(`/changeGoalItem/${id}/${it}`)
        .then(() => {
          this.fetchGoals()
        })
    },
    deleteGoal(id) {
      axios
        .get(`/deleteGoal/${id}`)
        .then(() => {
          this.fetchGoals()
        })
    },
    showWriteGoal(goal) {
      this.$store.Item = goal

      this.$modal.show('goalModal',)
    },
    listenToEvents() {
      bus.$on('refreshGoals', () => {
        this.fetchGoals() // update goal
      })
    },
    showGoalModal(goal) {
      this.$store.Item = goal

      this.$modal.show('goalModal',)
    },
    saveChanges(goal) {
      this.$store.Item = goal
      this.$store.Item.lastEdited = new Date()
      axios.patch(`/goals/${this.$store.Item._id}`, this.$store.Item)
    },
  },
}

</script>
