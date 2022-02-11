import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faGamepad, faRunning, faUndo, faCrown } from '@fortawesome/free-solid-svg-icons'

library.add(faGamepad, faRunning, faUndo, faCrown)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
