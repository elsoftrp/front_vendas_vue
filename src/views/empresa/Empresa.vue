<template>
  <v-app id="empresa">
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
        :items="empresas"
        :custom-sort="customSort"
        :sort-by.sync="state.sortBy"
        :sort-desc.sync="state.sortDesc"
        :loading="loading"
      >
        <template v-slot:item.nome="{ item }">
          <a class="text-secondary" @click="goEdit(item.id)">{{
            item.nome
          }}</a>
        </template>
        <template v-slot:item.email="{ item }">
          <a v-if="item.email" :href="`mailto:${item.email.toLowerCase()}`">{{
            item.email
          }}</a>
          <span v-else>{{ `.` }}</span>
        </template>
        <template v-slot:item.celular="{ item }">
          <a
            v-if="item.celular"
            :href="
              `https://api.whatsapp.com/send?phone=+55${item.celular}&text=Olá, ...`
            "
            class="text-primary"
            target="_blank"
            >{{ item.celular }}</a
          >
          <span v-else>{{ item.celular ? item.celular : `.` }}</span>
        </template>
        <template v-slot:item.inativo="{ item }">
          <v-chip :color="getColor(item.inativo)" dark outlined label x-small>{{
            item.inativo ? 'Inativo' : 'Ativo'
          }}</v-chip>
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
  name: 'Empresas',
  data () {
    return {
      nomeJanela: 'Empresas',
      caption: '',
      direitos: null,
      callApi: false,
      filtered: false,
      loading: true,
      headers: [
        { text: 'Código', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'CNPJ', value: 'cnpjcpf' },
        { text: 'E-mail', value: 'email' },
        { text: 'Telefone', value: 'telefone' },
        { text: 'Celular', value: 'celular' },
        { text: 'Cidade', value: 'cidade.cidade' },
        { text: 'Situação', value: 'inativo' },
        { text: 'Remover', value: 'actions', sortable: false }
      ],
      state: {
        pagination: { meta: { last_page: 0 } },
        urlState: '',
        filterTerm: '',
        sortBy: '',
        sortDesc: false
      },
      pageState: 1,
      empresas: []
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setEmpresaData', 'setTituloHeader']),
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
      if (this.empresaData !== null) {
        this.state = this.empresaData
        this.empresas = this.state.pagination.data
        this.pageState = this.state.pagination.meta.current_page
        this.filtered = this.state.filterTerm !== ''
        this.loading = false
        this.callApi = false
        this.setEmpresaData(null)
      } else {
        if (page !== this.pageState) this.pageState = page
        this.urlState = `${baseApiUrl}/empresas${mountUrl(
          pesquisa,
          page,
          order,
          orderDir
        )}`
        axios.get(this.urlState)
          .then(req => {
            this.empresas = req.data.data
            this.state.pagination = req.data
            this.callApi = false
          })
          .catch(showError)
          .finally((this.loading = false))
      }
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.setEmpresaData(this.state)
        this.$router.push({ path: `/empresas/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.$router.push('/empresas/add')
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
                const index = this.empresas.indexOf(item)
                this.empresas.splice(index, 1)
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
    ...mapGetters('cadastros', ['empresaData', 'menuData'])
  },
  mounted () {
    this.$vuetify.goTo(0)
    this.getDataFromApi()
    this.getDireitos()
  }
}
</script>

<style></style>
