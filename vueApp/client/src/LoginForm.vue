<template>
  <form @submit.prevent="submit">
    <h1 class="text-xl font-bold mb-2">
      Log in
    </h1>

    <label
      class="block"
      for="username"
    >
      Username
    </label>
    <input
      id="username"
      v-model="username"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="text"
      required
      autofocus
    >

    <label
      class="block mt-3"
      for="password"
    >
      Password
    </label>
    <input
      id="password"
      v-model="password"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="password"
      required
    >

    <div class="mt-4 flex items-center justify-between">
      <button
        class="bg-green-800 hover:bg-green-700 py-1 px-3 text-white rounded-sm"
        type="submit"
      >
        Log in
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

import { handleSuccessfulLogin } from './auth'

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    submit() {
      axios.post('/login', {
        username: this.username,
        password: this.password,
      })
        .then(response => {
          handleSuccessfulLogin(response.data.token)
          this.$emit('login')
        })
    },
  },
}

</script>
