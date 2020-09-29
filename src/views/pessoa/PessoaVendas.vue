<template>
<div class="ma-1 pa-3">

    <v-row>
      <v-col cols="auto" >
        <span class="font-weight-bold">{{nome +'  '+cnpjcpf }}</span>
      <v-container fluid>
        <v-row>
          <v-col>
            <notificacao :titulo="'Total de Vendas'" :color="'green '" :valor="somatoria"> </notificacao>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
          disable-pagination
          hide-default-footer
          :headers='headers'
          :items='vendas'
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          :item-expanded="buscaItem()"
      >
        <template v-slot:item.totpedido='{ item }'>
          <span>
              {{ item.totpedido ?
              valFormat(item.totpedido) : '' }}
          </span>
        </template>

        <template  v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
          <v-data-table
            disable-pagination
            hide-default-footer
            :headers="headersItem"
            :items="details"
          >

            <template v-slot:item.prvenda="{ item }">
              <span>
                  {{ item.prvenda ?
                      valFormat(item.prvenda) : '' }}
              </span>
            </template>
            <template v-slot:item.prtotal="{ item }">
              <span>
                  {{ item.prtotal ?
                      valFormat(item.prtotal) : '' }}
              </span>
            </template>

          </v-data-table>
          </td>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
</div>
</template>

<script>
import { baseApiUrl } from '@/global'
import Notificacao from '@/components/template/Notificacao.vue'
import { valorFormatado } from '@/config/funcoes.js'
import axios from 'axios'

export default {
  name: 'PessoaVendas',
  components: { Notificacao },
  props: [
    'pessoaid',
    'nome',
    'cnpjcpf'
  ],
  data () {
    return {
      vendas: [],
      somatoria: 0,
      singleExpand: true,
      expanded: [],
      details: [],
      headers: [
        { text: 'Empresa', value: 'nome' },
        { text: 'Código', value: 'id' },
        { text: 'Data', value: 'pedidodt' },
        { text: 'Valor', value: 'totpedido' },
        { text: 'Detalhes', value: 'data-table-expand' }
      ],
      headersItem: [
        { text: 'Código', value: 'id' },
        { text: 'Produto', value: 'despro' },
        { text: 'Pr.Unitário', value: 'prvenda' },
        { text: 'Quant.', value: 'quantidade' },
        { text: 'Pr.Total', value: 'prtotal' }
      ]
    }
  },
  methods: {
    buscaVendas (id) {
      if (id && id !== '') {
        axios
          .get(`${baseApiUrl}/pedidos/vendas/${id}`)
          .then(req => {
            this.vendas = req.data
          })
      }
    },
    buscaItem (id) {
      if (this.expanded && this.expanded.length > 0) {
        axios
          .get(`${baseApiUrl}/pedidos/vendaitens/${this.expanded[0].id}`)
          .then(req => {
            this.details = req.data
          })
      } else this.details = []
    },
    getColor (status) {
      if (status === 'S') return 'silver'
      else return ''
    },
    valFormat (value) {
      return valorFormatado(value)
    }
  },
  watch: {
    vendas: function (value) {
      if (value.length > 0) {
        this.somatoria = this.vendas.reduce(function (total, item) {
          return total + (item.totpedido)
        }, 0)
      }
    }
  },
  mounted () {
    this.buscaVendas(this.pessoaid)
  }
}
</script>

<style>
</style>
