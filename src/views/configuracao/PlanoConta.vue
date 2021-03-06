<template>
  <v-app id="pessoas">
    <v-card outlined class="ma-1 pa-1">
      <v-btn
        v-show="direitos && direitos.btnincluir"
        class="ma-3"
        fab
        dark
        fixed
        right
        bottom
        color="deep-purple darken-3"
        @click="goAdd"
      >
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      <v-data-table
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="dataset"
        :custom-sort="customSort"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :loading="loading"
      >
      <template v-slot:item.desplano="{ item }">
        <a class="text-secondary" @click="goEdit(item)">{{
          item.desplano ? item.desplano : '.'
        }}</a>
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
          :length="pagination.last_page"
          total-visible="8"
        ></v-pagination>
      </div>
      <div class="text-muted">Total de registros {{ pagination.total }}</div>
    </v-card>
    <div>
        <v-dialog style='height: 600px;' v-model='dialog' scrollable max-width='600px' >
          <v-card>
            <v-card-title>Cadastro</v-card-title>
            <v-divider></v-divider>
            <v-form
              id="fCadastro"
              @submit.prevent="salvar"
              v-model="validForm"
              enctype="multipart/form-data"
              >
            <v-card-text >
              <v-row>
                <v-col cols="6" sm="3" md="3" lg="3">
                  <v-text-field
                    outlined
                    dense
                    label="Código"
                    name="id"
                    id="iid"
                    v-model="data.id"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    label="Plano de Conta Principal"
                    outlined
                    dense
                    :items="planos"
                    v-model="data.plano_conta_pai"
                    return-object
                    item-text="desplano"
                    item-value="id"
                    :search-input.sync="searchPlano"
                    malength="10"
                    @blur="setClassificacao(data)"
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
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    label="Descrição"
                    outlined
                    dense
                    name="desplano"
                    id="idesplano"
                    malength="80"
                    required
                    :rules="[rules.required('Descrição')]"
                    v-model="data.desplano"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    label="Classificação"
                    outlined
                    dense
                    name="classificacao"
                    id="iclassificacao"
                    malength="80"
                    required
                    :rules="[rules.required('Classificação')]"
                    v-model="data.classificacao"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="error" text @click='dialog = false'
                >Fechar</v-btn
              >
              <v-btn text
                     type="submit"
                     color="success"
                     :disabled="!validForm"
                >Salvar</v-btn
              >
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'
import { mountUrl } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'PlanoConta',
  data () {
    return {
      nomeJanela: 'PlanoConta',
      urlApi: 'planoconta',
      headers: [
        { text: 'Classificação', value: 'classificacao' },
        { text: 'Descrição', value: 'desplano' },
        { text: 'Ação', value: 'actions', sortable: false }
      ],
      caption: '',
      direitos: null,
      searchPlano: null,
      callApi: false,
      sortBy: '',
      sortDesc: false,
      urlState: '',
      filterTerm: '',
      filtered: false,
      loading: true,
      pagination: {},
      pageState: 1,
      dataset: [],
      indexData: -1,
      data: { classicacao: '' },
      validForm: false,
      dialog: false,
      planos: [],
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        }
      }
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader']),
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
      this.urlState = `${baseApiUrl}/${this.urlApi}${mountUrl(
        pesquisa,
        page,
        order,
        orderDir
      )}`
      axios.get(this.urlState)
        .then(req => {
          this.dataset = req.data.data
          this.pagination = req.data
          this.loading = false
          this.callApi = false
        })
        .catch(showError)
        .finally((this.loading = false))
    },
    salvar () {
      if (!this.validForm) return
      const method = this.data.id ? 'put' : 'post'
      const id = this.data.id ? `/${this.data.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/${this.urlApi}${id}`, this.data)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          this.data.id = req.data
          method === 'put' ? Object.assign(this.dataset[this.indexData], this.data) : this.dataset.push(this.data)
          this.dialog = false
        })
        .catch(showError)
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    },
    goEdit (item) {
      if (this.direitos && this.direitos.btnalterar) {
        this.indexData = this.dataset.indexOf(item)
        this.data = Object.assign({}, item)
        if (this.data.plano_conta_pai) {
          this.planos.push(this.data.plano_conta_pai)
        }
        this.dialog = true
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.data = { classificacao: '' }
        this.dialog = true
      }
    },
    goDelete (item) {
      if (this.direitos && this.direitos.btnexcluir) {
        this.$confirm('Deseja realmente excluir esse registro ?', { buttonTrueText: 'Sim', buttonFalseText: 'Não' }).then(res => {
          if (res) {
            this.loadingAll = true
            axios.delete(`${baseApiUrl}/${this.urlApi}/${item.id}`)
              .then(resp => {
                this.$toasted.global.defaultSuccess()
                const index = this.dataset.indexOf(item)
                this.dataset.splice(index, 1)
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
    navigate (page) {
      if (!this.callApi) this.getDataFromApi(this.filterTerm, page, this.sortBy, this.sortDesc)
    },
    orderedBy (value) {
      if (!this.callApi) this.getDataFromApi(this.filterTerm, 1, value, this.sortDesc)
    },
    orderedDesc (value) {
      if (!this.callApi) this.getDataFromApi(this.filterTerm, 1, this.sortBy, value)
    },
    find (filter) {
      if (filter != null && filter !== '' && filter.length >= 3) {
        this.filterTerm = filter
        this.filtered = true
        if (!this.callApi) this.getDataFromApi(this.filterTerm)
      } else if (this.filtered) {
        if (!this.callApi) {
          this.getDataFromApi()
          this.filtered = false
          this.filterTerm = ''
        }
      }
    },
    customSort: function (items, index, isDesc) {
      return items
    },
    buscaPlano (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/${this.urlApi}/planopai`, { pesquisa: pesquisa })
          .then(req => {
            this.planos = req.data
          })
      }
    },
    setClassificacao (item) {
      if (item.plano_conta_pai && item.plano_conta_pai.classificacao !== '') {
        item.classificacao = item.plano_conta_pai.classificacao + '.'
      }
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
          value !== this.pagination.current_page)
      ) this.navigate(value)
    },
    sortBy: function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedBy(value)
    },
    sortDesc: function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedDesc(value)
    },
    searchPlano: function (value) {
      if (value && value !== '') {
        this.buscaPlano(value)
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['menuData', 'buscaBarra'])
  },
  mounted () {
    this.$vuetify.goTo(0)
    this.getDataFromApi()
    this.getDireitos()
  }
}
</script>

<style></style>
