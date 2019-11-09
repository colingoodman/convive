<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 16px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- taskbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-yellow-600">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-yellow-600"
        minimized-class="hover:text-yellow-600"
      >
        <check-icon />
      </button-toggle-box>
      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Tasks
      </span>
      <button
        class="text-gray-600 hover:text-yellow-600 align-middle float-right"
        @click="showTaskSettingsModal"
      >
        <settings-icon />
      </button>
      <button
        class="mr-2 text-gray-600 hover:text-yellow-600 align-middle float-right"
        @click="taskHelpModal = true"
      >
        <help-circle-icon />
      </button>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addTask"
      >
        <input
          v-model="newTask"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Task"
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
        class="p-1 ml-1 border-2 border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-400 rounded-sm flex-shrink-0"
      >
        <package-icon />
      </button>
    </div>

    <!-- tag list -->
    <div
      v-show="expanded"
      class="flex p-1 overflow-x-auto border-t-2 border-gray-500"
    >
      <button
        v-for="goal in $store.goals"
        :key="goal._id"
        class="border-2 px-1 mr-1 border-gray-500 rounded-sm flex-shrink-0"
        :class="{
          'bg-teal-500 text-white border-teal-500 hover:bg-teal-400 hover:border-teal-500': tags.includes(goal._id),
          'bg-white text-gray-500 border-gray-500 hover:text-teal-500 hover:border-teal-500': !tags.includes(goal._id),
        }"
        @click="toggleTag(goal._id)"
      >
        {{ goal.name }}
      </button>
    </div>

    <div
      class=""
      style="-webkit-column-break-inside: avoid;
          page-break-inside: avoid;
               break-inside: avoid;
               overflow-y: auto;
               max-height: 81vh;"
    >
      <ol v-show="(tasks.length>0) && (expanded)">
        <li
          v-for="(task, i) in filteredTasks.slice().reverse()"
          :key="task._id"
          class="border-gray-500 border-t-2 flex items-top bg-gray-100 text-left p-1"
          :class="{ 'bg-gray-200': !(i % 2), 'bg-gray-400': task.completion }"
          @mouseleave="changeHighlight(task)"
          @mouseenter="changeHighlight(task)"
        >
          <button
            v-show="task.completion==false"
            class="border-gray-500 border-2 px-1 text-gray-500 hover:text-yellow-600 hover:border-yellow-600 rounded-sm"
            @click="toggleTaskCompletion(task)"
          >
            <check-icon />
          </button>
          <button
            v-show="task.completion==true"
            class="border-2 px-1 border-gray-500 text-gray-500 hover:text-red-500 hover:border-red-500 rounded-sm"
            @click="toggleTaskCompletion(task)"
          >
            <x-icon />
          </button>

          <div />

          <button
            class="hover:text-red-500 mx-1"
            :class="{
              'text-gray-500': !task.focus,
              'text-red-500': task.focus
            }"
            @click="toggleTaskFocus(task)"
          >
            <target-icon />
          </button>

          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <input
              v-model="task.item"
              type="text"
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
              :class="{
                'line-through text-gray-600': task.completion,
                'text-gray-900': !task.completion
              }"
              @keyup.enter="saveChanges(task)"
            >
          </div>

          <div
            v-show="task.valuePoints"
            class="flex p-1 hover:text-yellow-500 text-gray-500"
          >
            <hexagon-icon />
            <span>{{ task.valuePoints }}</span>
          </div>

          <div
            v-show="task.activationDate && task.activation"
            class="p-1 hover:text-yellow-500 text-gray-500"
            :title="`Task Activated on ${task.activationDate}`"
          >
            <zap-icon />
          </div>

          <div
            v-show="task.activationDate && !task.activation"
            class="p-1 hover:text-yellow-500 text-gray-500"
            :title="`Task Not Activated`"
          >
            <zap-off-icon />
          </div>

          <div
            v-show="task.goalID"
            class="text-gray-500 hover:text-teal-400 p-1"
            :title="`${task.goalName}`"
          >
            <!-- <span class="px-1 uppercase tracking-wide font-medium text-sm">{{ task.goalName }}</span> -->
            <trending-up-icon />
          </div>

          <div
            v-show="task.routine"
            class="p-1"
            :class="{
              'line-through text-gray-500': task.completion,
              'text-blue-500': !task.completion
            }"
            :title="`Generated by Routine on ${task.createdAt}`"
          >
            <copy-icon />
          </div>

          <due-date-badge :value="task.dueDate" />

          <duration-badge :value="Number(task.duration)" />

          <money-value-badge :value="Number(task.valueMoney)" />

          <div class="flex">
            <button
              v-if="$store.settings.taskBox.showDeleteButton || task.completion"
              class="border-2 ml-1 px-1 border-gray-500 flex-shrink-0 text-gray-500 hover:text-red-500 hover:border-red-500 rounded-sm"
              @click="deleteTask(task)"
            >
              <trash-icon />
            </button>
            <button
              class="border-gray-500 ml-1 border-2 flex-shrink-0 text-gray-500 hover:text-blue-500 hover:border-blue-500 p-1 rounded-sm"
              @click="showItemModal(task)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="tasks.length==0"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The Task Box is empty. Create a new Task above!
        </p>
      </div>

      <task-modal style="overflow-y: scroll;" />

      <modal
        name="taskSettingsModal"
        height="600px"
        width="400px"
      >
        <task-settings-modal />
      </modal>
      <task-box-help v-model="taskHelpModal" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {
  CheckIcon, SettingsIcon, PlusIcon, PackageIcon, XIcon, TargetIcon, ZapIcon,
  ZapOffIcon, TrendingUpIcon, CopyIcon, MenuIcon, TrashIcon, HexagonIcon, HelpCircleIcon,
} from 'vue-feather-icons'

