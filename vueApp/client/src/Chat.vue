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
            { message.message }
          </li>
        </ol>
      </div>
      <div
        class="p-1 bg-gray-100 border-2"
        style="height: 40px"
      >
        <input
        type="text"
        placeholder="Enter message here"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data: () => ({
    messages: [],
    chatID: Number,
  }),
  methods: {
    fetchMessages(chatID) {
      axios.get('/message').then(response => {
        this.messages = response.data
      })
    },
  },
}
</script>
