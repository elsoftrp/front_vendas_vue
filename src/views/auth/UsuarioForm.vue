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
            <v-tab v-show="viewPermissao">Permissões</v-tab>
            <v-tab-item>
              <!-- cadastro de usuario -->
              <v-row class="mt-5">
                <v-col cols="6" sm="6" md="3">
                  <v-text-field
                    outlined
                    dense
                    label="Código"
                    name="id"
                    id="iid"
                    v-model="entity.id"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    label="Nome"
                    outlined
                    dense
                    name="name"
                    id="iname"
                    malength="80"
                    required
                    :rules="[rules.required('name')]"
                    v-model="entity.name"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-text-field
                    outlined
                    dense
                    label="E-Mail"
                    name="email"
                    type="email"
                    id="iemail"
                    maxlength="100"
                    v-model="entity.email"
                    :rules="[rules.required('E-mail')]"
                    @blur="hasCadastro(entity.cnpj)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                                  <v-autocomplete
                    label="Empresa"
                    outlined
                    dense
                    name="empresa"
                    id="iempresa"
                    item-text="nome"
                    item-value="id"
                    malength="10"
                    required
                    :items="empresas"
                    :rules="[rules.required('Empresa')]"
                    v-model="entity.empresa"
                    return-object
                    >
                      <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.nome"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.cnpjcpf"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="entity.cidade"
                    :items="cidades"
                    autocomplete="off"
                    hide-no-data
                    hide-selected
                    item-text="cidade"
                    item-value="id"
                    label="Cid"
                    :search-input.sync="searchCidade"
                    placeholder="Digite para busca"
                    return-object
                    :rules="[rules.required('Cid')]"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.cidade"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.uf"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-text-field
                    v-if="!entity.id"
                    label="Senha"
                    outlined
                    dense
                    name="password"
                    id="ipassword"
                    malength="30"
                    v-model="entity.password"
                    prepend-icon="mdi-lock"
                    :type="show1 ? 'text' : 'password'"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-text-field
                    v-if="!entity.id"
                    label="Confirmação de senha"
                    outlined
                    dense
                    name="password_confirmed"
                    id="ipassword_confirmed"
                    malength="30"
                    v-model="entity.password_confirmed"
                    prepend-icon="mdi-lock"
                    :type="show2 ? 'text' : 'password'"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-switch v-model="entity.darkmode" label="Modo Dark"></v-switch>
                </v-col>
              </v-row>
              <br />
              <v-row>
                <v-col cols="auto">
                  <v-btn type="submit" color="success" large :disabled="!validForm">Salvar</v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="error" large @click.prevent="goBack">Cancelar</v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item v-show="viewPermissao">
              <Permissao :items="permissoes" :itemsModulo="modulos" :usuario="entity"></Permissao>
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
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import Permissao from './Permissao'

export default {
  name: 'UsuarioCadastro',
  components: { Loading, Permissao },
  data () {
    return {
      show1: false,
      show2: false,
      loadingAll: false,
      validForm: false,
      nCadastroValid: true,
      viewPermissao: false,
      permissoes: null,
      modulos: null,
      searchCidade: null,
      cidades: [],
      empresas: [],
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        },
        emailMatch: () => 'The email and password you entered dont match'
      },
      entity: {
        id: '',
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    salvar () {
      if (!this.validForm) return
      const method = this.entity.id ? 'put' : 'post'
      const id = this.entity.id ? `/${this.entity.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/usuarios${id}`, this.entity)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          this.$router.push({ path: '/usuarios' })
        })
        .catch(showError)
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    },
    buscaCidade (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/cidades`, { name: pesquisa })
          .then(req => {
            this.cidades = req.data
          })
      }
    },
    buscaEmpresa () {
      axios
        .get(`${baseApiUrl}/empresas`)
        .then(req => {
          this.empresas = req.data.data
        })
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: '/usuarios' })
    },
    isCadastroValido () {
      return this.nCadastroValid || 'Já existe esse email cadastrado'
    },
    hasCadastro (value) {
      if (!!value) {
        axios
          .post(`${baseApiUrl}/usuarios/seek`, { email: value })
          .then(req => {
            const resultado = req.data
            if (!resultado) this.nCadastroValid = true
            else if (resultado.length > 1) this.nCadastroValid = false
            else if (resultado.length > 0 && resultado[0].id !== this.entity.id) this.nCadastroValid = false
            else this.nCadastroValid = true
          })
      } else this.nCadastroValid = true
    },
    buscaPermissao (id) {
      if (id) {
        axios
          .get(`${baseApiUrl}/permissao/${id}`)
          .then(req => {
            this.permissoes = req.data
            this.viewPermissao = true
          })
          .catch(err => {
            if (err.response.status === 403) this.viewPermissao = false
            this.permissoes = []
          })
      }
    },
    buscaModulos (id) {
      if (id) {
        axios
          .get(`${baseApiUrl}/modulos/${id}`)
          .then(req => {
            this.modulos = req.data
            this.viewPermissao = true
          })
          .catch(err => {
            if (err.response.status === 403) this.viewPermissao = false
            this.modulos = []
          })
      }
    }
  },
  watch: {
    searchCidade: function (value) {
      if (value && value !== '') {
        this.buscaCidade(value)
      }
    }
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id !== '') {
      this.loadingAll = true
      axios
        .get(`${baseApiUrl}/usuarios/${this.$route.params.id}/edit`)
        .then(req => {
          this.entity = req.data
          if (this.entity.cidade) this.cidades.push(this.entity.cidade)
          if (this.entity.empresa) this.empresas.push(this.entity.empresa)
          this.buscaPermissao(this.entity.id)
          this.buscaModulos(this.entity.id)
        })
        .catch(err => {
          if (err.response.status === 403) {
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
      this.entity = {}
      this.buscaEmpresa()
    }
  }
}
</script>

<style>

</style>
