import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import store from '../store'

Vue.use(new VueSocketIO({
  connection: 'https://table-top-game-server.herokuapp.com/',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: {
    autoConnect: false
  }
}))
