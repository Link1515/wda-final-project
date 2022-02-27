import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './user.js'
import game from './game.js'
import room from './room.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: true
  },
  mutations: {
    loadingFinish (state) {
      state.loading = false
    },
    loading (state) {
      state.loading = true
    }
  },
  modules: { user, game, room },
  plugins: [
    createPersistedState({
      key: 'userInfo',
      paths: ['user.account', 'user.token']
    }),
    createPersistedState({
      key: 'game',
      paths: ['game']
    })
  ]
})
