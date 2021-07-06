<template>
  <div>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="400"
    >
      <v-card class="text-center">
        <v-card-title class="white--text primary">
          Forget Password
        </v-card-title>
        <v-form class="pa-5">
          <p class="text-left mb-2 ml-2">
            Enter your email:
          </p>
          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            color="primary"
            label="Enter your email"
            placeholder="Enter your email"
            prepend-inner-icon="mdi-gmail"
            dense
            rounded
            solo
          />
          <v-btn
            class="primary white--text text-center"
            rounded
            small
            @click="forgetPasswordRequest()"
          >
            Submit
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import ValidationMixin from '~/mixins/ValidationMixin'

export default {
  name: 'DialogForgotPassword',
  // eslint-disable-next-line vue/no-unused-components
  mixins: [ValidationMixin],
  data () {
    return {
      dialog: false,
      form: {
        email: ''
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  created () {
    this.$nuxt.$on('toggleDialogForgotPassword', () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    forgetPasswordRequest () {
      if (this._validEmail(this.form.email)) {
        /* const { data } = await getMutationData(FORGOT_PASSWORD_REQUEST, { email: this.form.email })
        // console.log('forgetPasswordRequest-->', data)

        if (data.ForgotPasswordRequest.code === api.SUCCESS) {
          await this.$store.commit('auth/SET_PASSWORD_RESET_VERIFY_TOKEN', data.ForgotPasswordRequest.jwt)
          await this.$router.push('/verify-reset-password-token')
          this.$notifier.showMessage({
            content: 'Please check your email, 6 digit password reset token has been sent to your email.',
            color: 'success'
          })
        } else {
          this.$notifier.showMessage({
            content: data.ForgotPasswordRequest.msg,
            color: 'error'
          })
        } */
      }
    }
  }
}
</script>

<style scoped>

</style>
