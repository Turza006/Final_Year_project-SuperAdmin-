<template>
  <div>
    <v-card max-width="450px" height="596px" class="mx-auto mt-10" elevation="10">
      <v-img
        style="position: absolute; left: calc(50% - 80px); top: 5vh; z-index: 1; width: 160px; height: auto;"
        src="/img/logo.png"
      />
      <div class="clip" />
      <h3 class="text-center">
        Super Admin
      </h3>
      <p class="text-center mb-0">
        Sign in to your account
      </p>
      <v-form ref="form" class="pt-5 px-10 pb-0 ">
        <v-text-field
          v-model="form.email"
          :rules="emailRules"
          label="Enter your email"
          prepend-inner-icon="mdi-account"
          placeholder="Enter your email"
          dense
          solo
          rounded
        />
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
          label="Enter your password"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          rounded
          dense
          solo
          @keypress.enter="onSubmit()"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
      <v-card-actions class="pa-0 px-10">
        <v-btn rounded block class="white--text" style="background: #FF4E00" @click="onSubmit()">
          Login
        </v-btn>
      </v-card-actions>
      <v-btn
        text
        small
        class="float-right mr-10 mt-5"
        style="color: #FF4E00"
        @click="openForgotDialog()"
      >
        Forget Password?
      </v-btn>
      <div class="text-center py-3 pt-16" />
      <div class="clip2" />
    </v-card>
    <DialogForgotPassword />
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import DialogForgotPassword from '~/components/dialogs/DialogForgotPassword'
import { getMutationData } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { TOAST } from '~/utils/strings'
import { SUPER_ADMIN_LOGIN } from '~/graphql/mutations/auth'

export default {
  name: 'PageLogin',
  components: {
    DialogForgotPassword
  },
  layout: 'authLayout',
  data () {
    return {
      dialog: false,
      showPassword: false,
      form: {
        email: '',
        password: '',
        deviceToken: ''
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password length is too short. Minimum length is 8.'
      ]
    }
  },
  beforeCreate () {
    if (this.$store.state.auth.isAuthenticated) {
      console.log('user already logged in...')
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions('auth', ['requestSuperAdminLogin']),
    openForgotDialog () {
      this.dialog = false
      this.$nuxt.$emit('toggleDialogForgotPassword')
    },
    async onSubmit () {
      if (this.$refs.form.validate()) {
        const data = await getMutationData(this.$apollo, SUPER_ADMIN_LOGIN, this.form)
        if (data.SuperAdminLogin !== null) {
          if (data.SuperAdminLogin.code === API.SUCCESS) {
            this.$notifier.showMessage({
              content: data.SuperAdminLogin.msg,
              color: 'success'
            })
            await this.$store.commit('auth/SET_VERIFY_TOKEN', data.SuperAdminLogin.jwt)
            await this.$router.push('/verify')
          } else {
            this.$notifier.showMessage({
              content: data.SuperAdminLogin.msg,
              color: 'error'
            })
          }
        } else {
          this.$notifier.showMessage({
            content: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
            color: 'error'
          })
        }
      } else {
        this.$notifier.showMessage({
          content: TOAST.PLEASE_ENTER_VALID_EMAIL_AND_PASSWORD,
          color: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.clip {
  background: #FF4E00;
  width: 100%;
  height: 140px;
  clip-path: circle(140px at 0% 0%);
}

.clip2 {
  display: inline;
  position: absolute;
  z-index: 100;
  background: #FF4E00;
  width: 100%;
  height: 145px;
  clip-path: circle(140px at 100% 100%);
}
</style>
