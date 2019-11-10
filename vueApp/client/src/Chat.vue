<template>
  <div
    class="newPage bg-green-100"
  >
    <div
      v-if="chat.user0"
      class="Modal rounded bg-white shadow-lg"
      style="width: 75vw; height: 60vh;"
    >
      <h1
        class="p-3"
      >
      A Conversation between <b>{{ chat.user0 }}</b> and <b>{{ chat.user1 }}</b> also {{ user0 }}

      </h1>
      <h1>
        <span
          class="w-100"
            v-for="(interest, i) in commonInterests"
            :key="interest"
          >{{ interest }}</span>
      </h1>
      <div
        class="h-100 bg-blue-100 px-2"
        style="height: 100%; overflow-y: scroll;"
      >
        <ol>
          <li
            v-for="(message, i) in messages"
            :key="message._id"
            class="block text-blue-900"
            :class="{
              'text-blue-600': message.username = chat.user0,
            }"
          >
            <b>{{ message.username }}</b>: {{ message.message }}
          </li>
        </ol>
      </div>
      <div
        class="p-1 bg-gray-100 border-2 flex"
        style="height: 60px"
      >
        <input
        v-model="newMessage"
        type="text"
        placeholder="Enter message here"
        class="flex-1 border-2"
        />
        <div
        >
          <button
            @click="addMessage"
            class="mx-2 p-2 border-2 bg-blue-300 hover:bg-blue-500"
          >
            Send
          </button>
                <button
          class="bg-yellow-200 mx-1 p-2 border-2"
          @click="fetchMessages"
          >
          Refresh
          </button>
          <button
            class="bg-yellow-200 mx-1 p-2 border-2"
            @click="fetchChat"
          >
          Fetch Chat
          </button>
          <button
            class="bg-red-300 mx-1 p-2 border-2"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="Modal rounded bg-white shadow-lg"
    >
      <button
      @click="startChat"
      class="bg-blue-300 p-3 rounded-sm m-auto block"
    >
      Start a New Chat
    </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
var coin = require('./coin')


export default {

  data: () => ({
    newMessage: '',
    messages: [],
    chatID: "5dc7063a1c9d440000b45a35",
    chat: {},
    user0: {},
    user1: {},
  }),
  computed: {
    commonInterests() {
      let common = []
      foreach (interest in user0.interests); {
        foreach (i in user1.interests); {
          if (interest == i) {common.push(interest)}
        }
      }
      return common
    },
  },
  methods: {
    startChat() {
      this.fetchChat()
      this.fetchMessages()
    },
    fetchChat() {
      axios.get(`/chat/${this.chatID}`)
        .then(response => {
          this.chat = response.data
          axios.get(`/user/${this.chat.user0}`).then(response => { this.user0 = response.data })
          axios.get(`/user/${this.chat.user1}`).then(response => { this.user1 = response.data })
        })
      },
    fetchMessages() {
      axios.get(`/chat/${this.chatID}/messages`)
      .then(response => {
        this.messages = response.data
      })
    },
    addMessage() {
      let param = {
        message: this.newMessage,
        username: this.$store.user.username,
        chatID: this.chatID,
      }
      axios
        .post('/message', param)
        .then(() => {
          this.fetchMessages()
        })
      }
  },
  created() {
    //this.fetchChat()
    //this.fetchMessages()
  },
}
</script>
