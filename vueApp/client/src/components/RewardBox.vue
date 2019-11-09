<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 16px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- rewardbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-pink-600 flex">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-pink-600"
        minimized-class="hover:text-pink-600"
      >
        <award-icon />
      </button-toggle-box>
      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Rewards
      </span>
      <div class="flex-grow" />
      <div class="flex px-1 text-gray-600">
        {{ $store.settings.points }}
        <hexagon-icon />
      </div>
      <button
        class="text-gray-600 hover:text-pink-600 align-middle float-right"
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
        @submit.prevent="addReward"
      >
        <input
          v-model="newReward"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Reward"
        >
        <button
          type="submit"
          class="border-2 p-1 border-gray-500 text-gray-500 hover:text-pink-500 hover:border-pink-500 rounded-sm"
        >
          <plus-icon />
        </button>
      </form>
      <button
        class="p-1 ml-1 border-2 border-pink-500 bg-pink-500 text-white hover:bg-pink-400 rounded-sm flex-shrink-0"
      >
        <package-icon />
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
      <ol v-show="(rewards.length>0) && (expanded)">
        <li
          v-for="(reward, i) in rewards.slice().reverse()"
          :key="reward._id"
          class="border-gray-500 border-t-2 flex items-top bg-gray-100 text-left p-1"
          :class="{ 'bg-gray-200': !(i % 2) }"
        >
          <button
            class="border-gray-500 border-2 p-1 text-gray-500 hover:text-pink-600 hover:border-pink-600 rounded-sm flex"
            @click="purchaseReward(reward)"
          >
            <div>
              <hexagon-icon />
            </div>
            <span>{{ reward.cost }}</span>
          </button>
          <div class="border-1 border-solid border-blue-500 w-auto flex-grow">
            <input
              v-model="reward.item"
              type="text"
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
              @keyup.enter="saveChanges(reward)"
            >
          </div>

          <div class="flex text-gray-600">
            <span class="p-1 text-lg">{{ reward.uses }}</span>
            <button
              class="border-2 ml-1 px-1 border-gray-500 flex-shrink-0 text-gray-500 hover:text-red-500 hover:border-red-500 rounded-sm"
              @click="deleteReward(reward)"
            >
              <trash-icon />
            </button>
            <button
              class="border-gray-500 ml-1 border-2 flex-shrink-0 text-gray-500 hover:text-blue-500 hover:border-blue-500 p-1 rounded-sm"
              @click="showRewardModal(reward)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="rewards.length==0"
        class="row alert alert-info text-center bg-gray-200"
      >
        <p class="alert alert-info truncate text-gray-500">
          The Reward Box is empty. Create a new Reward above!
        </p>
      </div>

      <reward-modal v-model="rewardModalOpen" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {
  CheckIcon, SettingsIcon, PlusIcon, PackageIcon, XIcon, TargetIcon, ZapIcon,
  ZapOffIcon, TrendingUpIcon, AwardIcon, MenuIcon, TrashIcon, HexagonIcon,
} from 'vue-feather-icons'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import DurationBadge from './widgets/DurationBadge.vue'
import MoneyValueBadge from './widgets/MoneyValueBadge.vue'
import DueDateBadge from './widgets/DueDateBadge.vue'

import RewardModal from '../modals/RewardModal.vue'

export default {
  components: {
    RewardModal,
    SettingsIcon,
    PlusIcon,
    PackageIcon,
    HexagonIcon,
    TargetIcon,
    ZapIcon,
    ZapOffIcon,
    TrendingUpIcon,
    AwardIcon,
    MenuIcon,
    TrashIcon,
    ButtonToggleBox,
    DurationBadge,
    MoneyValueBadge,
    DueDateBadge,
  },
  data() {
    return {
      colors: [],
      rewards: [],
      goals: [],
      tags: [],
      newReward: '',
      expanded: true,
      box: 'Reward',
      rewardModalOpen: false,
    }
  },

  created() {
    this.fetchRewards()
  },

  methods: {
    addReward() {
      let param = {
        item: this.newReward,
      }
      axios
        .post('/rewards', param)
        .then(() => {
          this.clearReward()
          this.fetchRewards()
        })
    },
    clearReward() {
      this.newReward = ''
    },
    fetchRewards() {
      axios.get('/rewards').then(response => {
        this.rewards = response.data
      })
    },
    purchaseReward(reward) {
      this.$store.settings.points -= reward.cost
      reward.uses += 1
      this.saveChanges(reward)
    },
    async saveChanges(reward) {
      await axios.patch(`/rewards/${reward._id}`, reward)
      reward.lastEdited = new Date()
    },
    async deleteReward(reward) {
      await axios.delete(`/rewards/${reward._id}`)
      this.rewards = this.rewards.filter(t => t !== reward)
    },
    showRewardModal(reward) {
      this.$store.Item = reward

      this.rewardModalOpen = true;
    },
  },
}

</script>
