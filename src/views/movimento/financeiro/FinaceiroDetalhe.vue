<template>
    <v-card outlined>
      <v-card-title>Financeiro Detalhes</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                disable-pagination
                hide-default-footer
                :headers="headers"
                :items="detalhes"
              >
              <template v-slot:item.valorpago="{ item }">
                <span>
                    {{ item.valorpago ?
                        valFormat(item.valorpago) : '' }}
                </span>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error" text @click="closeDialog()">Fechar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { valorFormatado } from '@/config/funcoes.js'

export default {
  name: 'FinanceiroDetalhes',
  props: ['detalhes'],
  data () {
    return {
      headers: [
        { text: 'Pagamento', value: 'pagamentodt' },
        { text: 'Valor Pago', value: 'valorpago' },
        { text: 'Tipo Pagto', value: 'pagto_tp.despagtotp' },
        { text: 'Usuário', value: 'usuario.name' }
      ]
    }
  },
  methods: {
    closeDialog () {
      this.$emit('fechar', false)
    },
    valFormat (value) {
      return valorFormatado(value)
    },
  }
}
</script>

<style>

</style>
