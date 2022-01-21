import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import store from '../store'
// import router from '../router'

export const serverAPI = axios.create({
  baseURL: process.env.VUE_APP_SERVERAPI
})

// serverAPI.interceptors.response.use(res => res, error => {
//   if (error.response) {
//     if (error.response.status === 401) {
//       if (error.config.url !== '/users/extend') {
//         const originalRequest = error.config
//         return serverAPI.post('users/extend', {}, {
//           headers: {
//             authorization: 'Bearer ' + store.state.user.token
//           }
//         }).then(({ data }) => {
//           store.commit('user/extend', data.result.token)
//           originalRequest.headers.authorization = 'Bearer ' + store.state.user.token
//           return axios(originalRequest)
//         }).catch(error => {
//           store.commit('user/logout')
//           router.push('/login')
//           return Promise.reject(error)
//         })
//       }
//     }
//   } else {
//     if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
//       console.log('錯誤')
//     }
//   }
//   return Promise.reject(error)
// })

Vue.use(VueAxios, { axios, serverAPI })
