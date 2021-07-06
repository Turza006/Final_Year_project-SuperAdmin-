<template>
  <v-app dark>
    <NavigationDrawerComponent :clipped="clipped" :mini-variant="miniVariant" />
    <AppBarComponent :title="title" :clipped="clipped" :mini-variant="miniVariant" :fixed="fixed" />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <RightNavigationDrawerComponent />
    <FooterComponent :fixed="fixed" />
  </v-app>
</template>

<script>
import NavigationDrawerComponent from '~/components/common/NavigationDrawerComponent'
import { FOOTER_EVENT, NAVIGATION_DRAWER_EVENTS } from '~/utils/events'
import RightNavigationDrawerComponent from '~/components/common/RightNavigationDrawerComponent'
import AppBarComponent from '~/components/common/AppBarComponent'
import FooterComponent from '~/components/common/FooterComponent'
export default {
  components: { FooterComponent, AppBarComponent, RightNavigationDrawerComponent, NavigationDrawerComponent },
  data () {
    return {
      clipped: false,
      miniVariant: false,
      fixed: false,
      title: 'b2bServiceNet',
      subTitle: 'Super Admin'
    }
  },
  created () {
    this.$nuxt.$on(NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawer, () => {
      this.drawer = !this.drawer
    })

    this.$nuxt.$on(NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawerMiniVariant, () => {
      this.miniVariant = !this.miniVariant
    })

    this.$nuxt.$on(NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawerClipped, () => {
      this.clipped = !this.clipped
    })

    this.$nuxt.$on(FOOTER_EVENT.toggleFixedFooter, () => {
      this.fixed = !this.fixed
    })
  }
}
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
