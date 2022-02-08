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
    role: '',
    favoriteGame: []
  },
  mutations: {
    login (state, userInfo) {
      state._id = userInfo._id
      state.account = userInfo.account
      state.email = userInfo.email
      state.token = userInfo.token
      state.role = userInfo.role
      state.favoriteGame = userInfo.favoriteGame
    },
    logout (state) {
      state._id = ''
      state.account = ''
      state.email = ''
      state.token = ''
      state.role = ''
      state.favoriteGame = []
    },
    extend (state, newToken) {
      state.token = newToken
    },
    getInfo (state, userInfo) {
      state._id = userInfo._id
      state.account = userInfo.account
      state.email = userInfo.email
      state.role = userInfo.role
      state.favoriteGame = userInfo.favoriteGame
    },
    updateFavGame (state, newFavGame) {
      state.favoriteGame = newFavGame
    }
  },
  actions: {
    async register (_, registerData) {
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
    },
    async getInfo ({ commit, state }) {
      if (!state.token) return
      try {
        const { data } = await serverAPI.get('/users/getInfo', {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('getInfo', data.result)
      } catch (error) {
        commit('logout')
      }
    },
    async addFavGame ({ commit, state }, { gameId, gameName }) {
      try {
        const { data } = await serverAPI.post('/users/addFavGame/' + gameId, { gameName }, {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('updateFavGame', data.result)
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗'
        })
      }
    },
    async removeFavGame ({ commit, state }, gameId) {
      try {
        const { data } = await serverAPI.post('/users/removeFavGame/' + gameId, {}, {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('updateFavGame', data.result)
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗'
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
