export default {
  namespaced: true,
  state: {
    pedidoImp: null
  },
  getters: {
    pedidoImp: state => state.pedidoImp
  },
  mutations: {
    setPedidoImp (state, pedidofn) {
      state.pedidoImp = pedidofn
    }
  },
  actions: {},
  modules: {}
}
