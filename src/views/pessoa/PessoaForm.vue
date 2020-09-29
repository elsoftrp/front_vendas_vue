/* eslint-disable camelcase */
/* eslint-disable camelcase */
<template>
  <v-app>
    <div class="d-print-none">
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
            <v-tab v-show="viewVendas">Vendas</v-tab>
            <v-tab v-show="viewVendas">Financeiro</v-tab>

            <v-tab-item><!-- cadastro de pessoas -->

              <v-row>
                <v-col cols="auto">
                  <v-btn tile large v-print="'#printable'" icon><v-icon>mdi-printer</v-icon></v-btn>
                </v-col>
                <v-col cols="6" sm="2" md="1" lg="1">
                  <v-text-field
                    outlined
                    dense
                    label="Código"
                    name="id"
                    id="iid"
                    v-model="pessoa.id"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="3">
                  <v-text-field
                    label="Data do Cadastro"
                    outlined
                    dense
                    id="idatacadastro"
                    name="datacadastro"
                    v-model="pessoa.created_at"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="2" md="1" lg="1">
                  <v-checkbox
                    outlined
                    dense
                    label="Inativo"
                    name="inativo"
                    id="iinativo"
                    v-model="pessoa.inativo"
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
                    v-model='pessoa.inativodt'
                    :disabled="pessoa.inativo==false"
                    :required="pessoa.inativo==true"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                  <v-autocomplete
                    v-model="pessoa.pessoa_tp"
                    :items="pessoasTp"
                    outlined
                    dense
                    chips
                    item-text="descricao"
                    item-value="id"
                    small-chips
                    label="Tipo de Pessoa"
                    multiple
                    hide-details
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                  <v-text-field
                    label="CNPJ/CPF"
                    outlined
                    dense
                    id="icnpj"
                    name="cnpj"
                    maxlength="20"
                    v-mask="['###.###.###-##', '##.###.###/####-##']"
                    v-model="pessoa.cnpjcpf"
                    @blur="hasCadastro(pessoa.cnpjcpf)"
                    :hide-details="nCadastroValid && cnpjValid"
                    :rules="[
                      rules.required('CNPJ/CPF'),
                      isCnpjValid(),
                      isCadastroValido()
                    ]"
                  ></v-text-field>
                  <div class="invalid-feedback" hidden>
                    Não é um cnpj ou cpf válido.
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="Inscrição Estadual/RG"
                    outlined
                    dense
                    id="iinsrg"
                    name="insrg"
                    maxlength="20"
                    v-model="pessoa.insrg"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="Inscrição Municipal"
                    outlined
                    dense
                    id="iinsmunicipal"
                    name="insmunicipal"
                    maxlength="20"
                    v-model="pessoa.insmunicipal"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" xs="12" sm="12" md="9" lg="9" xl="9">
                  <v-text-field
                    label="Nome"
                    outlined
                    dense
                    name="nome"
                    id="inome"
                    malength="80"
                    required
                    :rules="[rules.required('nome')]"
                    v-model="pessoa.nome"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="2" lg="2">
                  <v-text-field
                    outlined
                    dense
                    label="CEP"
                    class="mask-cep"
                    name="cep"
                    id="icep"
                    maxlength="9"
                    v-mask="['#####-###']"
                    v-model="pessoa.cep"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="pessoa.cidade"
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
                    hide-details
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
                <v-col cols="12" sm="6" md="5" lg="5">
                  <v-text-field
                    outlined
                    dense
                    label="Endereço"
                    name="endereco"
                    id="iendereco"
                    maxlength="50"
                    v-model="pessoa.endereco"
                    :rules="[rules.required('Endereço')]"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="1" lg="1">
                  <v-text-field
                    outlined
                    dense
                    label="Número"
                    name="numero"
                    id="inumero"
                    maxlength="10"
                    v-model="pessoa.numero"
                    :rules="[rules.required('Número')]"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2" lg="2">
                  <v-text-field
                    outlined
                    dense
                    label="Complemento"
                    name="complemento"
                    id="icomplemento"
                    maxlength="30"
                    v-model="pessoa.complemento"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    outlined
                    dense
                    label="Bairro"
                    name="bairro"
                    id="ibarro"
                    maxlength="40"
                    v-model="pessoa.bairro"
                    :rules="[rules.required('Bairro')]"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="3" lg="2">
                  <v-text-field
                    outlined
                    dense
                    label="Telefone"
                    class="mask-celular"
                    name="fone"
                    id="ifone"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    maxlength="15"
                    v-model="pessoa.telefone"
                    :rules="[rules.required('telefone')]"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3" lg="2">
                  <v-text-field
                    outlined
                    dense
                    label="Celular"
                    class="mask-celular"
                    name="celular"
                    id="icelular"
                    maxlength="15"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    v-model="pessoa.celular"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3" lg="2">
                  <v-text-field
                    outlined
                    dense
                    label="Celular"
                    class="mask-celular"
                    name="celular2"
                    id="icelular2"
                    maxlength="15"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    v-model="pessoa.celular2"
                    hide-details
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
                    maxlength="60"
                    v-model="pessoa.email"
                    :rules="[rules.required('E-mail')]"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-textarea
                    label="Observação"
                    outlined
                    name="obs"
                    id="iobs"
                    cols="85"
                    rows="6"
                    v-model="pessoa.obs"
                    hide-details
                  ></v-textarea>
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
            <v-tab-item v-show="viewVendas">
              <pessoa-vendas :pessoaid="pessoa.id" :nome="pessoa.nome" :cnpjcpf="pessoa.cnpjcpf"></pessoa-vendas>
            </v-tab-item>
            <v-tab-item v-show="viewVendas">
              <pessoa-financeiro :pessoaid="pessoa.id" :nome="pessoa.nome" :cnpjcpf="pessoa.cnpjcpf"></pessoa-financeiro>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-container>
    </v-form>
    </div>
    <div v-show='false'>
      <pessoa-print id="printable" :dataset="pessoa"> </pessoa-print>
    </div>
  </v-app>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { mask } from 'vue-the-mask'
