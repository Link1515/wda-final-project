import swal from 'sweetalert2'
import { serverAPI } from '../plugins/Axios.js'
// import router from '../router'

export default {
  namespaced: true,
  state: {
    _id: '',
    account: '',
    email: '',
    token: '',
    role: ''
  },
  mutations: {
    login (state, value) {
      state._id = value._id
      state.account = value.account
      state.email = value.email
      state.token = value.token
      state.role = value.role
    }
  },
  actions: {
    async login ({ commit }, value) {
      try {
        const { data } = await serverAPI.post('/users/login', value)
        commit('login', data.result)
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    }
  },
  getters: {

  }
}
