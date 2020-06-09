import Vue from 'vue'
import VueRouter from "vue-router"
import router from "./router.js"
import axios from "axios"
import App from './App.vue'

import $ from 'jquery/dist/jquery'
import "./assets/js/bootstrap.min.js"
import "./assets/css/bootstrap.min.css"
import "./assets/css/animate.css"

Vue.use(VueRouter)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

axios.defaults.baseURL = "http://47.106.89.101:8080"
axios.defaults.withCredentials = true

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
