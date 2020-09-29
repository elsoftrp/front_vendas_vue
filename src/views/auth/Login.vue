<template>
  <div id="app">
    <v-app id="inspire">

        <v-content>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-col cols="12" sm="8" md="4">
                <v-card outlined >
                  <v-toolbar class="deep-purple darken-3 " dark flat>
                    <v-toolbar-title>Login</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        label="Login"
                        name="login"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="usuario.login"
                      ></v-text-field>

                      <v-text-field
                        id="senha"
                        label="senha"
                        name="senha"
                        prepend-icon="mdi-lock"
                        :type="show1 ? 'text' : 'password'"
                        v-model="usuario.senha"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.prevent="conectar"
                      >Entrar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
    </v-app>
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      show1: false,
      usuario: {
        login: '',
        senha: ''
      }
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setUsuarioData']),
    conectar () {
      this.login()
    },
    async auth () {
      return await axios.get(`${baseApiUrl}/usuario`)
    },
    async login () {
      axios
        .post(`${baseApiUrl}/login`, {
          email: this.usuario.login,
          password: this.usuario.senha,
          device_name: 'browser'
        })
        .then(resp => {
          localStorage.setItem('token', resp.data)
          axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`
          this.auth()
            .then(resp => {
              const usuario = resp.data
              const parsed = JSON.stringify(usuario)
              localStorage.setItem('vendas', parsed)
              this.setUsuarioData(usuario)
              this.$router.push({ path: '/' })
            })
            .catch(showError)
        })
        .catch(showError)
    }
  }
}
</script>

<style></style>
