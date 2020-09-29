<template>
  <v-app>
    <v-container>
      <v-btn color="info" class="ma-3" :disabled="selected.length == 0"
        >Adicionar</v-btn
      >
      <v-row>
        <v-data-table
          v-model="selected"
          show-select
          disable-pagination
          hide-default-footer
          :headers="headers"
          :items="items"
        >
        </v-data-table>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Modulos',
  props: ['items', 'usuario'],
  data () {
    return {
      headers: [
        { text: 'Módulo', value: 'nomeprograma' },
        { text: 'Menu', value: 'menutitle' },
        { text: 'Submenu', value: 'itemtitle' }
      ],
      selected: []
    }
  },
  methods: {
    adicionar () {}
  }
}
</script>

<style></style>
