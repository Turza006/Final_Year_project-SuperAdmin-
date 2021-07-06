<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" right top>
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  data () {
    return {
      show: false,
      message: '',
      color: '',
      timeout: 6000
    }
  },

  created () {
    this.$store.subscribe((mutation, state) => {
      // console.log('snackbar mutation')
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color.toLowerCase()
        this.show = true
      }
    })
  }
}
</script>
