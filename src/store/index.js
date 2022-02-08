import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './user.js'
import game from './game.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { user, game },
  plugins: [
    createPersistedState({
      key: 'userInfo',
      paths: ['user.token']
    }),
    createPersistedState({
      key: 'game',
      paths: ['game']
    })
  ]
})
