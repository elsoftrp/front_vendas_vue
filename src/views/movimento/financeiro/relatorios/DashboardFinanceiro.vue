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
    <v-container fluid>
      <!-- vendas -->
      <v-row class="mt-3">
        <v-col cols=12>
          <v-card
            class="mx-auto"
            outlined
          >
          <v-card-title>Vendas</v-card-title>
            <v-row
              align="center"
              justify="center"
              class="ma-2"
            >
              <v-col cols="4">
                <v-card
                  class="mx-auto"
                  max-width="250"
                  min-width="250"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Venda de Agosto/2020</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="green white--text">R$ 412,00</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  class="mx-auto"
                  max-width="250"
                  min-width="250"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Vendas de Julho/2020</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="light-blue darken-2 white--text">R$ 169,90</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  class="mx-auto"
                  max-width="250"
                  min-width="250"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Vendas de 2020</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="orange darken-4 white--text">R$ 1.066,00</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!-- vendas fim -->
      <!-- financeiro -->
      <v-row class="mx-auto" align="center"
            justify="center"
      >
        <v-card
          outlined
          class="mx-auto"
        >
          <v-card-title>Financeiro</v-card-title>
          <v-row>
            <v-row
              class="ma-2"
            >
              <v-col>
                <v-card
                  class="mx-auto"
                  max-width="250"
                  min-width="250"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Receber vencidos</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="green darken-4 white--text">R$ 69,50</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
              <v-col>
                <v-card
                  class="mx-auto"
                  max-width="250"
                  min-width="250"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Pagar vencidos</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="red darken-4 white--text">R$ 169,90</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
            </v-row>
            <v-row
              class="ma-2"
            >
              <v-col>
                <v-card
                class="mx-auto"
                max-width="250"
                min-width="250"
                outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Receber a vencer</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="green--text">R$ 515,00</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
              <v-col>
                <v-card
                class="mx-auto"
                max-width="250"
                min-width="250"
                outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-h6 font-weight-bold mb-4 ">Pagar a vencer</div>
                      <v-divider></v-divider>
                      <v-list-item-title class="headline mb-1 text-center "><p class="red--text">R$ 0,00</p> </v-list-item-title>
                      <v-list-item-subtitle> <p ></p> </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-card>
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </v-row>
      <!-- financeiro fim -->
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'DashboardFinanceiro',
  data () {
    return {
      urlApi: 'financeiro',
      dados: []
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: `/${this.urlApi}` })
    }
  }

}
</script>

<style>

</style>
