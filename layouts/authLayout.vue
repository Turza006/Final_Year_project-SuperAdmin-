<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar'

export default {
  name: 'AuthLayout',
  components: {
    Snackbar
  },
  created () {
    if (this.$store.state.auth.jwt !== '') {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
