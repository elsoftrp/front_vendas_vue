<template>
  <v-app id="pessoas">
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
      <v-row class="pl-10 pt-5">
        <v-radio-group row v-model="state.tipo">
          <v-radio
            label="Todos"
            :value="0">
          </v-radio>
          <v-radio
            v-for="t in state.pessoasTp"
            :key="t.id"
            :label="`${t.descricao}`"
            :value="t.id"
          ></v-radio>
        </v-radio-group>
      </v-row>

      <v-data-table
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="pessoas"
        :custom-sort="customSort"
        :sort-by.sync="state.sortBy"
        :sort-desc.sync="state.sortDesc"
        :loading="loading"
      >

        <template v-slot:item.pessoa_tp="{ item }">
          <v-chip v-for="(it, index) in item.pessoa_tp" :key="index" :color="getColorTipo(it.descricao)" outlined label x-small>{{it.descricao}}</v-chip>
        </template>

        <template v-slot:item.nome="{ item }">
          <a class="text-secondary" @click="goEdit(item.id)">{{
            item.nome ? item.nome : '.'
          }}</a>
        </template>
        <template v-slot:item.celular="{ item }">
          <a
            v-if="item.celular"
            :href="
              `https://api.whatsapp.com/send?phone=+55${item.celular}&text=Olá, `
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
import { baseApiUrl, showError } from '@/global'
import { mountUrl } from '@/config/funcoes.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Pessoa',
  data () {
    return {
      nomeJanela: 'Pessoas',
      urlApi: 'pessoas',
      caption: '',
      direitos: null,
      callApi: false,
      state: {
        pagination: { meta: { last_page: 0 } },
        urlState: '',
        filterTerm: '',
        sortBy: '',
        sortDesc: false,
        tipo: 0,
        pessoasTp: []
      },
      filtered: false,
      loading: true,
      headers: [
        { text: 'Tipo', value: 'pessoa_tp' },
        { text: 'Nome', value: 'nome' },
        { text: 'CNPJ/CPF', value: 'cnpjcpf' },
        { text: 'Telefone', value: 'telefone' },
        { text: 'Celular', value: 'celular' },
        { text: 'Situação', value: 'inativo' },
        { text: 'Excluir', value: 'actions', sortable: false }
      ],
      pageState: 1,
      pessoas: []
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader', 'setPessoaData']),
    buscaPessoasTp () {
      axios
        .get(`${baseApiUrl}/pessoastp/lista`)
        .then(req => {
          this.state.pessoasTp = req.data
        })
    },
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
      const posicao = this.state.tipo !== 0 ? this.state.tipo : null
      if (this.pessoaData !== null) {
        this.state = this.pessoaData
        this.pessoas = this.state.pagination.data
        this.pageState = this.state.pagination.meta.current_page
        this.filtered = this.state.filterTerm !== ''
        this.loading = false
        this.callApi = false
        this.setPessoaData(null)
      } else {
        if (page !== this.pageState) this.pageState = page
        this.state.urlState = `${baseApiUrl}/${this.urlApi}${mountUrl(
          pesquisa,
          page,
          order,
          orderDir,
          posicao
        )}`
        this.buscaPessoasTp()
        axios.get(this.state.urlState)
          .then(req => {
            this.pessoas = req.data.data
            this.state.pagination = req.data
            this.callApi = false
          })
          .catch(showError)
          .finally((this.loading = false))
      }
    },
    goEdit (id) {
      if (this.direitos && this.direitos.btnalterar) {
        this.setPessoaData(this.state)
        this.$router.push({ path: `/${this.urlApi}/${id}` })
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.setPessoaData(this.state)
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
                const index = this.pessoas.indexOf(item)
                this.pessoas.splice(index, 1)
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
      if (status) return 'red'
      else return 'green'
    },
    getColorTipo (status) {
      if (status === 'Cliente') return 'green'
      else return 'orange'
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
    'state.tipo': function (value) {
      if (!this.callApi) this.getDataFromApi()
    }
  },
  computed: {
    ...mapGetters('cadastros', ['pessoaData', 'menuData', 'buscaBarra'])
  },
  mounted () {
    this.$vuetify.goTo(0)
    this.getDataFromApi()
    this.getDireitos()
  }
}
</script>

<style>

</style>
