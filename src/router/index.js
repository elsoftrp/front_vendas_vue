import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { authOnly: true } },
  { path: '/empresas', component: () => import('../views/empresa/Empresa.vue'), meta: { authOnly: true } },
  { path: '/empresas/add', component: () => import('../views/empresa/EmpresaForm.vue'), meta: { authOnly: true } },
  { path: '/empresas/:id', component: () => import('../views/empresa/EmpresaForm.vue'), meta: { authOnly: true } },
  { path: '/pessoas', component: () => import('../views/pessoa/Pessoa.vue'), meta: { authOnly: true } },
  { path: '/pessoas/add', component: () => import('../views/pessoa/PessoaForm.vue'), meta: { authOnly: true } },
  { path: '/pessoas/:id', component: () => import('../views/pessoa/PessoaForm.vue'), meta: { authOnly: true } },
  { path: '/pessoastp', component: () => import('../views/configuracao/PessoaTp.vue'), meta: { authOnly: true } },
  { path: '/pagtotp', component: () => import('../views/configuracao/PagtoTp.vue'), meta: { authOnly: true } },
  { path: '/planoconta', component: () => import('../views/configuracao/PlanoConta.vue'), meta: { authOnly: true } },
  { path: '/produtos', component: () => import('../views/produto/Produto.vue'), meta: { authOnly: true } },
  { path: '/produtos/add', component: () => import('../views/produto/ProdutoForm.vue'), meta: { authOnly: true } },
  { path: '/produtos/:id', component: () => import('../views/produto/ProdutoForm.vue'), meta: { authOnly: true } },
  { path: '/grupos', component: () => import('../views/configuracao/Grupo.vue'), meta: { authOnly: true } },
  { path: '/unidades', component: () => import('../views/configuracao/Unidade.vue'), meta: { authOnly: true } },
  { path: '/pedidos', component: () => import('../views/movimento/pedidos/Pedido.vue'), meta: { authOnly: true } },
  { path: '/pedidos/add', component: () => import('../views/movimento/pedidos/PedidoForm.vue'), meta: { authOnly: true } },
  { path: '/pedidos/resumodiario', component: () => import('../views/movimento/pedidos/relatorios/PedidoResumoDiario.vue'), meta: { authOnly: true } },
  { path: '/pedidos/:id', component: () => import('../views/movimento/pedidos/PedidoForm.vue'), meta: { authOnly: true } },
  { path: '/pedidos/cupom/:id', component: () => import('../views/movimento/pedidos/relatorios/Cupom.vue'), meta: { authOnly: true } },
  { path: '/financeiro', component: () => import('../views/movimento/financeiro/Financeiro.vue'), meta: { authOnly: true } },
  { path: '/financeiro/add', component: () => import('../views/movimento/financeiro/FinanceiroForm.vue'), meta: { authOnly: true } },
  { path: '/financeiro/:id', component: () => import('../views/movimento/financeiro/FinanceiroForm.vue'), meta: { authOnly: true } },
  { path: '/usuarios', component: () => import('../views/auth/Usuario.vue'), meta: { authOnly: true } },
  { path: '/usuarios/add', component: () => import('../views/auth/UsuarioForm.vue'), meta: { authOnly: true } },
  { path: '/usuarios/:id', component: () => import('../views/auth/UsuarioForm.vue'), meta: { authOnly: true } },
  { path: '/mudarsenha', component: () => import('../views/configuracao/ResetPassword.vue'), meta: { authOnly: true } },
  { path: '/login', name: 'Login', component: () => import('../views/auth/Login.vue') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const jsonUser = localStorage.getItem('vendas')
  const user = JSON.parse(jsonUser)
  if (to.matched.some(record => record.meta.authOnly)) {
    if (!user || !user.email) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
