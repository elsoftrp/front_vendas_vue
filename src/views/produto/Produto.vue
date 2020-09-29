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
      <v-data-table
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="dataset"
        :custom-sort="customSort"
        :sort-by.sync="state.sortBy"
        :sort-desc.sync="state.sortDesc"
        :loading="loading"
      >
        <template v-slot:item.despro="{ item }">
          <a class="text-secondary" @click="goEdit(item.id)">{{
            item.despro ? item.despro : '.'
          }}</a>
        </template>

        <template v-slot:item.prvenda="{ item }">
          <span>
              {{ item.prvenda ?
                  new Number(item.prvenda).toLocaleString('pt-br', { maximumFractionDigits: 2 , minimumFractionDigits: 2}) : '' }}
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
          :length="state.pagination.last_page"
          total-visible="8"
        ></v-pagination>
      </div>
      <div class="text-muted">Total de registros {{ state.pagination.total }}</div>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'
import { mountUrl } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Produtos',
  data () {
    return {
      nomeJanela: 'Produtos',
      urlApi: 'produtos',
      direitos: null,
      caption: '',
      callApi: false,
      state: {
        pagination: {},
        urlState: '',
        filterTerm: '',
        sortBy: '',
        sortDesc: false
      },
      filtered: false,
      loading: true,
      headers: [
        { text: 'Produto', value: 'despro' },
        { text: 'Preço', value: 'prvenda' },
        { text: 'Estoque', value: 'estoque' },
        { text: 'Grupo', value: 'descricao' },
        { text: 'Remover', value: 'actions', sortable: false }
      ],
      pageState: 1,
      dataset: []
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader', 'setProdutoData']),
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
      if (this.produtoData !== null) {
        this.state = this.produtoData
        this.dataset = this.state.pagination.data
        this.pageState = this.state.pagination.current_page
        this.filtered = this.state.filterTerm !== ''
        this.loading = false
        this.callApi = false
        this.setProdutoData(null)
      } else {
        if (page !== this.pageState) this.pageState = page
        this.state.urlState = `${baseApiUrl}/${this.urlApi}${mountUrl(
          pesquisa,
          page,
          order,
          orderDir
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
      }
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.setProdutoData(this.state)
        this.$router.push({ path: `/${this.urlApi}/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.setProdutoData(this.state)
        this.$router.push(`/${this.urlApi}/add`)
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
          value !== this.state.pagination.current_page)
      ) this.navigate(value)
    },
    'state.sortBy': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedBy(value)
    },
    'state.sortDesc': function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) this.orderedDesc(value)
    }
  },
  computed: {
    ...mapGetters('cadastros', ['produtoData', 'menuData', 'buscaBarra'])
  },
  mounted () {
    this.$vuetify.goTo(0)
    this.getDataFromApi()
    this.getDireitos()
  }
}
</script>

<style></style>
