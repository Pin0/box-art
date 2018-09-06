import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueHtml2Canvas from 'vue-html2canvas';
import "babel-core/register"
import 'babel-polyfill'

Vue.use(BootstrapVue);
Vue.use(VueHtml2Canvas);
new Vue({
  el: '#app',
  render: h => h(App)
})
