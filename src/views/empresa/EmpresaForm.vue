<template>
  <v-app>
    <loading :active.sync='loadingAll' :is-full-page='true' ></loading>
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
      id='fCadastro'
      @submit.prevent='salvar'
      v-model='validForm'
      enctype='multipart/form-data'
    >
      <v-container fluid class='pa-1 text-black-50'>
        <v-card outlined class='ma-1 pa-3'>
              <v-row>
                <v-col cols='6' sm='6' md='3'>
                  <v-text-field
                    outlined
                    dense
                    label='Código'
                    name='id'
                    id='iid'
                    v-model='empresa.id'
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols='6' sm='6' md='3'>
                  <v-text-field
                    label='Data do Cadastro'
                    outlined
                    dense
                    id='idatacadastro'
                    name='datacadastro'
                    v-model='empresa.created_at'
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='12' sm='6' md='3'>
                  <v-text-field
                    label='CNPJ/CPF'
                    outlined
                    dense
                    :class="{ 'is-invalid': !ncadValid }"
                    id='icnpjcpf'
                    name='cpnjcpf'
                    maxlength='20'
                    v-mask="['###.###.###-##', '##.###.###/####-##']"
                    v-model='empresa.cnpjcpf'
                    @blur='hasCadastro(empresa.cnpjcpf)'
                    :rules="[rules.required('CNPJ/CPF'), isCadastroValido()]"
                  ></v-text-field>
                  <div class='invalid-feedback' hidden>Não é um cnpj ou cpf válido.</div>
                </v-col>
                <v-col cols='12' sm='6' md='3'>
                  <v-text-field
                    label='Inscrição Estadual/RG'
                    outlined
                    dense
                    id='iinsrg'
                    name='insrg'
                    maxlength='20'
                    v-model='empresa.insrg'
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='3'>
                  <v-text-field
                    label='Inscrição Municipal'
                    outlined
                    dense
                    id='iins_municipal'
                    name='ins_municipal'
                    maxlength='20'
                    v-model='empresa.insmunicipal'
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='6' sm='2' md='1' lg='1'>
                  <v-checkbox
                    outlined
                    dense
                    label='Inativo'
                    name='inativo'
                    id='iinativo'
                    v-model='empresa.inativo'
                    true-value='true'
                    false-value='false'
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
                    v-model='empresa.inativodt'
                    :disabled='empresa.inativo==false'
                    :required='empresa.inativo==true'
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='12' sm='6' md='6' lg='6'>
                  <v-text-field
                    label='Nome'
                    outlined
                    dense
                    name='nome'
                    id='inome'
                    malength='80'
                    required
                    :rules="[rules.required('nome')]"
                    v-model='empresa.nome'
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='6' lg='6'>
                  <v-text-field
                    outlined
                    dense
                    label='Fantasia'
                    name='fantasia'
                    id='ifantasia'
                    maxlength='50'
                    v-model='empresa.fantasia'
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='12' sm='6' md='2' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='CEP'
                    class='mask-cep'
                    name='cep'
                    id='icep'
                    maxlength='9'
                    v-mask="['#####-###']"
                    v-model='empresa.cep'
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='6' lg='6'>
                  <v-autocomplete
                    outlined
                    dense
                    v-model='empresa.cidade'
                    :items='cidades'
                    autocomplete='off'
                    hide-no-data
                    hide-selected
                    item-text='cidade'
                    item-value='id'
                    label='Cid'
                    :search-input.sync='searchCidade'
                    placeholder='Digite para busca'
                    return-object
                    :rules="[rules.required('Cid')]"
                  >
                    <template v-slot:item='{ item }'>
                      <v-list-item-content>
                        <v-list-item-title v-text='item.cidade'></v-list-item-title>
                        <v-list-item-subtitle v-text='item.uf'></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='12' sm='6' md='5' lg='5'>
                  <v-text-field
                    outlined
                    dense
                    label='Endereço'
                    name='endereco'
                    id='iendereco'
                    maxlength='50'
                    v-model='empresa.endereco'
                    :rules="[rules.required('Endereço')]"
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='1' lg='1'>
                  <v-text-field
                    outlined
                    dense
                    label='Número'
                    name='numero'
                    id='inumero'
                    maxlength='10'
                    v-model='empresa.numero'
                    :rules="[rules.required('Número')]"
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='2' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='Complemento'
                    name='complemento'
                    id='icomplemento'
                    maxlength='30'
                    v-model="empresa.complemento"
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='4' lg='4'>
                  <v-text-field
                    outlined
                    dense
                    label='Bairro'
                    name='bairro'
                    id='ibarro'
                    maxlength='40'
                    v-model='empresa.bairro'
                    :rules="[rules.required('Bairro')]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols='12' sm='6' md='3' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='Telefone'
                    class='mask-celular'
                    name='telefone'
                    id='itelefone'
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    maxlength='15'
                    v-model='empresa.telefone'
                    :rules="[rules.required('telefone')]"
                  ></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='3' lg='2'>
                  <v-text-field
                    outlined
                    dense
                    label='Celular'
                    class='mask-celular'
                    name='celular'
                    id='icelular'
                    maxlength='15'
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    v-model='empresa.celular'
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols='12' sm='12' md='12' lg='12'>
                  <v-text-field
                    outlined
                    dense
                    label='E-Mail'
                    name='email'
                    type='email'
                    id='iemail'
                    maxlength='60'
                    v-model='empresa.email'
                    :rules="[rules.required('E-mail')]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols='12' sm='12' md='12' lg='12'>
                  <v-textarea
                    label='Observação'
                    outlined
                    name='obs'
                    id='iobs'
                    cols='85'
                    rows='4'
                    v-model='empresa.obs'
                  ></v-textarea>
                </v-col>
              </v-row>
              <br />
              <v-row>
                <v-col cols='auto'>
                  <v-btn type='submit' color='success' large :disabled='!validForm'>Salvar</v-btn>
                </v-col>
                <v-col cols='auto'>
                  <v-btn color='error' large @click.prevent='goBack'>Cancelar</v-btn>
                </v-col>
              </v-row>

        </v-card>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { mask } from 'vue-the-mask'
