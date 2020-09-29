<template>
<div class="ma-1 pa-3">
    <v-row>
      <v-col cols="auto" >
      <span class="font-weight-bold">{{nome +'  '+cnpjcpf }}</span>
      <v-container fluid>
        <v-row>
          <v-col>
            <notificacao :titulo="'Total Recebido'" :color="'green'" :valor="somatoria.recebido"> </notificacao>
          </v-col>
          <v-col>
            <notificacao :titulo="'Total a Receber'" :color="'red'" :valor="somatoria.receber"> </notificacao>
          </v-col>
        </v-row>
      </v-container>

      <v-data-table
          disable-pagination
          hide-default-footer
          :headers='headers'
          :items='financeiro'
      >

        <template v-slot:item.tpfinanceiro='{ item }'>
          <span>
              {{ item.tpfinanceiro =='R' ? 'RECEBER' : 'PAGAR' }}
          </span>
        </template>
        <template v-slot:item.pagamentodt='{ item }'>
              <v-chip outlined label v-show="!item.pagamentodt" :color="estadoTitulo(item)" dark>aberto</v-chip>
          <span>{{ item.pagamentodt ? item.pagamentodt : '' }}</span>
        </template>

        <template v-slot:item.valor='{ item }'>
          <span>
              {{ item.valor ?
              new Number(item.valor).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2}) : '' }}
          </span>
        </template>
        <template v-slot:item.valorpago='{ item }'>
          <span>
              {{ item.valorpago ?
              new Number(item.valorpago).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2}) : '' }}
          </span>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
</div>
</template>

<script>
import { baseApiUrl } from '@/global'
import { dataVencida, valorFormatado } from '@/config/funcoes.js'
import Notificacao from '@/components/template/Notificacao.vue'
import axios from 'axios'

export default {
  name: 'PessoaFinanceiro',
  components: { Notificacao },
  props: [
    'pessoaid',
    'nome',
    'cnpjcpf'
  ],
  data () {
    return {
      financeiro: [],
      somatoria: {
        receber: 0,
        recebido: 0
      },
      headers: [
        { text: 'Tipo', value: 'tpfinanceiro' },
        { text: 'Vencimento', value: 'vencimentodt' },
        { text: 'Pagamento', value: 'pagamentodt' },
        { text: 'Valor', value: 'valor' },
        { text: 'Valor Pago', value: 'valorpago' }
      ]
    }
  },
  methods: {
    estadoTitulo (obj) {
      if (!obj.pagamentodt || obj.pagamentodt === '') {
        return dataVencida(obj.vencimentodt) ? 'red' : 'silver'
      }
    },
    buscaFinanceiro (id) {
      if (id && id !== '') {
        axios
          .get(`${baseApiUrl}/financeiro/pessoa/${id}`)
          .then(req => {
            this.financeiro = req.data
          })
      }
    },
    valFormat (value) {
      return valorFormatado(value)
    }
  },
  watch: {
    financeiro: function (value) {
      if (value.length > 0) {
        this.somatoria.receber = this.financeiro.reduce(function (total, item) {
          return item.tpfinanceiro === 'R' ? total + (item.valor - item.valorpago) : total
        }, 0)
        this.somatoria.recebido = this.financeiro.reduce(function (total, item) {
          return item.tpfinanceiro === 'R' ? total + item.valorpago : total
        }, 0)
      }
    }
  },
  mounted () {
    this.buscaFinanceiro(this.pessoaid)
  }
}
</script>

<style>
</style>
