<template>
  <div
    class="newPage"
  >
    <div
      class="Modal rounded p-3"
      style="background-color: white;"
    >
      <div
        v-if="$store.user"
        class="flex items-center"
      >
        <button
          class="block bg-red-500 hover:bg-red-400 py-1 px-3 text-white rounded-sm"
          @click="signOut"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    register: false,
  }),
  methods: {
    signOut() {
      localStorage.removeItem('jwt')
      location.reload()
      this.$router.push('login')
    },
  },
}
</script>
