<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap;
  margin-bottom: 32px;
  -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- subscriptionbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-orange-500">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-orange-500"
        minimized-class="hover:text-orange-500"
      >
        <credit-card-icon />
      </button-toggle-box>

      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">
        Subscriptions
      </span>
    </h2>

    <div
      v-show="expanded"
      class="flex p-1"
    >
      <form
        class="flex flex-grow"
        @submit.prevent="addSubscription"
      >
        <input
          v-model="newSubscription"
          class="flex-grow px-1 outline-none"
          type="text"
          placeholder="New Subscription"
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
        class="p-1 ml-1 border-2 border-orange-500 bg-orange-500 text-white hover:bg-orange-400 rounded-sm flex-shrink-0"
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
      <ol v-show="(subscriptions.length>0) && (expanded)">
        <li
          v-for="(subscription, i) in subscriptions.slice().reverse()"
          :key="subscription._id"
          class="border-gray-500 border-t-2 flex items-top bg-gray-100 text-left p-1"
          :class="{ 'bg-gray-200': !(i % 2), 'bg-blue-200': ($store.highlightSubscriptionID === subscription._id) }"
        >
          <button
            class="border-2 px-1 border-gray-500 text-gray-500 hover:text-yellow-500 hover:border-yellow-500 rounded-sm"
          >
            <external-link-icon />
          </button>

          <div />

          <div class="ml-1 border-1 border-solid border-blue-500 w-auto flex-grow">
            <input
              v-model="subscription.item"
              type="text"
              class="truncate flex-grow pl-1 bg-transparent border-gray-500 h-full w-full"
              :class="{
                'line-through text-gray-600': subscription.completion,
                'text-gray-900': !subscription.completion
              }"
              @keyup.enter="saveChanges(subscription)"
            >
          </div>

          <money-value-badge :value="Number(subscription.valueMoney)" />

          <div class="flex">
            <button
              class="ml-1 border-gray-500 border-2 flex-shrink-0 text-gray-500 hover:text-blue-500 hover:border-blue-500 p-1 rounded-sm"
              @click="showSubscriptionModal(subscription)"
            >
              <menu-icon />
            </button>
          </div>
        </li>
      </ol>

      <div
        v-show="subscriptions.length==0 && expanded"
        class="text-center bg-gray-200"
      >
        <p class="truncate text-gray-500">
          The Subscription Box is empty. Create a new Subscription above!
        </p>
      </div>

      <subscription-modal style="overflow-y: scroll;" />
    </div>
  </div>
</template>

<script>
import { addDays } from 'date-fns'
import axios from 'axios'
import { CreditCardIcon, PackageIcon, PlusIcon, MenuIcon, ExternalLinkIcon } from 'vue-feather-icons'

import bus from './../bus.js'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'
import SubscriptionModal from '../modals/SubscriptionModal.vue'
import MoneyValueBadge from './widgets/MoneyValueBadge.vue'

export default {
  components: {
    CreditCardIcon,
    PackageIcon,
    PlusIcon,
    MenuIcon,
    ExternalLinkIcon,
    ButtonToggleBox,
    SubscriptionModal,
    MoneyValueBadge,
  },
  data() {
    return {
      subscriptions: [],
      newSubscription: '',
      expanded: true,
      box: 'Subscription',
    }
  },
  created() {
    this.fetchSubscriptions()
    this.listenToEvents()
  },
  methods: {
    showSubscriptionSettingsModal() {
      // this.$modal.show('subscriptionSettingsModal',)
    },
    addSubscription() {
      let param = {
        item: this.newSubscription,
      }
      axios
        .post('/subscriptions', param)
        .then(() => {
          this.clearSubscription()
          this.fetchSubscriptions()
        })
    },
    clearSubscription() {
      this.newSubscription = ''
    },
    refreshSubscriptions() {
      bus.$emit('refreshSubscriptions')
    },
    fetchSubscriptions() {
      axios.get('/subscriptions').then(response => {
        this.subscriptions = response.data
      })
    },
    async saveChanges(subscription) {
      await axios.patch(`/subscriptions/${subscription._id}`, subscription)
      subscription.lastEdited = new Date()
    },
    deleteSubscription(id) {
      axios
        .get(`/deleteSubscription/${id}`)
        .then(() => {
          this.fetchSubscriptions()
        })
    },
    anyChangeTimer(item) {
      if (item.timer) {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/false`)
          .then(() => {
            this.fetchSubscriptions()
          })
      } else {
        axios
          .put(`anyChangeTimer/${item._id}/${item.type}/true`)
          .then(() => {
            this.fetchSubscriptions()
          })
      }
    },
    showSubscriptionModal(subscription) {
      this.$store.Item = subscription

      this.$modal.show('subscriptionModal',)
    },
    listenToEvents() {
      bus.$on('refreshSubscriptions', () => {
        this.fetchSubscriptions() // update subscription
      })
    },
    subscriptionGenerateTask(subscription) {
      if (event) event.preventDefault()
      let param = {
        item: subscription.item,
        priority: subscription.priority,
        difficulty: subscription.difficulty,
        goalID: subscription.goalID,
        duration: subscription.duration,
        valueMoney: subscription.valueMoney,
      }
      axios
        .post(`/subscriptionGenerateTask/${subscription._id}`, param)
        .then(() => {
          this.clearSubscription()
          this.refreshTasks()
        })
    },
    refreshTasks() {
      bus.$emit('refreshTasks')
    },
  },
}

</script>
