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
          <v-tabs background-color="brown darken-1" dark flat>
            <v-tab>Cadastro</v-tab>

            <v-tab-item><!-- cadastro de produto -->

              <v-row>
                <v-col cols="6" sm="2" md="1" lg="1">
                  <v-text-field
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
                <v-col cols="6" sm="6" md="2" lg="2">
                  <v-text-field
                    label="Data do Cadastro"
                    outlined
                    dense
                    id="idatacadastro"
                    name="datacadastro"
                    v-model="data.created_at"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="2" md="1" lg="1">
                  <v-checkbox
                    outlined
                    dense
                    label="Inativo"
                    name="inativo"
                    id="iinativo"
                    v-model="data.inativo"
                    true-value="true"
                    false-value="false"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols='6' sm='3' md='2' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='Data Inativo'
                    class='mask-data'
                    name='inativodt'
                    id='iinativodt'
                    maxlength='10'
                    v-mask="'##/##/####'"
                    v-model='data.inativodt'
                    :disabled='data.inativo==false'
                    :required='data.inativo==true'
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                <v-autocomplete
                    label="Unidade"
                    outlined
                    dense
                    name="unidade"
                    id="iunidade"
                    item-text="unidade"
                    item-value="id"
                    malength="10"
                    required
                    :items="unidades"
                    :rules="[rules.required('Unidade')]"
                    v-model="data.unidade"
                    return-object
                    hide-details
                    >
                      <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.unidade"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.desunidade"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                  </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <v-text-field
                    label="Descrição"
                    outlined
                    dense
                    name="despro"
                    id="idespro"
                    malength="80"
                    required
                    :rules="[rules.required('Descrição')]"
                    v-model="data.despro"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="data.grupo"
                    :items="grupos"
                    autocomplete="off"
                    hide-no-data
                    hide-selected
                    item-text="descricao"
                    item-value="id"
                    label="Grupo"
                    :search-input.sync="searchGrupo"
                    placeholder="Digite para busca"
                    return-object
                    hide-details
                    :rules="[rules.required('Grupo')]"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" md="2" lg="2">
                  <v-currency-field
                    outlined
                    dense
                    label="Preço de Custo R$"
                    name="prcusto"
                    id="iprcusto"
                    v-model="data.prcusto"
                    hide-details
                    @blur="atualizaVenda(data)"
                  ></v-currency-field>
                </v-col>
                <v-col cols="12" sm="3" md="2" lg="2">
                  <v-currency-field
                    outlined
                    dense
                    label="Percentual Lucro %"
                    name="plucro"
                    id="iplucro"
                    v-model="data.plucro"
                    hide-details
                    @blur="atualizaVenda(data)"
                  ></v-currency-field>
                </v-col>
                <v-col cols="12" sm="3" md="2" lg="2">
                  <v-currency-field
                    outlined
                    dense
                    label="Preço de Venda R$"
                    name="prvenda"
                    id="iprvenda"
                    v-model="data.prvenda"
                    hide-details
                    @blur="atualizaLucro(data)"
                  ></v-currency-field>
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
            </v-tab-item>
          </v-tabs>
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
  name: 'ProdutoForm',
  directives: { mask },
  components: { Loading },
  data () {
    return {
      urlApi: 'produtos',
      caption: 'Cadastro de Produtos',
      loadingAll: false,
      validForm: false,
      nCadastroValid: true,
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        }
      },
      searchGrupo: null,
      grupos: [],
      unidades: [],
      data: {
        id: '',
        empresa_id: '',
        grupo_id: '',
        ean: '',
        despro: '',
        unidade: '',
        prcusto: '',
        plucro: '',
        prvenda: '',
        estoquep: '',
        ultprcompra: '',
        ultprvenda: '',
        dtvenda: '',
        dtcompra: '',
        inativo: '',
        inativod: '',
        created_at: '',
        grupo: {}
      }
    }
  },
  methods: {
    buscaGrupo () {
      axios
        .get(`${baseApiUrl}/grupos/`)
        .then(req => {
          this.grupos = req.data.data
        })
    },
    buscaUnidade () {
      axios
        .get(`${baseApiUrl}/unidades/`)
        .then(req => {
          this.unidades = req.data.data
        })
    },
    salvar () {
      if (!this.validForm) return
      const method = this.data.id ? 'put' : 'post'
      const id = this.data.id ? `/${this.data.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/${this.urlApi}${id}`, this.data)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          if (method === 'put') {
            const index = this.produtoData.pagination.data.map(el => el.id).indexOf(this.data.id)
            Object.assign(this.produtoData.pagination.data[index], this.data)
          } else {
            this.produtoData.pagination.data.unshift(this.data)
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
    isCadastroValido () {
      return this.nCadastroValid || 'Já existe esse número cadastrado'
    },
    hasCadastro (value) {
      if (value) {
        if (!value) return
        axios
          .post(`${baseApiUrl}/${this.urlApi}/seek`, { campo: value })
          .then(req => {
            const resultado = req.data
            if (!resultado) this.nCadastroValid = true
            else if (resultado.length > 1) this.nCadastroValid = false
            else if (
              resultado.length > 0 &&
              resultado[0].id !== this.data.id
            ) { this.nCadastroValid = false } else this.nCadastroValid = true
          })
      } else this.nCadastroValid = true
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
    searchGrupo: function (value) {
      if (value && value !== '') {
        this.buscaGrupo(value)
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['produtoData'])
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id !== '') {
      this.loadingAll = true
      axios
        .get(`${baseApiUrl}/${this.urlApi}/${this.$route.params.id}/edit`)
        .then(req => {
          this.data = req.data
          if (this.data.grupo) this.grupos.push(this.data.grupo)
          if (this.data.unidade) this.unidades.push(this.data.unidade)
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
      this.data = { }
    }
    this.buscaGrupo()
    this.buscaUnidade()
  }
}
</script>

<style></style>
