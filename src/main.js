import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// style
import './style/bootstrap-grid.css'
import './style/normalize.css'
import './style/variable.css'
// plugins
import './plugins/PrimeVue.js'
import './plugins/FortAwesome.js'
import './plugins/Axios.js'
import './plugins/Vuelidate.js'
import './plugins/VueSweetAlert.js'
import './plugins/VueImgInputer.js'
import './plugins/VueSocketIO.js'
import './plugins/VueSelect.js'
import './plugins/VuePageTransition.js'
import './plugins/VueGtag.js'
// global component
import Title from './components/Title.vue'
// mixin
import mixin from './mixin.js'

Vue.mixin(mixin)
Vue.component('Title', Title)

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
