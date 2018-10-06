import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import setIntValue from './setIntValue.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueHtml2Canvas from 'vue-html2canvas'
import "babel-core/register"
import "babel-polyfill"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'


//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus)
library.add(faMinus)
library.add(faTimes)
library.add(faDownload)



Vue.use(BootstrapVue);
Vue.use(VueHtml2Canvas);
Vue.use(setIntValue);
new Vue({
  el: '#app',
  render: h => h(App)
})
