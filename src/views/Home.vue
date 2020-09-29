<template>
  <div class="home d-print-none">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" align="center" justify="center">
            <img alt="Vue logo" src="../assets/logo.jpg" />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { baseApiUrl } from '@/global'
import { converteMenu } from '@/config/funcoes.js'
import axios from 'axios'
export default {
  name: 'Home',
  components: {
  },
  methods: {
    ...mapMutations('cadastros', ['setUsuarioData', 'setTituloHeader', 'setMenuData', 'setEmpresaHeader']),
    ...mapActions(['carregaEmpresas']),
    menuUsuario () {
      axios.get(`${baseApiUrl}/menu`).then(resp => {
        const menu = resp.data
        const novomenu = converteMenu(menu)
        if (novomenu && novomenu.length > 0) {
          this.setMenuData(novomenu)
        }
      })
    }
  },
  computed: {
    ...mapGetters('cadastros', ['usuarioData', 'empresaHeader'])
  },
  mounted () {
    if (!this.usuarioData && localStorage.getItem('vendas')) {
      axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`
      const usuario = JSON.parse(localStorage.getItem('vendas'))
      this.setUsuarioData(usuario)
      this.menuUsuario()
    } else if (this.usuarioData) {
      this.menuUsuario()
      this.setTituloHeader('Vendas')
    }
    this.carregaEmpresas()
  },
  created () {
    this.$forceUpdate()
  }
}
</script>
