<template>
  <div class="sessionBox card">
    <h3 class="cardTitle">
      Sessions
    </h3>

    <form
      class="cardTitle"
      @submit.prevent
    >
      <input
        v-model="session"
        type="text"
        class="textEntry"
        placeholder="New Session"
        @keypress="typing=true"
      >
      <button
        class="cardButton"
        style="border-color: var(--ltgreen)"
        @click="addSession($event)"
      >
        <img src="../../public/plus.svg">
      </button>
      <!-- <span class="help-block small text-center" v-show="typing">Hit enter to save</span> -->
      <!-- "addTodo($event)" -->
    </form>

    <div class="cardContainer">
      <ol class="listType">
        <li
          v-for="session in sessions"
          :key="session._id"
          class="cardTask cardItem"
        >
          <span class="cardText">{{ session.item }}</span>
          <button
            class="cardButton"
            style="border-color: var(--ltblue)"
          >
            <img src="../../public/menu.svg">
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import bus from './../bus.js'

export default {
  data() {
    return {
      sessions: [],
      timer: null,
      totalTime: 25 * 60,
      resetButton: false,
      time: 0,
    }
  },

  computed: {
    minutes() {
      const minutes = Math.floor(this.totalTime / 60)
      return this.padTime(minutes)
    },
    seconds() {
      const seconds = this.totalTime - (this.minutes * 60)
      return this.padTime(seconds)
    },
  },

  created: function() {
    this.fetchSessions()
    this.listenToEvents()
  },

  methods: {
    fetchSessions() {
      axios.get('/allsessions').then((response) => {
        this.sessions = response.data
      })
    },
    deleteSessions(id) {
      axios.get(`/deletesession/${id}`).then(() => {
        this.fetchSessions()
      })
    },
    listenToEvents() {
      bus.$on('refreshSessions', () => {
        this.fetchSessions() // update todo
      })
    },
    addSession(event) {
      if (event) event.preventDefault()
      let param = {
        item: this.session,
        type: 'session',
      }
      axios.post('/addsession', param)
        .then(() => {
          this.clearSession()
          this.refreshSessions()
          this.typing = false
        })
    },
    clearSession() {
      this.session = ''
    },
    refreshSessions() {
      bus.$emit('refreshSessions')
    },
  },

}
</script>
