<template>
  <div>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card :loading="loading">
        <v-form ref="form" class="px-10 pt-3">
          <h3 class="text-uppercase mb-5">
            Change Password
          </h3>
          <v-layout>
            <v-flex xs12 md4 sm5 class="pt-4">
              <label>Current Password:</label>
            </v-flex>
            <v-flex xs12 md8 sm7>
              <v-text-field
                v-model="oldPassword"
                :rules="passwordRules"
                label="Current Password"
                placeholder="Current Password"
                prepend-inner-icon="mdi-lock"
                :type="showCurrentPassword ? 'text' : 'password'"
                :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                solo
                rounded
                @click:append="showCurrentPassword = !showCurrentPassword"
              />
            </v-flex>
            <v-flex />
          </v-layout>
          <v-layout>
            <v-flex xs12 md4 sm5 class="mt-4">
              <label>New Password:</label>
            </v-flex>
            <v-flex xs12 md8 sm7>
              <v-text-field
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                :rules="newPasswordRules"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                dense
                rounded
                color="black"
                solo
                @click:append="showPassword = !showPassword"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4 sm12 class="mt-4">
              <label>Confirm Password:</label>
            </v-flex>
            <v-flex xs12 md8 sm12>
              <v-text-field
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Confirm password"
                :rules="confirmPasswordRules"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                dense
                rounded
                color="black"
                solo
                @click:append="showPassword = !showPassword"
              />
            </v-flex>
          </v-layout>
        </v-form>
        <div class="pb-8 text-center mt-5 pb-10 mx-10">
          <v-btn
            :loading="loading"
            color="primary"
            class="white--text"
            rounded
            block
            @click="onSubmit()"
          >
            <v-icon class="mr-1">
              mdi-key-change
            </v-icon>
            Change Password
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DialogChangePassword',
  data () {
    return {
      dialog: false,
      loading: false,
      showCurrentPassword: false,
      showPassword: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
        v => v.length >= 8 || 'Password length is too short. Minimum length is 8.'
      ],
      newPasswordRules: [
        v => !!v || 'Password is required',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
        v => v.length >= 8 || 'Password length is too short. Minimum length is 8.',
        v => v !== this.oldPassword || 'New password should not match with current password. Try something else...'
      ],
      confirmPasswordRules: [
        v => !!v || 'Password is required',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
        v => v.length >= 8 || 'Password length is too short. Minimum length is 8.',
        v => v === this.newPassword || 'Confirm Password not matched'
      ]
    }
  },
  created () {
    this.$nuxt.$on('toggleDialogChangePassword', () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('admin', ['requestAdminChangePassword']),
    async onSubmit () {
      if (this.$refs.form.validate()) {
        const res = await this.requestAdminChangePassword({ $apollo: this.$apollo, oldPassword: this.oldPassword, newPassword: this.newPassword })
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
        if (res.code === 'success') {
          this.oldPassword = ''
          this.newPassword = ''
          this.confirmPassword = ''
          this.dialog = false
        }
      } else {
        this.$notifier.showMessage({
          content: 'Please enter valid input',
          color: 'error'
        })
      }
    }
  }
}
</script>
