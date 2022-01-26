import Vue from 'vue'
import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/vela-orange/theme.css'
import 'primevue/resources/themes/saga-orange/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// global components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'

// global directive
import Tooltip from 'primevue/tooltip'

Vue.component('Button', Button)
Vue.component('Card', Card)
Vue.component('Dialog', Dialog)

Vue.directive('tooltip', Tooltip)

Vue.use(PrimeVue, { ripple: true })
