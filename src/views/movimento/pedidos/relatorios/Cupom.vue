<template>
  <div>
    <v-btn class="d-print-none" tile large @click="imprimir" icon><v-icon>mdi-printer</v-icon></v-btn>
      <v-btn
        class="ma-3 d-print-none"
        fab
        fixed
        right
        dark
        color="deep-purple darken-3"
        @click="goBack"
      >
        <v-icon dark>mdi-arrow-left</v-icon>
      </v-btn>
    <div>
      <table class="printer-ticket ">
        <thead>
          <tr>

            <th colspan="3">
              <img style="position: absolute; display: table-row;" src="@/assets/logo_cupom3.png"
               alt="RA Gelo" width=64 height=59>
              <span class="title">{{empresa.length>0 ? empresa[0].nome :''}}</span>  <br/>
              {{empresa.length>0 ? empresa[0].telefone: ''}} <br/>
              {{empresa.length>0 ? empresa[0].cnpjcpf: ''}}
            </th>
          </tr>
          <tr>
            <th colspan="3">
              {{pedidoImp.pessoa.nome}} <br />
              {{pedidoImp.pessoa.cnpjcpf}}
            </th>
          </tr>
          <tr class="sup">
            <th colspan="3" align="center">
              <b>Pedido de Venda: {{pedidoImp.id}}</b> <br/>
              {{pedidoImp.created_at ? pedidoImp.created_at: pedidoImp.pedidodt}}
            </th>
          </tr>
          <tr>
            <th class="ttu" colspan="3">
              <b>Cupom não fiscal</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <div style="padding-top: 10px;"></div>
          <div style="display: contents;" v-for="(item, index) in pedidoImp.pedido_item" :key="index" >
            <tr>
              <td colspan="3">{{item.produto.despro}}</td>
            </tr>
            <tr >
              <td >R$ {{valFormat(item.prvenda)}}</td>
              <td >{{'x '+item.quantidade+'  ='}}</td>
              <td >R$ {{ valFormat(item.prvenda*item.quantidade) }}</td>
            </tr>
          </div>
        </tbody>
        <tfoot>
          <tr class="sup ttu p--0">
            <td colspan="3">
              <b>Totais</b>
            </td>
          </tr>
          <tr class="ttu">
            <td colspan="2">Sub-total</td>
            <td align="right">R$ {{ valFormat(subTotal()) }}</td>
          </tr>
          <tr class="ttu" >
            <td colspan="2">Desconto</td>
            <td align="right">R$ {{valFormat(totalDesconto())}}</td>
          </tr>
          <tr class="ttu">
            <td colspan="2">Total</td>
            <td align="right">R$ {{valFormat(pedidoImp.totpedido)}}</td>
          </tr>
          <tr class="sup ttu p--0">
            <td colspan="3">
              <b>Pagamentos</b>
            </td>
          </tr>
          <tr class="ttu">
            <td colspan="2">{{ pedidoImp.tp_pagto === 'A' ? 'À VISTA' : 'A PRAZO  '+pedidoImp.parcelas+' x'  }}</td>
          </tr>
          <tr class="ttu">
            <td colspan="2">{{pedidoImp.pagto_tp.despagtotp}}</td>
          </tr>
          <tr class="sup">
            <td colspan="3" align="left">
              <b>Entregue: </b>
            </td>
          </tr>
          <tr class="sup">
            <td colspan="3" align="center">
              ELSoft Sistemas
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { valorFormatado } from '@/config/funcoes.js'
export default {
  name: 'Cupom',
  data () {
    return {
      empresa: {}
    }
  },
  methods: {
    ...mapMutations('pedido', ['setPedidoImp']),
    goBack () {
      /*window.history.length > 1
      //  ? this.$router.go(-1)
      //  : */
      this.$router.push({ path: '/pedidos' })
    },
    imprimir () {
      window.print()
    },
    valFormat (value) {
      return valorFormatado(value)
    },
    subTotal () {
      if (this.pedidoImp) {
        return this.pedidoImp.pedido_item.reduce(function (total, item) {
          return total + item.prvenda * item.quantidade
        }, 0)
      } return 0
    },
    totalDesconto () {
      if (this.pedidoImp) {
        return this.pedidoImp.pedido_item.reduce(function (total, item) {
          return total + item.desconto * item.quantidade
        }, 0)
      } return 0
    },
    getEmpresa (id) {
      this.empresa = this.empresas.filter(e => e.id === id)
    }
  },
  computed: {
    ...mapGetters('pedido', ['pedidoImp']),
    ...mapGetters(['empresas'])
  },
  mounted () {
    this.getEmpresa(this.pedidoImp.empresa.id)
  },
  destroyed () {
    this.setPedidoImp(null)
  }
}
</script>

<style>

 .text-center {
  text-align: center;
}
.ttu {
  text-transform: uppercase;
}
 .printer-ticket {
  display: table !important;
  width: 100%;
  max-width: 400px;
  font-weight: light;
  line-height: 1.3em;
}
 .printer-ticket,
 .printer-ticket * {
  font-family: Tahoma, Geneva, sans-serif;
  font-size: 12px;
}
 .printer-ticket th:nth-child(2),
 .printer-ticket td:nth-child(2) {
  width: 50px;
}
 .printer-ticket th:nth-child(3),
 .printer-ticket td:nth-child(3) {
  width: 90px;
  text-align: right;
}
 .printer-ticket th {
  font-weight: inherit;
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px dashed #BCBCBC;
}
 .printer-ticket tbody tr:last-child td {
  padding-bottom: 10px;
}
 .printer-ticket tfoot .sup td {
  padding: 10px 0;
  border-top: 1px dashed #BCBCBC;
}
 .printer-ticket tfoot .sup.p--0 td {
  padding-bottom: 0;
}
 .printer-ticket .title {
  font-size: 1.5em;
  padding: 15px 0;
}
 .printer-ticket .top td {
  padding-top: 10px;
}
 .printer-ticket .last td {
  padding-bottom: 10px;
}

</style>
