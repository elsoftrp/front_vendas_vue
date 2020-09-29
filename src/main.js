import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VuetifyConfirm from './plugins/vuetifyconfirm'

import './config/msgs'
import './config/axios'
import './config/currency'
import './config/print_nb'

Vue.config.productionTip = false

new Vue({
  vuetify,
  VuetifyConfirm,
  axios,
  VueAxios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
