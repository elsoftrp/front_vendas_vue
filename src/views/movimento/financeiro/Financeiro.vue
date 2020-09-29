<template>
  <v-app :id="nomeJanela">

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
              <v-row>
                <v-col>
                  <notificacao :color="'green darken-4'" :valor="totaliza.receber_vencido"><template v-slot:titulo>{{'Receber vencidos'}}</template> </notificacao>
                </v-col>
                <v-col>
                  <notificacao :color="'red darken-4'" :valor="totaliza.pagar_vencido"><template v-slot:titulo>{{'Pagar vencidos'}}</template> </notificacao>
                </v-col>
                <v-col>
                  <notificacao  :color="'green--text'" :valor="totaliza.receber_vencer"><template v-slot:titulo>{{'Receber a vencer'}}</template> </notificacao>
                </v-col>
                <v-col>
                  <notificacao :color="'red--text'" :valor="totaliza.pagar_vencer"><template v-slot:titulo>{{'Pagar a vencer'}}</template> </notificacao>
                </v-col>
              </v-row>
            </v-container>
            <!-- controles -->
            <v-row class="pl-10">
              <v-col v-show="false" xs="12" sm="12" md="12" lg="2" class="mt-5">
                <v-btn x-small depressed color="primary" dark @click="goDashboard()"><v-icon>mdi-chart-areaspline</v-icon>Resumo</v-btn>
              </v-col>
              <v-col xs="6" sm="6" md="6" lg="5">
                <v-radio-group row v-model="state.posicao">
                  <v-radio
                    label="Aberto"
                    value="A"
                  >
                  </v-radio>
                  <v-radio
                    label="Baixado"
                    value="B"
                  ></v-radio>
                  <v-radio
                    label="Todos"
                    value="T"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col xs="6" sm="6" md="6" lg="5" class="mt-5">
                <v-btn class="mr-2 mb-2" x-small depressed color="success" dark v-show="direitos && direitos.btnchave1" :disabled="!(state.posicao === 'A')" @click="goBaixar()"><v-icon>mdi-currency-usd</v-icon>Baixar</v-btn>
                <v-btn class="mr-2 mb-2" x-small depressed color="warning" dark v-show="direitos && direitos.btnchave2" :disabled="!(state.posicao !== 'T')" @click="goEstornar()"><v-icon>mdi-backspace-outline</v-icon> Estonar</v-btn>
                <v-btn class="mr-2 mb-2" x-small depressed color="error" dark v-show="direitos && direitos.btnexcluir" :disabled="!(state.posicao ==='A')" @click="goDelete()"><v-icon>mdi-delete</v-icon>Excluir</v-btn>
                <v-btn class="mr-2 mb-2" x-small depressed color="secondary" dark  @click="goDetalhes()"><v-icon>mdi-details</v-icon>Detalhes</v-btn>
              </v-col>
            </v-row>
            <!-- inicio grid -->
            <v-data-table
              disable-pagination
              hide-default-footer
              :headers="headers"
              :items="dataset"
              :custom-sort="customSort"
              :sort-by.sync="state.sortBy"
              :sort-desc.sync="state.sortDesc"
              :loading="loading"
              show-select
              :single-select="true"
              item-key='id'
              v-model="titulo"
            >
              <template v-slot:item.tpfinanceiro='{ item }'>
                    <v-chip outlined label x-small dark :color="item.tpfinanceiro === 'R' ? 'green' : 'red'"> {{ item.tpfinanceiro === 'R' ? 'RECEBER' : 'PAGAR' }}</v-chip>
              </template>

              <template v-slot:item.pessoa="{ item }">
                <a class="text-secondary" @click="goEdit(item.id)">{{
                  item.pessoa ?  item.pessoa.nome : item.obs !== '' ? item.obs : '.'
                }}</a>
              </template>

              <template v-slot:item.pagamentodt='{ item }'>
                    <v-chip outlined label x-small v-show="!item.pagamentodt" :color="estadoTitulo(item)" dark>aberto</v-chip>
                <span>{{ item.pagamentodt ? item.pagamentodt : '' }}</span>
              </template>

              <template v-slot:item.valor="{ item }">
                <span>
                    {{ item.valor ?
                        valFormat(item.valor) : '' }}
                </span>
              </template>
              <template v-slot:item.valorpago='{ item }'>
                <v-chip outlined label small v-show="item.valorpago && item.valorpago < item.valor" color="red" dark>{{valFormat(item.valorpago)}}</v-chip>
                <span v-show="item.valorpago && item.valorpago >= item.valor">{{ item.valorpago ? valFormat(item.valorpago)   : '' }}</span>
              </template>

              <template v-slot:item.pagto_tp="{ item }">
                  {{item.pagto_tp ? item.pagto_tp.despagtotp : '.'}}
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
    <div >
      <v-dialog  v-model="dialog" max-width="600px" >
        <financeiro-bx :financeiro="itemobj"  @fechar="closeDialog" @atualiza="updateBaixa"> </financeiro-bx>
      </v-dialog>
    </div>
    <div>
      <v-dialog v-model="dialogDet" max-width="500px">
        <financeiro-detalhe :detalhes="financeiroDetalhes" @fechar="closeDialogDet"></financeiro-detalhe>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
