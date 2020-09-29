<template>
  <v-app id="usuario">
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
        :items="entitys"
        :custom-sort="customSort"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :loading="loading"
      >
        <template v-slot:item.name="{ item }">
          <a class="text-secondary" @click="goEdit(item.id)">{{
            item.name ? item.name : '.'
          }}</a>
        </template>
        <template v-slot:item.email="{ item }">
          <a v-if="item.email" :href="`mailto:${item.email.toLowerCase()}`">{{
            item.email
          }}</a>
          <span v-else>{{ `.` }}</span>
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
  </v-app>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'
import { mountUrl } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Usuarios',
  data () {
    return {
      nomeJanela: 'Usuarios',
      caption: '',
      direitos: null,
      callApi: false,
      sortBy: '',
      sortDesc: false,
      urlState: '',
      filterTerm: '',
      filtered: false,
      loading: true,
      headers: [
        { text: 'Código', value: 'id' },
        { text: 'Nome', value: 'name' },
        { text: 'E-mail', value: 'email' },
        { text: 'Empresa', value: 'nome' },
        { text: 'Remover', value: 'actions', sortable: false }
      ],
      pagination: {},
      pageState: 1,
      entitys: []
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
      if (page !== this.pageState) this.pageState = page
      this.urlState = `${baseApiUrl}/usuarios${mountUrl(pesquisa, page, order, orderDir)}`
      axios.get(this.urlState)
        .then(req => {
          this.entitys = req.data.data
          this.pagination = req.data
          this.loading = false
          this.callApi = false
        })
        .catch(showError)
        .finally((this.loading = false))
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.$router.push({ path: `/usuarios/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.$router.push('/usuarios/add')
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
                const index = this.entitys.indexOf(item)
                this.entitys.splice(index, 1)
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
      if (filter != null && filter !== '' && filter.length > 3) {
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
    getColor (status) {
      if (status === 'I') return 'red'
      else return 'green'
    }
  },
  watch: {
    pageState: function (value, old) {
      if (value || (value !== '' && value !== old && value !== this.pagination.current_page)) {
        this.navigate(value)
      }
    },
    sortBy: function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) {
        this.orderedBy(value)
      }
    },
    sortDesc: function (value, old) {
      if (value || value !== '' || (value !== 'undefined' && value !== old)) {
        this.orderedDesc(value)
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['menuData'])
  },
  mounted () {
    this.$vuetify.goTo(0)
    this.getDataFromApi()
    this.getDireitos()
  }
}
</script>

<style></style>
