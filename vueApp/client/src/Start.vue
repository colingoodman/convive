<template>
  <div
    class="bg-grey-100 justify-center rounded bg-white shadow-lg Modal"
    style="width: 30vw; height: 30vh;"
  >
    <h1 class="text-xl font-bold mb-2 block bg-gray-200 p-3">
      Convive
    </h1>

    <a href="https://forms.gle/kntGMMJTQYr1ULje9 " target="_blank">
      <button
        @click="redirect"
        class="border-1 bg-gray-200 p-3 rounded-sm mx-auto"
      >
          Get Started
      </button>
    </a>
  </div>
</template>

<script>

export default {
  name: 'Start',
  methods: {
    redirect() {
      this.$router.push('login')
    }
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
