import swal from 'sweetalert2'
import { serverAPI } from '../plugins/Axios.js'
import router from '../router'

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
    },
    logout (state) {
      state._id = ''
      state.account = ''
      state.email = ''
      state.token = ''
      state.role = ''
    },
    extend (state, newToken) {
      state.token = newToken
    }
  },
  actions: {
    async register ({ commit }, registerData) {
      try {
        await serverAPI.post('users/register', registerData)
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '註冊成功'
        }).then(() => {
          router.go()
        })
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    },
    async login ({ commit }, loginData) {
      try {
        const { data } = await serverAPI.post('/users/login', loginData)
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
    },
    async logout ({ commit, state }) {
      try {
        await serverAPI.delete('users/logout', {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('logout')
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '已登出'
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
    userInfo (state) {
      return {
        isLogin: state.token?.length > 0,
        isAdmin: state.role === 'admin',
        ...state
      }
    }
  }
}
