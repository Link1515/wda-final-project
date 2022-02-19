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
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// global directive
import Tooltip from 'primevue/tooltip'

// toastservice
import ToastService from 'primevue/toastservice'

Vue.component('Button', Button)
Vue.component('Card', Card)
Vue.component('Dialog', Dialog)
Vue.component('InputText', InputText)
Vue.component('Textarea', Textarea)
Vue.component('Toast', Toast)
Vue.component('DataTable', DataTable)
Vue.component('Column', Column)

Vue.directive('tooltip', Tooltip)

Vue.use(ToastService)
Vue.use(PrimeVue, { ripple: true })
