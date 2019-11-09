import Vue from 'vue'
import VueMoment from 'vue-moment'
import VModal from 'vue-js-modal'
import axios from 'axios'
import VueRouter from 'vue-router'

import App from './App.vue'
import Start from './Start.vue'
import Login from './Login.vue'
import Chat from './Chat.vue'

import store from './store'
import { checkAuthentication } from './auth'

axios.defaults.baseURL = '/api'
checkAuthentication()

Vue.prototype.$store = store

Vue.config.productionTip = false
Vue.use(VueMoment)
Vue.use(VueRouter)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })

const authGuard = (to, from, next) => {
  if (!store.user) return next('/auth')

  next()
}

const routes = [
  { path: '/', component: Start },
  { path: '/login', component: Login },
  { path: '/chat', component: Chat, beforeEnter: authGuard},
  { path: '*', redirect: '/' },
]

export const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history',
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
