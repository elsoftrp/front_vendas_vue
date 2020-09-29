export default {
  namespaced: true,
  state: {
    buscaBarra: '',
    tituloHeader: 'Vendas',
    mesResumoDiario: null,
    empresaHeader: null,
    usuarioData: null,
    menuData: null,
    empresaData: null,
    pessoaData: null,
    produtoData: null,
    pedidoData: null,
    financeiroData: null
  },
  getters: {
    buscaBarra: state => state.buscaBarra,
    tituloHeader: state => state.tituloHeader,
    mesResumoDiario: state => state.mesResumoDiario,
    empresaHeader: state => state.empresaHeader,
    empresaData: state => state.empresaData,
    pessoaData: state => state.pessoaData,
    produtoData: state => state.produtoData,
    usuarioData: state => state.usuarioData,
    pedidoData: state => state.pedidoData,
    financeiroData: state => state.financeiroData,
    menuData: state => state.menuData
  },
  mutations: {
    setBuscaBarra (state, buscaBarrafn) {
      state.buscaBarra = buscaBarrafn
    },
    setTituloHeader (state, tituloHeaderfn) {
      state.tituloHeader = tituloHeaderfn
    },
    setMesResumoDiario (state, mesResumoDiario) {
      state.mesResumoDiario = mesResumoDiario
    },
    setEmpresaHeader (state, empresaHeader) {
      state.empresaHeader = empresaHeader
    },
    setEmpresaData (state, empresaWin) {
      state.empresaData = empresaWin
    },
    setPessoaData (state, pessoaWin) {
      state.pessoaData = pessoaWin
    },
    setProdutoData (state, produtoWin) {
      state.produtoData = produtoWin
    },
    setPedidoData (state, pedidofn) {
      state.pedidoData = pedidofn
    },
    setFinanceiroData (state, financeirofn) {
      state.financeiroData = financeirofn
    },
    setUsuarioData (state, usuariofn) {
      state.usuarioData = usuariofn
    },
    setMenuData (state, menufn) {
      state.menuData = menufn
    }
  },
  actions: {},
  modules: {}
}