import { validaCpfCnpj } from '@/config/valida_cpf_cnpj.js'
import { cidadeBusca } from '@/config/cidades.js'
import { baseApiUrl, showError } from '@/global'

export default {
  name: 'EmpresaCadastro',
  directives: { mask },
  components: { Loading },
  data () {
    return {
      loadingAll: false,
      validForm: false,
      cpfValid: true,
      ncadValid: true,
      cpfRequired: true,
      nCadastroValid: true,
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
      searchCidade: null,
      cidades: [],
      empresa: {
        id: '',
        cnpjcpf: '',
        insrg: '',
        insmunicipal: '',
        nome: '',
        fantasia: '',
        endereco: '',
        numero: '',
        bairro: '',
        cep: '',
        complemento: '',
        telefone: '',
        celular: '',
        email: '',
        celular2: '',
        inativo: '',
        inativodt: '',
        cidade: '',
        obs: ''
      }
    }
  },
  methods: {
    buscaCidade (pesquisa) {
      if (pesquisa) {
        cidadeBusca(pesquisa).then(resp => {
          this.cidades = resp.data
        })
      }
    },
    salvar () {
      if (!this.validForm) return
      const method = this.empresa.id ? 'put' : 'post'
      const id = this.empresa.id ? `/${this.empresa.id}` : ''
      this.loadingAll = true
      axios[method](`${baseApiUrl}/empresas${id}`, this.empresa)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          this.goBack()
        })
        .catch(showError)
        .finally(setTimeout(() => {
          this.loadingAll = false
        }, 1000)
        )
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: '/empresas' })
    },
    isRequiredCpf (value) {
      return !this.cpfRequired || !!value || 'CPF/CNPJ precisa ser informado'
    },
    isCpfValid () {
      return this.cpfValid || 'CPF ou CNPJ não é válido'
    },
    isCadastroValido () {
      return this.nCadastroValid || 'Já existe esse número cadastrado'
    },
    hasCadastro (value) {
      if (!!value) {
        const numeros = value.replace(/[^0-9]/g, '')
        axios
          .post(`${baseApiUrl}/empresas/seek`, { cnpjcpf: numeros })
          .then(req => {
            const resultado = req.data
            if (!resultado) this.nCadastroValid = true
            else if (resultado.length > 1) this.nCadastroValid = false
            else if (resultado.length > 0 && resultado[0].id !== this.empresa.id) this.nCadastroValid = false
            else this.nCadastroValid = true
          })
      } else this.nCadastroValid = true
    }
  },
  watch: {
    'empresa.cnpjcpf': function (value) {
      if (!value || validaCpfCnpj(value)) {
        this.cpfValid = true
      } else this.cpfValid = false
    },
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
        .get(`${baseApiUrl}/empresas/${this.$route.params.id}/edit`)
        .then(req => {
          this.empresa = req.data
          if (this.empresa.cidade) {
            this.cidades.push(this.empresa.cidade)
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            showError(err)
            this.goBack()
          }
        }).finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    } else {
      this.empresa = {}
    }
  }
}
</script>

<style>
</style>