import Notificacao from '@/components/template/Notificacao.vue'
import { baseApiUrl, showError } from '@/global'
import { mountUrl, dataVencida, valorFormatado } from '@/config/funcoes.js'
import FinanceiroBx from './FinanceiroBx'
import FinanceiroDetalhe from './FinaceiroDetalhe'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Financeiro',
  components: { FinanceiroBx, FinanceiroDetalhe, Notificacao },
  data () {
    return {
      nomeJanela: 'Financeiro',
      urlApi: 'financeiro',
      direitos: null,
      caption: '',
      callApi: false,
      itemobj: {},
      dialog: false,
      dialogDet: false,
      indexData: -1,
      titulo: [],
      financeiroDetalhes: [],
      state: {
        pagination: { meta: { last_page: 0 } },
        urlState: '',
        filterTerm: '',
        sortBy: '',
        sortDesc: false,
        posicao: 'A',
        notificacao: {},
        empresa: {}
      },
      totaliza: {
        receber_vencido: 0,
        pagar_vencido: 0,
        receber_vencer: 0,
        pagar_vencer: 0
      },
      filtered: false,
      loading: true,
      headers: [
        { text: 'Movimento', value: 'tpfinanceiro' },
        { text: 'Pessoa', value: 'pessoa' },
        { text: 'Vencimento', value: 'vencimentodt' },
        { text: 'Pagamento', value: 'pagamentodt' },
        { text: 'Valor', value: 'valor' },
        { text: 'Valor Pago', value: 'valorpago' },
        { text: 'Tipo Pagto', value: 'pagto_tp' }
      ],
      pageState: 1,
      dataset: []
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader','setFinanceiroData']),
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
      if (this.financeiroData !== null) {
        this.state = this.financeiroData
        this.dataset = this.state.pagination.data
        this.pageState = this.state.pagination.meta.current_page
        this.filtered = this.state.filterTerm !== ''
        this.loading = false
        this.callApi = false
        this.setTotaliza(this.state.notificacao)
        this.setFinanceiroData(null)
      } else {
        if (page !== this.pageState) this.pageState = page
        this.state.urlState = `${baseApiUrl}/${this.urlApi}${mountUrl(
          pesquisa,
          page,
          order,
          orderDir,
          this.state.empresa.id,
          this.state.posicao
        )}`
        axios.get(this.state.urlState)
          .then(req => {
            this.dataset = req.data.data
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
      if (this.direitos) {
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
      if (data) {
        this.totaliza.receber_vencido = data.vencidos.length > 0 ? Number(data.vencidos.filter(el => el.tpfinanceiro === 'R').map(m => m.aberto_vencido)) : 0
        this.totaliza.pagar_vencido = data.vencidos.length > 0 ? Number(data.vencidos.filter(el => el.tpfinanceiro === 'P').map(m => m.aberto_vencido)) : 0
        this.totaliza.receber_vencer = data.vencer.length > 0 ? Number(data.vencer.filter(el => el.tpfinanceiro === 'R').map(m => m.aberto_vencer)) : 0
        this.totaliza.pagar_vencer = data.vencer.length > 0 ? Number(data.vencer.filter(el => el.tpfinanceiro === 'P').map(m => m.aberto_vencer)) : 0
      }
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.setFinanceiroData(this.state)
        this.$router.push({ path: `/${this.urlApi}/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.setFinanceiroData(this.state)
        this.$router.push(`/${this.urlApi}/add`)
      }
    },
    goDelete (item) {
      if (this.direitos && this.direitos.btnexcluir && this.titulo.length > 0) {
        this.$confirm('Deseja realmente excluir esse registro ?', { buttonTrueText: 'Sim', buttonFalseText: 'Não' }).then(res => {
          if (res) {
            this.loadingAll = true
            axios.delete(`${baseApiUrl}/${this.urlApi}/${this.titulo[0].id}`)
              .then(resp => {
                this.$toasted.global.defaultSuccess()
                const index = this.dataset.indexOf(this.titulo[0])
                this.dataset.splice(index, 1)
                this.titulo = []
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
    goBaixar (item) {
      if (this.direitos && this.direitos.btnchave1 && this.titulo.length > 0) {
        Object.assign(this.itemobj, this.titulo[0])
        this.indexData = this.dataset.indexOf(this.titulo[0])
        this.dialog = true
      }
    },
    goEstornar () {
      if (this.direitos && this.direitos.btnchave2 && this.titulo.length > 0) {
        this.$confirm('Deseja realmente estornar esse título?', { buttonTrueText: 'Sim', buttonFalseText: 'Não' }).then(res => {
          if (res) {
            this.loadingAll = true
            axios.delete(`${baseApiUrl}/${this.urlApi}/estorno/${this.titulo[0].id}`)
              .then(resp => {
                this.$toasted.global.defaultSuccess()
                const index = this.dataset.indexOf(this.titulo[0])
                this.state.posicao === 'B' ? this.dataset.splice(index, 1) : Object.assign(this.dataset[index], resp.data)
                this.titulo = []
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
    goDetalhes () {
      if (this.titulo.length > 0) {
        this.buscaDetalhes(this.titulo[0].id)
        this.dialogDet = true
      }
    },
    closeDialog (value) {
      this.dialog = value
    },
    closeDialogDet (value) {
      this.financeiroDetalhes = []
      this.titulo = []
      this.dialogDet = value
    },
    updateBaixa (value) {
      this.dialog = false
      value.valorpago >= value.valor ? this.dataset.splice(this.indexData, 1) : Object.assign(this.dataset[this.indexData], value)
      this.titulo = []
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
    estadoTitulo (obj) {
      if (!obj.pagamentodt || obj.pagamentodt === '') {
        return dataVencida(obj.vencimentodt) ? 'red' : 'silver'
      }
    },
    buscaDetalhes (id) {
      if (id && id !== '') {
        axios.get(`${baseApiUrl}/financeiroitem?conditions=financeiro_id:=:${id}`)
          .then(resp => {
            this.financeiroDetalhes = resp.data.data
          })
          .catch({ showError })
      }
    },
    mudarEmpresa (value) {
      if (!this.callApi) this.getDataFromApi()
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
    'state.posicao': function (value) {
      if (value) {
        this.titulo = []
        if (!this.callApi) this.getDataFromApi()
      }
    },
    'state.empresa': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.mudarEmpresa(value)
    },
    'state.sortBy': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedBy(value)
    },
    'state.sortDesc': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedDesc(value)
    }
  },
  computed: {
    ...mapGetters('cadastros', ['financeiroData', 'menuData', 'buscaBarra', 'usuarioData']),
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
