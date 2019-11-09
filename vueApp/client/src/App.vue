<template>
  <div
    id="app"
    class="bg-gray-400 justify-center"
  >
    <nav
      class="p-2 flex"
      style="background-color: white;"
    >
      <router-link
        v-if="false"
        to="landing"
      >
        <button
          class="p-1 border-2 border-green-800 bg-green-800 hover:border-green-600 hover:bg-green-600 text-white rounded-sm flex-shrink-0"
        >
          Home
        </button>
      </router-link>

        <div
          class="p-1 ml-1 text-blue-500 rounded-sm flex-shrink-0"
        >
          <b>Convive</b>
        </div>

      <div class="flex-grow" />

      <router-link
        v-if="false"
        to="auth"
      >
        <button
          class="p-1 mx-1 border-2 border-green-800 bg-green-800 hover:border-green-600 hover:bg-green-600 text-white rounded-sm flex-none"
        >
          Login / Register
        </button>
      </router-link>
      <router-link
        v-if="$store.user"
        to="/"
      >
        <button
          @click="signOut"
          class="p-1 m border-green-800 bg-green-800 border-2 text-white hover:bg-green-500 hover:border-green-500 rounded flex-shrink-0"
        >
          Log Out
        </button>
      </router-link>
    </nav>

    <router-view />

    <footer
      class="bg-green-900 text-white"
    />
  </div>
</template>

<script>
import { UserIcon } from 'vue-feather-icons'

export default {
  name: 'App',
  components: { UserIcon },
  methods: {
    signOut() {
      localStorage.removeItem('jwt')
      location.reload()
    },
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  @apply max-w-full min-h-screen font-sans antialiased text-black;
}

body {
  @apply m-0;
}

.newPage {
  @apply min-h-screen w-full bg-center;
  background-color: #647C64;
}

.Modal {
  @apply w-auto h-auto;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

@media (max-width: 500px) {
  .Modal {
    width: 75vw;
  }
}
</style>
