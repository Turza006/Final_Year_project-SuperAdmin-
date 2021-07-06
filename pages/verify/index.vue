<template>
  <div>
    <v-card max-width="500px" class="mx-auto" :loading="loading">
      <v-card-title class="primary white--text text-center">
        <h3>Verify Your Account</h3>
      </v-card-title>
      <p class="px-5 pt-5 grey--text caption">
        A verification email has been sent to your email address.
        {{ isAuthenticated }}
      </p>
      <v-form class="px-5 pb-0">
        <v-text-field
          v-model="token"
          label="Enter your verify token"
          placeholder="Enter 6 digit verify token"
          dense
          outlined
        />
      </v-form>
      <v-card-actions class="pa-0 px-5">
        <v-btn small color="primary" class="white--text" @click="onSubmit()">
          Verify
        </v-btn>
      </v-card-actions>
      <div class="text-center py-3">
        <hr class="mb-2 grey--text">
        <span>Did not get verify token?</span>
        <v-btn class="ml-2" small outlined :loading="resendTokenLoading" @click="resendVerifyToken()">
          Resend Token
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TOAST } from '~/utils/strings'
import { SUPER_ADMIN_EMAIL_VERIFICATION } from '~/graphql/mutations/auth'
import { getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'

export default {
  name: 'PageVerify',
  layout: 'authLayout',
  data () {
    return {
      token: '',
      loading: false,
      resendTokenLoading: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'verifyToken']),
    isTokenValid () {
      if (this.token === '') {
        this.$notifier.showMessage({
          content: TOAST.PLEASE_ENTER_VERIFY_TOKEN,
          color: 'error'
        })
        return false
      } else if (this.token.length !== 6) {
        this.$notifier.showMessage({
          content: TOAST.PLEASE_ENTER_VALID_VERIFY_TOKEN,
          color: 'error'
        })
        return false
      } else {
        return true
      }
    }
  },
  created () {
    if (this.isAuthenticated) {
      this.$router.push('/')
    }
    // else if (this.verifyToken === '') {
    //   this.$router.push('/login')
    // }
  },
  beforeCreate () {
    if (this.$store.state.auth.isAuthenticated) {
      console.log('user already logged in...')
      this.$router.push('/')
    }
  },
  methods: {
    async onSubmit () {
      if (this.isTokenValid) {
        this.loading = true
        const data = await getMutationDataWithCustomHeader(this.$apollo, SUPER_ADMIN_EMAIL_VERIFICATION,
          { token: this.token },
          { jwt: this.verifyToken })
        this.loading = false
        if (data.SuperAdminEmailVerification.jwt !== null) {
          await this.$store.commit('auth/SET_USER_DATA', data.SuperAdminEmailVerification)
          await this.$store.commit('auth/SET_TOKEN', { jwt: data.SuperAdminEmailVerification.jwt })
          await this.$store.commit('auth/UNSET_VERIFY_TOKEN')
          await this.$apolloHelpers.onLogin(data.SuperAdminEmailVerification.jwt)
          await this.$router.push('/')
          this.$notifier.showMessage({
            content: data.SuperAdminEmailVerification.msg,
            color: 'success'
          })
        } else {
          this.$notifier.showMessage({
            content: data.SuperAdminEmailVerification.msg,
            color: 'error'
          })
        }
      }
    },
    async resendVerifyToken () {
      // this.resendTokenLoading = true
      // const { data } = await getMutationDataWithCustomHeader(RESEND_VERIFICATION, {}, { jwt: this.verifyToken })
      // this.resendTokenLoading = false
      // // console.log('resendVerifyToken----> ', data)
      // if (data.ResendVerification.code === api.SUCCESS) {
      //   this.$notifier.showMessage({
      //     content: data.ResendVerification.msg,
      //     color: 'success'
      //   })
      // } else {
      //   this.$notifier.showMessage({
      //     content: data.ResendVerification.msg,
      //     color: 'error'
      //   })
      // }
    }
  }
}
</script>
