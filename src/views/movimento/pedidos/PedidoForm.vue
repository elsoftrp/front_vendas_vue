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

          <!-- lança cliente -->
          <div>
            <v-row>
              <v-col cols="auto">
                <v-btn hide-details tile large @click="imprimirCupom(data.id)" icon><v-icon>mdi-printer</v-icon></v-btn>
              </v-col>

              <v-col cols="6" sm="6" md="3">
                <v-text-field
                  label="Data do Pedido"
                  outlined
                  dense
                  :disabled="data.id != '' "
                  id="idatapedido"
                  name="datapedido"
                  v-mask="'##/##/####'"
                  v-model="data.pedidodt"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="2" md="1" lg="1">
                <v-text-field
                  v-show="data.id"
                  outlined
                  dense
                  label="Código"
                  name="id"
                  id="iid"
                  v-model="data.id"
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
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
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  label="Cliente"
                  outlined
                  dense
                  name="cliente"
                  id="icliente"
                  item-text="nome"
                  item-value="id"
                  malength="10"
                  :readonly="data.id !== ''"
                  required
                  :search-input.sync="searchPessoa"
                  :items="pessoas"
                  :rules="[rules.required('Cliente')]"
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
              <v-col cols="6" sm="3" md="3" lg="3">
                <v-currency-field
                  outlined
                  dense
                  label="Total Produtos R$"
                  name="totproduto"
                  id="itotproduto"
                  v-model="data.totproduto"
                  readonly
                  hide-details
                ></v-currency-field>
              </v-col>
              <v-col cols="6" sm="3" md="3" lg="3">
                <v-currency-field
                  outlined
                  dense
                  label="Desconto R$"
                  name="desc"
                  id="idesc"
                  v-model="data.desconto"
                  readonly
                  hide-details
                ></v-currency-field>
              </v-col>
              <v-col cols="6" sm="3" md="3" lg="3">
                <v-currency-field
                  outlined
                  dense
                  label="Total Pedido R$"
                  name="totped"
                  id="itotped"
                  v-model="data.totpedido"
                  readonly
                  hide-details
                ></v-currency-field>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <!--Lista de produtos -->
            <v-col>
              <v-btn class="ma-3" fab dark color="green" @click="adicionarProduto">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
              <v-data-table
                disable-pagination
                hide-default-footer
                :headers="headers"
                :items="data.pedido_item"
              >
                <template v-slot:item.produto.despro="{ item }">
                  <a class="text-secondary" @click="editarProduto(item)">{{
                    item.produto.despro ? item.produto.despro : '.'
                    }}</a>
                </template>

                <template v-slot:item.prvenda="{ item }">
                  <span>
                      {{ item.prvenda ?
                          valFormat(item.prvenda) : '' }}
                  </span>
                </template>
                <template v-slot:item.desconto="{ item }">
                  <span>
                      {{ item.desconto ?
                          valFormat(item.desconto) : '' }}
                  </span>
                </template>
                <template v-slot:item.prtotal="{ item }">
                  <span>
                      {{ item.prtotal ?
                          valFormat(item.prtotal) : '' }}
                  </span>
                </template>

                <template v-slot:item.acao="{ item }">
                  <v-icon @click="excluirItem(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <br />
          <v-row>
            <v-col cols="auto">
              <v-btn color="success" large @click="dialogFinaliza = true">Finalizar</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="error" large @click.prevent="goBack">Cancelar</v-btn>
            </v-col>
          </v-row>
        </v-card>
        <!-- Finaliza venda -->
        <div>
          <v-dialog style="height: 700px;" v-model="dialogFinaliza" scrollable max-width="600px">
            <v-card>
              <v-card-title>Finalizar Venda</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-currency-field
                      outlined
                      dense
                      label="Total Produtos R$"
                      name="ptotprodutos"
                      id="iptotprodutos"
                      v-model="data.totproduto"
                      readonly
                      hide-details
                    ></v-currency-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-currency-field
                      outlined
                      dense
                      label="Desconto R$"
                      name="pdesconto"
                      id="ipdesconto"
                      v-model="data.desconto"
                      hide-details
                    ></v-currency-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-currency-field
                      outlined
                      dense
                      label="Total"
                      name="ptotal"
                      id="iptotal"
                      readonly
                      v-model="data.totpedido"
                      hide-details
                    ></v-currency-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="6" md="6" lg="6">
                    <v-radio-group hide-details row v-model="data.tp_pagto">
                      <v-radio
                        label="À Vista"
                        value="A"
                      >
                      </v-radio>
                      <v-radio
                        label="Prazo"
                        value="P"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row v-show="data.tp_pagto === 'P'">
                  <v-col cols="12" xs="12" sm="4" md="4" lg="4">
                    <v-text-field
                      outlined
                      dense
                      type="number"
                      label="Nº Parcelas"
                      name="parcelas"
                      id="iparcelas"
                      :rules="data.tp_pagto === 'P' ? [rules.required('Parcela')] : []"
                      v-model="data.parcelas"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4" md="4" lg="4">
                    <v-text-field
                      outlined
                      dense
                      type="number"
                      label="Dias 1ª Parcela"
                      name="diaspri"
                      id="idiaspri"
                      :rules="data.tp_pagto === 'P' ? [rules.required('Primeira Parcela')]: []"
                      v-model="data.dias_pri"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4" md="4" lg="4"
                    v-show="(data.parcelas && data.parcelas > 1)">
                    <v-text-field
                      outlined
                      dense
                      type="number"
                      label="Dias Próximas Parc."
                      name="diasprox"
                      id="idiasprox"
                      :rules="data.tp_pagto === 'P' && data.parcelas && data.parcelas > 1 ? [rules.required('Próximas Parcelas')] : []"
                      v-model="data.dias_prox"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-autocomplete
                      label="Forma Pagamento"
                      outlined
                      dense
                      name="pagtotp"
                      id="ipagtotp"
                      item-text="despagtotp"
                      item-value="id"
                      malength="10"
                      required
                      :items="pagtos"
                      :rules="[rules.required('Forma')]"
                      v-model="data.pagto_tp"
                      return-object
                      hide-details
                    >
                    </v-autocomplete>
                  </v-col>

                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-col cols="auto">
                  <v-btn type="submit" @click="salvar" color="success" :disabled="!validForm">Salvar</v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="error" @click="dialogFinaliza = false">Fechar</v-btn>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-container>
    </v-form>
    <!-- Lança produtos -->
    <div>
      <v-dialog style="height: 600px;" v-model="dialog" scrollable max-width="600px">
        <v-card outlined>
          <v-card-title>Produto</v-card-title>
          <v-divider></v-divider>
          <v-form
            id="fProduto"
            @submit.prevent="salvarProduto"
            v-model="validProduto"
            enctype="multipart/form-data"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-autocomplete
                    label="Produto"
                    outlined
                    dense
                    name="produto"
                    id="iproduto"
                    item-text="despro"
                    item-value="id"
                    malength="10"
                    required
                    :search-input.sync="searchProduto"
                    :items="produtos"
                    :rules="[rules.required('Produto')]"
                    v-model="item.produto"
                    @blur="atualizaPreco(item)"
                    return-object
                    hide-details
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.despro"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.prvenda"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="3" md="3" lg="3">
                  <v-currency-field
                    outlined
                    dense
                    label="Preço de Venda R$"
                    name="prvenda"
                    id="iprvenda"
                    v-model="item.prvenda"
                    :rules="[rules.required('Preço'),rules.notZero('Preço')]"
                    readonly
                    hide-details
                  ></v-currency-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-currency-field
                    outlined
                    dense
                    label="Desconto R$"
                    name="desconto"
                    id="idesconto"
                    @blur="atualizaTotal(item)"
                    v-model="item.desconto"
                    hide-details
                  ></v-currency-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="3" md="3" lg="3">
                  <v-text-field
                    outlined
                    dense
                    type="number"
                    label="Quantidade"
                    name="quantidade"
                    id="iquantidade"
                    :rules="[rules.required('Quantidade')]"
                    v-model="item.quantidade"
                    @blur="atualizaTotal(item)"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="3" md="3" lg="3">
                  <v-currency-field
                    outlined
                    dense
                    label="Total"
                    name="total"
                    id="itotal"
                    :rules="[rules.required('Total'), rules.notZero('Total')]"
                    readonly
                    v-model="item.prtotal"
                    hide-details
                  ></v-currency-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text type="submit" color="success" :disabled="!validProduto">Salvar</v-btn>
              <v-btn color="error" text @click="dialog = false">Fechar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { mask } from 'vue-the-mask'
