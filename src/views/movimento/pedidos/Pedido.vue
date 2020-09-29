<template>
  <v-app id="pedidos">
    <v-card outlined class="ma-1 pa-1">
      <v-btn
        v-show="direitos && direitos.btnincluir"
        class="ma-3"
        fab
        fixed
        right
        bottom
        dark
        color="deep-purple darken-3"
        @click="goAdd"
      >
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      <v-select
        outlined
        label="Empresa"
        :items="empresas"
        item-text="descricao"
        item-value="id"
        v-model="state.empresa"
        return-object
        >
      </v-select>
      <!-- informacao -->
            <v-container fluid>
              <v-row v-show="direitos && direitos.btnchave1">
                <v-col>
                  <notificacao :color="'green'" :valor="totaliza.mes_atual" > <template v-slot:titulo> <a @click="goResumoDiario()">{{ 'Vendas de '+totaliza.atualExtenso }}</a> </template> </notificacao>
                </v-col>
                <v-col>
                  <notificacao :color="'light-blue darken-2'" :valor="totaliza.mes_anterior" ><template v-slot:titulo><a @click="goResumoDiario('anterior')">{{'Vendas de '+totaliza.anteriorExtenso}}</a></template> </notificacao>
                </v-col>
                <v-col>
                  <notificacao :color="'orange darken-4'" :valor="totaliza.ano_atual"><template v-slot:titulo> {{'Vendas de '+totaliza.ano}} </template> </notificacao>
                </v-col>
              </v-row>
            </v-container>
      <v-data-table
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="pedidos"
        :custom-sort="customSort"
        :sort-by.sync="state.sortBy"
        :sort-desc.sync="state.sortDesc"
        :loading="loading"
      >
        <template v-slot:item.pessoa="{ item }">
          <a class="text-secondary" @click="goEdit(item.id)">{{
            item.pessoa.nome ? item.pessoa.nome : '.'
          }}</a>
        </template>
        <template v-slot:item.totpedido="{ item }">
          <span>
              {{ item.totpedido ?
                  valFormat(item.totpedido) : '' }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            v-show="direitos && direitos.btnexcluir"
            @click="goDelete(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination
          v-model="pageState"
          :length="state.pagination.meta.last_page"
          total-visible="8"
        ></v-pagination>
      </div>
      <div class="text-muted">Total de registros {{ state.pagination.meta.total }}</div>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
import Notificacao from '@/components/template/Notificacao.vue'
import { baseApiUrl, showError } from '@/global'
import { mountUrl, valorFormatado, mesExtenso, anoAtual, mesNumero } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Pedidos',
  components: { Notificacao },
  data () {
    return {
      nomeJanela: 'Pedidos',
      urlApi: 'pedidos',
      caption: '',
      direitos: null,
      callApi: false,
      totaliza: {
        atualExtenso: '',
        anteriorExtenso: '',
        ano: '',
        mes_atual: 0,
        mes_anterior: 0,
        ano_atual: 0
      },
      state: {
        pagination: { meta: { last_page: 0 } },
        urlState: '',
        filterTerm: '',
        sortDesc: false,
        notificacao: {},
        empresa: {}
      },
      pageState: 1,
      filtered: false,
      loading: true,
      headers: [
        { text: 'Data da venda', value: 'pedidodt' },
        { text: 'Cliente', value: 'pessoa' },
        { text: 'CNPJ/CPF', value: 'pessoa.cnpjcpf' },
        { text: 'Total', value: 'totpedido' },
        { text: 'Cancelar', value: 'actions', sortable: false }
      ],
      pedidos: []
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setPedidoData', 'setMesResumoDiario', 'setTituloHeader']),
    getDireitos () {
      const menu = this.menuData.map(el => el.items)
      menu.forEach(el => {
        if (el.find(e => e.name === this.nomeJanela)) {
          this.direitos = el[el.findIndex(e => e.name === this.nomeJanela)]
        }
      })
      if (this.direitos) this.caption = this.direitos.descricao
      this.setTituloHeader(this.caption)
    },
    getDataFromApi (pesquisa = null, page = 1, order = null, orderDir = null) {
      this.callApi = true
      this.loading = true
      if (this.pedidoData !== null) {
        this.state = this.pedidoData
        this.pedidos = this.state.pagination.data
        this.pageState = this.state.pagination.meta.current_page
        this.filtered = this.state.filterTerm !== ''
        this.loading = false
        this.callApi = false
        this.setTotaliza(this.state.notificacao)
        this.setPedidoData(null)
      } else {
        if (page !== this.pageState) this.pageState = page
        this.state.urlState = `${baseApiUrl}/${this.urlApi}${mountUrl(
          pesquisa,
          page,
          order,
          orderDir,
          this.state.empresa.id
        )}`
        axios.get(this.state.urlState)
          .then(req => {
            this.pedidos = req.data.data
            this.state.pagination = req.data
            this.loading = false
            this.callApi = false
          })
          .catch(showError)
          .finally((this.loading = false))
        this.getNotificacao(this.state.empresa.id)
      }
    },
    getNotificacao (id) {
      if (this.direitos && this.direitos.btnchave1) {
        if (Object.keys(this.state.notificacao).length === 0 || this.state.notificacao.emp !== id) {
          axios.get(`${baseApiUrl}/${this.urlApi}/resumo/${id}`)
            .then(req => {
              this.state.notificacao = req.data
              this.setTotaliza(this.state.notificacao)
            })
            .catch(showError)
        } else {
          this.setTotaliza(this.state.notificacao)
        }
      }
    },
    setTotaliza (data) {
      const hoje = new Date()
      this.totaliza.atualExtenso = mesExtenso(hoje)
      this.totaliza.anteriorExtenso = mesExtenso(hoje.setMonth(hoje.getMonth() - 1))
      this.totaliza.ano = anoAtual()
      if (data) {
        this.totaliza.mes_atual = data.mes_atual.length > 0 ? Number(data.mes_atual.map(m => m.valor)) : 0
        this.totaliza.mes_anterior = data.mes_anterior.length > 0 ? Number(data.mes_anterior.map(m => m.valor)) : 0
        this.totaliza.ano_atual = data.ano_atual.length > 0 ? Number(data.ano_atual.map(m => m.valor)) : 0
      }
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.setPedidoData(this.state)
        this.$router.push({ path: `/${this.urlApi}/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.setPedidoData(this.state)
        this.$router.push(`/${this.urlApi}/add`)
      }
    },
    goDelete (item) {
      if (this.direitos && this.direitos.btnexcluir) {
        this.$confirm('Deseja realmente cancelar essa venda ?', { buttonTrueText: 'Sim', buttonFalseText: 'Não' }).then(res => {
          if (res) {
            this.loadingAll = true
            axios.delete(`${baseApiUrl}/${this.urlApi}/${item.id}`)
              .then(resp => {
                this.$toasted.global.defaultSuccess()
                const index = this.pedidos.indexOf(item)
                this.pedidos.splice(index, 1)
              })
              .catch(showError)
              .finally(
                setTimeout(() => {
                  this.loadingAll = false
                }, 1000)
              )
          }
        })
      }
    },
    goResumoDiario (tipo) {
      if (this.direitos) {
        const hoje = new Date()
        const mes = tipo === 'anterior' ? mesNumero(hoje.setMonth(hoje.getMonth() - 1)) : mesNumero(hoje)
        const emp = this.state.empresa.id
        this.setMesResumoDiario({ mes, emp })
        this.setPedidoData(this.state)
        this.$router.push(`/${this.urlApi}/resumodiario`)
      }
    },
    navigate (page) {
      if (!this.callApi) this.getDataFromApi(this.state.filterTerm, page, this.state.sortBy, this.state.sortDesc)
    },
    orderedBy (value) {
      if (!this.callApi) this.getDataFromApi(this.state.filterTerm, 1, value, this.state.sortDesc)
    },
    orderedDesc (value) {
      if (!this.callApi) this.getDataFromApi(this.state.filterTerm, 1, this.state.sortBy, value)
    },
    mudarEmpresa (value) {
      if (!this.callApi) this.getDataFromApi()
    },
    find (filter) {
      if (filter != null && filter !== '' && filter.length > 3) {
        this.state.filterTerm = filter
        this.filtered = true
        if (!this.callApi) this.getDataFromApi(this.state.filterTerm)
      } else if (this.filtered) {
        if (!this.callApi) {
          this.getDataFromApi()
          this.filtered = false
          this.state.filterTerm = ''
        }
      }
    },
    valFormat (value) {
      return valorFormatado(value)
    },
    customSort: function (items, index, isDesc) {
      return items
    },
    getColor (status) {
      if (status === 'I') return 'red'
      else return 'green'
    }
  },
  watch: {
    buscaBarra: function (value) {
      if (value) {
        this.find(value)
      }
    },
    pageState: function (value, old) {
      if (
        value ||
        (value !== '' &&
          value !== old &&
          value !== this.state.pagination.meta.current_page)
      ) this.navigate(value)
    },
    'state.sortBy': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedBy(value)
    },
    'state.sortDesc': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedDesc(value)
    },
    'state.empresa': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.mudarEmpresa(value)
    }
  },
  computed: {
    ...mapGetters('cadastros', ['pedidoData', 'menuData', 'buscaBarra', 'usuarioData']),
    ...mapGetters(['empresas'])
  },
  mounted () {
    this.state.empresa = { id: this.usuarioData.empresa_id }
    this.$forceUpdate()
    this.$vuetify.goTo(0)
    this.getDireitos()
    this.getDataFromApi()
  }
}
</script>

<style></style>
