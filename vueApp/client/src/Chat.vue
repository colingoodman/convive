<template>
  <div
    class="newPage"
  >
    <div
      class="Modal rounded bg-white shadow-lg"
      style="width: 75vw; height: 75vh;"
    >
      <h1
        class="p-1"
      >
      You are chatting with //USERNAME//
      <button
        class="bg-yellow-200"
        @click="fetchMessages"
      >
      Refresh
      </button>
      </h1>
      <div
        class="h-100 bg-green-200"
        style="height: 100%;"
      >
        <ol>
          <li
            v-for="(message, i) in messages.slice().reverse()"
            :key="message._id"
          >
            {{ message.message }}
          </li>
        </ol>
      </div>
      <div
        class="p-1 bg-gray-100 border-2"
        style="height: 40px"
      >
        <input
        v-model="newMessage"
        type="text"
        placeholder="Enter message here"
        />
        <button
          @click="addMessage"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  data: () => ({
    newMessage: '',
    messages: [],
    chatID: "5dc7063a1c9d440000b45a35",
  }),
  methods: {
    fetchMessages() {
      axios.get(`/chat/${this.chatID}/messages`)
      .then(response => {
        this.messages = response.data
      })
    },
    addMessage() {
      let param = {
        message: this.newMessage,
        username: 'test',
        chatID: this.chatID,
      }
      axios
        .post('/message', param)
        .then(() => {
          this.fetchMessages()
        })
    },
  },
}
</script>