import { baseApiUrl, showError } from '@/global'
import { dataHoje, valorFormatado } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'

export default {
  name: 'PedidoForm',
  directives: { mask },
  components: { Loading },
  data () {
    return {
      urlApi: 'pedidos',
      caption: 'Vendas',
      loadingAll: false,
      validForm: false,
      validProduto: false,
      dialog: false,
      dialogFinaliza: false,
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
      searchPessoa: null,
      searchProduto: null,
      pessoas: [],
      produtos: [],
      pagtos: [],
      item: {},
      indexProduto: -1,
      status: '',
      headers: [
        { text: 'Código', value: 'produto.id' },
        { text: 'Produto', value: 'produto.despro' },
        { text: 'Pr.Unitário', value: 'prvenda' },
        { text: 'Desconto', value: 'desconto' },
        { text: 'Quant.', value: 'quantidade' },
        { text: 'Pr.Total', value: 'prtotal' },
        { text: 'Remover', value: 'acao' }
      ],
      data: {
        id: '',
        pessoa_id: '',
        totproduto: '',
        desconto: '',
        devolucao: '',
        totpedido: '',
        pessoa: {},
        tp_pagto: 'A',
        pedido_item: []
      }
    }
  },
  methods: {
    ...mapMutations('pedido', ['setPedidoImp']),
    imprimirCupom (id) {
      if (id && id !== '') {
        this.setPedidoImp(this.data)
        this.$router.push({ path: `/${this.urlApi}/cupom/${id}` })
      }
    },
    buscaProduto (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/pedidos/produto`, { pesquisa: pesquisa })
          .then(req => {
            this.produtos = req.data
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
    buscaPagtos () {
      axios
        .get(`${baseApiUrl}/pagtotp`)
        .then(req => {
          this.pagtos = req.data
        })
    },
    salvar () {
      if (!this.validForm) return
      if (this.data.pedido_item.length === 0) return
      if (!this.data.pessoa) return
      if (!this.data.empresa) return
      const method = this.data.id ? 'put' : 'post'
      const id = this.data.id ? `/${this.data.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/${this.urlApi}${id}`, this.data)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          if (method === 'put') {
            const index = this.pedidoData.pagination.data.map(el => el.id).indexOf(this.data.id)
            Object.assign(this.pedidoData.pagination.data[index], this.data)
          } else {
            this.data.id = req.data
            this.pedidoData.pagination.data.unshift(this.data)
          }
          this.$confirm('Deseja imprimir a venda ?', { buttonTrueText: 'Sim', buttonFalseText: 'Não' }).then(res => {
            if (res) {
              this.imprimirCupom(this.data.id)
            } else {
              this.$router.push({ path: `/${this.urlApi}` })
            }
          })
        })
        .catch(showError)
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    },
    salvarProduto () {
      this.atualizaTotal(this.item)
      this.status === 'edit' ? Object.assign(this.data.pedido_item[this.indexProduto], this.item)
        : this.data.pedido_item.push(this.item)
      this.atualizaPedido()
      this.item = {}
      this.status = ''
      this.dialog = false
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: `/${this.urlApi}` })
    },
    adicionarProduto () {
      this.status = 'insert'
      this.item = {}
      this.dialog = true
    },
    editarProduto (item) {
      this.status = 'edit'
      this.indexProduto = this.data.pedido_item.indexOf(item)
      this.item = Object.assign({}, item)
      this.dialog = true
    },
    excluirItem (item) {
      const index = this.data.pedido_item.indexOf(item)
      this.data.pedido_item.splice(index, 1)
    },
    atualizaPreco (obj) {
      if (obj && obj.produto) {
        obj.prvenda = obj.produto.prvenda
      }
    },
    atualizaTotal (obj) {
      if (obj && obj.produto && obj.quantidade > 0) {
        const desconto = obj.desconto ? obj.desconto : 0
        obj.prtotal = ((obj.prvenda - desconto) * obj.quantidade)
      }
    },
    atualizaPedido () {
      this.data.totproduto = this.data.pedido_item.reduce(function (total, item) {
        return total + item.prtotal
      }, 0)
      this.data.totpedido = (this.data.totproduto - this.data.desconto)
    },
    valFormat (value) {
      return valorFormatado(value)
    }
  },
  watch: {
    searchProduto: function (value) {
      if (value && value !== '') {
        this.buscaProduto(value)
      }
    },
    searchPessoa: function (value) {
      if (value && value !== '') {
        this.buscaPessoa(value)
      }
    },
    'data.desconto': function (value) {
      if (value && value !== '') {
        this.atualizaPedido()
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['pedidoData']),
    ...mapGetters(['empresas'])
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id !== '') {
      this.loadingAll = true
      axios
        .get(`${baseApiUrl}/${this.urlApi}/${this.$route.params.id}/edit`)
        .then(req => {
          this.data = req.data
          if (this.data.pessoa) this.pessoas.push(this.data.pessoa)
          if (this.data.pagto_tp) this.pagtos.push(this.data.pagto_tp)
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
    } else {
      this.data.pedidodt = dataHoje()
    }
    this.$vuetify.goTo(0)
    this.buscaPagtos()
    this.$forceUpdate()
  }
}
</script>

<style></style>
