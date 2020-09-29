<template>
  <div id="app" >
    <v-app id="inspire" >
      <v-navigation-drawer
        v-show="usuarioData"
        v-model="drawer"
        app
        clipped
        dense
        class="d-print-none"
      >
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar color="indigo">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-title>{{
              usuarioData ? usuarioData.name : ''
            }}</v-list-item-title>

            <v-btn icon @click.stop="drawer = !drawer">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item link to="/">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Principal</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-for="item in menuData"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.icon"
            no-action
            dense
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subitem in item.items"
              :key="subitem.title"
              :to="`${subitem.link}`"
            >
              <v-list-item-action v-if="subitem.icon">
                <v-icon>{{ subitem.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ subitem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn @click.prevent="logout" block
              ><v-icon>mdi-logout</v-icon>Sair</v-btn
            >
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar flat class="deep-purple darken-3 d-print-none" app clipped-left dark>
        <v-app-bar-nav-icon
          v-show="usuarioData"
          class="white--text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title style="width: 300px"
          class="ml-0 pl-4" flat >
            <span  >{{ tituloHeader }} </span>

        </v-toolbar-title>
        <v-text-field
          class="d-print-none"
          v-show="usuarioData"
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Digite o nome para pesquisa e aperte enter"
          @keyup.enter="find($event)"
          v-model="filterTerm"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon @click.prevent="logout" dark><v-icon >mdi-logout</v-icon></v-btn>
      </v-app-bar>

      <v-content>
        <router-view></router-view>
      </v-content>
      <v-btn
        v-scroll='onScroll'
        v-show='fab'
        fab
        dark
        fixed
        bottom
        left
        color='primary'
        @click='toTop'
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <v-footer app class="d-print-none">
        <span>&copy; ELSoft Sistemas 2020</span>
      </v-footer>
    </v-app>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { baseApiUrl } from '@/global'
import axios from 'axios'
export default {
  name: 'Principal',
  data () {
    return {
      drawer: false,
      fab: false,
      filterTerm: '',
      menuItems: [
        {
          icon: 'mdi-domain',
          active: false,
          title: 'Empresas',
          items: [{ title: 'Cadastro', link: '/empresas' }]
        },
        {
          icon: 'mdi-office-building',
          title: 'Escritórios',
          items: [{ title: 'Cadastro', link: '/escritorios' }]
        },
        {
          icon: 'mdi-face-outline',
          title: 'Sócios',
          items: [{ title: 'Cadastro', link: '/socios' }]
        },
        {
          icon: 'mdi-settings',
          title: 'Configuração',
          items: [{ title: 'Login', link: '/login' }]
        }
      ]
    }
  },
  methods: {
    ...mapMutations('cadastros', ['setBuscaBarra', 'setUsuarioData', 'setMenuData']),
    navigateTo (where) {
      if (this.$router.currentRoute.name !== where) {
        this.$router.push({ name: where })
      }
    },
    logout () {
      localStorage.removeItem('token')
      localStorage.removeItem('vendas')
      this.setUsuarioData(null)
      this.setMenuData(null)
      axios.post(`${baseApiUrl}/logout`).then(resp => {})
      delete axios.defaults.headers.common.Authorization
      this.$router.push({ name: 'Login' })
      this.drawer = false
    },
    find (ev) {
      ev.preventDefault()
      this.setBuscaBarra(this.filterTerm)
      this.filterTerm = this.filterTerm === '*' ? '' : this.filterTerm
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  },
  computed: {
    ...mapGetters('cadastros', ['usuarioData', 'menuData', 'tituloHeader'])
  },
  watch: {
    usuarioData: function (value) {
      if (value) {
        this.drawer = true
        this.$vuetify.theme.dark = this.usuarioData.darkmode
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>
<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
