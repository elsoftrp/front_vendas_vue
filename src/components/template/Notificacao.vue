<template>
  <div>
    <v-card
    class="mx-auto"
    max-width="230"
    min-width="230"
    min-height="100"
    max-height="100"
    outlined
    >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-h6 font-weight-bold mb-4 ">
          <slot name="titulo"></slot>
          {{ titulo }}
        </div>
        <v-divider></v-divider>
        <v-list-item-title class="headline mb-1 text-center "><p class="white--text" :class="color"> {{ 'R$ '+valFormat(valor) }} </p> </v-list-item-title>
        <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </v-card>
  </div>
</template>

<script>
import { valorFormatado } from '@/config/funcoes.js'
export default {
  name: 'Notificao',
  props: [
    'color',
    'valor'
  ],
  data () {
    return {
      titulo: ''
    }
  },
  methods: {
    valFormat (value) {
      return valorFormatado(value)
    }
  }
}
</script>

<style>

</style>
