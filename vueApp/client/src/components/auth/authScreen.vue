<template>
  <div
    class="newPage"
  >
    <div
      class="Modal rounded bg-white shadow-lg"
    >
      <div class="p-3">
        <img src="ltblabel1.png">
        <div
          class="flex"
        >
          <register-form
            v-if="register"
            class="flex-grow p-3"
            @register="hide"
            @login="register = false"
          />
          <login-form
            v-else
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
import RegisterForm from './RegisterForm.vue'

export default {
  components: { LoginForm, RegisterForm },
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
