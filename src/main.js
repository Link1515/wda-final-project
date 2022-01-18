import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// style
import './style/bootstrap-grid.css'
import './style/bootstrap-utilities.css'
import './style/normalize.css'
import './style/variable.css'
// plugins
import './plugins/PrimeVue.js'
// global component
import Title from './components/Title.vue'
Vue.component('Title', Title)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
