<template>
  <v-app id="pagtotp">
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
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        placeholder="Digite o nome para pesquisa"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :items-per-page="10"
        :headers="headers"
        :items="dataset"
        :loading="loading"
        :search="search"
      >
      <template v-slot:item.despagtotp="{ item }">
        <a class="text-secondary" @click="goEdit(item)">{{
          item.despagtotp ? item.despagtotp : '.'
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
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    label="Descrição"
                    outlined
                    dense
                    name="despagto"
                    id="idespagto"
                    malength="80"
                    required
                    :rules="[rules.required('Descrição')]"
                    v-model="data.despagtotp"
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
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PagtoTp',
  components: { },
  data () {
    return {
      nomeJanela: 'PagtoTp',
      urlApi: 'pagtotp',
      headers: [
        { text: 'Descrição', value: 'despagtotp' },
        { text: 'Ação', value: 'actions', sortable: false }
      ],
      caption: '',
      direitos: null,
      urlState: '',
      search: '',
      loading: true,
      dataset: [],
      indexData: -1,
      data: {},
      validForm: false,
      dialog: false,
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
    getDataFromApi () {
      this.loading = true
      this.urlState = `${baseApiUrl}/${this.urlApi}`
      axios.get(this.urlState)
        .then(req => {
          this.dataset = req.data
          this.loading = false
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
        this.dialog = true
      }
    },
    goAdd (ev) {
      ev.preventDefault()
      if (this.direitos && this.direitos.btnincluir) {
        this.data = {}
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
    getColor (status) {
      if (status === 'I') return 'red'
      else return 'green'
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