import { validaCpfCnpj } from '@/config/valida_cpf_cnpj.js'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import { mapGetters } from 'vuex'
import PessoaVendas from './PessoaVendas'
import PessoaFinanceiro from './PessoaFinanceiro'
import PessoaPrint from './PessoaPrint'

export default {
  name: 'PessoaForm',
  directives: { mask },
  components: { Loading, PessoaVendas, PessoaPrint, PessoaFinanceiro },
  data () {
    return {
      loadingAll: false,
      validForm: false,
      nCadastroValid: true,
      cnpjValid: true,
      viewVendas: true,
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        },
        emailMatch: () => "The email and password you entered don't match"
      },
      searchCidade: null,
      cidades: [],
      pessoasTp: [],
      pessoa: {
        id: '',
        nome: '',
        cnpjcpf: '',
        insrg: '',
        razaosocial: '',
        fantasia: '',
        abrevnome: '',
        telefone: '',
        celular: '',
        celular2: '',
        email: '',
        inativo: '',
        inativodt: '',
        obs: '',
        created_at: '',
        cidade: {},
        pessoa_tp: {}
      }
    }
  },
  methods: {
    buscaCidade (pesquisa) {
      if (pesquisa) {
        axios
          .post(`${baseApiUrl}/cidades`, { name: pesquisa })
          .then(req => {
            this.cidades = req.data
          })
      }
    },
    buscaPessoasTp () {
      axios
        .get(`${baseApiUrl}/pessoastp/`)
        .then(req => {
          this.pessoasTp = req.data.data
        })
    },
    salvar () {
      if (!this.validForm) return
      const method = this.pessoa.id ? 'put' : 'post'
      const id = this.pessoa.id ? `/${this.pessoa.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/pessoas${id}`, this.pessoa)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          if (method === 'put') {
            const index = this.pessoaData.pagination.data.map(el => el.id).indexOf(this.pessoa.id)
            Object.assign(this.pessoaData.pagination.data[index], this.pessoa)
          } else {
            this.pessoaData.pagination.data.unshift(this.pessoa)
          }
          this.$router.push({ path: '/pessoas' })
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
        : this.$router.push({ path: '/pessoas' })
    },
    isCnpjValid () {
      return this.cnpjValid || 'CPF ou CNPJ não é válido'
    },
    isCadastroValido () {
      return this.nCadastroValid || 'Já existe esse número cadastrado'
    },
    hasCadastro (value) {
      if (value) {
        const numeros = value.replace(/[^0-9]/g, '')
        axios
          .post(`${baseApiUrl}/pessoas/seek`, { cnpjcpf: numeros })
          .then(req => {
            const resultado = req.data
            if (!resultado) this.nCadastroValid = true
            else if (resultado.length > 1) this.nCadastroValid = false
            else if (
              resultado.length > 0 &&
              resultado[0].id !== this.pessoa.id
            ) { this.nCadastroValid = false } else this.nCadastroValid = true
          })
      } else this.nCadastroValid = true
    }
  },
  watch: {
    'pessoa.cnpjcpf': function (value) {
      if (!value || value === '') {
        this.cnpjValid = false
      } else {
        const numeros = value.replace(/[^0-9]/g, '')
        if (
          (numeros.length === 11 || numeros.length === 14) &&
          validaCpfCnpj(numeros)
        ) {
          this.cnpjValid = true
        } else {
          this.cnpjValid = false
        }
      }
    },
    searchCidade: function (value) {
      if (value && value !== '') {
        this.buscaCidade(value)
      }
    }
  },
  computed: {
    ...mapGetters('cadastros', ['pessoaData'])
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id !== '') {
      this.loadingAll = true
      axios
        .get(`${baseApiUrl}/pessoas/${this.$route.params.id}/edit`)
        .then(req => {
          this.pessoa = req.data
          if (this.pessoa.cidade) this.cidades.push(this.pessoa.cidade)
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
      this.pessoa = { }
    }
    this.buscaPessoasTp()
  }
}
</script>

<style>

</style>
