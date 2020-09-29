import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  iconPack: 'mdi',
  position: 'top-center',
  theme: 'toasted-primary',
  fullWidth: false,
  fitToScreen: false,
  duration: 4000
})

Vue.toasted.register(
  'defaultSuccess',
  payload => (!payload.msg ? 'Operação realizada com sucesso!' : payload.msg),
  { type: 'success', icon: 'check-circle' }
)

Vue.toasted.register(
  'defaultError',
  payload => (!payload.msg ? 'Oops.. Erro inesperado.' : payload.msg),
  { type: 'error', icon: 'alert-circle' }
)
