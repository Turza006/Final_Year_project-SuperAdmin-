<template>
  <v-navigation-drawer
    v-model="rightDrawer"
    temporary
    fixed
    right
  >
    <v-list>
      <v-list-item @click.native="rightDrawer = !rightDrawer">
        <v-list-item-action>
          <v-btn icon>
            <v-icon light>
              mdi-close
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { NAVIGATION_DRAWER_EVENTS } from '~/utils/events'

export default {
  name: 'RightNavigationDrawerComponent',
  data () {
    return {
      rightDrawer: false
    }
  },
  created () {
    this.$nuxt.$on(NAVIGATION_DRAWER_EVENTS.toggleNavigationRightDrawer, () => {
      this.rightDrawer = !this.rightDrawer
    })
  }
}
</script>
