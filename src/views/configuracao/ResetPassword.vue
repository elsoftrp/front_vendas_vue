<template>
  <v-app>
    <loading :active.sync="loadingAll" :is-full-page="true"></loading>
    <v-container fluid>
      <v-row>
      <v-col cols="12">
      <v-row align="center" justify="center" style="height: 300px;" >
      <v-card outlined >
        <v-form @submit.prevent="salvar" v-model="validForm">
          <v-row class="ma-4">
            <v-col cols="12" >
              <v-text-field
                class="mt-10"
                label="Nova Senha"
                outlined
                dense
                name="passwordnew"
                id="ipasswordnew"
                malength="30"
                :rules="[
                  rules.required('novasenha'),
                  rules.min('Nova senha', '3')
                ]"
                v-model="entity.novasenha"
                prepend-icon="mdi-lock"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-4">
            <v-col cols="12" >
              <v-text-field
                label="Confirmação de senha"
                outlined
                dense
                name="password_confirmednew"
                id="ipassword_confirmednew"
                malength="30"
                :rules="[
                  rules.required('novasenhaconfirma'),
                  rules.min('Confirmação', '3')
                ]"
                v-model="entity.novasenhaconfirma"
                prepend-icon="mdi-lock"
                :type="show2 ? 'text' : 'password'"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
              ></v-text-field>
            </v-col>
          </v-row>
          <br />
          <v-row>
            <v-col cols="auto">
              <v-btn
                type="submit"
                color="success"
                class="ml-3"
                large
                :disabled="!validForm"
                >Salvar</v-btn
              >
            </v-col>
            <v-col cols="auto">
              <v-btn color="error" large @click.prevent="goBack"
                >Cancelar</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
      </v-row>
      </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: 'ResetPassword',
  components: { Loading },
  data () {
    return {
      loadingAll: false,
      show1: false,
      show2: false,
      validForm: false,
      rules: {
        required (propertyType) {
          return value => !!value || `${propertyType} é requerido`
        },
        min (propertyType, len) {
          return value =>
            (value && value.length >= len) ||
            `${propertyType} necessita de no minimo ${len} caracteres`
        }
      },
      entity: {}
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setTituloHeader']),
    salvar () {
      if (!this.validForm) return
      this.loadingAll = true
      this.entity.email = this.usuarioData.email
      axios
        .post(`${baseApiUrl}/usuarios/mudar`, this.entity)
        .then(req => {
          this.$toasted.global.defaultSuccess()
          this.$router.push({ path: '/' })
        })
        .catch(showError)
        .finally(
          setTimeout(() => {
            this.loadingAll = false
          }, 1000)
        )
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ path: '/' })
    }
  },
  computed: {
    ...mapGetters('cadastros', ['usuarioData'])
  },
  mounted () {
    this.setTituloHeader('Alterar Senha')
  }
}
</script>

<style></style>
