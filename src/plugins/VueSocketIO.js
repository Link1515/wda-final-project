import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
// import store from '../store'

Vue.use(new VueSocketIO({
  connection: process.env.VUE_APP_SERVERAPI,
  options: {
    autoConnect: false
  }
}))
