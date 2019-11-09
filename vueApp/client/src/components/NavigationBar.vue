<template>
  <nav
    class="navigation"
  >
    <!-- <img src="../../public/ltblabel1.png" style="padding:8px; width:10%;height:6%;""/> -->

    <img
      v-if="searchSelected"
      src="../../public/search.svg"
      style="position:fixed;top:16px;left:auto;"
    >
    <input
      type="text"
      class="textEntry"
    >

    <div>
      <swatches
        v-model="$store.settings.colorHex"
        show-fallback
        shapes="circles"
        swatch-size="28"
        :trigger-style="{ width: '32px', height: '32px', marginTop: '6px' }"
        @input="changeBackground"
      />
    </div>

    <span
      v-if="$store.user"

      :style="{ backgroundColor: [$store.settings.colorHex] }"
      class="text-blue-900 align-middle hover:text-black m-3 px-2"
    >
      {{ $store.user.email }}
      {{ $store.settings.colorHex }}
    </span>

    <button
      class="px-1 border-green-500 text-gray-500 hover:text-green-500 pr-3"
      :style="{ 'border-color': `var(--lt${$store.user ? 'green' : 'red'})` }"
      @click="showAuthModal()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
        cx="12"
        cy="7"
        r="4"
      /></svg>
    </button>
  </nav>
</template>

<script>
import axios from 'axios'
import Swatches from 'vue-swatches'

import bus from './../bus.js'

import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  components: {
    Swatches,
  },
  data() {
    return {
      todosCompleted: 0,
      todosCreated: 0,
      name: '',
      searchSelected: false,
    }
  },
  created() {
    this.fetchStats()
    this.listenToEvents()
  },
  methods: {
    fetchStats() {
      axios.get('/stats').then((response) => {
        this.todosCreated = response.data.todosCreated
        this.todosCompleted = response.data.todosCompleted
      })
    },
    changeBackground() {
      axios.patch('/settings', this.$store.settings)
    },
    listenToEvents() {
      bus.$on('refreshStats', () => {
        this.fetchStats()
      })
    },
    showAuthModal() {
      this.$modal.show('auth')
    },
  },
}
</script>
