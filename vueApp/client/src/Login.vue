<template>
  <div
    class="newPage"
  >
    <div
      class="Modal rounded bg-white shadow-lg"
      style="width: 25vw;"
    >
      <div class="p-3">
        <div
          class="flex"
        >
          <login-form
            class="flex-grow p-3"
            @login="hide"
            @register="register = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue'

export default {
  components: { LoginForm },
  data: () => ({
    register: false,
  }),
  methods: {
    hide() {
      this.$modal.hide('auth')
    },
    signOut() {
      localStorage.removeItem('jwt')
      location.reload()
    },
  },
}
</script>
