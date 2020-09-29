/* eslint-disable camelcase */
/* eslint-disable camelcase */
<template>
  <v-app>
    <loading :active.sync="loadingAll" :is-full-page="true"></loading>
    <v-btn
        class="ma-3"
        fab
        fixed
        right
        dark
        color="deep-purple darken-3"
        @click="goBack"
      >
        <v-icon dark>mdi-arrow-left</v-icon>
      </v-btn>
    <v-form
      id="fCadastro"
      @submit.prevent="salvar"
      v-model="validForm"
      enctype="multipart/form-data"
    >
      <v-container fluid class="pa-1 text-black-50">
        <v-card outlined class="ma-1 pa-3">

              <v-row>
                <v-col cols="6" sm="6" md="6" lg="1">
                  <v-text-field
                    outlined
                    dense
                    label="Código"
                    name="id"
                    id="iid"
                    v-show="data.id !== ''"
                    v-model="data.id"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="3">
                  <v-text-field
                    label="Data do Cadastro"
                    outlined
                    dense
                    id="idatacadastro"
                    name="datacadastro"
                    v-show="data.id !== ''"
                    v-model="data.created_at"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <v-select
                    outlined
                    dense
                    label="Empresa"
                    :items="empresas"
                    item-text="descricao"
                    item-value="id"
                    v-model="data.empresa"
                    :rules="[rules.required('Empresa')]"
                    return-object
                    hide-details
                    >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-radio-group hide-details row v-model="data.tpfinanceiro">
                    <v-radio
                      label="Receber"
                      value="R"
                    >
                    </v-radio>
                    <v-radio
                      label="Pagar"
                      value="P"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <v-autocomplete
                    label="Plano de Contas"
                    outlined
                    dense
                    :items="planos"
                    v-model="data.plano_conta"
                    return-object
                    item-text="desplano"
                    item-value="id"
                    :search-input.sync="searchPlano"
                    malength="10"
                    hide-details
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.desplano"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.classificacao"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <v-autocomplete
                    label="Pessoa"
                    outlined
                    dense
                    name="pessoa"
                    id="ipessoa"
                    item-text="nome"
                    item-value="id"
                    malength="10"
                    :readonly="(data.id !== '' && data.pedido_id && data.pedido_id !== '')"
                    :search-input.sync="searchPessoa"
                    :items="pessoas"
                    v-model="data.pessoa"
                    return-object
                    hide-details
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.nome"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.cnpjcpf"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='6' xs="12" sm='3' md='2' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='Data Vencimento'
                    class='mask-data'
                    name='vencimentodt'
                    id='ivencimentodt'
                    maxlength='10'
                    v-mask="'##/##/####'"
                    v-model='data.vencimentodt'
                    :rules="[rules.required('Data vencimento')]"
                    hide-details
                  ></v-text-field>
                </v-col>
                  <v-col cols="6" xs="12" sm="3" md="3" lg="2">
                    <v-text-field
                      outlined
                      dense
                      type="number"
                      label="Parcela"
                      name="parcela"
                      id="iparcela"
                      v-model="data.parcela"
                      hide-details
                    ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="data.pagto_tp"
                    :items="pagtos"
                    autocomplete="off"
                    hide-no-data
                    hide-selected
                    item-text="despagtotp"
                    item-value="id"
                    label="Forma de Pagamento"
                    return-object
                    :rules="[rules.required('Forma Pagamento')]"
                    hide-details
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-currency-field
                    outlined
                    dense
                    label="Valor do Título R$"
                    name="valor"
                    id="ivalor"
                    v-model="data.valor"
                    required
                    :rules="[rules.notZero('Valor')]"
                    hide-details
                  ></v-currency-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    label="Histórico"
                    outlined
                    dense
                    name="obs"
                    id="iobs"
                    malength="80"
                    v-model="data.obs"
                    :rules="[rules.required('Histórico')]"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <br />
              <v-row>
                <v-col cols="auto">
                  <v-btn
                    type="submit"
                    color="success"
                    large
                    :disabled="!validForm"
                    >Salvar</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn color="error" large @click.prevent="goBack"
                    >Cancelar</v-btn
                  >
                </v-col>
              </v-row>

        </v-card>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { mask } from 'vue-the-mask'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'FinanceiroForm',
  directives: { mask },
  components: { Loading },
  data () {
    return {
      urlApi: 'financeiro',
      caption: 'Financeiro',
      loadingAll: false,
      validForm: false,
      nCadastroValid: true,
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        notZero (propertyType) {
          return value => (value && value !== '0,00') || `${propertyType} precisa ser preenchido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        }
      },
      searchPlano: null,
      searchPessoa: null,
      pessoas: [],
      planos: [],
      pagtos: [],
      data: {
        id: '',
        tpfinanceiro: 'R',
        created_at: ''
      }
    }
  },
  methods: {
    buscaPagtos () {
      axios
        .get(`${baseApiUrl}/pagtotp`)
        .then(req => {
          this.pagtos = req.data
        })
    },
    buscaPlano (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/${this.urlApi}/planoconta`, { pesquisa: pesquisa })
          .then(req => {
            this.planos = req.data
          })
      }
    },
    buscaPessoa (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/pedidos/cliente`, { pesquisa: pesquisa })
          .then(req => {
            this.pessoas = req.data
          })
      }
    },
    salvar () {
      if (!this.validForm) return
      if (this.data.valorpago > 0) return
      const method = this.data.id ? 'put' : 'post'
      const id = this.data.id ? `/${this.data.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/${this.urlApi}${id}`, this.data)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          if (method === 'put') {
            const index = this.financeiroData.pagination.data.map(el => el.id).indexOf(this.data.id)
            Object.assign(this.financeiroData.pagination.data[index], this.data)
          } else {
            this.data.id = req.data
            this.financeiroData.pagination.data.unshift(this.data)
          }
          this.$router.push({ path: `/${this.urlApi}` })
        })
        .catch(showError)
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: `/${this.urlApi}` })
    },
    atualizaLucro (obj) {
      if (obj.prvenda && obj.prvenda !== '' && obj.prvenda > 0 && obj.prcusto > 0) {
        obj.plucro = ((((obj.prvenda - obj.prcusto) / obj.prcusto) * 100))
      }
    },
    atualizaVenda (obj) {
      if (obj.plucro && obj.plucro !== '' && obj.plucro > 0 && obj.prcusto > 0) {
        obj.prvenda = (obj.prcusto + ((obj.prcusto * obj.plucro) / 100))
      }
    }
  },
  watch: {
    searchPlano: function (value) {
      if (value && value !== '') {
        this.buscaPlano(value)
      }
    },
    searchPessoa: function (value) {
      if (value && value !== '') {
        this.buscaPessoa(value)
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['financeiroData']),
    ...mapGetters(['empresas'])
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id !== '') {
      this.loadingAll = true
      axios
        .get(`${baseApiUrl}/${this.urlApi}/${this.$route.params.id}/edit`)
        .then(req => {
          this.data = req.data
          if (this.data.pagto_tp) this.pagtos.push(this.data.pagto_tp)
          if (this.data.pessoa) this.pessoas.push(this.data.pessoa)
          if (this.data.plano_conta) this.planos.push(this.data.plano_conta)
        })
        .catch(err => {
          if ((err.response.status === 403)) {
            showError(err)
            this.goBack()
          }
        })
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    }
    this.buscaPagtos()
  }
}
</script>

<style></style>
