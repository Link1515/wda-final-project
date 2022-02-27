import swal from 'sweetalert2'
import { serverAPI } from '../plugins/Axios.js'

export default {
  namespaced: true,
  state: {
    _id: '',
    account: '',
    nickname: '',
    avatar: '',
    email: '',
    token: '',
    role: '',
    favoriteGame: []
  },
  mutations: {
    login (state, userInfo) {
      state._id = userInfo._id
      state.account = userInfo.account
      state.nickname = userInfo.nickname
      state.avatar = userInfo.avatar
      state.email = userInfo.email
      state.token = userInfo.token
      state.role = userInfo.role
      state.favoriteGame = userInfo.favoriteGame
    },
    logout (state) {
      state._id = ''
      state.account = ''
      state.nickname = ''
      state.avatar = ''
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
      state.nickname = userInfo.nickname
      state.avatar = userInfo.avatar
      state.email = userInfo.email
      state.role = userInfo.role
      state.favoriteGame = userInfo.favoriteGame
    },
    updateFavGame (state, newFavGame) {
      state.favoriteGame = newFavGame
    },
    updateUserInfo (state, userInfo) {
      state.account = userInfo.account
      state.nickname = userInfo.nickname
    },
    updataAvatar (state, avatar) {
      state.avatar = avatar
    }
  },
  actions: {
    async login ({ commit }, loginData) {
      try {
        commit('loading', null, { root: true })
        const { data } = await serverAPI.post('/users/login', loginData)
        commit('loadingFinish', null, { root: true })
        commit('login', data.result)
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
      } catch (error) {
        commit('loadingFinish', null, { root: true })
        swal.fire({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    },
    async logout ({ commit, state }) {
      try {
        commit('loading', null, { root: true })
        await serverAPI.delete('users/logout', {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('loadingFinish', null, { root: true })
        commit('logout')
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '已登出'
        })
      } catch (error) {
        commit('loadingFinish', null, { root: true })
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
    async updataAvatar ({ commit }) {
      try {
        const { data } = await serverAPI.get('/users/updateAvatar')
        commit('updataAvatar', data.result)
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '更新頭像失敗'
        })
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
    },
    async refreshFavGame ({ commit, state }) {
      try {
        const { data } = await serverAPI.get('/users/refreshFavGame', {
          headers: {
            authorization: 'Bearer ' + state.token
          }
        })
        commit('updateFavGame', data.result)
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '更新失敗'
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
