import axios from 'axios'
import decodeJWT from 'jwt-decode'

import store from './store'
import { router } from './main'

export function handleSuccessfulLogin(token) {
  localStorage.setItem('jwt', token)
  handleAuthentication(token)
  // const user = decodeJWT(token)
  // this.$router.push(user.isAdmin ? 'admin' : 'dashboard')
}

export function checkAuthentication() {
  const token = localStorage.getItem('jwt')
  if (token) handleAuthentication(token)
}

export async function handleAuthentication(token) {
  axios.defaults.headers.common['Authorization'] = token

  store.settings = (await axios.get('/settings')).data

  const payload = decodeJWT(token)
  store.user = payload.user
  axios.patch(`/users/${store.user.id}`, { previousLogin: new Date() })

  router.replace('/app')
}
