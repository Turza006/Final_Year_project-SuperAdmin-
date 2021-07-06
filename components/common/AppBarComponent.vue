<template>
  <v-app-bar
    :clipped-left="clipped"
    fixed
    app
  >
    <v-app-bar-nav-icon color="primary" @click.stop="$nuxt.$emit(toggleNavigationDrawer)" />
    <v-btn
      color="primary"
      icon
      @click.stop="$nuxt.$emit(toggleNavigationDrawerMiniVariant)"
    >
      <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
    </v-btn>
    <v-btn
      color="primary"
      icon
      @click.stop="$nuxt.$emit(toggleNavigationDrawerClipped)"
    >
      <v-icon>mdi-application</v-icon>
    </v-btn>
<!--    <v-btn
      icon
      @click.stop="$nuxt.$emit(toggleFixedFooter)"
    >
      <v-icon>mdi-minus</v-icon>
    </v-btn>-->
    <v-toolbar-title class="cursor-pointer" @click="$router.push('/')">
      <v-img
        style="width: 186px; height: auto;"
        src="/img/logo.png"
      />
    </v-toolbar-title>
    <v-spacer />
    <v-menu
      offset-y
    >
      <template #activator="{ attrs, on }">
        <v-btn
          color="primary"
          class="ma-5"
          v-bind="attrs"
          icon
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          class="px-10"
          link
          to="/profile"
        >
          <v-list-item-title>PROFILE</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="px-10"
          link
          @click="performLogout()"
        >
          <v-list-item-title>LOGOUT</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
<!--    <v-btn
      icon
      @click.stop="$nuxt.$emit(toggleNavigationRightDrawer)"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>-->
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'
import { NAVIGATION_DRAWER_EVENTS } from '~/utils/events'

export default {
  name: 'AppBarComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    clipped: {
      type: Boolean,
      required: true
    },
    miniVariant: {
      type: Boolean,
      required: true
    },
    fixed: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      toggleNavigationDrawer: NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawer,
      toggleNavigationDrawerMiniVariant: NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawerMiniVariant,
      toggleNavigationDrawerClipped: NAVIGATION_DRAWER_EVENTS.toggleNavigationDrawerClipped,
      toggleNavigationRightDrawer: NAVIGATION_DRAWER_EVENTS.toggleNavigationRightDrawer,
      toggleFixedFooter: NAVIGATION_DRAWER_EVENTS.toggleFixedFooter
    }
  },
  methods: {
    ...mapActions('auth', ['requestPerformLogout']),
    async performLogout () {
      await this.requestPerformLogout()
      await this.$apolloHelpers.onLogout()
      await this.$router.push('/login')
    }
  }
}
</script>
