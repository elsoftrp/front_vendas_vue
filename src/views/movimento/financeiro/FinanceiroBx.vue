<template>
    <v-card outlined>
      <v-card-title>Baixa Financeiro</v-card-title>
      <v-divider></v-divider>
      <v-form
        id="fBaixa"
        @submit.prevent="salvar"
        v-model="validForm"
        enctype="multipart/form-data"
      >
        <v-card-text>
          <v-row>
            <v-col>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-autocomplete
                label="Forma Pagamento"
                outlined
                dense
                name="pagtotp"
                id="ipagtotp"
                item-text="despagtotp"
                item-value="id"
                malength="10"
                required
                :items="pagtos"
                :rules="[rules.required('Forma')]"
                v-model="item.pagto_tp"
                return-object
                hide-details
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                label="Data Pagamento"
                outlined
                dense
                id="ipagamentodt"
                name="pagamentodt"
                v-mask="'##/##/####'"
                v-model="item.pagamentodt"
                :rules="[rules.required('Data Pagamento')]"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="6" md="6" lg="6">
              <v-currency-field
                outlined
                dense
                label="Valor Pago R$"
                name="valorpago"
                id="ivalorpago"
                v-model="item.valorpago"
                :rules="[rules.notZero('Valor Pago')]"
                @focus="item.valorpago = (financeiro.valor - financeiro.valorpago)"
                hide-details
              ></v-currency-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-text-field
                    label="Observação"
                    outlined
                    dense
                    id="iobs"
                    name="obs"
                    maxlength="100"
                    v-model="item.obs"
                    hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text type="submit" color="success" :disabled="!validForm">Baixar</v-btn>
          <v-btn color="error" text @click="closeDialog()">Fechar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

</template>

<script>
import { mask } from 'vue-the-mask'
import { baseApiUrl, showError } from '@/global'
import { dataHoje } from '@/config/funcoes.js'
import axios from 'axios'

export default {
  name: 'FinanceiroBx',
  directives: { mask },
  props: ['financeiro'],
  data () {
    return {
      validForm: false,
      pagtos: [],
      item: {},
      rules: {
        notZero (propertyType) {
          return value => (value && value !== '0,00') || `${propertyType} precisa ser preenchido`
        },
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        }
      }
    }
  },
  methods: {
    salvar () {
      if (!this.validForm) return
      if (this.item && this.item.valorpago <= 0) return
      const method = this.item.id ? 'put' : 'post'
      const id = this.item.id ? `/${this.item.id}` : ''
      if (!this.financeiro && this.financeiro.id === '') return
      this.item.financeiro = this.financeiro
      axios[method](`${baseApiUrl}/financeiroitem${id}`, this.item)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          this.financeiro.valorpago = (this.financeiro.valorpago + this.item.valorpago)
          this.financeiro.pagamentodt = this.item.pagamentodt
          this.financeiro.quitadodt = this.financeiro.valorpago >= this.financeiro.valor ? this.item.pagamentodt : null
          this.emit = {}
          this.$emit('atualiza', this.financeiro)
        })
        .catch(showError)
    },
    buscaPagtos () {
      axios
        .get(`${baseApiUrl}/pagtotp`)
        .then(req => {
          this.pagtos = req.data
        })
    },
    closeDialog () {
      this.item = {}
      this.$emit('fechar', false)
    }
  },
  mounted () {
    this.buscaPagtos()
    this.item.pagamentodt = dataHoje()
  },
  updated () {
    if (this.item && (!this.item.pagamentodt || this.item.pagamentodt === '')) {
      this.item.pagamentodt = dataHoje()
    }
  }
}
</script>

<style>

</style>
