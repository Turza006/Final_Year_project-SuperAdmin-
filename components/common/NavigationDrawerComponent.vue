<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="miniVariant"
    :clipped="clipped"
    fixed
    app
  >
    <v-list>
      <v-list-item
        color="primary"
        v-for="(item, i) in navigationItems"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { NAVIGATION_DRAWER_EVENTS } from '~/utils/events'

export default {
  name: 'NavigationDrawerComponent',
  props: {
    clipped: {
      type: Boolean,
      required: true
    },
    miniVariant: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      drawer: true,
      navigationItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Category', icon: 'mdi-view-list', to: '/category' },
        { title: 'Service', icon: 'mdi-view-list-outline', to: '/service' },
        { title: 'Package', icon: 'mdi-package-variant-closed', to: '/package' },
        { title: 'Accounts', icon: 'mdi-currency-usd-circle-outline', to: '/accounts' },
        { title: 'Admins', icon: 'mdi-shield-account', to: '/admins' },
        { title: 'Users', icon: 'mdi-account-group', to: '/users' },
        { title: 'Order With', icon: 'mdi-truck-delivery-outline', to: '/order-with' }
        // { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
      ]
    }
  },
  created () {
    this.$nuxt.$on(NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawer, () => {
      this.drawer = !this.drawer
    })
  }
}
</script>
