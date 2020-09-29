<template>
  <v-app>
    <loading :active.sync='loadingAll' :is-full-page='true'></loading>
    <v-container>
      <v-btn color='primary' dark @click='dialog = true'>
        Adicionar
      </v-btn>
      <v-row>
        <v-dialog v-model='dialog' scrollable max-width='600px'>
          <v-card outlined>
            <v-card-title>Selecione o módulo</v-card-title>
            <v-divider></v-divider>
            <v-card-text style='height: 600px;'>
              <v-data-table
                v-model='selected'
                show-select
                disable-pagination
                hide-default-footer
                :headers='headersModulo'
                :items='itemsModulo'
                item-key='id'
              >
              </v-data-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color='blue darken-1' text @click='dialog = false'
                >Fechar</v-btn
              >
              <v-btn color='blue darken-1' text @click='salvarModulo'
                >Salvar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row>
        <v-data-table
          disable-pagination
          hide-default-footer
          :headers='headers'
          :items='items'
        >
          <template v-slot:item.btnincluir='{ item }'>
            <v-simple-checkbox v-model='item.btnincluir'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnalterar='{ item }'>
            <v-simple-checkbox v-model='item.btnalterar'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnexcluir='{ item }'>
            <v-simple-checkbox v-model='item.btnexcluir'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnchave1='{ item }'>
            <v-simple-checkbox v-model='item.btnchave1'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnchave2='{ item }'>
            <v-simple-checkbox v-model='item.btnchave2'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnchave3='{ item }'>
            <v-simple-checkbox v-model='item.btnchave3'></v-simple-checkbox>
          </template>
          <template v-slot:item.btnchave4='{ item }'>
            <v-simple-checkbox v-model='item.btnchave4'></v-simple-checkbox>
          </template>
          <template v-slot:item.actions='{ item }'>
            <v-icon  small class='mr-2' @click='alteraPermissao(item)'>
              mdi-content-save-outline
            </v-icon>
            <v-icon  small class='mr-2' @click='excluiPermissao(item)'>
              mdi-trash-can-outline
            </v-icon>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: 'Permissao',
  components: { Loading },
  props: ['items', 'itemsModulo', 'usuario'],
  data () {
    return {
      headers: [
        { text: 'Módulo', value: 'nomeprograma' },
        { text: 'Incluir', value: 'btnincluir' },
        { text: 'Alterar', value: 'btnalterar' },
        { text: 'Excluir', value: 'btnexcluir' },
        { text: 'Chave 1', value: 'btnchave1' },
        { text: 'Chave 2', value: 'btnchave2' },
        { text: 'Chave 3', value: 'btnchave3' },
        { text: 'Chave 4', value: 'btnchave4' },
        { text: 'Menu', value: 'menutitle' },
        { text: 'Submenu', value: 'itemtitle' },
        { text: 'Gravar', value: 'actions' }
      ],
      headersModulo: [
        { text: 'Módulo', value: 'nomeprograma' },
        { text: 'Menu', value: 'menutitle' },
        { text: 'Submenu', value: 'itemtitle' }
      ],
      dialog: false,
      loadingAll: false,
      hasUpdate: false,
      selected: []
    }
  },
  methods: {
    salvarModulo () {
      if (this.selected.length > 0) {
        try {
          this.loadingAll = true
          let permissao = {}
          this.selected.forEach(element => {
            permissao.user_id = parseInt(this.usuario.id)
            permissao.programa_id = parseInt(element.id)
            permissao.btnincluir = false
            permissao.btnalterar = false
            permissao.btnexcluir = false
            permissao.btnvisualizar = false
            permissao.btnimprimir = false
            permissao.btnchave1 = false
            permissao.btnchave2 = false
            permissao.btnchave3 = false
            permissao.btnchave4 = false
            this.adicionaModulo(permissao, element)
            permissao = {}
          })
        } catch (error) {
          console.log(error)
          this.loadingAll = false
          this.dialog = false
        }
      }
      this.loadingAll = false
      this.dialog = false
    },
    adicionaModulo (obj, el) {
      axios
        .post(`${baseApiUrl}/permissao`, obj)
        .then(res => {
          el.id = res.data
          this.items.push(el)
        })
        .catch(showError)
    },
    alteraPermissao (item) {
      if (item) {
        item.user_id = this.usuario.id
        item.programa_id = parseInt(item.id)
        axios
          .put(`${baseApiUrl}/permissao/${item.id}`, item)
          .then(res => {
            this.$toasted.global.defaultSuccess()
          })
          .catch(showError)
      }
    },
    excluiPermissao (item) {
      if (item) {
        axios
          .delete(`${baseApiUrl}/permissao/${item.id}`)
          .then(res => {
            this.items.splice(this.items.indexOf(item), 1)
            this.$toasted.global.defaultSuccess()
          })
          .catch(showError)
      }
    }
  },
  watch: {

  }
}
</script>

<style></style>
