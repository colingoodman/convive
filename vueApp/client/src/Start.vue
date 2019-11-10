<template>
  <div
    class="bg-grey-400 justify-center rounded bg-white shadow-lg Modal"
    style="width: 30vw;"
  >
    <h1 class="text-xl font-bold block bg-gray-300 p-3">
      Convive
    </h1>
    <div
      class="flex p-3"
    >
      <a href="https://forms.gle/kntGMMJTQYr1ULje9 " target="_blank">
        <button
          @click="redirect"
          class="border-1 bg-blue-200 hover:bg-blue-400 p-3 rounded-sm float-left block w-100"
        >
            Get Started
        </button>
      </a>
      <button
        @click="redirect"
        class="border-1 bg-gray-200 hover:bg-gray-400 p-3 rounded-sm ml-auto float-right block w-100"
      >
        Log In
      </button>
    </div>
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

body {
  @apply m-0;
}

.newPage {
  @apply w-full bg-center;
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
