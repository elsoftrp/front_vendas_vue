<template>
  <div>
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
    <v-container>
      <v-data-table
          disable-pagination
          hide-default-footer
          :headers="headers"
          :items="resumodiario"
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
          item-key="dia"
          :item-expanded="buscaVendas()"
      >
        <template v-slot:item.dia='{ item }'>
          <span>
              {{ item.dia ?
              datFormat(item.dia) : '' }}
          </span>
        </template>

        <template v-slot:item.valor='{ item }'>
          <span>
              {{ item.valor ?
              valFormat(item.valor) : '' }}
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
            <template v-slot:item.pessoa="{ item }">
              {{
                item.pessoa.nome ? item.pessoa.nome : '.'
              }}
            </template>

            <template v-slot:item.totpedido="{ item }">
              <span>
                  {{ item.totpedido ?
                      valFormat(item.totpedido) : '' }}
              </span>
            </template>

          </v-data-table>
          </td>
        </template>
      </v-data-table>

    </v-container>
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import { valorFormatado, dataFormatada } from '@/config/funcoes'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'PedidoResumoDiario',
  data () {
    return {
      resumodiario: [],
      mes: 0,
      empresa_id: '',
      details: [],
      expanded: [],
      headers: [
        { text: 'Data', value: 'dia' },
        { text: 'Quant. Venda', value: 'qde' },
        { text: 'Total do dia', value: 'valor' },
        { text: 'Detalhes', value: 'data-table-expand', sortable: false }
      ],
      headersItem: [
        { text: 'Código', value: 'id' },
        { text: 'Cliente', value: 'pessoa' },
        { text: 'Total Venda', value: 'totpedido' }
      ]
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader', 'setMesResumoDiario']),
    buscaLista (mes, empresa) {
      if (mes) {
        axios
          .get(`${baseApiUrl}/pedidos/resumodiario?mes=${mes}&emp=${empresa}`)
          .then(req => {
            this.resumodiario = req.data
          })
      }
    },
    buscaVendas () {
      if (this.expanded && this.expanded.length > 0) {
        const dia = this.datFormat(this.expanded[0].dia).replace(new RegExp('/', 'g'), '-')
        axios
          .get(`${baseApiUrl}/pedidos/lista?date=${dia}&emp=${this.empresa_id}`)
          .then(req => {
            this.details = req.data
          })
      } else this.details = []
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: '/pedidos' })
    },
    valFormat (value) {
      return valorFormatado(value)
    },
    datFormat (value) {
      return dataFormatada(value)
    }
  },
  computed: {
    ...mapGetters('cadastros', ['mesResumoDiario'])
  },
  mounted () {
    if (this.mesResumoDiario) {
      this.mes = this.mesResumoDiario.mes
      this.empresa_id = this.mesResumoDiario.emp
      this.buscaLista(this.mes, this.empresa_id)
    }
  },
  destroyed () {
    this.setMesResumoDiario(null)
  }
}
</script>

<style>

</style>
