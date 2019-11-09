import Vue from 'vue'
import VueMoment from 'vue-moment'
import VModal from 'vue-js-modal'
import axios from 'axios'
import VueRouter from 'vue-router'

import App from './App.vue'
import Toolbox from './components/Toolbox.vue'
import AuthScreen from './components/auth/authScreen.vue'
import UserSettings from './components/auth/UserSettings.vue'

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
  { path: '/', redirect: { path: '/auth' } },
  { path: '/landing', redirect: { path: '/auth' } },
  { path: '/app', component: Toolbox, beforeEnter: authGuard },
  { path: '/auth', component: AuthScreen },
  { path: '/user', component: UserSettings, beforeEnter: authGuard },
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
