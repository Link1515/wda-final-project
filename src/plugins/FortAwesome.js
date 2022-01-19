import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faGamepad, faRunning } from '@fortawesome/free-solid-svg-icons'

library.add(faGamepad, faRunning)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
