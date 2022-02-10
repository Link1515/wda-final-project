import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faGamepad, faRunning, faUndo } from '@fortawesome/free-solid-svg-icons'

library.add(faGamepad, faRunning, faUndo)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
