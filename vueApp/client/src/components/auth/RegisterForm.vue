<template>
  <form @submit.prevent="submit">
    <h1 class="text-xl font-bold mb-2">
      Register
    </h1>

    <label
      class="block"
      for="email"
    >
      Email
    </label>
    <input
      id="email"
      v-model="email"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="email"
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

    <label
      class="block mt-3"
      for="confirm-password"
    >
      Confirm Password
    </label>
    <input
      id="confirm-password"
      v-model="confirmPassword"
      class="block w-full p-1 border border-gray-500 rounded-sm"
      type="password"
      required
    >

    <div class="mt-4 flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-400 py-1 px-3 text-white rounded-sm"
        type="submit"
      >
        Register
      </button>
      <button
        class="underline text-gray-500"
        @click="$emit('login')"
      >
        I already have an account
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

import { handleSuccessfulLogin } from '../../auth'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    submit() {
      if (this.password === this.confirmPassword) {
        axios.post('/register', {
          email: this.email,
          password: this.password,
        })
          .then(response => {
            handleSuccessfulLogin(response.data.token)
            this.$emit('register')
          })
      } else {
        this.password = ''
        this.confirmPassword = ''

        return alert('Passwords do not match')
      }
    },
    hide() {
      this.$modal.hide('auth')
    },
  },

}

</script>
