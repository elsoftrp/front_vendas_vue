<template>
  <v-card outlined class="m-2 p-2">
    <div class="mt-3">
      <v-text-field
        class="mt-2 pa-3"
        id="pesquisa"
        prepend-inner-icon="mdi-magnify"
        clearable
        autocomplete="off"
        name="pesquisa"
        placeholder="Digite o nome para pesquisa e aperte enter"
        @keyup.enter="find($event)"
        v-model="filterTerm"
      />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Busca',
  data () {
    return {
      filterTerm: ''
    }
  },
  methods: {

    find (ev) {
      ev.preventDefault()
      this.$emit('find', this.filterTerm)
    }
  }
}
</script>

<style>

</style>
