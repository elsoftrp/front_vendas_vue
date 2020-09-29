import Vue from 'vue'
import Vuetify from 'vuetify'
import VuetifyConfirm from 'vuetify-confirm'

const vuetify = new Vuetify({
  icons: {
    iconfont: 'md'
  },
  buttonTrueText: 'Sim',
  buttonFalseText: 'Não'
})

Vue.use(VuetifyConfirm, { vuetify })

export default VuetifyConfirm
