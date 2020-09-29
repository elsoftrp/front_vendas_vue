<template>
  <v-app >
    <v-container >
        <v-row>
          <v-col cols=2><h2>Empresa</h2></v-col>
          <v-col cols=10><h2>{{empresas.length >0 ? empresas[0].nome:''}}</h2></v-col>
        </v-row>
        <v-row class="center"><v-col><h3>Ficha de Cadastro</h3></v-col></v-row>
        <v-row dense>
          <v-col cols=2><h4>Código</h4></v-col>
          <v-col cols=10>{{dataset.id}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Tipo de cadastro</h4></v-col>
            <v-col v-for="item in dataset.pessoa_tp" v-bind:key="item.id" >{{item.descricao}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>CNPJ/CPF</h4></v-col>
          <v-col cols=3>{{dataset.cnpjcpf}}</v-col>
          <v-col cols=1><h4>Ins.Est./RG</h4></v-col>
          <v-col cols=2>{{dataset.insrg}}</v-col>
          <v-col cols=2><h4>Ins.Municipal</h4></v-col>
          <v-col cols=2>{{dataset.insmunicipal}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Nome</h4></v-col>
          <v-col cols=10>{{dataset.nome}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Endereço</h4></v-col>
          <v-col cols=8>{{dataset.endereco}}</v-col>
          <v-col cols=1><h4>Número</h4></v-col>
          <v-col cols=1>{{dataset.numero}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Bairro</h4></v-col>
          <v-col cols=3>{{dataset.bairro}}</v-col>
          <v-col cols=2><h4>Complemento</h4></v-col>
          <v-col cols=2>{{dataset.complemento}}</v-col>
          <v-col cols=1><h4>CEP</h4></v-col>
          <v-col cols=2>{{dataset.cep}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Cidade</h4></v-col>
          <v-col cols=8>{{dataset.cidade ? dataset.cidade.cidade : ''}}</v-col>
          <v-col cols=2>{{dataset.cidade ? dataset.cidade.uf : ''}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>Telefones</h4></v-col>
          <v-col cols=2>{{dataset.telefone}}</v-col>
          <v-col cols=2>{{dataset.celular}}</v-col>
          <v-col cols=2>{{dataset.celular2}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2><h4>E-mail</h4></v-col>
          <v-col cols=10>{{dataset.email}}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols=2 ><h4>Observação</h4></v-col>
          <v-col >{{dataset.obs}}</v-col>
        </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['dataset'],
  computed: {
    ...mapGetters(['empresas'])
  }
}
</script>

<style>

</style>