import TaskModal from '../modals/TaskModal.vue'
import TaskSettingsModal from '../modals/TaskSettingsModal.vue'
import TaskBoxHelp from '../modals/TaskBoxHelp.vue'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import DurationBadge from './widgets/DurationBadge.vue'
import MoneyValueBadge from './widgets/MoneyValueBadge.vue'
import DueDateBadge from './widgets/DueDateBadge.vue'

export default {
  components: {
    CheckIcon,
    SettingsIcon,
    PlusIcon,
    PackageIcon,
    XIcon,
    TargetIcon,
    ZapIcon,
    ZapOffIcon,
    TrendingUpIcon,
    CopyIcon,
    MenuIcon,
    TrashIcon,
    HexagonIcon,
    HelpCircleIcon,
    ButtonToggleBox,
    TaskModal,
    TaskSettingsModal,
    TaskBoxHelp,
    DurationBadge,
    MoneyValueBadge,
    DueDateBadge,
  },
  data() {
    return {
      colors: [],
      tasks: [],
      tags: [],
      newTask: '',
      expanded: true,
      box: 'Task',
      taskHelpModal: false,
    }
  },

  computed: {
    filteredTasks() {
      return this.tasks.filter(task => {
        return (task.activation || this.$store.settings.taskBox.showDeactivated) &&
          (!this.tags.some(Boolean) || this.tags.some(tag => tag && tag === task.goalID))
      })
    },
  },

  created() {
    this.fetchTasks()
  },

  methods: {
    toggleTag(goalID) {
      if (this.tags.includes(goalID)) {
        this.tags = this.tags.filter(tag => tag !== goalID)
      } else {
        this.tags.push(goalID)
      }
    },
    changeHighlight(task) {
      if (this.$store.highlightRoutineID === task.routineID) { this.$store.highlightRoutineID = null } else { this.$store.highlightRoutineID = task.routineID }
      if (this.$store.highlightGoalID === task.goalID) {
        this.$store.highlightGoalID = null
      } else { this.$store.highlightGoalID = task.goalID }
    },
    addTask() {
      let param = {
        item: this.newTask,
      }
      axios
        .post('/tasks', param)
        .then(() => {
          this.clearTask()
          this.fetchTasks()
        })
    },
    clearTask() {
      this.newTask = ''
    },
    fetchTasks() {
      axios.get('/tasks').then(response => {
        this.tasks = response.data
        var now = new Date()
        for (var i = 0; i < this.tasks.length; i++) {
          if (!this.tasks[i].activationDate) {
            this.tasks[i].activation = true
          } else if (new Date(this.tasks[i].activationDate) < now) { this.tasks[i].activation = true } else { this.tasks[i].activation = false }
        }
      })
    },
    toggleTaskCompletion(task) {
      let id = task._id
      
      if (task.completion) {
        axios
          .patch(`/tasks/${id}`, { completion: false })
          .then(() => {
            this.$store.settings.points -= Number(task.valuePoints)
            task.completion = false
            axios.patch('/settings/', this.$store.settings )
          })
      } else {
        if (!task.routine) {
        axios
          .patch(`/tasks/${id}`, { completion: true, focus: false })
          .then(() => {
            this.$store.settings.points += Number(task.valuePoints)
            task.completion = true
            this.$set(task, 'focus', false)
            axios.patch('/settings/', this.$store.settings )
          })
        } else { 
          let r = this.$store.routines.find(routine => {
            return task.routineID === routine._id
          })
          let c = r.completions + 1;
          axios
            .patch(`/routines/${task.routineID}`, { completion: true, completions: c })
            .then(() => {
              r.completion = true
              r.completions += 1;
            })
          this.deleteTask(task) 
          }
      }
    },
    toggleTaskFocus(task) {
      let id = task._id
      if (task.focus) {
        axios
          .patch(`/tasks/${id}`, { focus: false })
          .then(() => {
            task.focus = false
          })
      } else {
        axios
          .patch(`/tasks/${id}`, { focus: true })
          .then(() => {
            this.$set(task, 'focus', true)
          })
      }
    },
    async saveChanges(task) {
      await axios.patch(`/tasks/${task._id}`, task)
      task.lastEdited = new Date()
    },
    async deleteTask(task) {
      await axios.delete(`/tasks/${task._id}`)
      this.tasks = this.tasks.filter(t => t !== task)
    },
    anyChangeTimer(item) {
      if (item.timer) {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/false`)
          .then(() => {
            this.fetchTasks()
          })
      } else {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/true`)
          .then(() => {
            this.fetchTasks()
          })
      }
    },
    showItemModal(task) {
      this.$store.Item = task

      this.$modal.show('taskModal',)
    },
    showTaskSettingsModal() {
      this.$modal.show('taskSettingsModal',)
    },
  },
}

</script>
