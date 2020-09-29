import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { baseApiUrl } from '@/global'
import cadastros from './cadastros'
import pedido from './pedido'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    empresas: null
  },
  getters: {
    empresas: state => state.empresas
  },
  mutations: {
    setEmpresas (state, payload) {
      state.empresas = payload
    }
  },
  actions: {
    carregaEmpresas (context) {
      axios.get(`${baseApiUrl}/empresas`)
        .then(resp => {
          context.commit('setEmpresas', resp.data.data)
        })
    }
  },
  modules: {
    cadastros,
    pedido
  }
})

export default store
